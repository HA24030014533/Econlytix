import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/partials/Post";
import Sidebar from "@layouts/partials/Sidebar";
import MarketRibbon from "@components/MarketRibbon"; // Added import
import { getListPage, getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import dateFormat from "@lib/utils/dateFormat";
import { sortByDate } from "@lib/utils/sortFunctions";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { FaRegCalendar } from "react-icons/fa";
const { blog_folder, pagination } = config.settings;

const Home = ({
  banner,
  posts,
  featured_posts,
  recent_posts,
  categories,
  promotion,
}) => {
  const sortPostByDate = sortByDate(posts);
  const featuredPosts = sortPostByDate.filter(
    (post) => post.frontmatter.featured
  );
  const showPosts = pagination;

  // Define posts for each part of the hero
  const heroPost0 = sortPostByDate.length > 0 ? sortPostByDate[0] : null;
  const heroPost1 = sortPostByDate.length > 1 ? sortPostByDate[1] : null;
  const heroPost2 = sortPostByDate.length > 2 ? sortPostByDate[2] : null;
  const heroPostCenter = sortPostByDate.length > 3 ? sortPostByDate[3] : null;
  const heroOpinionPosts = sortPostByDate.length > 4 ? sortPostByDate.slice(4, 8) : [];


  const recentListingPostsStart = 8; // This will now be the start for the "More Top Stories" section
  // const recentListingPosts = sortPostByDate.slice(recentListingPostsStart, recentListingPostsStart + showPosts); // Old definition

  const mainHeadlinePost = sortPostByDate.length > recentListingPostsStart ? sortPostByDate[recentListingPostsStart] : null;
  const gridPostsCount = 3;
  const gridPosts = mainHeadlinePost && sortPostByDate.length > (recentListingPostsStart + 1)
                  ? sortPostByDate.slice(recentListingPostsStart + 1, recentListingPostsStart + 1 + gridPostsCount)
                  : (!mainHeadlinePost && sortPostByDate.length > recentListingPostsStart)
                  ? sortPostByDate.slice(recentListingPostsStart, recentListingPostsStart + gridPostsCount)
                  : [];
  
  // const postsConsumedByMoreTopStories = (mainHeadlinePost ? 1 : 0) + gridPosts.length; // Not needed for totalPages calc here
  // const paginationStartPoint = recentListingPostsStart + postsConsumedByMoreTopStories; // This was the error for totalPages


  return (
    <>
      <MarketRibbon />
      <div> {/* Removed mt-8 from wrapper div */}
        <Base>
          {/* Hero Section Start */}
          <section className="section pt-6 pb-12 bg-body dark:bg-darkmode-body">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            {/* Left Column - w-full on small, lg:w-1/4 on large */}
            <div className="w-full lg:w-1/4 lg:px-2 mb-8 lg:mb-0 space-y-5">
              {heroPost0 && <Post post={heroPost0} displayMode="hero_left_list" />}
              {heroPost1 && <Post post={heroPost1} displayMode="hero_left_list" />}
              {heroPost2 && <Post post={heroPost2} displayMode="hero_left_list" />}
            </div>

            {/* Center Column - w-full on small, lg:w-1/2 on large. Added flex for centering. */}
            <div className="w-full lg:w-1/2 lg:px-2 mb-8 lg:mb-0 flex flex-col items-center text-center">
              {heroPostCenter && (
                <>
                  {heroPostCenter.frontmatter.image && (
                    <div className="mb-4 w-full max-w-2xl"> {/* Increased max-width from xl to 2xl */}
                      <ImageFallback
                        className="rounded-lg w-full h-auto object-cover aspect-[16/10] shadow-md" /* Changed aspect ratio */
                        src={heroPostCenter.frontmatter.image}
                        alt={heroPostCenter.frontmatter.title}
                        width={800}
                        height={500} /* Adjusted height prop to match 16:10 for 800 width */
                        priority={true}
                      />
                    </div>
                  )}
                  {/* Post content (headline, summary, meta) below image */}
                  <div className="w-full"> {/* Ensure text content also respects centering */}
                    <Post post={heroPostCenter} displayMode="hero_center_headline" />
                  </div>
                </>
              )}
            </div>

            {/* Right Column (Opinion) - w-full on small, lg:w-1/4 on large */}
            <div className="w-full lg:w-1/4 lg:px-2">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-primary text-foreground">Opinion</h2>
              {heroOpinionPosts.length > 0 ? (
                heroOpinionPosts.map((post) => (
                  <Post key={post.slug} post={post} displayMode="hero_right_opinion" />
                ))
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">No opinion posts available.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Hero Section End */}

      {/* Main Content Area (after hero) */}
      <section className="section pt-20">
        <div className="container">
          <div className="row items-start">
            <div className="mb-12 lg:mb-0 w-full lg:w-3/4 lg:px-2"> {/* "Recent Posts" section, using Tailwind width */}
              {/* Promotion */}
              {promotion.enable && (
                <Link href={promotion.link} className="section block pt-0 mb-10">
                  <ImageFallback
                    className="h-full w-full rounded shadow"
                    height="115"
                    width="800"
                    src={promotion.image}
                    alt="promotion"
                  />
                </Link>
              )}

              {/* More Top Stories (formerly Recent Posts) */}
              {recent_posts.enable && (mainHeadlinePost || gridPosts.length > 0) && (
                <div className="section pt-0">
                  {markdownify(recent_posts.title, "h3", "section-title mb-8 text-foreground")}
                  
                  {/* Main Headline Post */}
                  {mainHeadlinePost && (
                    <div className="mb-12 flex flex-col md:flex-row items-stretch border-b border-border pb-8"> {/* Added items-stretch and border */}
                      <div className="md:w-1/2 md:pr-6 flex flex-col justify-between"> {/* Added flex flex-col justify-between */}
                        <div>
                          <h2 className="h3 mb-4 text-foreground">
                            <Link href={`/${blog_folder}/${mainHeadlinePost.slug}`} className="block hover:text-primary">
                              {mainHeadlinePost.frontmatter.title}
                            </Link>
                          </h2>
                          <p className="text-foreground mb-4">
                            {mainHeadlinePost.frontmatter.summary ? mainHeadlinePost.frontmatter.summary : mainHeadlinePost.content.slice(0, 150) + '...'}
                          </p>
                        </div>
                        <p className="inline-flex items-center font-secondary text-xs mt-auto text-muted-foreground"> {/* Added mt-auto to push to bottom */}
                          <FaRegCalendar className="mr-1.5" />
                          {dateFormat(mainHeadlinePost.frontmatter.date)}
                        </p>
                      </div>
                      {mainHeadlinePost.frontmatter.image && (
                        <div className="md:w-1/2 md:pl-6 mt-6 md:mt-0">
                          <Link href={`/${blog_folder}/${mainHeadlinePost.slug}`} className="block">
                            <ImageFallback
                              className="rounded-lg w-full h-auto object-cover aspect-[4/3] shadow-md" /* Changed aspect ratio from 16/10 to 4/3 */
                              src={mainHeadlinePost.frontmatter.image}
                              alt={mainHeadlinePost.frontmatter.title}
                              width={500}
                              height={375} /* Adjusted for 4/3 ratio with width 500 */
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Grid Posts */}
                  {gridPosts.length > 0 && (
                    <div> {/* Removed rounded p-6 from here */}
                      <div className="row">
                        {gridPosts.map((post) => (
                          <div className="mb-8 md:col-4" key={post.slug}>
                            <Post post={post} displayMode="featured_large" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Duplicate Pagination removed from here */}
            </div> {/* End of lg:w-3/4 column */}
            
            {/* Sidebar Column */}
            <div className="w-full lg:w-1/4 lg:px-2">
              <Sidebar
                className={"lg:mt-0"}
                posts={posts}
                categories={categories}
              />
            </div>
          </div> {/* End of .row items-start */}

          {/* Pagination moved here, inside .container but after .row */}
          <Pagination
            totalPages={Math.ceil(Math.max(0, sortPostByDate.length - recentListingPostsStart) / showPosts)}
            currentPage={1}
          />
        </div> {/* End of .container */}
      </section>
        </Base>
      </div>
    </>
  );
};

export default Home;

// for homepage data
export const getStaticProps = async () => {
  const homepage = await getListPage("content/_index.md");
  const { frontmatter } = homepage;
  const { featured_posts, recent_posts, promotion } = frontmatter;
  const posts = getSinglePage(`content/${blog_folder}`);
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  const categoriesWithPostsCount = categories.map((category) => {
    const filteredPosts = posts.filter((post) =>
      post.frontmatter.categories.includes(category)
    );
    return {
      name: category,
      posts: filteredPosts.length,
    };
  });

  return {
    props: {
      posts: posts,
      featured_posts,
      recent_posts,
      promotion,
      categories: categoriesWithPostsCount,
    },
  };
};
