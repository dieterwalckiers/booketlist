import { Box } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import H1 from "components/headings/h1";
import React from "react";
import { Publisher } from "shared/contract";

interface Props {
    publisher: Publisher;
}

const PublisherOverview: React.FC<Props> = ({ publisher }) => {
    return (
        <Box id="publisher-overview">
            <H1>{publisher.name}</H1>
            <PortableText value={publisher.pageContent} />
        </Box>
    )
}

export default PublisherOverview