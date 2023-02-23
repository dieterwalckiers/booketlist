import { Author, Book, BookCategory, Publisher } from "shared/contract";

export function normalizeBook(book: any): Book {
    console.log("norm book", book);
    return {
        ...book,
        slug: book.slug.current,
        authors: book.authors.map(normalizeAuthor),
        publisher: normalizePublisher(book.publisher),
    };
}

export function normalizePublisher(publisher: any): Publisher {
    return {
        ...publisher,
        slug: publisher.slug.current,
    };
}

export function normalizeAuthor(author: any): Author {
    return {
        ...author,
        slug: author.slug.current,
    };
}

export function normalizeBookCategory(bookCategory: any): BookCategory {
    return {
        ...bookCategory,
        slug: bookCategory.slug.current,
    };
}
