import fs from "fs"; // file system module
import path from "path"; // construct file paths safely
import matter from "gray-matter"; // extracts frontmatter metadata and markdown body
import { remark } from "remark"; // together with html: converts markdown to HTML
import html from "remark-html";

export type ContentType = "writing" | "projects";

// Metadata shared by all content types
export interface ContentMeta {
  title: string;
  summary: string;
  date: string;
  year: number;
  featured: boolean;
  image: string;
  tech: string[];
  github?: string;
}

// Metadata + slug
type ContentItem = ContentMeta & { slug: string };

/**
 * Return directory path for given content type
 * @param Content type
 * @returns directory path
 */
function getContentDirectory(type: ContentType) {
  return path.join(process.cwd(), `content/${type}`);
}

/**
 * Get metadata for all content entries
 * Reads all markdown files in given directory
 * Extract frontmatter with matter
 * Sort newest first
 * @returns Array of metadata + slug
 */
export function getAllContentMeta(type: ContentType): ContentItem[] {
  const directory = getContentDirectory(type);
  const fileNames = fs.readdirSync(directory);

  const allContent = fileNames.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    
    const { data } = matter(fileContents);
    return {
      slug,
      ...validateMeta(data), // spread frontmatter properties
    };
  });

  return allContent.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  });
}

/**
 * Get article by its slug
 * Reads markdown file and converts to HTML
 * @param slug (filename without .md extension)
 * @returns
 */
export async function getContentBySlug(type: ContentType, slug: string) {
  const directory = getContentDirectory(type);
  const fullPath = path.join(directory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  // Pipeline: Markdown to HTML AST to HTML string
  // - remark() starts markdown processor instance
  // - .use(html) adds a plugin. .use() attaches transformation plugin
  // - .process() to run markdown content through processor; is async
  const processedContent = await remark().use(html).process(content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    ...validateMeta(data),
    contentHtml,
  };
}

/**
 *  Gets metadata for featured content
 * @param Content type 
 * @returns Metadata 
 */
export function getFeaturedContent(type: ContentType) {
  return getAllContentMeta(type).filter((item) => item.featured);
}

function validateMeta(data: any): ContentMeta {
  const requiredFields = ["title", "summary", "date", "year", "featured", "image", "tech"];
  for (const field of requiredFields) {
    if (data[field] === undefined) {
      throw new Error("Missing required frontmatter fields: " + `${field}`);
    }
  }
  
  if (!Array.isArray(data.tech)) {
    throw new Error("Frontmatter 'tech' must be an array");
  }
  
  if (data.github && typeof data.github !== "string") {
    throw new Error("Frontmatter 'github' must be a string");
  }

  return {
    title: data.title,
    summary: data.summary,
    date: data.date,
    featured: data.featured,
    year: data.year,
    image: data.image,
    tech: data.tech, 
    github: data.github,
  };
}