import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from 'next/link'
import { useNextSanityImage } from 'next-sanity-image';
import React from "react";
import { Book } from "shared/contract";

import { client } from "../../../sanity/lib/client";

interface IProps {
    book: Book;
}

const BookCard: React.FC<IProps> = ({ book }) => {

    const bookCoverImageProps: Record<string, any> = useNextSanityImage(
        client,
        book.cover,
    );

    return (
        <Link href={`/books/${book.slug}`}>
            <Flex
                width={{ base: "100%", md: "300px" }}
                direction="column"
                justifyContent="center"
                alignItems="center"
                mx={{ base: 0, md: 12 }}
                my={{ base: 0, md: 6 }}
                cursor="pointer"
            >
                <Image
                    {...bookCoverImageProps as any}
                    style={{ width: "100%", height: 'auto' }}
                    sizes="(max-width: 48em) 100vw, 300px"
                    placeholder="blur"
                    blurDataURL={book.cover.asset.metadata.lqip}
                    alt={`Cover for ${book.title}`}
                />
                <Text mt={4}>
                    {book.title}
                </Text>
            </Flex>
        </Link>
    )
}

export default BookCard
