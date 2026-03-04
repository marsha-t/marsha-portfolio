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
  featured: boolean;
}

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
 *
 * @returns Array of metadata
 */
export function getAllContentMeta(type: ContentType) {
  const directory = getContentDirectory(type);
  const fileNames = fs.readdirSync(directory);

  return fileNames.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data } = matter(fileContents);

    return {
      slug,
      ...(data as ContentMeta), // spread frontmatter properties
    };
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
    ...(data as ContentMeta),
    contentHtml,
  };
}
