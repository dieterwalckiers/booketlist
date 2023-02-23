
import { Author, Book, BookCategory, Publisher } from "shared/contract";

import { NavItem } from "./contract";

export function buildNavItems(
    bookCategories: BookCategory[],
    publishers: Publisher[],
    authors: Author[],
): Array<NavItem> {
    console.log("building nav items with bookCategories", bookCategories);
    return [
        {
            label: "Books +",
            children: bookCategories.map((bookCategory) => ({
                label: bookCategory.name,
                href: `/cat/${bookCategory.slug}`,
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
