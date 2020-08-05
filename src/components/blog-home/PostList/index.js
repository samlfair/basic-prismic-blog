import React from "react";
import PostItem from "./PostItem";
import Prismic from "prismic-javascript";
import { client } from "../../../utils/prismicHelpers";

/**
 * Post list component
 */
const PostList = ({ featuredPostRef, posts }) => {
  // Handle featured post
  let featuredPost = posts.filter(
    (post) => post.uid === featuredPostRef.uid
  )[0];
  if (featuredPost) {
    posts.forEach((post, index) => {
      if (post.uid === featuredPostRef.uid) posts.splice(index, 1);
    });
  }
  if (featuredPostRef.uid && !featuredPost) {
    const getFeaturedPost = async () =>
      await client.getByUID(featuredPostRef.uid);
    featuredPost = getFeaturedPost();
  }
  return (
    <div className="blog-main">
      {featuredPost && (
        <PostItem key={featuredPost.id} post={featuredPost} featured={true} />
      )}
      {posts.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};

export default PostList;
