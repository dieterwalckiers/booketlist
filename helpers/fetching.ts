import { NavItem } from "components/navbar/contract";
import { buildNavItems } from "components/navbar/helpers";
import { Author, Book } from "shared/contract";

import { client } from "../sanity/lib/client";
import { normalizeAuthor, normalizeBook, normalizePublisher } from "./normalizing";

export async function fetchAllBookSlugs() {
    const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
    const booksRaw = await authClient.fetch(`*[_type == "book"]{ slug }`);
    return booksRaw.map(book => book.slug.current);
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

export async function fetchBook(slug: string): Promise<Book> {
    const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
    const bookRaw = await authClient.fetch(`
      *[_type == "book" && slug.current == $slug][0] {
        ...,
        authors[]->{name,slug},
        publisher->{name,pageContent,slug},
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

export async function fetchAuthor(slug: string): Promise<Author> {
    const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
    const authorRaw = await authClient.fetch(`
      *[_type == "author" && slug.current == $slug][0] {
        ...,
      }
    `, { slug });
    return normalizeAuthor(authorRaw);
}

export async function fetchPublisher(slug: string): Promise<Author> {
    const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
    const publisherRaw = await authClient.fetch(`
      *[_type == "publisher" && slug.current == $slug][0] {
        ...,
      }
    `, { slug });
    return normalizePublisher(publisherRaw);
}

export async function fetchMenuProps(): Promise<{ navItems: NavItem[], settings: any }> {

    const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
    const booksRaw = await authClient.fetch(`
        *[_type == "book"]{
            ...,
            authors[]->{name,slug},
            publisher->{name,pageContent,slug},
        }
    `);
    console.log(`${booksRaw.length} books found`);

    const books = booksRaw.map(book => normalizeBook(book));
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
    const publishers = publishersRaw.map(publisher => normalizePublisher(publisher));
    const authorsRaw = await authClient.fetch(`*[_type == "author"]`);
    const authors = authorsRaw.filter(noDraft).map(author => normalizeAuthor(author));
    const navItems = buildNavItems(books, publishers, authors);

    console.log("settings", settings);
    return {
        navItems,
        settings,
    }
}

export function noDraft<E>(doc: { _id: string }): boolean {
    return !(doc._id.startsWith("drafts"))
}