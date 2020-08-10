import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import Prismic from "prismic-javascript";

import {
  Header,
  PostList,
  DefaultLayout,
  Lang,
  SearchBar,
} from "../components";
import NotFound from "./NotFound";
import { client } from "../utils/prismicHelpers";

/**
 * Blog homepage component
 */

const langs = {};

const BlogHome = ({ match }) => {
  const lang = match.params.lang;

  const [prismicData, setPrismicData] = useState({
    homeDoc: null,
    featuredPost: null,
    blogPosts: null,
  });
  const [notFound, toggleNotFound] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the homepage and blog post documents from Prismic
  useEffect(() => {
    const fetchPrismicData = async () => {
      try {
        // Get languages
        (await client.getApi("blog-home")).languages.forEach(
          (lang) => (langs[lang.id.split("-")[0]] = lang.id)
        );

        const homeDoc = await client.getSingle("blog-home", {
          lang: langs[lang],
        });

        const featuredPost = (
          await client.getSingle("featured_post", {
            fetchLinks: [
              "post.title",
              "post.date",
              "post.uid",
              "post.body",
              "post.author",
            ],
            lang: langs[lang],
          })
        ).data.featured_post;

        console.log(featuredPost);
        if (featuredPost.uid) {
          let featuredAuthor = await client.getByUID(
            "author",
            featuredPost.data.author.uid,
            { lang: langs[lang] }
          );
          featuredPost.data.author = featuredAuthor;
        }

        const blogPosts = await client.query(
          Prismic.Predicates.at("document.type", "post"),
          {
            orderings: "[my.post.date desc]",
            fetchLinks: ["author.author_name", "author.profile_picture"],
            lang: langs[lang],
          }
        );

        if (homeDoc) {
          setPrismicData({
            homeDoc,
            featuredPost,
            blogPosts: blogPosts.results,
          });
        } else {
          console.warn(
            "Blog Home document was not found. Make sure it exists in your Prismic repository"
          );
          toggleNotFound(true);
        }
      } catch (error) {
        console.error(error);
        toggleNotFound(true);
      }
    };

    fetchPrismicData();
  }, [match]);

  // Return the page if a document was retrieved from Prismic
  if (prismicData.homeDoc) {
    const homeDoc = prismicData.homeDoc;
    const blogPosts = prismicData.blogPosts;
    const featuredPost = prismicData.featuredPost;
    const title = RichText.asText(homeDoc.data.headline);

    return (
      <DefaultLayout seoTitle={title}>
        <Header
          image={homeDoc.data.image}
          headline={homeDoc.data.headline}
          description={homeDoc.data.description}
        />
        <SearchBar
          setResults={setSearchResults}
          setQuery={setSearchQuery}
          lang={langs[lang]}
        />
        {searchQuery ? (
          <PostList posts={searchResults} />
        ) : (
          <PostList posts={blogPosts} featuredPost={featuredPost} />
        )}
        <Lang match={match} languages={homeDoc.alternate_languages} />
      </DefaultLayout>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default BlogHome;
