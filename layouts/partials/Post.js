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
  // Use pre-calculated reading time if available, otherwise calculate it
  const rTime = post.calculatedReadingTime !== undefined ? post.calculatedReadingTime : readingTime(post.content);
  const { display_settings } = post.frontmatter; // Get the new display settings object
  const {
    display_area = "Default",
    layout_style = "Standard",
    column_priority = "Standard",
    display_order,
    featured_until,
    hide_from_lists
  } = display_settings || {}; // Destructure with defaults

  // Map displayMode to layout_style if provided
  let effectiveLayoutStyle = layout_style;
  if (displayMode) {
    switch (displayMode) {
      case "grid_item":
        effectiveLayoutStyle = "Grid Item";
        break;
      case "featured_large":
        effectiveLayoutStyle = "Featured Large";
        break;
      case "hero_right_opinion":
        effectiveLayoutStyle = "Hero Right";
        break;
      case "hero_center_headline":
        effectiveLayoutStyle = "Hero Center";
        break;
      default:
        effectiveLayoutStyle = layout_style;
        break;
    }
  }

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
  let showAuthor = false;
  let showDate = true;
  let showReadingTime = true;
  let summaryLength = Number(summary_length);
  let renderImage = post.frontmatter.image;
  let authorTextClass = "text-xs text-muted-foreground mt-1";
  let metaUlClass = "flex flex-wrap items-center space-x-3 text-xs mt-1.5 text-muted-foreground";

  // Layout style specific overrides
  switch (effectiveLayoutStyle) {
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
    case "Extra Compact":
      containerClass = "post flex flex-col";
      imageContainerClass = "relative w-full h-16 mb-2"; // Parent div defines size with relative positioning
      imageClass = "rounded"; // Class for the image itself
      imageWidth = 114; // Used for 'sizes' prop
      imageHeight = 64;  // Defined, but not passed with layout="fill"
      titleClass = "text-md font-semibold mb-1 mt-0 line-clamp-2 h-[3.75rem] text-foreground";
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
      titleClass = "text-3xl font-bold mb-3 mt-8 line-clamp-2 h-[4.5rem] text-foreground";
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
      renderImage = false;  // This ensures the image is not rendered in the Post component
      metaUlClass = "flex flex-wrap items-center justify-center space-x-3 text-xs mt-2.5 pt-2.5 border-t border-border text-muted-foreground";
      break;
    case "Hero Right":
      containerClass = "flex mb-3 items-start";
      imageContainerClass = "w-16 mr-3 flex-shrink-0";
      imageClass = "rounded-md aspect-square object-cover";
      imageWidth = 64;
      imageHeight = 64;
      titleClass = "text-sm font-medium hover:text-primary leading-tight mb-0.5 text-foreground line-clamp-2";
      authorTextClass = "text-[11px] text-muted-foreground mt-0.5";
      showSummary = false;
      showDate = false;
      showReadingTime = false;
      showCategories = false;
      break;
    case "Opinion Style":
      containerClass = "post border-l-4 border-primary pl-4";
      titleClass = "text-xl font-semibold mb-2 text-foreground";
      showAuthor = false;
      showDate = true;
      break;
    case "Grid Item":
      containerClass = "post grid-item hover:scale-[1.02] transition-transform duration-200";
      imageContainerClass = "image-container relative h-48"; // Added relative positioning and height
      imageClass = "object-cover";
      imageHeight = undefined;
      imageWidth = undefined;
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

  // Special handling for hero center headline to prevent double image rendering
  if (displayMode === "hero_center_headline") {
    renderImage = false;
  }

  const TextContent = () => (
    <div className="flex flex-col flex-grow p-4"> {/* Added p-4 for padding. TextContent itself is a flex container that grows */}
      <div className="flex-grow mb-3"> {/* Added mb-3. This inner div groups title and summary, allowing them to push meta down */}
        <h3 className={titleClass}>
          <Link href={`/${blog_folder}/${post.slug}`} className="block">
            {post.frontmatter.title}
          </Link>
        </h3>
        {showSummary && (
          <p className={`mt-1.5 text-sm text-foreground ${displayMode === 'hero_center_headline' ? 'px-4 md:px-8 lg:px-12' : ''} line-clamp-3`}> {/* Changed mt-2.5 to mt-1.5 */}
            {post.summaryText !== undefined ? post.summaryText : (post.content?.slice(0, summaryLength) + '...')}
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
      <div className="flex mb-6 items-start">
        {renderImage && (
          <div className="w-16 h-16 mr-4 flex-shrink-0">
            <ImageFallback
              className="rounded-none w-16 h-16 object-cover aspect-square"
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              width={64}
              height={64}
              quality={90}
              sizes="64px"
            />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h3 className="text-base font-light leading-tight mb-1 text-foreground">
            <Link href={`/${blog_folder}/${post.slug}`} className="block">
              {post.frontmatter.title}
            </Link>
          </h3>
        </div>
      </div>
    );
  }

  // Define imageRenderProps before the main return statement, matching user example structure
  let imageRenderProps = {
    src: post.frontmatter.image,
    alt: post.frontmatter.title,
    quality: 90, // Default quality
    style: { objectFit: 'cover', width: 'auto', height: 'auto' }, // Ensure aspect ratio is maintained
    // fill is undefined by default, meaning width/height props will be used by Next/Image
  };

  if (post.slug === "post-12") {
    imageRenderProps = {
      ...imageRenderProps, // Start with defaults
      width: 700,
      height: 180,
      // objectFit: "cover", // REMOVED direct prop
      fill: undefined,    // Explicitly ensure fill is not true
      style: { objectFit: 'cover', width: 'auto', height: 'auto' }, // Maintain aspect ratio
    };
  } else if (effectiveLayoutStyle === "Extra Compact" || effectiveLayoutStyle === "Grid Item") {
    imageRenderProps = {
      ...imageRenderProps, // Start with defaults
      fill: true,         // Enable fill mode for Next/Image
      // objectFit: "cover", // REMOVED direct prop
      width: undefined,   // Not used by Next/Image when fill is true
      height: undefined,  // Not used by Next/Image when fill is true
      style: { objectFit: 'cover' }, // For fill, only objectFit is needed in style
    };
  } else { // Default case for other posts (not "post-12", "post-8" and not "Extra Compact")
    imageRenderProps = {
      ...imageRenderProps, // Start with defaults
      width: imageWidth,  // Use imageWidth from the layout_style switch statement
      height: imageHeight, // Use imageHeight from the layout_style switch statement
      fill: undefined,    // Ensure fill is not true
      style: { objectFit: 'cover', width: '100%', height: 'auto' },
    };
  }

  return (
    <div className={containerClass}>
      {renderImage && (
        <div className={imageContainerClass}>
          <ImageFallback
            className={imageClass}
            {...imageRenderProps}
            sizes="(max-width: 768px) 100vw, 400px"
            priority={false}
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
          {post.frontmatter.image_attribution && (
            <div className="image-attribution text-xs mt-1 text-muted-foreground">
              Image:{" "}
              <a
                href={post.frontmatter.image_attribution.source_link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {post.frontmatter.image_attribution.title}
              </a>{" "}
              by {post.frontmatter.image_attribution.creator} /{" "}
              <a
                href={post.frontmatter.image_attribution.rights_link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {post.frontmatter.image_attribution.rights_text}
              </a>
            </div>
          )}
        </div>
      )}
      <TextContent />
    </div>
  );
};

export default Post;
