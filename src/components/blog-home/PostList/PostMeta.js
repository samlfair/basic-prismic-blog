import React from "react";
import { Date } from "prismic-reactjs";

/**
 * Post list item date component
 */
const PostMeta = ({ date, author }) => {
  console.log(author);
  // Format the date to M d, Y
  const dateFormat = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  const displayDate = new Intl.DateTimeFormat("en-US", dateFormat).format(
    Date(date)
  );

  return (
    <p className="blog-post-meta">
      <time className="created-at">{displayDate}</time>
      {author && (
        <span className="author">
          <span className="separator">|</span>
          {author.author_name[0].text}
        </span>
      )}
    </p>
  );
};

export default PostMeta;
