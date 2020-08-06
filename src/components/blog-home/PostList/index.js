import React, { useState } from "react";
import PostItem from "./PostItem";
import Prismic from "prismic-javascript";
import { client } from "../../../utils/prismicHelpers";

/**
 * Post list component
 */
const PostList = ({ featuredPost, posts }) => {
  if (featuredPost.node) {
    posts = posts.filter(
      (post) => post.node._meta.uid !== featuredPost.node._meta.uid
    );
  }
  return (
    <div className="blog-main">
      {featuredPost.node && (
        <PostItem
          key={featuredPost.node._meta.uid}
          post={featuredPost}
          featured={true}
        />
      )}
      {posts.map((post) => (
        <PostItem post={post} key={post.node._meta.uid} />
      ))}
    </div>
  );
};

export default PostList;
