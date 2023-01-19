
import { Book, Publisher } from "shared/contract";

import { NavItem } from "./contract";

export function buildNavItems(
    books: Book[],
    publishers: Publisher[]
): Array<NavItem> {
    return [
        {
            label: "Books",
            children: books.map((book) => ({
                label: book.title,
                href: `/books/${book.slug}`,
            })),
        },
        {
            label: "Publishers",
            children: publishers.map((publisher) => ({
                label: publisher.name,
                href: `/publishers/${publisher.slug}`,
            })),
        },
        {
            label: "Authors & Illustrators",
            href: "/authors",
        },
        {
            label: "About",
            href: "/about",
        },
    ]
}
