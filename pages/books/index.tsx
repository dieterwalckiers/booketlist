import { Box, Button, Flex, Hide, Link, useBreakpoint, useBreakpointValue, useMediaQuery } from "@chakra-ui/react";
import BooksOverview from "components/booksoverview";
import H1 from "components/headings/h1";
import Layout from "components/layout";
import { NavItem } from "components/navbar/contract";
import { fetchAllBooks, fetchMenuProps } from "helpers/fetching";
import Head from "next/head";
import React, { useEffect, useState } from "react";
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
        <>
            <Head>
                <title>Books | Booketlist Agency</title>
            </Head>
            <Layout navItems={navItems} settings={settings}>
                <BooksOverview
                    books={books}
                    filterable={true}
                />
            </Layout>
        </>

    )
}

export default Books