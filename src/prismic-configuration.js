// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = "https://sam-onboarding-blog.cdn.prismic.io/api/v2";

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
export const accessToken = process.env.REACT_APP_PRISMIC_ACCESS_TOKEN;

// -- Link resolution rules
// Manages the url links to internal Prismic documents
export const linkResolver = (doc) => {
  const getLang = (langCode) => {
    return langCode.split("-")[0];
  };

  if (doc.type === "post") return `/${getLang(doc.lang)}/blog/${doc.uid}`;
  return "/";
};
