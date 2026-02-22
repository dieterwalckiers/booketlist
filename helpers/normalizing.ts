import {
  BlogPost,
  BlogPostSummary,
  Book,
  BookCategory,
  Home,
  IAuthor,
  LanguageRight,
  Page,
  PageElement,
  PortableTextBlock,
  Publisher,
} from 'shared/contract'

import { getLangName } from './lang'

export function normalizeBook(book: any, skipNormAuthor = false): Book {
  const normalizedBook = {
    ...book,
    bookCategory: normalizeBookCategory(book.bookCategory),
    slug: book.slug?.current || null,
    authors: skipNormAuthor
      ? book.authors || []
      : (book.authors || [])
          .filter((a) => !!a)
          .map((a) => normalizeAuthor(a, true)),
    illustrators: skipNormAuthor
      ? book.illustrators || []
      : (book.illustrators || [])
          .filter((a) => !!a)
          .map((a) => normalizeAuthor(a, true)),
    publisher:
      (skipNormAuthor || !book.publisher
        ? book.publisher
        : normalizePublisher(book.publisher)) || null,
    soldLanguageRights: skipNormAuthor
      ? book.soldLanguageRights || []
      : (book.soldLanguageRights || [])
          .filter(Boolean)
          .map(({ languageCode }) => ({
            code: languageCode,
            name: getLangName(languageCode),
          })),
    additionalMedia: book.additionalImages || [],
    age: parseInt(book.age),
  } as Book
  normalizedBook.searchableDataSerialized = `${normalizedBook.title}${
    normalizedBook.originalTitle || ''
  }${normalizedBook.authors
    .map((a) => a.name)
    .join(', ')}${normalizedBook.illustrators.map((i) => i.name).join(', ')}${
    normalizedBook.publisher?.name || ''
  }${normalizedBook.bookCategory?.name || ''}`
  return normalizedBook
}

export function normalizeLanguageRight(languageRight: any): LanguageRight {
  return {
    code: languageRight.languageCode,
    name: getLangName(languageRight.languageCode),
  }
}

function normalizePageElement(pageElement: any): PageElement {
  return {
    ...pageElement,
    type: pageElement._type,
  }
}

export function normalizePage(page: any): Page {
  return {
    ...page,
    slug: page.slug?.current || null,
    elements: page.elements.map((el) => normalizePageElement(el)),
  }
}

export function normalizeHome(home: any): Home {
  return {
    ...home,
    elements: home.elements.map((el) => normalizePageElement(el)),
  }
}

export function normalizePublisher(publisher: any): Publisher {
  return {
    ...publisher,
    slug: publisher.slug?.current || null,
    elements: (publisher.elements || []).map((el) => normalizePageElement(el)),
  }
}

export function normalizeAuthor<A extends IAuthor>(
  author: any,
  skipNormBook = false
): A {
  return {
    ...author,
    ...(skipNormBook
      ? {}
      : {
          books: (author.books || []).map((book) => normalizeBook(book, true)),
        }),
    elements: (author.elements || []).map((el) => normalizePageElement(el)),
    slug: author.slug?.current || null,
  }
}

export function normalizeBookCategory(bookCategory: any): BookCategory {
  return {
    ...bookCategory,
    slug: bookCategory.slug?.current || null,
  }
}

export function normalizeBlogPostSummary(
  post: Record<string, unknown>
): BlogPostSummary {
  const raw = post as Record<string, unknown>
  return {
    title: raw.title as string,
    slug: (raw.slug as Record<string, string>)?.current || '',
    excerpt: (raw.excerpt as string) || '',
    coverImage: (raw.coverImage as BlogPostSummary['coverImage']) || null,
    publishedAt: (raw.publishedAt as string) || (raw._createdAt as string),
    author: (raw.author as string) || null,
  }
}

export function normalizeBlogPost(post: Record<string, unknown>): BlogPost {
  return {
    ...normalizeBlogPostSummary(post),
    body: (post.body as PortableTextBlock[]) || [],
  }
}

export function filterOutDrafts(entity: { _id: string }): boolean {
  return entity._id.startsWith('drafts.') ? false : true
}
