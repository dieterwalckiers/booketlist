import { NavItem } from "components/navbar/contract";
import { buildNavItems } from "components/navbar/helpers";
import { Author, AuthorWithBooks, Book, Home, Page, Publisher } from "shared/contract";

import { client } from "../sanity/lib/client";
import { filterOutDrafts, normalizeAuthor, normalizeBook, normalizeBookCategory, normalizeHome, normalizePage, normalizePublisher } from "./normalizing";

export async function fetchAllBooks(): Promise<Book[]> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN });
  const booksRaw = await authClient.fetch(`
      *[_type == "book"] {
        ...,
        authors[]->{name,slug},
        illustrators[]->{name,slug},
        publisher->{
          name,
          elements,
          slug,
          "imageAssets": elements[].value.asset->{
            ...,
            metadata
          }
        },
        bookCategory->{name,slug},
        'availableLanguageRights': languageRights[isSold != true].languageCode,
        cover {
          asset->{
            ...,
            metadata
          }
        }
      }
    `);
  return booksRaw.filter(filterOutDrafts).map(book => normalizeBook(book));
}

export async function fetchAllBookSlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const booksRaw = await authClient.fetch(`*[_type == "book"]{ slug }`);
  return booksRaw.map(book => book.slug.current);
}

export async function fetchAllPageSlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const pagesRaw = await authClient.fetch(`*[_type == "page"]{ slug }`);
  return pagesRaw.map(page => page.slug.current);
}

export async function fetchAllAuthorSlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const authorsRaw = await authClient.fetch(`*[_type == "author"]`);
  return authorsRaw.map(author => author.slug.current);
}

export async function fetchAllPublisherSlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const publishersRaw = await authClient.fetch(`*[_type == "publisher"]`);
  return publishersRaw.map(publisher => publisher.slug.current);
}

export async function fetchAllBookCategorySlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const bookCategoriesRaw = await authClient.fetch(`*[_type == "bookCategory"]`);
  return bookCategoriesRaw.map(cat => cat.slug.current);
}

export async function fetchHome(): Promise<Home> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const homeRaw = await authClient.fetch(`*[_type == "home"][0] {
    ...,
    "imageAssets": elements[].value.asset->{
      ...,
      metadata
    }
  }`);
  return normalizeHome(homeRaw);
}

export async function fetchBook(slug: string): Promise<Book> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const bookRaw = await authClient.fetch(`
      *[_type == "book" && slug.current == $slug][0] {
        ...,
        bookCategory->{name,slug},
        authors[]->{name,slug},
        illustrators[]->{name,slug},
        publisher->{
          name,
          slug,
          "imageAssets": elements[].value.asset->{
            ...,
            metadata
          }
        },
        'availableLanguageRights': languageRights[isSold != true].languageCode,
        cover {
          asset->{
            ...,
            metadata
          }
        }
      }
    `, { slug });
  return normalizeBook(bookRaw);
}

export async function fetchPage(slug: string): Promise<Page> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const pageRaw = await authClient.fetch(`
    *[_type == "page" && slug.current == $slug][0] {
      ...,
      "imageAssets": elements[].value.asset->{
        ...,
        metadata
      }
    }
    `, { slug });
  return normalizePage(pageRaw);
}

export async function fetchBooksForCategorySlug(categorySlug: string): Promise<Book[]> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN });

  const bookCategory = await authClient.fetch(`
        *[_type == "bookCategory" && slug.current == $categorySlug][0]
    `, { categorySlug });

  const booksRaw = await authClient.fetch(`
      *[_type == "book" && bookCategory._ref == $categoryId] {
        ...,
        authors[]->{name,slug},
        illustrators[]->{name,slug},
        publisher->{
          name,
          slug,
          "imageAssets": elements[].value.asset->{
            ...,
            metadata
          }
        },
        bookCategory->{name,slug},
        'availableLanguageRights': languageRights[isSold != true].languageCode,
        cover {
          asset->{
            ...,
            metadata
          }
        }
      }
    `, { categoryId: bookCategory._id });

  return booksRaw.map(book => normalizeBook(book));
}

export async function fetchAuthorWithBooks(slug: string): Promise<AuthorWithBooks> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })

  // include all books by this author
  const authorRaw = await authClient.fetch(`
      *[_type == "author" && slug.current == $slug][0] {
        ...,
        "imageAssets": elements[].value.asset->{
          ...,
          metadata
        },
        "books": *[_type == "book" && references(^._id)] {
          ...,
          bookCategory->{name,slug},
          cover {
            asset->{
              ...,
              metadata
            }
          }
        }
      }
    `, { slug });

  return normalizeAuthor<AuthorWithBooks>(authorRaw);
}

export async function fetchPublisher(slug: string): Promise<Publisher> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const publisherRaw = await authClient.fetch(`
      *[_type == "publisher" && slug.current == $slug][0] {
        ...,
        "imageAssets": elements[].value.asset->{
          ...,
          metadata,
        }
      }
    `, { slug });
  return normalizePublisher(publisherRaw);
}

export async function fetchBookCategory(slug: string) {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const bookCategoryRaw = await authClient.fetch(`
      *[_type == "bookCategory" && slug.current == $slug][0] {
        ...,
      }
    `, { slug });
  return normalizeBookCategory(bookCategoryRaw);
}

export async function fetchHighlightedBooks(): Promise<Book[]> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const booksRaw = await authClient.fetch(`
      *[_type == "book" && isHighlighted == true] {
        ...,
          bookCategory->{name,slug},
          cover {
            asset->{
              ...,
              metadata
            }
          }
      }
    `);
  return booksRaw.map(book => normalizeBook(book, true));
}

export async function fetchMenuProps(): Promise<{ navItems: NavItem[], settings: any }> {

  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const bookCategoriesRaw = await authClient.fetch(`*[_type == "bookCategory"]`);
  const bookCategories = bookCategoriesRaw.map(bookCategory => normalizeBookCategory(bookCategory));

  const settings = await authClient.fetch(`
      *[_type == "settings"][0] {
        logo {
          asset->{
            ...,
            metadata
          }
        }
      }
    `);

  const publishersRaw = await authClient.fetch(`*[_type == "publisher"]`);
  const publishers = publishersRaw.filter(filterOutDrafts).map(publisher => normalizePublisher(publisher));
  const authorsRaw = await authClient.fetch(`*[_type == "author"]`);
  const authors = authorsRaw.filter(filterOutDrafts).map(author => normalizeAuthor<Author>(author));
  const pagesRaw = await authClient.fetch(`*[_type == "page"] {
        ...,
        "imageAssets": elements[].value.asset->{
            ...,
            metadata
        }
    }`);
  const pages = pagesRaw.map(page => normalizePage(page));
  const navItems = buildNavItems(bookCategories, publishers, authors, pages);

  return {
    navItems,
    settings,
  }
}
