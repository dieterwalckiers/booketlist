import BookGallery from "components/bookgallery";
import Layout from "components/layout";
import { fetchAllBookCategorySlugs, fetchBooksForCategorySlug, fetchMenuProps } from "helpers/fetching";

export default function BookCategoryPage({ navItems, settings, books }) {

    return (
        <Layout navItems={navItems} settings={settings}>
            {books && <BookGallery books={books} />}
        </Layout>
    )
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const books = await fetchBooksForCategorySlug(params.slug)
    return {
        props: {
            navItems,
            settings,
            books,
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