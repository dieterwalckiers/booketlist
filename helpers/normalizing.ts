import { Author, Book, Publisher } from "shared/contract";

export function normalizeBook(book: any): Book {
    console.log("norm book", book);
    return {
        ...book,
        slug: book.slug.current,
        authors: book.authors.map(normalizeAuthor),
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