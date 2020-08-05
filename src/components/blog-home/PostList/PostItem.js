import React from "react";
import { Link } from "react-router-dom";
import { RichText } from "prismic-reactjs";

import PostDate from "./PostDate";
import FirstParagraph from "./FirstParagraph";
import { linkResolver } from "../../../prismic-configuration";

/**
 * Post list item component
 */
const PostItem = ({ featured, post }) => {
  console.log(post);
  const title = RichText.asText(post.data.title)
    ? RichText.asText(post.data.title)
    : "Untitled";
  return (
    <div className={"blog-post" + (featured && " featured-post")}>
      {featured &&
        post.data.body.reduce((acc, slice) => {
          if (slice.slice_type === "image_with_caption") {
            return <img src={slice.primary.image.url} />;
          }
          return acc;
        }, [])}
      <div className="container">
        {featured && <span className="featured-tag">Featured</span>}
        <Link to={linkResolver(post)}>
          <h2>{title}</h2>
        </Link>

        <PostDate date={post.data.date} />
        <FirstParagraph sliceZone={post.data.body} textLimit={300} />
      </div>
    </div>
  );
};

export default PostItem;
