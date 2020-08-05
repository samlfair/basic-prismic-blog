import React from "react";

const Embed = ({ slice }) => {
  return (
    <div
      className="embed"
      dangerouslySetInnerHTML={{ __html: slice.primary.media.html }}
    />
  );
};

export default Embed;
