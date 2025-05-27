import parseMDX from "@lib/utils/mdxParser";
import matter from "gray-matter";
import path from "path";

// Helper function to safely read files
const safeReadFile = (filePath) => {
  try {
    // Only import fs in server context
    if (typeof window === 'undefined') {
      const fs = require('fs');
      return fs.readFileSync(filePath, "utf-8");
    }
    return null;
  } catch (error) {
    return null;
  }
};

// get list page data, ex: _index.md
export const getListPage = async (filePath) => {
  const pageData = safeReadFile(filePath);
  
  // If file doesn't exist or we're on client side, return default data
  if (!pageData) {
    return {
      frontmatter: {
        title: "Latest Posts",
        meta_title: "Latest Posts",
        description: "Browse all posts",
        image: "/images/default-og.png"
      },
      content: ""
    };
  }

  const pageDataParsed = matter(pageData);
  return {
    frontmatter: pageDataParsed.data,
    content: pageDataParsed.content,
  };
};

// get all single pages
export const getSinglePage = (folder) => {
  try {
    // Only import fs in server context
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const filesPath = path.join(process.cwd(), folder);
      const files = fs.readdirSync(filesPath);
      const sanitizeFiles = files.filter((file) => file.endsWith(".md"));
      const filterSingleFiles = sanitizeFiles.filter((file) => file.match(/^(?!_)/));
      const singlePages = filterSingleFiles.map((filename) => {
        const slug = filename.replace(".md", "");
        const pageData = fs.readFileSync(path.join(filesPath, filename), "utf-8");
        const pageDataParsed = matter(pageData);
        
        // Convert frontmatter to JSON serializable format
        const frontmatter = { ...pageDataParsed.data };
        
        // Convert date to ISO string if it exists
        if (frontmatter.date) {
          frontmatter.date = new Date(frontmatter.date).toISOString();
        }
        
        // Convert any other date fields that might exist
        Object.keys(frontmatter).forEach(key => {
          if (frontmatter[key] instanceof Date) {
            frontmatter[key] = frontmatter[key].toISOString();
          }
        });

        return {
          frontmatter,
          slug,
          content: pageDataParsed.content,
        };
      });

      // Filter out draft posts and future posts
      const publishedPages = singlePages.filter(page => {
        const isDraft = page.frontmatter.draft === true;
        const isFuturePost = page.frontmatter.date && new Date(page.frontmatter.date) > new Date();
        return !isDraft && !isFuturePost;
      });

      return publishedPages;
    }
    return [];
  } catch (error) {
    console.error("Error reading single pages:", error);
    return [];
  }
};

// get regular page data
export const getRegularPage = async (slug) => {
  try {
    // Only import fs in server context
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const filesPath = path.join(process.cwd(), "content");
      const files = fs.readdirSync(filesPath);
      const sanitizeFiles = files.filter((file) => file.endsWith(".md"));
      const filterSingleFiles = sanitizeFiles.filter((file) => file.match(/^(?!_)/));
      const singlePages = filterSingleFiles.map((filename) => {
        const slug = filename.replace(".md", "");
        const pageData = fs.readFileSync(path.join(filesPath, filename), "utf-8");
        const pageDataParsed = matter(pageData);
        
        // Convert frontmatter to JSON serializable format
        const frontmatter = { ...pageDataParsed.data };
        
        // Convert date to ISO string if it exists
        if (frontmatter.date) {
          frontmatter.date = new Date(frontmatter.date).toISOString();
        }
        
        // Convert any other date fields that might exist
        Object.keys(frontmatter).forEach(key => {
          if (frontmatter[key] instanceof Date) {
            frontmatter[key] = frontmatter[key].toISOString();
          }
        });

        return {
          frontmatter,
          slug,
          content: pageDataParsed.content,
        };
      });
      const regularPage = singlePages.find((page) => page.slug === slug);
      return regularPage;
    }
    return null;
  } catch (error) {
    console.error("Error reading regular page:", error);
    return null;
  }
};
