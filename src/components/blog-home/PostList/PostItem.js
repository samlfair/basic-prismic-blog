import React from "react";
import { Link } from "react-router-dom";
import { RichText } from "prismic-reactjs";

import PostMeta from "./PostMeta";
import FirstParagraph from "./FirstParagraph";
import { linkResolver } from "../../../prismic-configuration";

/**
 * Post list item component
 */
const PostItem = ({ featured, post }) => {
  const title = RichText.asText(post.node.title)
    ? RichText.asText(post.node.title)
    : "Untitled";
  return (
    <div className={"blog-post" + (featured && " featured-post")}>
      {featured &&
        post.node.body.reduce((acc, slice) => {
          if (slice.__typename === "PostBodyImage_with_caption") {
            return <img src={slice.primary.image.url} />;
          }
          return acc;
        }, [])}
      <div className="container">
        {featured && <span className="featured-tag">Featured</span>}
        <Link to={linkResolver(post)}>
          <h2>{title}</h2>
        </Link>
        <PostMeta date={post.node.date} author={post.node.author} />
        <FirstParagraph sliceZone={post.node.body} textLimit={300} />
      </div>
    </div>
  );
};

export default PostItem;
