import React from "react";
import { DiscussionEmbed } from "disqus-react";

const root = process.env.REACT_APP_ROOT;

const Comments = ({ url, title }) => {
  return (
    <div className="comments">
      <DiscussionEmbed
        className="container"
        shortname={"sam-onboarding-blog"}
        config={{
          url: root,
          identifier: url.params.uid,
          title: title,
        }}
      />
    </div>
  );
};

export default Comments;
