import { Box, Flex, Hide, Link, useMediaQuery } from "@chakra-ui/react";
import H1 from "components/headings/h1";
import books from "pages/books";
import React, { useEffect, useMemo, useState } from "react";
import { Book, BookFilter, BookWithAuthorRef, IBook } from "shared/contract";

import BookGallery from "./bookgallery";
import FilterPanel from "./filterpanel";
import { filterBooks } from "./filterpanel/helpers";

interface Props {
    title?: string;
    books: Array<IBook>;
    filterable?: boolean;
}

function BooksOverview({ title, filterable, books }: Props) {
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const [filterVisible, setFilterVisible] = useState<boolean>(!isMobile && filterable);

    useEffect(() => {
        setFilterVisible(!isMobile && filterable);
    }, [isMobile, filterable]);

    const onClickFilter = () => {
        setFilterVisible(!filterVisible);
    }

    const [bookFilter, setBookFilter] = React.useState<BookFilter>({} as BookFilter);

    const filteredBooks = useMemo(() => {
        if (filterable) {
            return filterBooks(books as Book[], bookFilter);
        }
        return books;
    }, [filterable, books, bookFilter]);

    return (
        <Box>
            <Flex justifyContent="space-between">
                {title ? <H1>All books</H1> : null}
                {filterable && isMobile ? (
                    <Link
                        onClick={onClickFilter}
                        py={1}
                        px={3}
                        color="#ef4e41"
                        border="1px solid #ef4e41"
                        borderRadius={20}
                        my={2}
                    >
                        {filterVisible ? "HIDE FILTER" : "FILTER BOOKS..."}
                    </Link>
                ) : null}
            </Flex>

            <Flex direction={{ base: "column", md: "row" }}>
                {filterVisible && (
                    <FilterPanel
                        books={filteredBooks as Book[]}
                        bookFilter={bookFilter}
                        onUpdateFilter={setBookFilter}
                    />
                )}
                <Box flexGrow={1}>
                    <BookGallery books={filteredBooks} />
                </Box>
            </Flex>
        </Box >
    )
}

export default BooksOverview;