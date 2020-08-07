import React from "react";
import { Link } from "react-router-dom";

/**
 * Post back button component
 */
const BackButton = ({ lang }) => (
  <div className="back">
    <Link to={"/" + lang}>back to list</Link>
  </div>
);

export default BackButton;
