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

const gqlClient = new ApolloClient({
  link: PrismicLink({
    uri: "https://sam-onboarding-blog.cdn.prismic.io/graphql",
  }),
  cache: new InMemoryCache(),
});

const blogHomeGqlQuery = gql`
  query newQuery {
    allPosts {
      edges {
        node {
          title
          date
          author {
            ... on Author {
              author_name
              profile_picture
            }
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
              author {
                ... on Author {
                  author_name
                  profile_picture
                }
              }
            }
          }
        }
      }
    }
  }
`;

const blogHomeGqlQuery2 = gql`
  query {
    allPosts {
      edges {
        node {
          title
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
        let gqlRes = await gqlClient.query({ query: blogHomeGqlQuery });

        console.log(gqlRes);

        // const homeDoc = await client.getSingle("blog-home");
        const homeDoc = gqlRes.data.allBlogHomes.edges[0].node;
        console.log(homeDoc);

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
