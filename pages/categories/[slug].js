import { useRouter } from 'next/router';
import Baseof from "@layouts/Baseof";
import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { slugify } from "@lib/utils/textConverter";
import Link from 'next/link';
import FeaturedArticleItem from '@layouts/partials/FeaturedArticleItem';
import PopularArticleItem from '@layouts/partials/PopularArticleItem';
import Post from '@layouts/partials/Post'; // Assuming Post can handle grid item display

// Using a standard font as a fallback (can be replaced with actual font logic if needed)
const standardFont = { className: '' };

const CategoryPage = ({ slug, posts }) => {
  const router = useRouter();
  const { title } = config.site;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const capitalizedSlug = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Category';

  // Determine featured, popular, and other posts
  // This is a basic implementation; consider more sophisticated logic for "popular"
  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  const popularPosts = posts && posts.length > 1 ? posts.slice(1, 6) : []; // Next 5 posts
  const otherPosts = posts && posts.length > 6 ? posts.slice(6) : (posts && posts.length > 1 ? posts.slice(1) : []);


  return (
    <Baseof title={`${capitalizedSlug} - ${title}`}>
      <div className={`section ${standardFont.className} category-page-container py-10`}> {/* Added py-10 for vertical padding */}
        <div className="w-full"> {/* Changed from 'container mx-auto px-4' to 'w-full' */}
          {/* Apply styles similar to .category-title from SCSS */}
          <h1 className="text-4xl font-bold text-center text-black border-b border-black pb-3 mb-10">
            {capitalizedSlug.toUpperCase()}
          </h1>
          
          {posts && posts.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-12"> {/* Adjusted gap */}
              {/* Main Content Area */}
              <div className="lg:w-2/3 flex flex-col gap-12"> {/* Added flex-col and gap */}
                {featuredPost && (
                  // FeaturedArticleItem already has good styling from its own definition and category-page.scss
                  <FeaturedArticleItem article={featuredPost} />
                )}
                
                {/* Grid of Other Articles */}
                {otherPosts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8"> {/* Adjusted gap and sm breakpoint */}
                    {otherPosts.map((post) => (
                      // Apply card-like styling here for Post items in the grid
                      <div key={post.slug} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <Post post={post} display_settings={{ layout_style: "Grid Item" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:w-1/3 lg:pl-6"> {/* Adjusted padding */}
                {popularPosts.length > 0 && (
                  <div className="sticky top-10"> {/* Added sticky positioning for sidebar */}
                    {/* Apply styles similar to .popular-articles-title from SCSS */}
                    <h2 className="text-xl font-semibold mb-5 pb-2.5 border-b-2 border-gray-200">Most Popular in {capitalizedSlug}</h2>
                    <div className="space-y-5"> {/* Adjusted spacing */}
                      {popularPosts.map((post) => (
                        // PopularArticleItem already has good styling
                        <PopularArticleItem key={post.slug} article={post} />
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600">
              No posts found in the category "{capitalizedSlug}".
            </p>
          )}
        </div>
      </div>
    </Baseof>
  );
};

export default CategoryPage;

export async function getStaticPaths() {
  const categorySlugs = getTaxonomy("content/posts", "categories");
  const paths = categorySlugs.map((categorySlug) => ({
    params: { slug: categorySlug },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const allPosts = getSinglePage("content/posts");

  // Ensure posts are sorted, e.g., by date, if not already
  // This helps in consistently picking the 'featured' and 'popular' posts
  const sortedPosts = allPosts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

  const filteredPosts = sortedPosts.filter(post => {
    const postCategories = post.frontmatter.categories;
    if (postCategories && Array.isArray(postCategories)) {
      return postCategories.some(category => {
        if (typeof category === 'string') {
          return slugify(category) === slug;
        }
        return false;
      });
    }
    return false;
  });

  return {
    props: {
      slug,
      posts: filteredPosts,
    },
    revalidate: 60,
  };
}