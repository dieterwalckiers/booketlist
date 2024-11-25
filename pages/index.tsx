
import { Flex } from "@chakra-ui/react";
import Layout from "components/layout";
import PageElements from "components/page/pageElements";
import { fetchHighlightedBooks, fetchHome, fetchMenuProps } from "helpers/fetching";
import Head from "next/head";
import Script from "next/script";

export default function IndexPage({ navItems, settings, home, highlightedBooks }) {
    return (
        <>
            <Head>
                <title>Home | Booketlist Agency</title>
            </Head>
            <Layout navItems={navItems} settings={settings}>
                <Script src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></Script>
                <PageElements
                    elements={home.elements}
                    pageTitle="home"
                    extraProps={{
                        highlightedBooksElement: { highlightedBooks },
                    }}
                />
            </Layout>
        </>
    )
}

export async function getStaticProps() {
    const { navItems, settings } = await fetchMenuProps();
    const home = await fetchHome();
    const highlightedBooks = await fetchHighlightedBooks();
    return {
        props: {
            navItems,
            settings,
            home,
            highlightedBooks,
        }
    };
}