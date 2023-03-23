import { Box } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import H1 from "components/headings/h1";
import PageElements from "components/page/pageElements";
import React from "react";
import { Publisher } from "shared/contract";

interface Props {
    publisher: Publisher;
}

const PublisherOverview: React.FC<Props> = ({ publisher }) => {
    console.log("endering publisher", publisher);
    return (
        <Box id="publisher-overview">
            <H1>{publisher.name}</H1>
            <PageElements elements={publisher.elements} pageTitle="publisherInfo" />
        </Box>
    )
}

export default PublisherOverview