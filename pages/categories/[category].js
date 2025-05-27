import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Sidebar from "@layouts/partials/Sidebar";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { slugify } from "@lib/utils/textConverter";
import Post from "@partials/Post";
const { blog_folder } = config.settings;

// category page
const Category = ({ postsByCategories, category, posts, categories }) => {
  return (
    <Base title={category}>
      <div className="section mt-16">
        <div className="container">
          <h1 className="h2 mb-12">
            Showing posts from
            <span className="section-title ml-1 inline-block capitalize">
              {category.replace("-", " ")}
            </span>
          </h1>
          <div className="row">
            <div className="lg:col-8">
              <div className="row rounded border border-border p-4 px-3 dark:border-darkmode-border lg:p-6">
                {postsByCategories.map((post, i) => (
                  <div key={`key-${i}`} className="col-12 mb-8 sm:col-6">
                    <Post post={post} />
                  </div>
                ))}
              </div>
            </div>
            <Sidebar posts={posts} categories={categories} />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Category;

// category page routes
export const getStaticPaths = () => {
  const allCategories = getTaxonomy(`content/${blog_folder}`, "categories");

  const paths = allCategories.map((category) => ({
    params: {
      category: category,
    },
  }));

  return { paths, fallback: false };
};

// category page data
export const getStaticProps = ({ params }) => {
  const posts = getSinglePage(`content/${blog_folder}`);
  // Fix for serialization error: ensure display_settings and featured_until are null if undefined
  posts.forEach(post => {
    if (post.frontmatter) {
      // Check if display_settings exists and is an object
      if (post.frontmatter.display_settings !== undefined && post.frontmatter.display_settings !== null) {
        // If featured_until is undefined, set it to null
        if (post.frontmatter.display_settings.featured_until === undefined) {
          post.frontmatter.display_settings.featured_until = null;
        }
      } else if (post.frontmatter.display_settings === undefined) {
        // If display_settings itself is undefined, set it to null
        post.frontmatter.display_settings = null;
      }
    }
  });

  const filterPosts = posts.filter((post) =>
    post.frontmatter.categories.find((category) =>
      slugify(category).includes(params.category)
    )
  );
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  const categoriesWithPostsCount = categories.map((category) => {
    const filteredPosts = posts.filter((post) =>
      post.frontmatter.categories.map(e => slugify(e)).includes(category)
    );
    return {
      name: category,
      posts: filteredPosts.length,
    };
  });

  const serializeDates = (postList) => postList.map(post => ({
    ...post,
    frontmatter: {
      ...post.frontmatter,
      date: post.frontmatter.date instanceof Date ? post.frontmatter.date.toISOString() : post.frontmatter.date,
      display_settings: post.frontmatter.display_settings ? {
        ...post.frontmatter.display_settings,
        featured_until: post.frontmatter.display_settings.featured_until instanceof Date
          ? post.frontmatter.display_settings.featured_until.toISOString()
          : post.frontmatter.display_settings.featured_until,
      } : post.frontmatter.display_settings,
    },
  }));

  const serializablePosts = serializeDates(posts);
  const serializableFilterPosts = serializeDates(filterPosts);

  return {
    props: {
      posts: serializablePosts,
      postsByCategories: serializableFilterPosts,
      category: params.category,
      categories: categoriesWithPostsCount,
    },
  };
};
