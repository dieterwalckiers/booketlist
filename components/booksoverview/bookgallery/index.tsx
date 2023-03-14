import { Flex } from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { BookFilter, IBook } from "shared/contract";

import { filterBooks } from "../filterpanel/helpers";
import BookCard from "./bookcard";

interface IProps {
    books: IBook[];
}

const BookGallery: React.FC<IProps> = ({ books }) => {
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