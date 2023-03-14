import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { PortableText } from '@portabletext/react'
import H1 from "components/headings/h1";
import Link from "next/link";
import React from "react";
import { Book } from "shared/contract";


interface IProps {
    book: Book;
}

const BookDetail: React.FC<IProps> = ({ book }) => {
    return (
        <Flex
            direction="column"
            fontSize={{ base: "md", md: "lg" }}
        >
            <H1>{book.title}</H1>
            {book.authors?.length ? (
                <Flex>
                    <Text mr="2">{`Author${book.authors?.length > 1 ? "s" : ""}`}:</Text>
                    {(book.authors || []).map((author => (
                        <Link href={`/authors/${author.slug}`} key={`auth-${author.slug}`}>
                            {author.name}
                        </Link>
                    )))}
                </Flex>
            ) : null}
            {book.illustrators.length ? (
                <Flex>
                    <Text mr="2">{`Illustrator${book.authors?.length > 1 ? "s" : ""}`}:</Text>
                    {(book.illustrators || []).map((author => (
                        <Link href={`/authors/${author.slug}`} key={`auth-${author.slug}`}>
                            {author.name}
                        </Link>
                    )))}
                </Flex>
            ) : null}
            <Box
                mt={{ base: 4, md: 12 }}
            >
                <PortableText
                    value={book.description}
                />
            </Box>
            {book.age && (
                <Box mt={{ base: 4, md: 12 }}>
                    {`Age: ${book.age}`}
                </Box>
            )}
            <Box mt={{ base: 4, md: 12 }}>
                {`Publisher: ${book.publisher.name}`}
            </Box>
        </Flex >
    )
}

export default BookDetail;