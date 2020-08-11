import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";

import {
  DefaultLayout,
  BackButton,
  SliceZone,
  Comments,
  Lang,
} from "../components";
import NotFound from "./NotFound";
import { client } from "../utils/prismicHelpers";

/**
 * Blog post page component
 */

const langs = {
  fr: "fr-fr",
  en: "en-us",
};

const Post = ({ match }) => {
  const [prismicDoc, setPrismicDoc] = useState(null);
  const [notFound, toggleNotFound] = useState(false);

  const uid = match.params.uid;
  const lang = match.params.lang;

  // Get the blog post document from Prismic
  useEffect(() => {
    const fetchPrismicData = async () => {
      try {
        // Get languages
        (await client.getApi("blog-home")).languages.forEach(
          (lang) => (langs[lang.id.split("-")[0]] = lang.id)
        );

        const doc = await client.getByUID("post", uid, {
          lang: langs[lang],
        });

        if (doc) {
          setPrismicDoc(doc);
        } else {
          console.warn(
            "Blog post document was not found. Make sure it exists in your Prismic repository"
          );
          toggleNotFound(true);
        }
      } catch (error) {
        console.error(error);
        toggleNotFound(true);
      }
    };

    fetchPrismicData();
  }, [uid, match]);

  // Return the page if a document was retrieved from Prismic
  if (prismicDoc) {
    const title =
      prismicDoc.data.title.length !== 0
        ? RichText.asText(prismicDoc.data.title)
        : "Untitled";

    return (
      <DefaultLayout wrapperClass="main" seoTitle={title}>
        <div className="outer-container">
          <BackButton lang={lang} />
          <h1>{title}</h1>
        </div>
        <SliceZone sliceZone={prismicDoc.data.body} />
        {prismicDoc.data.allowComments === "yes" && (
          <Comments url={match} title={title} />
        )}
        <Lang match={match} languages={prismicDoc.alternate_languages} />
      </DefaultLayout>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default Post;
