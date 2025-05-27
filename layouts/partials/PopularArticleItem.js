import ImageFallback from "@layouts/components/ImageFallback";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { humanize, plainify, slugify } from "@lib/utils/textConverter";

const PopularArticleItem = ({ article }) => {
  const { frontmatter, content } = article;
  const { title, image, date, readingTime } = frontmatter; // Assuming 'categories' might not be needed here directly

  // Assuming 'readingTime' is available in frontmatter, otherwise calculate
  const readTime = readingTime || Math.ceil(plainify(content).split(" ").length / 200) + " min read";

  return (
    <div className="popular-article-item flex items-start space-x-4 rounded-md border border-gray-200 p-4 transition-shadow duration-200 hover:shadow-md">
      <div className="flex-grow">
        <h3 className="mb-1.5 text-lg font-semibold leading-tight text-gray-800">
          <Link href={`/posts/${article.slug}`} className="hover:text-primary">
            {title}
          </Link>
        </h3>
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          {date && (
            <span className="flex items-center">
              <FaRegClock className="mr-1" />
              {humanize(date)}
            </span>
          )}
          <span>{readTime}</span>
        </div>
      </div>
      {image && (
        <Link href={`/posts/${article.slug}`} className="block flex-shrink-0">
          <ImageFallback
            src={image}
            width={80} // Small thumbnail
            height={80}
            alt={title}
            className="rounded object-cover"
          />
        </Link>
      )}
    </div>
  );
};

export default PopularArticleItem;