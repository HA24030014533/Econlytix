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
import readingTime from "@lib/utils/readingTime";
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
              {/* Top story: headline, summary, and bullet for related story */}
              {heroPost0 && (
                <div className="pb-6 border-b border-border">
                  <h2 className="text-3xl font-extrabold mb-2 leading-tight text-foreground">
                    <Link href={`/${blog_folder}/${heroPost0.slug}`} className="hover:text-primary">
                      {heroPost0.frontmatter.title}
                    </Link>
                  </h2>
                  <p className="text-lg text-foreground mb-3">
                    {heroPost0.frontmatter.summary ? heroPost0.frontmatter.summary : heroPost0.content.slice(0, 120) + '...'}
                  </p>
                  {/* Bullet for related story, only if hero_bullet is set */}
                  {heroPost0.frontmatter.hero_bullet && (
                    <ul className="list-disc pl-5">
                      <li className="font-bold text-base text-foreground">
                        {heroPost0.frontmatter.hero_bullet}
                      </li>
                    </ul>
                  )}
                  {/* Comments and reading time */}
                  <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-4">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      523
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      {readingTime(heroPost0.content)}
                    </span>
                  </div>
                </div>
              )}
              {/* Next two stories: headline only */}
              {heroPost1 && (
                <div className="pt-6 border-b border-border">
                  <h3 className="text-xl font-bold mb-1 text-foreground">
                    <Link href={`/${blog_folder}/${heroPost1.slug}`} className="hover:text-primary">
                      {heroPost1.frontmatter.title}
                    </Link>
                  </h3>
                  <p className="text-base text-foreground">
                    {heroPost1.frontmatter.summary ? heroPost1.frontmatter.summary : heroPost1.content.slice(0, 80) + '...'}
                  </p>
                  {/* Comments and reading time */}
                  <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-4">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      243
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      {readingTime(heroPost1.content)}
                    </span>
                  </div>
                </div>
              )}
              {heroPost2 && (
                <div className="pt-6">
                  <h3 className="text-xl font-bold mb-1 text-foreground">
                    <Link href={`/${blog_folder}/${heroPost2.slug}`} className="hover:text-primary">
                      {heroPost2.frontmatter.title}
                    </Link>
                  </h3>
                  <p className="text-base text-foreground">
                    {heroPost2.frontmatter.summary ? heroPost2.frontmatter.summary : heroPost2.content.slice(0, 80) + '...'}
                  </p>
                  {/* Comments and reading time */}
                  <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-4">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      848
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      {readingTime(heroPost2.content)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Center Column - w-full on small, lg:w-1/2 on large */}
            <div className="w-full lg:w-1/2 lg:px-2 mb-8 lg:mb-0">
              {heroPostCenter && (
                <div className="flex flex-col items-center text-center">
                  {heroPostCenter.frontmatter.image && (
                    <div className="mb-4 w-full">
                      <ImageFallback
                        className="rounded-lg w-full h-auto object-cover aspect-[16/9] shadow-md"
                        src={heroPostCenter.frontmatter.image}
                        alt={heroPostCenter.frontmatter.title}
                        width={800}
                        height={450}
                        priority={true}
                      />
                    </div>
                  )}
                  <h1 className="text-4xl lg:text-5xl font-extrabold mb-3 leading-tight text-foreground">
                    <Link href={`/${blog_folder}/${heroPostCenter.slug}`} className="hover:text-primary">
                      {heroPostCenter.frontmatter.title}
                    </Link>
                  </h1>
                  <p className="text-lg text-foreground mb-4 max-w-2xl mx-auto">
                    {heroPostCenter.frontmatter.summary ? heroPostCenter.frontmatter.summary : heroPostCenter.content.slice(0, 140) + '...'}
                  </p>
                  <div className="flex items-center justify-center text-xs text-muted-foreground space-x-6">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      243
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      {readingTime(heroPostCenter.content)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Opinion) - w-full on small, lg:w-1/4 on large */}
            <div className="w-full lg:w-1/4 lg:px-2">
              <h2 className="text-3xl font-extrabold mb-6 text-left" style={{fontFamily: 'serif'}}>Opinion</h2>
              <div className="space-y-6">
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
