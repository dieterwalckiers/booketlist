import { Flex } from "@chakra-ui/react";
import React from "react";
import { Book } from "shared/contract";

import BookCard from "./bookcard";

interface IProps {
    books: Book[];
}

const BookGallery: React.FC<IProps> = ({ books /*: _books*/ }) => {

    // const books = [..._books, ..._books, ..._books, ..._books, ..._books, ..._books, ..._books, ..._books, ..._books, ..._books, ..._books, ..._books]; // TEMP!

    return (
        <Flex
            id={`bookGallery-${books[0].slug}`}
            direction={{ base: "column", md: "row" }}
            flexWrap="wrap"
            justifyContent="center"
        >
            {books.map((book, i) => (
                <BookCard key={`book${i}${book.slug}`} book={book} />
            ))}
        </Flex>
    )
}

export default BookGallery