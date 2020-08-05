import React from "react";
import PostItem from "./PostItem";
import Prismic from "prismic-javascript";
import { client } from "../../../utils/prismicHelpers";

/**
 * Post list component
 */
const PostList = ({ featuredPost, posts }) => {
  if (featuredPost.uid) {
    posts = posts.filter((post) => post.uid !== featuredPost.uid);
  }
  return (
    <div className="blog-main">
      {featuredPost.uid && (
        <PostItem key={featuredPost.id} post={featuredPost} featured={true} />
      )}
      {posts.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};

export default PostList;
