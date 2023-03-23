import { Box } from "@chakra-ui/react";
import BookGallery from "components/booksoverview/bookgallery";
import H1 from "components/headings/h1";
import * as React from "react";

import { IBook, PageElementHighlightedBooks } from "../../../../../shared/contract";

interface IProps {
    element: PageElementHighlightedBooks;
    highlightedBooks?: IBook[];
}

const PageElementHighlightedBooks: React.FC<IProps> = ({ element, highlightedBooks }) => {
    return (
        <Box>
            {element.title && (
                <H1>{element.title}</H1>
            )}
            {highlightedBooks?.length && (
                <BookGallery books={highlightedBooks} />
            )}
        </Box>
    );
}

export default PageElementHighlightedBooks;