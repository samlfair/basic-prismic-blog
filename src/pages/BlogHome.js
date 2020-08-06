import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import Prismic from "prismic-javascript";

import { Header, PostList, DefaultLayout } from "../components";
import NotFound from "./NotFound";
import { client } from "../utils/prismicHelpers";

/**
 * GraphQl
 
 import { PrismicLink } from "apollo-link-prismic";
 import { InMemoryCache } from "apollo-cache-inmemory";
 import ApolloClient from "apollo-client";
 import gql from "graphql-tag";
 
 const clientGql = new ApolloClient({
   link: PrismicLink({
     uri: "https://sam-onboarding-blog.prismic.io/graphql",
     accessToken: process.env.REACT_APP_PRISMIC_ACCESS_TOKEN,
    }),
    cache: new InMemoryCache(),
  });
  
*/

/**
 * Blog homepage component
 */
const BlogHome = () => {
  const [prismicData, setPrismicData] = useState({
    homeDoc: null,
    featuredPost: null,
    blogPosts: null,
  });
  const [notFound, toggleNotFound] = useState(false);

  // Get the homepage and blog post documents from Prismic
  useEffect(() => {
    const postsGraphQuery = `{
      post {
        title
        date
        uid
        body
        author {
          ...on author {
            author_name
            profile_picture
          }
        }
      }
    }`;

    const featuredGraphQuery = `{
      featured_post {
        featured_post {
          ...on post {
            title
            date
            uid
            body
            author {
              ...on author {
                author_name
                profile_picture
              }
            }
          }
        }
      }
    }`;

    const fetchPrismicData = async () => {
      try {
        const homeDoc = await client.getSingle("blog-home");

        const blogPosts = await client.query(
          Prismic.Predicates.at("document.type", "post", {
            orderings: "[my.post.date desc]",
          }),
          {
            graphQuery: postsGraphQuery,
          }
        );

        const featuredPost = (
          await client.getSingle("featured_post", {
            graphQuery: featuredGraphQuery,
          })
        ).data.featured_post;

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
  }, []);

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
        <PostList posts={blogPosts} featuredPost={featuredPost} />
      </DefaultLayout>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
};

export default BlogHome;
