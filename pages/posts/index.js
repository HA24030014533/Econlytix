import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";
import BlogPagination from "../page/[slug]"; // Keep default export for the component

const { blog_folder, pagination } = config.settings;

export const getStaticProps = async ({ params }) => {
  // For /posts, params will be undefined, so params.slug will be undefined.
  // currentPage will correctly default to 1.
  const currentPage = parseInt((params && params.slug) || 1);
  
  const posts = getSinglePage(`content/${blog_folder}`);
  
  const serializablePosts = posts.map(post => {
    // Ensure post and frontmatter exist to prevent runtime errors if data is malformed
    if (!post || !post.frontmatter) {
      // For now, return post as is, or handle error appropriately
      return post; 
    }
    const frontmatter = post.frontmatter;

    const dateValue = frontmatter.date;
    const serializableDate = dateValue instanceof Date
        ? dateValue.toISOString()
        : (dateValue === undefined ? null : dateValue);

    const featuredUntilValue = frontmatter.display_settings?.featured_until;
    const serializableFeaturedUntil = featuredUntilValue instanceof Date
                                      ? featuredUntilValue.toISOString()
                                      : (featuredUntilValue === undefined ? null : featuredUntilValue);
    
    return {
      ...post,
      frontmatter: {
        ...frontmatter,
        date: serializableDate,
        // If frontmatter.display_settings is undefined, set it to null.
        // Otherwise, spread it and ensure its nested properties like featured_until are also serialized.
        display_settings: frontmatter.display_settings === undefined
          ? null
          : {
            ...frontmatter.display_settings,
            featured_until: serializableFeaturedUntil,
          },
      },
    };
  });

  // Use the default postIndex structure as in the latter part of the provided page/[slug].js
  const postIndex = {
    frontmatter: {
      title: "Latest Posts" 
    }
  };

  return {
    props: {
      pagination: pagination,
      posts: serializablePosts,
      currentPage: currentPage,
      postIndex: postIndex,
    },
  };
};

export default BlogPagination;
