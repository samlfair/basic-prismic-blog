import React, { useState, useEffect } from "react";
import Prismic from "prismic-javascript";
import { client } from "../../utils/prismicHelpers";
import "./SearchBar.css";

const SearchBar = ({ setResults, setQuery, lang }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setQuery(e.target.value);
  };

  useEffect(() => {
    const performSearch = async () => {
      let loading = true;
      const blogPosts = await client.query(
        [
          Prismic.Predicates.at("document.type", "post"),
          Prismic.Predicates.fulltext("document", search),
        ],
        {
          orderings: "[my.post.date desc]",
          fetchLinks: ["author.author_name", "author.profile_picture"],
          lang: lang,
        }
      );
      if (loading) {
        setResults(blogPosts.results);
      }
      return () => (loading = false);
    };
    performSearch();
  }, [search]);

  return (
    <div className="container">
      <form className="search-form">
        <input
          placeholder="Search"
          className="search-bar"
          onChange={handleSearch}
          value={search}
          type="text"
        />
      </form>
    </div>
  );
};

export default SearchBar;
