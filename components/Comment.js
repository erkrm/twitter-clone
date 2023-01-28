import { db, storage } from '@/firebase';
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { signIn, useSession } from 'next-auth/react';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { deleteObject, ref } from 'firebase/storage';
import { useRecoilState } from 'recoil';
import { modalState, postIdState } from '@/atom/modalAtom';

export default function Comment({ comment, commentId, originalPostId }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLikes, setHasLikes] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useState();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'posts', originalPostId, 'comments', commentId, 'likes'),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, originalPostId, commentId]);

  useEffect(() => {
    setHasLikes(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  async function likeComment() {
    if (session) {
      if (hasLikes) {
        await deleteDoc(
          doc(
            db,
            'posts',
            originalPostId,
            'comments',
            commentId,
            'likes',
            session?.user.uid
          )
        );
      } else {
        await setDoc(
          doc(
            db,
            'posts',
            originalPostId,
            'comments',
            commentId,
            'likes',
            session?.user.uid
          ),
          {
            user: session.user.name,
          }
        );
      }
    } else {
      signIn();
    }
  }

  async function deleteComment() {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteDoc(doc(db, 'posts', originalPostId, 'comments', commentId));
    }
  }
  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200 pl-20">
      {/** USER IMAGE */}

      <img
        className="h-11 w-11 rounded-full mr-4"
        src={comment?.userImg}
        alt="user-img"
      />

      {/** RIGHT SIDE */}

      <div className="flex-1">
        {/** HEADER */}

        <div className="flex items-center justify-between">
          {/** POST USER INFO */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {comment?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">@{comment?.name} - </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
          </div>

          {/** DOT ICON */}
          <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
        </div>

        {/** POST TEXT */}
        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
          {comment?.comment}
        </p>

        {/** ICONS */}
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (!session) {
                  signIn();
                } else {
                  setPostId(originalPostId);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
          </div>
          {session?.user.uid === comment?.userId && (
            <TrashIcon
              onClick={deleteComment}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLikes ? (
              <HeartIconFilled
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes.length > 0 && (
              <span
                className={`${hasLikes && 'text-red-600'} text-sm select-none`}
              >
                {likes.length}
              </span>
            )}
          </div>
          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
}
