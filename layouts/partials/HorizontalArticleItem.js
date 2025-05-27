import ImageFallback from "@layouts/components/ImageFallback";
import Link from "next/link";
import { slugify } from "@lib/utils/textConverter";

const HorizontalArticleItem = ({ article }) => {
  const { frontmatter } = article;
  const { title, image } = frontmatter;

  return (
    <div className="horizontal-article-item overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      {image && (
        <Link href={`/posts/${article.slug}`} className="block">
          <ImageFallback
            src={image}
            width={400} // Adjust as needed
            height={225} // Adjust for 16:9 or desired aspect ratio
            alt={title}
            className="w-full object-cover"
          />
        </Link>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold leading-tight text-gray-800">
          <Link href={`/posts/${article.slug}`} className="hover:text-primary">
            {title}
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default HorizontalArticleItem;