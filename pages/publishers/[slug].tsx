import Layout from "components/layout";
import PublisherOverview from "components/publisheroverview";
import { fetchAllPublisherSlugs, fetchMenuProps, fetchPublisher } from "helpers/fetching";
import Head from "next/head";

export default function PublisherPage({ navItems, settings, publisher }) {
    return (
        <>
            <Head>
                <title>{publisher.name} | Booketlist Agency</title>
            </Head>
            <Layout navItems={navItems} settings={settings}>
                {publisher && <PublisherOverview publisher={publisher} />}
            </Layout>
        </>

    )
}

export async function getStaticProps({ params }) {
    const { navItems, settings } = await fetchMenuProps();
    const publisher = await fetchPublisher(params.slug);
    return {
        props: {
            navItems,
            settings,
            publisher,
        }
    };
}

export async function getStaticPaths() {
    const allPublisherSlugs = await fetchAllPublisherSlugs();
    const paths = allPublisherSlugs.map((slug) => {
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