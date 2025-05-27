import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { slugify } from "@lib/utils/textConverter";
// import Post from "@partials/Post"; // Will be replaced by specific item components
import FeaturedArticleItem from "@layouts/partials/FeaturedArticleItem";
import PopularArticleItem from "@layouts/partials/PopularArticleItem";
import HorizontalArticleItem from "@layouts/partials/HorizontalArticleItem";
import OpinionArticleItem from "@layouts/partials/OpinionArticleItem";

const { blog_folder } = config.settings;

// category page
const Category = ({ postsByCategories, category }) => {
  // Dummy data for now - replace with actual data fetching/filtering logic
  const featuredArticle = postsByCategories.length > 0 ? postsByCategories[0] : null;
  const popularArticles = postsByCategories.slice(1, 6); // Example: next 5 articles
  const horizontalArticles = postsByCategories.slice(6, 9); // Example: next 3 articles
  const opinionArticles = postsByCategories.slice(9, 11); // Example: next 2 articles

  const categoryTitle = category.replace("-", " ");

  return (
    <Base title={categoryTitle}>
      <div className="category-page-container section">
        {/* Top Heading */}
        <h1 className="category-title text-center font-bold">
          {categoryTitle.toUpperCase()}
        </h1>

        {/* Main Content Area (Two Columns) */}
        <div className="main-content-area mb-12 flex flex-col md:flex-row md:space-x-8">
          {/* Left Column (Featured Article) */}
          <div className="left-column mb-8 md:mb-0 md:w-3/5">
            {featuredArticle && <FeaturedArticleItem article={featuredArticle} />}
          </div>

          {/* Right Column (Most Popular) */}
          <div className="right-column md:w-2/5">
            <h2 className="popular-articles-title mb-6 text-xl font-semibold">
              Most Popular in {categoryTitle}
            </h2>
            <div className="popular-articles-list space-y-4">
              {popularArticles.map((article, i) => (
                <PopularArticleItem key={`popular-${i}`} article={article} />
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Articles Row */}
        {horizontalArticles.length > 0 && (
          <div className="horizontal-articles-row mb-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {horizontalArticles.map((article, i) => (
                <HorizontalArticleItem key={`horizontal-${i}`} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Related Opinion Section */}
        {opinionArticles.length > 0 && (
          <div className="related-opinion-section">
            <h2 className="related-opinion-title mb-6 text-xl font-semibold">
              Related Opinion
            </h2>
            <div className="opinion-articles-list space-y-6">
              {opinionArticles.map((article, i) => (
                <OpinionArticleItem key={`opinion-${i}`} article={article} />
              ))}
            </div>
          </div>
        )}
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
