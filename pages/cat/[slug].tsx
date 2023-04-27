import { Box } from "@chakra-ui/react";
import BooksOverview from "components/booksoverview";
import H1 from "components/headings/h1";
import Layout from "components/layout";
import { fetchAllBookCategorySlugs, fetchBookCategory, fetchBooksForCategorySlug, fetchMenuProps } from "helpers/fetching";
import Head from "next/head";

export default function BookCategoryPage({ navItems, settings, books, bookCategory }) {

    return (
        <>
            <Head>
                <title>{bookCategory.name} | Booketlist Agency</title>
            </Head>
            <Layout navItems={navItems} settings={settings}>
                <Box>
                    <H1>{bookCategory.name}</H1>
                    {books && <BooksOverview books={books} filterable={true} />}
                </Box>
            </Layout>
        </>

    )
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const bookCategory = await fetchBookCategory(params.slug);
    const books = await fetchBooksForCategorySlug(params.slug);

    return {
        props: {
            navItems,
            settings,
            books,
            bookCategory,
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