import { Box, Flex } from "@chakra-ui/react";

import { Page } from "../../shared/contract";
import PageElement from "./pageElement";

interface Props {
    page: Page;
}

const Page: React.FC<Props> = ({ page }) => {
    return (
        <Flex direction="column" alignItems="center">
            {(page.elements || []).map((e, i) => <PageElement pageElement={e} key={`page${page.title}El${i}`} />)}
        </Flex>
    );
}

export default Page