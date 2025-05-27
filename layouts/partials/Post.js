import config from "@config/config.json";
import ImageFallback from "@layouts/components/ImageFallback";
import dateFormat from "@lib/utils/dateFormat";
import readingTime from "@lib/utils/readingTime"; // Import readingTime utility
import Link from "next/link";
import { FaRegCalendar, FaUserAlt, FaClock } from "react-icons/fa"; // Added FaClock

const Post = ({ post, displayMode }) => {
  const { summary_length, blog_folder } = config.settings;
  const { meta_author } = config.metadata;
  const author = post.frontmatter.author ? post.frontmatter.author : meta_author;
  const rTime = readingTime(post.content);
  const { display_settings } = post.frontmatter; // Get the new display settings object
  const {
    display_area = "Default",
    layout_style = "Standard",
    column_priority = "Standard",
    display_order,
    featured_until,
    hide_from_lists
  } = display_settings || {}; // Destructure with defaults

  // Default settings
  let containerClass = "post mb-6 flex flex-col";
  let imageContainerClass = "relative mb-4";
  let imageClass = "rounded w-full";
  let imageHeight = 208;
  let imageWidth = 405;
  let titleClass = "text-xl font-semibold mb-2 line-clamp-2 h-[4.5rem] text-foreground";
  let showSummary = true;
  let showReadMoreButton = false;
  let showCategories = false;
  let showAuthor = true;
  let showDate = true;
  let showReadingTime = true;
  let summaryLength = Number(summary_length);
  let renderImage = post.frontmatter.image;
  let authorTextClass = "text-xs text-muted-foreground mt-1";
  let metaUlClass = "flex flex-wrap items-center space-x-3 text-xs mt-1.5 text-muted-foreground";

  // Layout style specific overrides
  switch (layout_style) {
    case "Compact":
      containerClass = "post flex flex-col";
      imageClass = "rounded w-full h-32 object-cover mb-2";
      imageHeight = 128;
      imageWidth = 228;
      titleClass = "text-lg font-semibold mb-1 mt-0 line-clamp-2 h-[4.5rem] text-foreground";
      showSummary = false;
      showReadMoreButton = false;
      showCategories = false;
      break;
    case "Card":
      containerClass = "post bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200";
      imageClass = "rounded-t-lg w-full h-48 object-cover";
      imageHeight = 192;
      imageWidth = 405;
      titleClass = "text-xl font-semibold mb-2 px-4 pt-4 text-foreground";
      metaUlClass = "px-4 pb-4 " + metaUlClass;
      break;
    case "Featured Large":
      titleClass = "text-3xl font-bold mb-3 mt-4 line-clamp-2 h-[4.5rem] text-foreground";
      summaryLength = Number(summary_length) + 100;
      imageHeight = 300;
      imageWidth = 530;
      showReadMoreButton = true;
      showCategories = true;
      break;
    case "Hero Left":
      containerClass = "post mb-5 flex flex-col";
      titleClass = "text-lg font-semibold mb-1.5 hover:text-primary text-foreground";
      summaryLength = 80;
      showAuthor = false;
      showCategories = false;
      renderImage = false;
      break;
    case "Hero Center":
      containerClass = "post mb-0 text-center flex flex-col";
      titleClass = "text-4xl lg:text-5xl font-bold mb-2 hover:text-primary text-foreground";
      summaryLength = 120;
      showAuthor = false;
      showCategories = false;
      renderImage = false;
      metaUlClass = "flex flex-wrap items-center justify-center space-x-3 text-xs mt-2.5 pt-2.5 border-t border-border text-muted-foreground";
      break;
    case "Hero Right":
      containerClass = "flex mb-4 items-start";
      imageContainerClass = "w-1/5 mr-3 flex-shrink-0";
      imageClass = "rounded-md aspect-square object-cover";
      imageWidth = 64;
      imageHeight = 64;
      titleClass = "text-sm font-medium hover:text-primary leading-tight mb-0.5 text-foreground";
      authorTextClass = "text-[11px] text-muted-foreground mt-0.5";
      showSummary = false;
      showDate = false;
      showReadingTime = false;
      showCategories = false;
      break;
    case "Opinion Style":
      containerClass = "post border-l-4 border-primary pl-4";
      titleClass = "text-xl font-semibold mb-2 text-foreground";
      showAuthor = true;
      showDate = true;
      break;
    case "Grid Item":
      containerClass = "post grid-item hover:scale-[1.02] transition-transform duration-200";
      imageClass = "rounded-lg w-full aspect-video object-cover";
      imageHeight = 200;
      imageWidth = 400;
      titleClass = "text-lg font-semibold mt-2 mb-1 text-foreground";
      break;
  }

  // Display area specific overrides
  switch (display_area) {
    case "Homepage Hero":
      containerClass += " col-span-full";
      break;
    case "Homepage Featured":
      containerClass += " bg-card/50";
      break;
    case "Homepage Grid":
      containerClass += " grid-item";
      break;
    case "Homepage List":
      containerClass += " list-item";
      break;
    case "Sidebar Featured":
      containerClass += " sidebar-featured";
      break;
    case "Sidebar Recent":
      containerClass += " sidebar-recent";
      break;
    case "Category Hero":
      containerClass += " category-hero";
      break;
    case "Category Featured":
      containerClass += " category-featured";
      break;
    case "Archive Hero":
      containerClass += " archive-hero";
      break;
    case "Archive Featured":
      containerClass += " archive-featured";
      break;
  }

  // Column priority specific overrides
  switch (column_priority) {
    case "Full-Width":
      containerClass += " col-span-full";
      break;
    case "Highlight Left":
      containerClass += " border-l-4 border-primary";
      break;
    case "Highlight Right":
      containerClass += " border-r-4 border-primary";
      break;
    case "Sticky":
      containerClass += " sticky top-4";
      break;
    case "Prominent":
      containerClass += " bg-card/80 shadow-lg";
      break;
  }

  // Check if post should be hidden based on featured_until date
  const shouldHide = featured_until && new Date(featured_until) < new Date();
  if (shouldHide || hide_from_lists) {
    return null; // Don't render the post
  }

  const TextContent = () => (
    <div className="flex flex-col flex-grow"> {/* TextContent itself is a flex container that grows */}
      <div className="flex-grow"> {/* This inner div groups title and summary, allowing them to push meta down */}
        <h3 className={titleClass}>
          <Link href={`/${blog_folder}/${post.slug}`} className="block">
            {post.frontmatter.title}
          </Link>
        </h3>
        {showSummary && (
          <p className={`mt-2.5 text-sm text-foreground ${displayMode === 'hero_center_headline' ? 'px-4 md:px-8 lg:px-12' : ''} line-clamp-3`}>
            {post.content?.slice(0, summaryLength)}...
          </p>
        )}
      </div>

      {/* Meta information - consistently rendered at the bottom of TextContent */}
      {(showDate || showReadingTime || (showAuthor && displayMode !== 'hero_right_opinion')) && (
        <ul className={`${metaUlClass} mt-auto`}> {/* mt-auto pushes this to the bottom of the flex parent */}
          {showDate && (
            <li className="inline-flex items-center">
              <FaRegCalendar className="mr-1.5" />
              {dateFormat(post.frontmatter.date)}
            </li>
          )}
          {showReadingTime && (
            <li className="inline-flex items-center">
              <FaClock className="mr-1.5" />
              {rTime}
            </li>
          )}
          {showAuthor && displayMode !== 'hero_right_opinion' && (
            <li>
              <Link
                className="inline-flex items-center hover:text-primary"
                href="/about"
              >
                <FaUserAlt className="mr-1.5" />
                {author}
              </Link>
            </li>
          )}
        </ul>
      )}

      {/* {showReadMoreButton && (
        <Link
          className="btn btn-outline-primary mt-4 text-sm py-1.5 px-3"
          href={`/${blog_folder}/${post.slug}`}
        >
          Read More
        </Link>
      )} */}
    </div>
  );

  if (displayMode === "hero_right_opinion") {
    return (
      <div className={containerClass}>
        {renderImage && (
          <div className={imageContainerClass}>
            <ImageFallback
              className={imageClass}
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              width={imageWidth}
              height={imageHeight}
            />
          </div>
        )}
        <div className={`${renderImage ? "w-4/5" : "w-full"} flex flex-col`}>
          <h3 className={`${titleClass} flex-grow`}> {/* Title grows to push author info down */}
            <Link href={`/${blog_folder}/${post.slug}`} className="block">
              {post.frontmatter.title}
            </Link>
          </h3>
          <p className={authorTextClass}> {/* Author info (meta for this mode) */}
            By {author}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {renderImage && (
        <div className={imageContainerClass}>
          <ImageFallback
            className={imageClass}
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            width={imageWidth}
            height={imageHeight}
          />
          {showCategories && (
            <ul className="absolute top-2 left-2 flex flex-wrap items-center">
              {post.frontmatter.categories.map((tag, index) => (
                <li
                  className="mx-1 my-0.5 inline-flex h-5 rounded-full bg-primary px-2.5 text-xs text-primary-foreground items-center justify-center"
                  key={"tag-" + index}
                >
                  <Link
                    className="capitalize"
                    href={`/categories/${tag.replace(" ", "-")}`}
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <TextContent />
    </div>
  );
};

export default Post;
