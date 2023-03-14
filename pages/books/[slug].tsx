import BookOverview from "components/bookoverview";
import Layout from "components/layout";
import { fetchAllBookSlugs, fetchBook, fetchMenuProps } from "helpers/fetching";

export default function BookPage({ navItems, settings, book }) {

    return (
        <Layout navItems={navItems} settings={settings}>
            {book && <BookOverview book={book} />}
        </Layout>
    )
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const book = await fetchBook(params.slug);
    return {
        props: {
            navItems,
            settings,
            book,
        }
    };
}

export async function getStaticPaths() {
    const allBookSlugs = await fetchAllBookSlugs();
    const paths = allBookSlugs.map((slug) => {
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