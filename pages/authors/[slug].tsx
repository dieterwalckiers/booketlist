import AuthorOverview from "components/authoroverview";
import Layout from "components/layout";
import { fetchAllAuthorSlugs, fetchAuthorWithBooks, fetchMenuProps } from "helpers/fetching";

export default function AuthorPage({ navItems, settings, author }) {
    return (
        <Layout navItems={navItems} settings={settings}>
            {author && <AuthorOverview author={author} />}
        </Layout>
    )
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const author = await fetchAuthorWithBooks(params.slug);
    return {
        props: {
            navItems,
            settings,
            author,
        }
    };
}

export async function getStaticPaths() {
    const allAuthorSlugs = await fetchAllAuthorSlugs();
    const paths = allAuthorSlugs.map((slug) => {
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