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
              <div className="mt-16 lg:col-6" key={post.slug}>
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
        display_settings: frontmatter.display_settings
          ? {
              ...frontmatter.display_settings,
              featured_until: serializableFeaturedUntil,
            }
          : frontmatter.display_settings,
      },
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
