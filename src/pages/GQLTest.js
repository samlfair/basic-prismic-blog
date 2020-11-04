import React, { useEffect, useState } from "react";
import Prismic from "prismic-javascript";

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
    uri: "https://slice-machine.cdn.prismic.io/graphql",
  }),
  cache: new InMemoryCache({ fragmentMatcher }),
});

/**
 * Blog homepage component
 */
const BlogHome = () => {
  const [prismicData, setPrismicData] = useState({});
  const [notFound, toggleNotFound] = useState(false);

  // Get the homepage and blog post documents from Prismic
  useEffect(() => {
    const fetchPrismicData = async () => {
      try {
        let cursor;
        const results = [];
        for (let i = 0; i < 3; i++) {
          const blogHomeGqlQuery = gql`
            query newQuery {
              allPages${cursor ? '(after:"' + cursor + '")' : ""} {
                pageInfo {
                  endCursor
                }
                edges {
                  node {
                    _meta {
                      uid
                    }
                    display_title
                  }
                }
              }
            }
          `;
          let gqlRes = (await gqlClient.query({ query: blogHomeGqlQuery })).data
            .allPages;
          results.push(...gqlRes.edges);
          cursor = gqlRes.pageInfo.endCursor;
          console.log(results);
          setPrismicData(results);
          toggleNotFound(false);
        }
      } catch (error) {
        console.error(error);
        toggleNotFound(true);
      }
    };
    fetchPrismicData();
  }, []);

  // Return the page if a document was retrieved from Prismic

  return <>{JSON.stringify(prismicData)}</>;

  return null;
};

export default BlogHome;
