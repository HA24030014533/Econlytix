import ImageFallback from "@layouts/components/ImageFallback";
import Link from "next/link";
import { slugify } from "@lib/utils/textConverter";

const OpinionArticleItem = ({ article }) => {
  const { frontmatter } = article;
  const { title, image, categories } = frontmatter; // Assuming categories might be used for the "OPINION" tag logic

  // Determine if "OPINION" tag should be shown.
  // This is a placeholder logic. You might have a specific 'isOpinion' flag or check categories.
  const isOpinion = categories && categories.map(c => c.toLowerCase()).includes("opinion");

  return (
    <div className="opinion-article-item flex items-start space-x-4 rounded-md border border-gray-200 p-4 transition-shadow duration-200 hover:shadow-md">
      {image && (
        <Link href={`/posts/${article.slug}`} className="block flex-shrink-0">
          <ImageFallback
            src={image}
            width={120} // Thumbnail size, adjust as needed
            height={90}  // Adjust for aspect ratio
            alt={title}
            className="rounded object-cover"
          />
        </Link>
      )}
      <div className="flex-grow">
        {isOpinion && (
          <span className="opinion-tag mb-1.5 inline-block rounded bg-accent px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Opinion
          </span>
        )}
        <h3 className="text-lg font-semibold leading-tight text-gray-800">
          <Link href={`/posts/${article.slug}`} className="hover:text-primary">
            {title}
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default OpinionArticleItem;