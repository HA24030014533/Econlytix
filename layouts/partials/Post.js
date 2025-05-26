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
  const { display_area, column_priority } = post.frontmatter; // Destructure new fields

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

  // Display mode specific overrides
  if (displayMode === "hero_left_list") {
    containerClass = "post mb-5 flex flex-col";
    titleClass = "text-lg font-semibold mb-1.5 hover:text-primary text-foreground";
    summaryLength = 80;
    showAuthor = false;
    showCategories = false;
    renderImage = false;
  } else if (displayMode === "hero_center_headline") {
    containerClass = "post mb-0 text-center flex flex-col";
    titleClass = "text-4xl lg:text-5xl font-bold mb-2 hover:text-primary text-foreground"; // Increased font size
    summaryLength = 120;
    showAuthor = false;
    showCategories = false;
    renderImage = false;
    metaUlClass = "flex flex-wrap items-center justify-center space-x-3 text-xs mt-2.5 pt-2.5 border-t border-border text-muted-foreground"; // Centered, below summary, with top border
  } else if (displayMode === "hero_right_opinion") {
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
    renderImage = post.frontmatter.image;
  } else if (displayMode === "featured_large") {
    titleClass = "text-3xl font-bold mb-3 mt-4 line-clamp-2 h-[4.5rem] text-foreground";
    summaryLength = Number(summary_length) + 100;
    imageHeight = 300;
    imageWidth = 530;
    showReadMoreButton = true;
    showCategories = true;
  } else if (displayMode === "compact_stacked") { 
    containerClass = "post flex flex-col";
    imageClass = "rounded w-full h-32 object-cover mb-2";
    imageHeight = 128;
    imageWidth = 228;
    titleClass = "text-lg font-semibold mb-1 mt-0 line-clamp-2 h-[4.5rem] text-foreground";
    showSummary = false;
    showReadMoreButton = false;
    showCategories = false;
  } else if (displayMode === "center_prominent") { 
    titleClass = "text-4xl font-bold mb-4 mt-4 text-foreground";
    summaryLength = Number(summary_length) + 150;
    imageContainerClass = "hidden";
    showCategories = true;
    showReadMoreButton = true;
    renderImage = false;
  }

  // Apply new layout controls from frontmatter
  if (display_area === "Homepage Hero") {
    // Example: Make hero posts span full width and have a special background
    containerClass = "post col-span-full bg-blue-100 p-4"; // Modify as needed
  } else if (display_area === "Homepage Featured") {
    containerClass = "post bg-yellow-100 p-4"; // Modify as needed
  } else if (display_area === "Sidebar") {
    containerClass = "post mb-4 p-2 border"; // Modify as needed
  }

  if (column_priority === "Full-Width") {
    // Example: Ensure it takes full width in a grid
    containerClass += " col-span-full"; // Append to existing classes
  } else if (column_priority === "Highlight Left") {
    containerClass += " border-l-4 border-primary"; // Example: Add a left border
  } else if (column_priority === "Highlight Right") {
    containerClass += " border-r-4 border-primary"; // Example: Add a right border
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
