import { comment } from 'postcss';
import React from 'react';

export default function Comment({ comment, id }) {
  return <div>{comment.comment}</div>;
}
