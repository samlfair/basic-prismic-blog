import React from "react";
import { Link } from "react-router-dom";

const Lang = ({ match }) => {
  const flags = {
    fr: "🇫🇷",
    en: "🇬🇧",
  };
  const lang = match.params.lang;
  let url;
  if (lang === "fr") url = match.url.replace(/fr/, `en`);
  if (lang === "en") url = match.url.replace(/en/, `fr`);
  return (
    <Link to={url} className="lang">
      {lang === "fr" ? flags.en : flags.fr}
    </Link>
  );
};

export default Lang;
