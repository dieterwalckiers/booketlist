import Layout from "components/layout";
import Page from "components/page";
import { fetchAllPageSlugs, fetchMenuProps, fetchPage } from "helpers/fetching";

export default function PagePage({ navItems, settings, page }) {
    return (
        <Layout navItems={navItems} settings={settings}>
            {page && <Page page={page} />}
        </Layout>
    )
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const page = await fetchPage(params.slug);
    return {
        props: {
            navItems,
            settings,
            page,
        }
    };
}

export async function getStaticPaths() {
    const allPageSlugs = await fetchAllPageSlugs();
    const paths = allPageSlugs.map((slug) => {
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