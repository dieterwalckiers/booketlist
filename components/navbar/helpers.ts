
import { Author, Book, BookCategory, Page, Publisher } from "shared/contract";

import { NavItem } from "./contract";

export function buildNavItems(
    bookCategories: BookCategory[],
    publishers: Publisher[],
    authors: Author[],
    pages: Page[],
): Array<NavItem> {
    return [
        {
            label: "Books +",
            href: "/books",
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
        ...pages.map(page => ({
            label: page.title,
            href: `/page/${page.slug}`,
        })),
    ]
}
