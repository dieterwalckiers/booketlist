import { Flex } from "@chakra-ui/react";
import Layout from "components/layout";
import PageElements from "components/page/pageElements";
import { fetchHighlightedBooks, fetchHome, fetchMenuProps } from "helpers/fetching";

export default function IndexPage({ navItems, settings, home, highlightedBooks }) {
    return (
        <Layout navItems={navItems} settings={settings}>
            <PageElements
                elements={home.elements}
                pageTitle="home"
                extraProps={{ highlightedBooksElement: { highlightedBooks } }}
            />
        </Layout>
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