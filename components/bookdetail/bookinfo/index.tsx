import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { PortableText } from '@portabletext/react'
import Link from "next/link";
import React from "react";
import { Book } from "shared/contract";


interface IProps {
    book: Book;
}

const BookInfo: React.FC<IProps> = ({ book }) => {
    return (
        <Flex
            direction="column"
            fontSize={{ base: "md", md: "lg" }}
        >
            <Heading as="h1" fontSize="2xl" mt={{ base: 4, md: 0 }} >{book.title}</Heading>
            <Box>
                {(book.authors || []).map((author => (
                    <Link href={`/authors/${author.slug}`} key={`auth-${author.slug}`}>
                        {author.name}
                    </Link>
                )))}
            </Box>
            <Box
                mt={{ base: 4, md: 12 }}
            >
                <PortableText
                    value={book.description}
                />
            </Box>
            <Box mt={{ base: 4, md: 12 }}>
                {`Publisher: ${book.publisher.name}`}
            </Box>
        </Flex >
    )
}

export default BookInfo;