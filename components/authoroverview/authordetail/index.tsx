import { Box, Heading } from '@chakra-ui/react';
import { PortableText } from '@portabletext/react';
import H1 from 'components/headings/h1';
import React from "react";
import { Author } from 'shared/contract';

interface IProps {
    author: Author;
}

const AuthorDetail: React.FC<IProps> = ({ author }) => {

    return (
        <Box id="author-detail">
            <H1>{author.name}</H1>
            <PortableText value={author.info} />
        </Box>
    )
}

export default AuthorDetail;