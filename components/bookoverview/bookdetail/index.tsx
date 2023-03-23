import { Box, Flex, Link, Stack, Text } from "@chakra-ui/react";
import { PortableText } from '@portabletext/react'
import H1 from "components/headings/h1";
import NextLink from "next/link";
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
                    <Stack>
                        {(book.authors || []).map((author => (
                            <Link
                                href={`/authors/${author.slug}`}
                                key={`auth-${author.slug}`}
                                as={NextLink}
                                _hover={{ textDecoration: "underline", color: "teal" }}
                                textUnderlineOffset={4}
                            >
                                {author.name}
                            </Link>
                        )))}
                    </Stack>
                </Flex>
            ) : null}
            {book.illustrators.length ? (
                <Flex>
                    <Text mr="2">{`Illustrator${book.authors?.length > 1 ? "s" : ""}`}:</Text>
                    {(book.illustrators || []).map((author => (
                        <Link
                            href={`/authors/${author.slug}`}
                            key={`auth-${author.slug}`}
                            as={NextLink}
                            _hover={{ textDecoration: "underline", color: "teal" }}
                            textUnderlineOffset={4}
                        >
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
                    {`Age: ${book.age}+`}
                </Box>
            )}
            <Box mt={{ base: 4, md: 12 }}>
                <Flex>
                    <Text mr={2}>
                        Publisher:
                    </Text>
                    <Link
                        href={`/publishers/${book.publisher.slug}`}
                        as={NextLink}
                        _hover={{ textDecoration: "underline", color: "teal" }}
                        textUnderlineOffset={4}
                    >
                        {book.publisher.name}
                    </Link>

                </Flex>
            </Box>
        </Flex >
    )
}

export default BookDetail;