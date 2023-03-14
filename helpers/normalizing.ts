import { Book, BookCategory, IAuthor, Page, PageElement, Publisher } from "shared/contract";

import { getLangName } from "./lang";

export function normalizeBook(book: any, skipNormAuthor = false): Book {
    return {
        ...book,
        bookCategory: normalizeBookCategory(book.bookCategory),
        slug: book.slug.current,
        authors: skipNormAuthor ? book.authors : book.authors.filter(a => !!a).map(a => normalizeAuthor(a, true)),
        illustrators: skipNormAuthor ? book.illustrators : (book.illustrators || []).filter(a => !!a).map(a => normalizeAuthor(a, true)),
        publisher: skipNormAuthor ? book.publisher : normalizePublisher(book.publisher),
        availableLanguageRights: skipNormAuthor ? (book.availableLanguageRights || []) : book.availableLanguageRights.map(l => ({
            code: l.toLowerCase(),
            name: getLangName(l.toLowerCase()),
        })),
        age: parseInt(book.age),
    };
}

function normalizePageElement(pageElement: any, imageAssetsMap: any[]): PageElement {

    if (pageElement.value && pageElement.value.asset) {
        const asset = imageAssetsMap.filter(a => !!a).find(asset => asset._id === pageElement.value.asset._ref)
        if (asset) {
            return {
                ...pageElement,
                type: pageElement._type,
                value: {
                    ...pageElement.value,
                    asset,
                }
            }
        }
    }

    return {
        ...pageElement,
        type: pageElement._type,
    }
}

export function normalizePage(page: any): Page {
    return {
        ...page,
        slug: page.slug.current,
        elements: page.elements.map(el => normalizePageElement(el, page.imageAssets)),
    };
}

export function normalizePublisher(publisher: any): Publisher {
    return {
        ...publisher,
        slug: publisher.slug.current,
    };
}

export function normalizeAuthor<A extends IAuthor>(author: any, skipNormBook = false): A {
    return {
        ...author,
        ...(skipNormBook ? {} : { books: (author.books || []).map(book => normalizeBook(book, true)) }),
        slug: author.slug.current,
    };
}

export function normalizeBookCategory(bookCategory: any): BookCategory {
    return {
        ...bookCategory,
        slug: bookCategory.slug.current,
    };
}
