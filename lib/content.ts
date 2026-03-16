import fs from "fs"; // file system module
import path from "path"; // construct file paths safely
import matter from "gray-matter"; // extracts frontmatter metadata and markdown body
import { remark } from "remark"; // create markdown AST
import remarkGfm from "remark-gfm"; // enable Github Markdown features
import remarkRehype from "remark-rehype"; // convert markdown AST to HTML AST
import rehypeRaw from "rehype-raw"; // allow HTML inside markdown
import rehypeSlug from "rehype-slug"; // heading IDs
import rehypeAutolinkHeadings from "rehype-autolink-headings"; // anchor links
import rehypeHighlight from "rehype-highlight"; // code syntax highlighting
import rehypeStringify from "rehype-stringify"; // convert HTML AST to HTML
import { visit } from "unist-util-visit";

export type ContentType = "writing" | "projects";

// Links
export interface ContentLink {
  label: string;
  url: string;
}

// Metadata shared by all content types
export interface ContentMeta {
  title: string;
  summary: string;
  date: string;
  year: number;
  timeframe?: string;
  featured: boolean;
  image: string;
  tech: string[];
  links?: ContentLink[];
  team?: number;
}



// Metadata + slug
export type ContentItem = ContentMeta & { slug: string };

// Headings in Markdown
export interface Heading {
  text: string;
  id: string;
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
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Remark plugin that extracts section headings from Markdown AST
 * Traverse AST using unist-util-visit and collects all level-2 headings
 * Extracts text content 
 * Generates slugified id (lowercase, removed punctuation and space)
 * Attach as Heading in processing context
 * @returns function which receives markdown AST and processing context
 */
function extractHeadings() {
  return (tree: any, file: any) => {
    const headings: Heading[] = [];

    visit(tree, "heading", (node: any) => {
      if (node.depth === 2) {
        const text = node.children
          .filter((child: any) => child.type === "text")
          .map((child: any) => child.value)
          .join("");

        const id = text
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "-");

        headings.push({ text, id });
      }
    });

    file.data.headings = headings;
  };
}

/*
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
  // - .use(html) adds a plugin.
  // - .process() to run markdown content through processor; is async
  const processedContent = await remark()
    .use(remarkGfm) // tables, strikethrough, task lists
    .use(extractHeadings)
    .use(remarkRehype, { allowDangerousHtml: true }) // markdown → html AST
    .use(rehypeRaw) // allow HTML inside markdown
    .use(rehypeSlug) // add ids to headings
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
    }) // clickable heading anchors
    .use(rehypeHighlight) // code syntax highlighting
    .use(rehypeStringify) // AST → HTML string
    .process(content);

  const contentHtml = processedContent.toString();
  const headings = (processedContent.data.headings || []) as Heading[];

  return {
    slug,
    ...validateMeta(data),
    contentHtml,
    headings,
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
  const requiredFields = [
    "title",
    "summary",
    "date",
    "year",
    "featured",
    "image",
    "tech",
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined) {
      throw new Error("Missing required frontmatter fields: " + `${field}`);
    }
  }

  if (!Array.isArray(data.tech)) {
    throw new Error("Frontmatter 'tech' must be an array");
  }

  if (data.timeframe && typeof data.timeframe !== "string") {
    throw new Error("Frontmatter 'timeframe' must be a string");
  }

  if (data.team && typeof data.team !== "number") {
    throw new Error("Frontmatter 'team' must be a number");
  }

   if (data.links) {
    if (!Array.isArray(data.links)) {
      throw new Error("Frontmatter 'links' must be an array");
    }

    for (const link of data.links) {
      if (typeof link.label !== "string" || typeof link.url !== "string") {
        throw new Error(
          "Each link must contain { label: string, url: string }"
        );
      }
    }
  }

  return {
    title: data.title,
    summary: data.summary,
    date: data.date,
    year: data.year,
    timeframe: data.timeframe,
    featured: data.featured,
    image: data.image,
    tech: data.tech,
    links: data.links,
    team: data.team,
  };
}
