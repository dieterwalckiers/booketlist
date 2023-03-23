import { Author, Book, BookCategory, BookFilter, Language, Publisher } from "shared/contract";

export function getUniqueCategories(books: Book[]): BookCategory[] {
    return books.reduce((acc, book) => {
        if (!(acc.some(c => c.name === book.bookCategory.name))) {
            acc.push(book.bookCategory);
        }
        return acc;
    }, [] as BookCategory[]);
}

export function getUniqueAuthors(books: Book[]): Author[] {
    return books.reduce((acc, book) => {
        for (const author of book.authors) {
            if (!(acc.some(a => a.name === author.name))) {
                acc.push(author);
            }
        }
        return acc;
    }, [] as Author[]);
}

export function getUniqueIllustrators(books: Book[]): Author[] {
    return books.reduce((acc, book) => {
        for (const illustrator of book.illustrators) {
            if (!(acc.some(a => a.name === illustrator.name))) {
                acc.push(illustrator);
            }
        }
        return acc;
    }, [] as Author[]);
}

export function getUniquePublishers(books: Book[]): Publisher[] {
    return books.reduce((acc, book) => {
        if (!(acc.some(p => p.name === book.publisher.name))) {
            acc.push(book.publisher);
        }
        return acc;
    }, [] as Publisher[]);
}

export function getUniqueAvailableLanguageRights(books: Book[]): Language[] {
    return books.reduce((acc, book) => {
        for (const language of book.availableLanguageRights) {
            if (!(acc.some(l => l.code === language.code))) {
                acc.push(language);
            }
        }
        return acc;
    }, [] as Language[]);
}

export function filterBooks(books: Book[], bookFilter: BookFilter) {
    if (!bookFilter || Object.keys(bookFilter).length === 0) {
        return books;
    }
    return books.filter((book) => {
        if (bookFilter.bookCats && bookFilter.bookCats.length > 0) {
            if (!bookFilter.bookCats.includes(book.bookCategory.slug)) {
                return false;
            }
        }
        if (bookFilter.authors && bookFilter.authors.length > 0) {
            if (!bookFilter.authors.some(a => book.authors.some(b => b.slug === a))) {
                return false;
            }
        }
        if (bookFilter.illustrators && bookFilter.illustrators.length > 0) {
            if (!bookFilter.illustrators.some(a => book.illustrators.some(b => b.slug === a))) {
                return false;
            }
        }
        if (bookFilter.publishers && bookFilter.publishers.length > 0) {
            if (!bookFilter.publishers.includes(book.publisher.slug)) {
                return false;
            }
        }
        if (bookFilter.avLangRights && bookFilter.avLangRights.length > 0) {
            if (!bookFilter.avLangRights.some(lang => book.availableLanguageRights.some(bookLang => bookLang.code === lang))) {
                return false;
            }
        }
        if (bookFilter.ageFrom !== undefined) {
            if (book.age < bookFilter.ageFrom) {
                return false;
            }
        }
        if (bookFilter.ageTo !== undefined) {
            if (book.age > bookFilter.ageTo) {
                return false;
            }
        }
        return true;
    });
}