import { Flex, Link, Text } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from 'next/link'
import { useNextSanityImage } from 'next-sanity-image';
import React from "react";
import { IBook } from "shared/contract";

import { client } from "../../../../sanity/lib/client";

interface IProps {
    book: IBook;
}

const BookCard: React.FC<IProps> = ({ book }) => {

    const bookCoverImageProps: Record<string, any> = useNextSanityImage(
        client,
        book.cover,
    );

    return (
        <Link
            href={`/books/${book.slug}`}
            as={NextLink}
        >
            <Flex
                width={{ base: "100%", md: "250px" }}
                direction="column"
                justifyContent="center"
                alignItems="center"
                mx={{ base: 0, md: 6 }}
                my={{ base: 0, md: 6 }}
                cursor="pointer"
            >
                {book.cover?.asset && (
                    <Image
                        {...bookCoverImageProps as any}
                        style={{ width: "100%", height: 'auto' }}
                        sizes="(max-width: 48em) 100vw, 300px"
                        placeholder="blur"
                        blurDataURL={book.cover.asset.metadata.lqip}
                        alt={`Cover for ${book.title}`}
                    />
                )}
                <Text mt={4}>
                    {book.title}
                </Text>
            </Flex>
        </Link>
    )
}

export default BookCard
