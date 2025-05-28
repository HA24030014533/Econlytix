import ImageFallback from "@layouts/components/ImageFallback";
import Link from "next/link";
import { FaRegClock, FaRegCommentDots } from "react-icons/fa";
import { plainify, slugify } from "@lib/utils/textConverter"; // Removed humanize
import dateFormat from "@lib/utils/dateFormat"; // Added dateFormat

const FeaturedArticleItem = ({ article }) => {
  const { frontmatter, summary, content } = article;
  const { title, image, author, date, categories, readingTime } = frontmatter;

  // Assuming 'readingTime' is available in frontmatter, otherwise calculate
  const readTime = readingTime || Math.ceil(plainify(content).split(" ").length / 200) + " min read";


  return (
    <div className="featured-article-item overflow-hidden rounded-lg bg-white shadow-lg">
      {image && (
        <Link href={`/posts/${article.slug}`} className="block h-[360px]"> {/* Increased fixed height to 360px */}
          <ImageFallback
            src={image}
            width={640} // Approx 16:9 for 360px height
            height={360} // Fixed height 360px
            alt={title}
            className="w-full h-full object-cover" // Image fills this container
          />
        </Link>
      )}
      <div className="p-6">
        <h2 className="mb-3 text-3xl font-bold leading-tight text-gray-900">
          <Link href={`/posts/${article.slug}`} className="hover:text-primary">
            {title}
          </Link>
        </h2>
        {summary && (
          <p className="mb-4 text-gray-700">
            {plainify(summary.slice(0, 150))}...
          </p>
        )}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <FaRegCommentDots className="mr-1.5" />
            {/* Placeholder for comments count */}0 Comments
          </span>
          {date && (
            <span className="flex items-center">
              <FaRegClock className="mr-1.5" />
              {dateFormat(date)}
            </span>
          )}
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticleItem;