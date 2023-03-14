import { Box, Flex } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Book, BookFilter, BookWithAuthorRef, IBook } from "shared/contract";

import BookGallery from "./bookgallery";
import FilterPanel from "./filterpanel";
import { filterBooks } from "./filterpanel/helpers";

interface Props {
    books: Array<IBook>;
    filterable?: boolean;
}

function BooksOverview(props: Props) {

    const { books, filterable } = props;

    const [bookFilter, setBookFilter] = React.useState<BookFilter>({} as BookFilter);

    const filteredBooks = useMemo(() => {
        if (filterable) {
            return filterBooks(books as Book[], bookFilter);
        }
        return books;
    }, [filterable, books, bookFilter]);

    return (
        <Flex direction={{ base: "column", md: "row" }}>
            {filterable && (
                <Box>
                    <FilterPanel books={filteredBooks as Book[]} bookFilter={bookFilter} onUpdateFilter={setBookFilter} />
                </Box>
            )}
            <Box flexGrow={1}>
                <BookGallery books={filteredBooks} />
            </Box>
        </Flex>
    )
}

export default BooksOverview;