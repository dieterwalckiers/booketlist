import { Book, BookCategory, Home, IAuthor, Page, PageElement, Publisher } from "shared/contract";

import { getLangName } from "./lang";

export function normalizeBook(book: any, skipNormAuthor = false): Book {

    return {
        ...book,
        bookCategory: normalizeBookCategory(book.bookCategory),
        slug: book.slug?.current || null,
        authors: skipNormAuthor ? (book.authors || []) : book.authors.filter(a => !!a).map(a => normalizeAuthor(a, true)),
        illustrators: skipNormAuthor ? (book.illustrators || []) : (book.illustrators || []).filter(a => !!a).map(a => normalizeAuthor(a, true)),
        publisher: skipNormAuthor ? book.publisher : normalizePublisher(book.publisher),
        availableLanguageRights: skipNormAuthor ? (book.availableLanguageRights || []) : (book.availableLanguageRights || []).map(l => ({
            code: l.toLowerCase(),
            name: getLangName(l.toLowerCase()),
        })),
        age: parseInt(book.age),
    };
}

function normalizePageElement(pageElement: any, imageAssetsMap?: any[]): PageElement {

    if (pageElement.value && pageElement.value.asset && imageAssetsMap) {
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
        slug: page.slug?.current || null,
        elements: page.elements.map(el => normalizePageElement(el, page.imageAssets)),
    };
}

export function normalizeHome(home: any): Home {
    return {
        ...home,
        elements: home.elements.map(el => normalizePageElement(el, home.imageAssets)),
    };
}

export function normalizePublisher(publisher: any): Publisher {
    return {
        ...publisher,
        slug: publisher.slug?.current || null,
        elements: (publisher.elements || []).map(el => normalizePageElement(el, publisher.imageAssets)),
    };
}

export function normalizeAuthor<A extends IAuthor>(author: any, skipNormBook = false): A {
    return {
        ...author,
        ...(skipNormBook ? {} : { books: (author.books || []).map(book => normalizeBook(book, true)) }),
        elements: (author.elements || []).map(el => normalizePageElement(el, author.imageAssets)),
        slug: author.slug?.current || null,
    };
}

export function normalizeBookCategory(bookCategory: any): BookCategory {
    return {
        ...bookCategory,
        slug: bookCategory.slug?.current || null,
    };
}

export function filterOutDrafts(entity: { _id: string }): boolean {
    return entity._id.startsWith("drafts.") ? false : true;
}