import { Book, BookCategory, Home, IAuthor, LanguageRight, Page, PageElement, Publisher } from "shared/contract";

import { getLangName } from "./lang";

export function normalizeBook(book: any, skipNormAuthor = false): Book {

    const normalizedBook = {
        ...book,
        bookCategory: normalizeBookCategory(book.bookCategory),
        slug: book.slug?.current || null,
        authors: skipNormAuthor ? (book.authors || []) : (book.authors || []).filter(a => !!a).map(a => normalizeAuthor(a, true)),
        illustrators: skipNormAuthor ? (book.illustrators || []) : (book.illustrators || []).filter(a => !!a).map(a => normalizeAuthor(a, true)),
        publisher: (skipNormAuthor || !book.publisher ? book.publisher : normalizePublisher(book.publisher)) || null,
        soldLanguageRights: skipNormAuthor ? (book.soldLanguageRights || []) : (book.soldLanguageRights || []).filter(Boolean).map(({ languageCode }) => ({
            code: languageCode,
            name: getLangName(languageCode),
        })),
        age: parseInt(book.age),
    } as Book;
    normalizedBook.searchableDataSerialized = `${normalizedBook.title}${normalizedBook.originalTitle || ""}${normalizedBook.authors.map(a => a.name).join(", ")}${normalizedBook.illustrators.map(i => i.name).join(", ")}${normalizedBook.publisher?.name || ""}${normalizedBook.bookCategory?.name || ""}`;
    return normalizedBook;
}

export function normalizeLanguageRight(languageRight: any): LanguageRight {
    return {
        code: languageRight.languageCode,
        name: getLangName(languageRight.languageCode),
    }
}


function normalizePageElement(pageElement: any): PageElement {
    return {
        ...pageElement,
        type: pageElement._type,
    }
}

export function normalizePage(page: any): Page {
    return {
        ...page,
        slug: page.slug?.current || null,
        elements: page.elements.map(el => normalizePageElement(el)),
    };
}

export function normalizeHome(home: any): Home {
    return {
        ...home,
        elements: home.elements.map(el => normalizePageElement(el)),
    };
}

export function normalizePublisher(publisher: any): Publisher {
    return {
        ...publisher,
        slug: publisher.slug?.current || null,
        elements: (publisher.elements || []).map(el => normalizePageElement(el)),
    };
}

export function normalizeAuthor<A extends IAuthor>(author: any, skipNormBook = false): A {
    return {
        ...author,
        ...(skipNormBook ? {} : { books: (author.books || []).map(book => normalizeBook(book, true)) }),
        elements: (author.elements || []).map(el => normalizePageElement(el)),
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