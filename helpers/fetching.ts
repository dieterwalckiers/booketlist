import { NavItem } from "components/navbar/contract";
import { buildNavItems } from "components/navbar/helpers";
import { Author, AuthorWithBooks, Book, Home, LanguageRight, Page, Publisher } from "shared/contract";

import { client } from "../sanity/lib/client";
import { filterOutDrafts, normalizeAuthor, normalizeBook, normalizeBookCategory, normalizeHome, normalizeLanguageRight, normalizePage, normalizePublisher } from "./normalizing";

export async function fetchAllBooks(): Promise<Book[]> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN });

  const booksRaw = await authClient.fetch(`
      *[_type == "book"] {
        ...,
        authors[]->{name,slug},
        illustrators[]->{name,slug},
        publisher->{
          name,
          slug,
          elements[] {
            ...,
            _type == "imageElement" => {
              ...,
              value {
                ..., 
                asset->{
                  _id,
                  url,
                  metadata {
                    dimensions,
                    lqip,
                    palette,
                    ...
                  }
                }
              }
            },
            _type == "galleryElement" => {
              ...,
              value[] {
                ...,
                value {
                  ..., 
                  asset->{
                    _id,
                    url,
                    metadata {
                      dimensions,
                      lqip,
                      palette,
                      ...
                    }
                  }
                },
              }
            }
          }
        },
        bookCategory->{name,slug},
        soldLanguageRights[]->{languageCode},
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

export async function fetchAllLanguageRights(): Promise<LanguageRight[]> {
    const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN });
    const languageRightsRaw = await authClient.fetch(`*[_type == "languageRight"]{ languageCode }`);
    return languageRightsRaw.map(languageRight => normalizeLanguageRight(languageRight));
  }

export async function fetchAllBookSlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const booksRaw = await authClient.fetch(`*[_type == "book"]{ slug }`);
  return booksRaw.map(book => book.slug?.current).filter(slug => !!slug);
}

export async function fetchAllPageSlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const pagesRaw = await authClient.fetch(`*[_type == "page"]{ slug }`);
  return pagesRaw.map(page => page.slug?.current).filter(slug => !!slug);
}

export async function fetchAllAuthorSlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const authorsRaw = await authClient.fetch(`*[_type == "author"]`);
  return authorsRaw.map(author => author.slug?.current).filter(slug => !!slug);
}

export async function fetchAllPublisherSlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const publishersRaw = await authClient.fetch(`*[_type == "publisher"]`);
  return publishersRaw.map(publisher => publisher.slug?.current).filter(slug => !!slug);
}

export async function fetchAllBookCategorySlugs() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const bookCategoriesRaw = await authClient.fetch(`*[_type == "bookCategory"]`);
  return bookCategoriesRaw.map(cat => cat.slug?.current).filter(slug => !!slug);
}

export async function fetchHome(): Promise<Home> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const homeRaw = await authClient.fetch(`*[_type == "home"][0] {
    ...,
    elements[] {
      ...,
      _type == "imageElement" => {
        ...,
        value {
          ..., 
          asset->{
            _id,
            url,
            metadata {
              dimensions,
              lqip,
              palette,
              ...
            }
          }
        }
      },
      _type == "galleryElement" => {
        ...,
        value[] {
          ...,
          value {
            ..., 
            asset->{
              _id,
              url,
              metadata {
                dimensions,
                lqip,
                palette,
                ...
              }
            }
          },
        }
      }
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
          elements[] {
            ...,
            _type == "imageElement" => {
              ...,
              value {
                ..., 
                asset->{
                  _id,
                  url,
                  metadata {
                    dimensions,
                    lqip,
                    palette,
                    ...
                  }
                }
              }
            },
            _type == "galleryElement" => {
              ...,
              value[] {
                ...,
                value {
                  ..., 
                  asset->{
                    _id,
                    url,
                    metadata {
                      dimensions,
                      lqip,
                      palette,
                      ...
                    }
                  }
                },
              }
            }
          }
        },
        soldLanguageRights[]->{languageCode},
        cover {
          asset->{
            ...,
            metadata
          }
        },
        additionalImages[]{
          asset->{
            ...,
            metadata
          }
        }
      }
    `, { slug });
  const rs = normalizeBook(bookRaw);
  return rs;
}

export async function fetchPage(slug: string): Promise<Page> {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const pageRaw = await authClient.fetch(`
    *[_type == "page" && slug.current == $slug][0] {
      ...,
      elements[] {
        ...,
        _type == "imageElement" => {
          ...,
          value {
            ..., 
            asset->{
              _id,
              url,
              metadata {
                dimensions,
                lqip,
                palette,
                ...
              }
            }
          }
        },
        _type == "galleryElement" => {
          ...,
          value[] {
            ...,
            value {
              ..., 
              asset->{
                _id,
                url,
                metadata {
                  dimensions,
                  lqip,
                  palette,
                  ...
                }
              }
            },
          }
        }
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
          elements[] {
            ...,
            _type == "imageElement" => {
              ...,
              value {
                ..., 
                asset->{
                  _id,
                  url,
                  metadata {
                    dimensions,
                    lqip,
                    palette,
                    ...
                  }
                }
              }
            },
            _type == "galleryElement" => {
              ...,
              value[] {
                ...,
                value {
                  ..., 
                  asset->{
                    _id,
                    url,
                    metadata {
                      dimensions,
                      lqip,
                      palette,
                      ...
                    }
                  }
                },
              }
            }
          }
        },
        bookCategory->{name,slug},
        soldLanguageRights[]->{languageCode},
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
        elements[] {
          ...,
          _type == "imageElement" => {
            ...,
            value {
              ..., 
              asset->{
                _id,
                url,
                metadata {
                  dimensions,
                  lqip,
                  palette,
                  ...
                }
              }
            }
          },
          _type == "galleryElement" => {
            ...,
            value[] {
              ...,
              value {
                ..., 
                asset->{
                  _id,
                  url,
                  metadata {
                    dimensions,
                    lqip,
                    palette,
                    ...
                  }
                }
              },
            }
          }
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
        name,
        slug,
        elements[] {
          ...,
          _type == "imageElement" => {
            ...,
            value {
              ..., 
              asset->{
                _id,
                url,
                metadata {
                  dimensions,
                  lqip,
                  palette,
                  ...
                }
              }
            }
          },
          _type == "galleryElement" => {
            ...,
            value[] {
              ...,
              value {
                ..., 
                asset->{
                  _id,
                  url,
                  metadata {
                    dimensions,
                    lqip,
                    palette,
                    ...
                  }
                }
              },
            }
          }
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
  return booksRaw.filter(filterOutDrafts).map(book => normalizeBook(book, true));
}

export async function fetchMenuProps(): Promise<{ navItems: NavItem[], settings: any }> {

  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const bookCategoriesRaw = await authClient.fetch(`*[_type == "bookCategory"]|order(orderRank)`);
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

  const publishersRaw = await authClient.fetch(`*[_type == "publisher"]|order(name asc)`);
  const publishers = publishersRaw.filter(filterOutDrafts).map(publisher => normalizePublisher(publisher));
  const authorsRaw = await authClient.fetch(`*[_type == "author"]|order(name asc)`);
  const authors = authorsRaw.filter(filterOutDrafts).map(author => normalizeAuthor<Author>(author));
  const pagesRaw = await authClient.fetch(`*[_type == "page"] {
    ...,
    elements[] {
      ...,
      _type == "imageElement" => {
        ...,
        value {
          ..., 
          asset->{
            _id,
            url,
            metadata {
              dimensions,
              lqip,
              palette,
              ...
            }
          }
        }
      },
      _type == "galleryElement" => {
        ...,
        value[] {
          ...,
          value {
            ..., 
            asset->{
              _id,
              url,
              metadata {
                dimensions,
                lqip,
                palette,
                ...
              }
            }
          },
        }
      }
    }
  }`);
  const pages = pagesRaw.map(page => normalizePage(page));
  const navItems = buildNavItems(bookCategories, publishers, authors, pages);

  return {
    navItems,
    settings,
  }
}
