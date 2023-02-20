import Layout from "components/layout";
import { fetchMenuProps } from "helpers/fetching";

export default function IndexPage({ navItems, settings }) {

    return (
        <Layout navItems={navItems} settings={settings}>
            Home joepie
        </Layout>
    )
}

export async function getStaticProps() {
    const { navItems, settings } = await fetchMenuProps();
    return {
        props: {
            navItems,
            settings,
        }
    };
}