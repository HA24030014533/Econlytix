import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Pagination from "@layouts/components/Pagination";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { markdownify } from "@lib/utils/textConverter";
import { sortByDate } from "@lib/utils/sortFunctions";
import Post from "@partials/Post";
const { blog_folder, summary_length } = config.settings;

// blog pagination
const BlogPagination = ({ postIndex, posts, currentPage, pagination }) => {
  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const orderedPosts = sortByDate(posts);
  const currentPosts = orderedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const { frontmatter } = postIndex;
  const { title } = frontmatter;
  const totalPages = Math.ceil(posts.length / pagination);

  return (
    <Base title={title}>
      <section className="section">
        <div className="container">
          {markdownify(title, "h1", "h2 mb-8 text-center")}
          <div className="row mb-16">
            {currentPosts.map((post, i) => (
              <div className="col-12 col-lg-6 mb-8" key={post.slug}>
                <Post post={post} />
              </div>
            ))}
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </section>
    </Base>
  );
};

export default BlogPagination;

// get blog pagination slug
export const getStaticPaths = () => {
  const getAllSlug = getSinglePage(`content/${blog_folder}`);
  const allSlug = getAllSlug.map((item) => item.slug).filter(slug => slug !== '404');
  const { pagination } = config.settings;
  const totalPages = Math.ceil(allSlug.length / pagination);
  let paths = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      params: {
        slug: (i + 1).toString(),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

// get blog pagination content
export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1);
  const { pagination } = config.settings;
  const posts = getSinglePage(`content/${blog_folder}`);
  
  const serializablePosts = posts.map(post => {
    // Ensure post.frontmatter is an object, defaulting to empty if undefined/null
    const originalFrontmatter = post.frontmatter || {};
    // Create a mutable copy to work with
    const newFrontmatter = { ...originalFrontmatter };

    // Serialize 'date'
    const dateValue = newFrontmatter.date;
    newFrontmatter.date = dateValue instanceof Date
        ? dateValue.toISOString()
        : (dateValue === undefined ? null : dateValue);

    // Serialize 'display_settings' and its 'featured_until' property
    if (newFrontmatter.display_settings === undefined) {
      newFrontmatter.display_settings = null;
    } else if (newFrontmatter.display_settings !== null && typeof newFrontmatter.display_settings === 'object') {
      // display_settings is an object, process its featured_until
      const featuredUntilValue = newFrontmatter.display_settings.featured_until;
      const serializableFeaturedUntil = featuredUntilValue instanceof Date
                                        ? featuredUntilValue.toISOString()
                                        : (featuredUntilValue === undefined ? null : featuredUntilValue);
      
      // Update display_settings by creating a new object with the serialized featured_until.
      // This also ensures we don't mutate an original display_settings object if it was part of a shared reference.
      newFrontmatter.display_settings = {
        ...newFrontmatter.display_settings,
        featured_until: serializableFeaturedUntil,
      };
    }
    // If display_settings was initially null, or some other non-object, non-undefined primitive,
    // it remains as is (e.g. null stays null). This logic specifically targets 'undefined' becoming 'null',
    // and processing 'featured_until' if 'display_settings' is an object.

    return {
      ...post,
      frontmatter: newFrontmatter, // Use the fully processed newFrontmatter
    };
  });

  // Create a default postIndex object instead of reading from _index.md
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
