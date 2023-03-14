import { Box, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import { useNextSanityImage } from 'next-sanity-image';
import React from "react";
import { Book } from "shared/contract";

import { client } from "../../sanity/lib/client";
import BookDetail from './bookdetail';

interface IProps {
    book: Book;
}

const BookOverview: React.FC<IProps> = ({ book }) => {

    const bookCoverImageProps: Record<string, any> = useNextSanityImage(
        client,
        book.cover,
    );

    return (
        <Flex
            id="book-detail"
            direction={{ base: "column", md: "row" }}
        >
            <Box
                width={{ base: "100%", md: "50%" }}
            >
                <Image
                    {...bookCoverImageProps as any}
                    style={{ width: "100%", height: 'auto' }}
                    sizes="(max-width: 48em) 100vw,
                        33vw"
                    placeholder="blur"
                    blurDataURL={book.cover.asset.metadata.lqip}
                    alt={`Cover for ${book.title}`}
                />
            </Box>
            <Flex
                maxWidth={{ base: "auto", md: "50%" }}
                direction="column"
                justifyContent="center"
                ml={{ base: 0, md: 12 }}
            >
                <BookDetail book={book} />
            </Flex>
        </Flex>
    )
}

export default BookOverview