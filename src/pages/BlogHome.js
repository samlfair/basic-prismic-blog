import React, { useEffect, useState } from "react";
import { RichText } from "prismic-reactjs";
import Prismic from "prismic-javascript";

import { Header, PostList, DefaultLayout } from "../components";
import NotFound from "./NotFound";
import { client } from "../utils/prismicHelpers";

/*
 * GraphQl
 */

import gql from "graphql-tag";
import { PrismicLink } from "apollo-link-prismic";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import fragmentTypes from "../utils/fragmentTypes.json";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes,
});

const gqlClient = new ApolloClient({
  link: PrismicLink({
    uri: "https://sam-onboarding-blog.cdn.prismic.io/graphql",
  }),
  cache: new InMemoryCache({ fragmentMatcher }),
});

const blogHomeGqlQuery = gql`
  query newQuery {
    allPosts {
      edges {
        node {
          _meta {
            uid
          }
          title
          date
          author {
            ... on Author {
              author_name
              profile_picture
            }
          }
          body {
            ... on PostBodyText {
              primary {
                text
              }
            }
            __typename
          }
        }
      }
    }
    allBlogHomes {
      edges {
        node {
          headline
          description
          image
        }
      }
    }
    allFeatured_posts {
      edges {
        node {
          featured_post {
            ... on Post {
              title
              date
              _meta {
                uid
              }
              author {
                ... on Author {
                  author_name
                  profile_picture
                }
              }
              body {
                ... on PostBodyText {
                  primary {
                    text
                  }
                }
                ... on PostBodyImage_with_caption {
                  primary {
                    image
                  }
                }
                __typename
              }
            }
          }
        }
      }
    }
  }
`;

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
    const fetchPrismicData = async () => {
      try {
        let gqlRes = await gqlClient.query({ query: blogHomeGqlQuery });

        const homeDoc = gqlRes.data.allBlogHomes.edges[0].node;
        const blogPosts = gqlRes.data.allPosts.edges;
        const featuredPost = {
          node: gqlRes.data.allFeatured_posts.edges[0].node.featured_post,
        };

        if (homeDoc) {
          setPrismicData({
            homeDoc,
            featuredPost,
            blogPosts: blogPosts,
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
    const title = RichText.asText(homeDoc.headline);

    return (
      <DefaultLayout seoTitle={title}>
        <Header
          image={homeDoc.image}
          headline={homeDoc.headline}
          description={homeDoc.description}
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
