import { SparklesIcon } from '@heroicons/react/outline';
import React from 'react';
import Input from './Input';
import Post from './Post';

export default function Feed() {
  const posts = [
    {
      id: '1',
      name: 'John Smith',
      username: 'John',
      userImg:
        'https://i.pinimg.com/originals/8e/9a/45/8e9a45396b98f9c31256ab7d589d6480.jpg',
      img: 'https://p0.pikist.com/photos/178/777/feng-shui-zen-stones-texture-material-graphic-design-fengshui-assembly.jpg',
      text: 'Hello ',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      name: 'Ton Sikh',
      username: 'Ton',
      userImg:
        'https://i.pinimg.com/originals/8e/9a/45/8e9a45396b98f9c31256ab7d589d6480.jpg',
      img: 'https://p0.pikist.com/photos/108/78/stones-black-oil-massage-oil-massage-bamboo-luck-bamboo-hot-stones-relaxation.jpg',
      text: 'Nice ',
      timestamp: '5 hours ago',
    },
  ];
  return (
    <div className="xl:ml[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-lx font-bold cursor-pointer">Home</h2>
        <div className="hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9">
          <SparklesIcon className="h-5" />
        </div>
      </div>
      <Input />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
