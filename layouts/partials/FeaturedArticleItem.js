import ImageFallback from "@layouts/components/ImageFallback";
import Link from "next/link";
import { FaRegClock, FaRegCommentDots } from "react-icons/fa";
import { humanize, plainify, slugify } from "@lib/utils/textConverter";

const FeaturedArticleItem = ({ article }) => {
  const { frontmatter, summary, content } = article;
  const { title, image, author, date, categories, readingTime } = frontmatter;

  // Assuming 'readingTime' is available in frontmatter, otherwise calculate
  const readTime = readingTime || Math.ceil(plainify(content).split(" ").length / 200) + " min read";


  return (
    <div className="featured-article-item overflow-hidden rounded-lg bg-white shadow-lg">
      {image && (
        <Link href={`/posts/${article.slug}`} className="block">
          <ImageFallback
            src={image}
            width={800} // Adjust as needed
            height={450} // Adjust as needed
            alt={title}
            className="w-full object-cover"
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
        <div className="mb-4 flex items-center text-sm text-gray-600">
          {author && (
            <span>
              By{" "}
              <Link
                href={`/authors/${slugify(author)}`}
                className="font-medium text-primary hover:underline"
              >
                {author}
              </Link>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <FaRegCommentDots className="mr-1.5" />
            {/* Placeholder for comments count */}0 Comments
          </span>
          {date && (
            <span className="flex items-center">
              <FaRegClock className="mr-1.5" />
              {humanize(date)}
            </span>
          )}
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticleItem;