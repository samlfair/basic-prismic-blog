import React from "react";
import { Text, Quote, ImageWithCaption, Embed, CodeBlock } from "./slices";

/**
 * Post slice zone component
 */
const SliceZone = ({ sliceZone }) =>
  sliceZone.map((slice, index) => {
    switch (slice.slice_type) {
      case "image_with_caption":
        return <ImageWithCaption slice={slice} key={`slice-${index}`} />;
      case "quote":
        return <Quote slice={slice} key={`slice-${index}`} />;
      case "text":
        return <Text slice={slice} key={`slice-${index}`} />;
      case "embed":
        return <Embed slice={slice} key={`slice-${index}`} />;
      case "code_block":
        return <CodeBlock slice={slice} key={`slice-${index}`} />;
      default:
        return null;
    }
  });

export default SliceZone;
