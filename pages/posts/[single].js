import config from "@config/config.json";
import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import parseMDX from "@lib/utils/mdxParser";
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
      display_settings: frontmatter.display_settings
        ? {
            ...frontmatter.display_settings,
            featured_until: serializableFeaturedUntil,
          }
        : frontmatter.display_settings,
    };
    
    return { ...individualPost, frontmatter: newFrontmatter };
  };

  // Helper function to serialize dates in a list of posts
  const serializePostListDates = (postList) => postList.map(p => serializePostDates(p));

  const serializablePost = serializePostDates(post);
  const serializableRelatedPosts = serializePostListDates(relatedPosts);
  const serializablePosts = serializePostListDates(posts);

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
