import { Box, Heading } from "@chakra-ui/react";
import H2 from "components/headings/h2";
import * as React from "react";

import { PageElementTitle } from "../../../../../shared/contract";

interface IProps {
    element: PageElementTitle;
}

const PageElement: React.FC<IProps> = ({ element }) => {
    const value = element?.value;
    return value && (
        <Box w="100%">
            <H2>
                {value}
            </H2>
        </Box>
    );
}

export default PageElement;