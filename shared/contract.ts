export interface Home {
  elements: PageElement[]
}

export interface YouTubeVideo {
  _type: 'youtube'
  url: string
}

export interface SanityImage {
  _type?: 'image'
  asset: {
    _id: string
    url: string
    metadata: Record<string, unknown>
  }
}

export type BookMediaItem = SanityImage | YouTubeVideo

export interface IBook {
  title: string
  originalTitle?: string
  description: any
  cover: any
  slug: string
  publisher: Publisher
  bookCategory: BookCategory
  age: number
}

export type Book = IBook & {
  authors: Author[]
  illustrators: Author[]
  publisher: Publisher
  soldLanguageRights: LanguageRight[]
  additionalMedia: BookMediaItem[]
  searchableDataSerialized?: string
}

export type BookWithAuthorRef = IBook & { authors: any }

export type LanguageRight = {
  code: string
  name: string
}

export type BookFilter = {
  bookCats?: string[] // slugs
  authors?: string[] // slugs
  illustrators?: string[] // slugs
  publishers?: string[] // slugs
  avLangRights?: string[] // codes
  ageFrom?: number
  ageTo?: number
  searchString?: string
}
export interface BookCategory {
  name: string
  books: Book[]
  slug: string
}

export interface Publisher {
  name: string
  elements: PageElement[]
  slug: string
}

export interface IAuthor {
  name: string
  slug: string
  elements: PageElement[]
  showInMenu?: boolean
}

export type Author = IAuthor
export type AuthorWithBooks = IAuthor & { books: BookWithAuthorRef[] }

export type PageElementType =
  | 'richTextElement'
  | 'imageElement'
  | 'galleryElement'
  | 'titleElement'
  | 'highlightedBooksElement'
  | 'joinNewsletterElement'

export interface PageElement {
  type: PageElementType
}

export interface PageElementRichText extends PageElement {
  value: any
}

export interface PageElementImage extends PageElement {
  value: any
  asset: any
  link?: string
  widthPercentage?: number
}

export interface PageElementGallery extends PageElement {
  value: any
}

export interface PageElementTitle extends PageElement {
  value: string
}

export interface PageElementHighlightedBooks extends PageElement {
  title: string
}

export interface PageElementJoinNewsletter extends PageElement {
  title: string
  caption: string
  buttonText: string
}

export interface Page {
  id: string
  slug: string
  title: string
  elements: PageElement[]
  hideInMenu?: boolean
}

export interface BlogPostSummary {
  title: string
  slug: string
  excerpt: string
  coverImage: SanityImage | null
  publishedAt: string
  author: string | null
}

export interface PortableTextBlock {
  _type: string
  [key: string]: unknown
}

export interface BlogPost extends BlogPostSummary {
  body: PortableTextBlock[]
}
