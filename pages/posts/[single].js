import config from "@config/config.json";
import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import parseMDX from "@lib/utils/mdxParser";
import readingTime from "@lib/utils/readingTime";
const { blog_folder } = config.settings;

// post single layout
const Article = ({
  post,
  mdxContent,
  slug,
  allCategories,
  relatedPosts,
  posts,
}) => {
  const { frontmatter, content } = post;

  return (
    <PostSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
      slug={slug}
      allCategories={allCategories}
      relatedPosts={relatedPosts}
      posts={posts}
    />
  );
};

// get post single slug
export const getStaticPaths = () => {
  const allSlug = getSinglePage(`content/${blog_folder}`);
  const paths = allSlug
    .filter(item => item.slug !== '404')
    .map((item) => ({
      params: {
        single: item.slug,
      },
    }));

  return {
    paths,
    fallback: false,
  };
};

// get post single content
export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const posts = getSinglePage(`content/${blog_folder}`);
  const post = posts.find((p) => p.slug == single);
  const mdxContent = await parseMDX(post.content);
  // related posts
  const relatedPosts = posts.filter((p) =>
    post.frontmatter.categories.some((cate) =>
      p.frontmatter.categories.includes(cate)
    )
  );

  const processedRelatedPosts = relatedPosts.map(p => {
    const calculatedReadingTime = readingTime(p.content);
    const summaryText = p.content ? p.content.slice(0, 200) + '...' : '';
    return {
      slug: p.slug,
      frontmatter: p.frontmatter,
      calculatedReadingTime,
      summaryText,
    };
  });

  //all categories
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

  // Helper function to serialize dates in a post object
  const serializePostDates = (individualPost) => {
    if (!individualPost || !individualPost.frontmatter) {
      return individualPost;
    }
    const frontmatter = individualPost.frontmatter;

    const dateValue = frontmatter.date;
    const serializableDate = dateValue instanceof Date
        ? dateValue.toISOString()
        : (dateValue === undefined ? null : dateValue);

    const featuredUntilValue = frontmatter.display_settings?.featured_until;
    const serializableFeaturedUntil = featuredUntilValue instanceof Date
                                      ? featuredUntilValue.toISOString()
                                      : (featuredUntilValue === undefined ? null : featuredUntilValue);

    const newFrontmatter = {
      ...frontmatter,
      date: serializableDate,
      display_settings: (frontmatter.display_settings === undefined || frontmatter.display_settings === null)
        ? null // Ensure display_settings is null if it's undefined or already null
        : { // If display_settings is an object, proceed to serialize its contents
            ...frontmatter.display_settings,
            featured_until: serializableFeaturedUntil, // serializableFeaturedUntil correctly handles undefined featured_until
          },
    };
    
    return { ...individualPost, frontmatter: newFrontmatter };
  };

  // Helper function to serialize dates in a list of posts
  const serializePostListDates = (postList) => postList.map(p => serializePostDates(p));

  const serializablePost = serializePostDates(post);
  const serializableRelatedPosts = serializePostListDates(processedRelatedPosts);
  // Optimize 'posts' prop by removing 'content' from each item
  // This ensures that only slug, frontmatter, and other metadata are passed, not full content
  const postsForOptimizedProp = posts.map(({ content, ...restOfPost }) => restOfPost);
  const serializablePosts = serializePostListDates(postsForOptimizedProp);

  return {
    props: {
      post: serializablePost,
      mdxContent: mdxContent,
      slug: single,
      allCategories: categoriesWithPostsCount,
      relatedPosts: serializableRelatedPosts,
      posts: serializablePosts,
    },
  };
};

export default Article;
