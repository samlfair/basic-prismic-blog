import React from "react";
import flags from "./flags.js";
import { Link } from "react-router-dom";
import "./Lang.css";

const Lang = ({ match, languages }) => {
  const langCodes = languages.map((lang) => lang.lang.split("-")[0]);
  const lang = match.params.lang;
  return (
    <div className="languages">
      {langCodes.map((lang, i) => {
        let url = match.url.replace(/^\/../, "/" + lang);
        return (
          <div className="flag-container" key={i}>
            <Link to={url} className="lang">
              {flags[lang].emoji}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Lang;
