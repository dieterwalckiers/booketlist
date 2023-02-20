
import { Author, Book, Publisher } from "shared/contract";

import { NavItem } from "./contract";

export function buildNavItems(
    books: Book[],
    publishers: Publisher[],
    authors: Author[],
): Array<NavItem> {
    console.log("building nav items with authors", authors);
    return [
        {
            label: "Books +",
            children: books.map((book) => ({
                label: book.title,
                href: `/books/${book.slug}`,
            })),
        },
        {
            label: "Publishers +",
            children: publishers.map((publisher) => ({
                label: publisher.name,
                href: `/publishers/${publisher.slug}`,
            })),
        },
        {
            label: "Authors & Illustrators +",
            children: authors.map((author) => ({
                label: author.name,
                href: `/authors/${author.slug}`,
            })),
        },
        {
            label: "About",
            href: "/about",
        },
    ]
}
