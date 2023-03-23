import { Box } from '@chakra-ui/react';
import H1 from 'components/headings/h1';
import PageElements from 'components/page/pageElements';
import React from "react";
import { Author } from 'shared/contract';

interface IProps {
    author: Author;
}

const AuthorDetail: React.FC<IProps> = ({ author }) => {

    return (
        <Box id="author-detail">
            <H1>{author.name}</H1>
            <PageElements elements={author.elements} pageTitle="authorInfo" />
        </Box>
    )
}

export default AuthorDetail;