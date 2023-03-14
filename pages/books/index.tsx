import { Box } from "@chakra-ui/react";
import BooksOverview from "components/booksoverview";
import H1 from "components/headings/h1";
import H2 from "components/headings/h2";
import Layout from "components/layout";
import { NavItem } from "components/navbar/contract";
import { fetchAllBooks, fetchMenuProps } from "helpers/fetching";
import React from "react";
import { Book } from "shared/contract";

interface Props {
    books: Book[];
    navItems: NavItem[];
    settings: any;
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const books = await fetchAllBooks();
    return {
        props: {
            navItems,
            settings,
            books,
        }
    };
}

const Books: React.FC<Props> = ({ books, navItems, settings }) => {
    return (
        <Layout navItems={navItems} settings={settings}>
            <Box>
                <H1>All books</H1>
                <BooksOverview books={books} filterable={true} />
            </Box>
        </Layout>
    )
}

export default Books