import { Box, Button, Flex, Hide, Link, useBreakpoint, useBreakpointValue, useMediaQuery } from "@chakra-ui/react";
import BooksOverview from "components/booksoverview";
import H1 from "components/headings/h1";
import Layout from "components/layout";
import { NavItem } from "components/navbar/contract";
import { fetchAllBooks, fetchAllLanguageRights, fetchMenuProps } from "helpers/fetching";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Book, LanguageRight } from "shared/contract";

interface Props {
    books: Book[];
    languageRights: LanguageRight[];
    navItems: NavItem[];
    settings: any;
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const [books, languageRights] = await Promise.all([
        fetchAllBooks(),
        fetchAllLanguageRights(),
    ]);

    return {
        props: {
            navItems,
            settings,
            books,
            languageRights,
        }
    };
}

const Books: React.FC<Props> = ({ books, languageRights, navItems, settings }) => {

    return (
        <>
            <Head>
                <title>Books | Booketlist Agency</title>
            </Head>
            <Layout navItems={navItems} settings={settings} alignLeft>
                <BooksOverview
                    books={books}
                    languageRights={languageRights}
                    filterable
                />
            </Layout>
        </>

    )
}

export default Books;