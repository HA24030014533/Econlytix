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
        const frontmatter = JSON.parse(JSON.stringify(pageDataParsed.data, (key, value) => {
          // Check if the value is a string that looks like a date, then parse and convert
          // This handles dates that gray-matter might have already parsed or left as strings
          if (typeof value === 'string') {
            const date = new Date(value);
            // Check if it's a valid date and it's not just a number string
            if (!isNaN(date.getTime()) && isNaN(Number(value))) {
              // Further check to avoid converting simple strings like "2024" into full date objects
              // This regex checks for a common date-like pattern. Adjust if your dates are very different.
              if (/^\d{4}-\d{2}-\d{2}/.test(value) || /\d{4}\/\d{2}\/\d{2}/.test(value) || Date.parse(value)) {
                 // Check if it's already an ISO string, if so, keep it
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                  return value;
                }
                return date.toISOString();
              }
            }
          }
          // If it's already a Date object (e.g., if gray-matter parsed it)
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }));
        
        // Ensure top-level date is also an ISO string if it exists and wasn't caught by the replacer
        if (frontmatter.date && !(typeof frontmatter.date === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(frontmatter.date))) {
            if (frontmatter.date instanceof Date) {
                 frontmatter.date = frontmatter.date.toISOString();
            } else if (typeof frontmatter.date === 'string') {
                const parsedDate = new Date(frontmatter.date);
                if (!isNaN(parsedDate.getTime())) {
                    frontmatter.date = parsedDate.toISOString();
                }
            }
        }


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
      const singlePages = await Promise.all(filterSingleFiles.map(async (filename) => {
        const slug = filename.replace(".md", "");
        const pageData = fs.readFileSync(path.join(filesPath, filename), "utf-8");
        const pageDataParsed = matter(pageData);
        
        // Convert frontmatter to JSON serializable format
        const frontmatter = JSON.parse(JSON.stringify(pageDataParsed.data, (key, value) => {
          // Check if the value is a string that looks like a date, then parse and convert
          if (typeof value === 'string') {
            const date = new Date(value);
            if (!isNaN(date.getTime()) && isNaN(Number(value))) {
              if (/^\d{4}-\d{2}-\d{2}/.test(value) || /\d{4}\/\d{2}\/\d{2}/.test(value) || Date.parse(value)) {
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                  return value;
                }
                return date.toISOString();
              }
            }
          }
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }));

        // Ensure top-level date is also an ISO string
        if (frontmatter.date && !(typeof frontmatter.date === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(frontmatter.date))) {
            if (frontmatter.date instanceof Date) {
                 frontmatter.date = frontmatter.date.toISOString();
            } else if (typeof frontmatter.date === 'string') {
                const parsedDate = new Date(frontmatter.date);
                if (!isNaN(parsedDate.getTime())) {
                    frontmatter.date = parsedDate.toISOString();
                }
            }
        }

        // Process content through MDX parser
        const mdxContent = await parseMDX(pageDataParsed.content);

        return {
          frontmatter,
          slug,
          content: pageDataParsed.content,
          mdxContent
        };
      }));
      const regularPage = singlePages.find((page) => page.slug === slug);
      return regularPage;
    }
    return null;
  } catch (error) {
    console.error("Error reading regular page:", error);
    return null;
  }
};
