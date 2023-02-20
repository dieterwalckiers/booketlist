import { Box, Heading } from '@chakra-ui/react';
import React from "react";
import { Author } from 'shared/contract';

interface IProps {
    author: Author;
}

const AuthorDetail: React.FC<IProps> = ({ author }) => {

    return (
        <Box
            id="author-detail"
        >
            <Heading as="h1" fontSize="2xl" mb={4}>{author.name}</Heading>
        </Box>
    )
}

export default AuthorDetail;