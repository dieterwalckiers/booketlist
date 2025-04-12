import { Box } from "@chakra-ui/react";
import BooksOverview from "components/booksoverview";
import H1 from "components/headings/h1";
import Layout from "components/layout";
import { fetchAllBookCategorySlugs, fetchAllLanguageRights, fetchBookCategory, fetchBooksForCategorySlug, fetchMenuProps } from "helpers/fetching";
import Head from "next/head";

export default function BookCategoryPage({ navItems, settings, books, bookCategory, languageRights }) {

    return (
        <>
            <Head>
                <title>{bookCategory.name} | Booketlist Agency</title>
            </Head>
            <Layout navItems={navItems} settings={settings} alignLeft>
                <Box>
                    <H1>{bookCategory.name}</H1>
                    {books && <BooksOverview books={books} filterable languageRights={languageRights} />}
                </Box>
            </Layout>
        </>

    )
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const bookCategory = await fetchBookCategory(params.slug);
    const books = await fetchBooksForCategorySlug(params.slug);
    const languageRights = await fetchAllLanguageRights();

    return {
        props: {
            navItems,
            settings,
            books,
            bookCategory,
            languageRights,
        }
    };
}

export async function getStaticPaths() {
    const allBookCategorySlugs = await fetchAllBookCategorySlugs();
    const paths = allBookCategorySlugs.map((slug) => {
        return {
            params: {
                slug,
            }
        }
    });
    return {
        paths,
        fallback: false,
    };
}