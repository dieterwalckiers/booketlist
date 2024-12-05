import { Flex } from "@chakra-ui/react";
import React from "react";
import { IBook } from "shared/contract";

import BookCard from "./bookcard";

interface IProps {
    books: IBook[];
}

const BookGallery: React.FC<IProps> = ({ books }) => {
    return (
        <Flex
            id={`bookGallery-${books.length ? books[0].slug : ""}`}
            direction={{ base: "column", md: "row" }}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="stretch"
        >
            {(books || []).map((book, i) => (
                <BookCard key={`book${i}${book.slug}`} book={book} />
            ))}
        </Flex>
    )
}

export default BookGallery