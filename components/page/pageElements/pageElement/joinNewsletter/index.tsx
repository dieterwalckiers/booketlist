import { Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react"
import H2 from "components/headings/h2";
import * as React from "react";

import { PageElementJoinNewsletter } from "../../../../../shared/contract";

interface IProps {
    element: PageElementJoinNewsletter;
}

const PageElementJoinNewsletter: React.FC<IProps> = ({ element }) => {
    return (
        <Stack border="1px solid black" padding={6} gap={2}>
            {element.title && (
                <H2 noMargin>{element.title}</H2>
            )}
            {element.caption && (
                <Text>{element.caption}</Text>
            )}
            {/* <Flex gap={2}>
                <Input placeholder="Your email address" width="40%" />
                <Button>{element.buttonText || "Subscribe Now"}</Button>
            </Flex> */}
            <Button
                width="400px"
                onClick={() => {
                    window.open("https://mailchi.mp/booketlistagency/subscribe-to-the-booketlist-newsletter", "_blank");
                }}
            >
                Sign up here to our monthly newsletter
            </Button>
        </Stack>
    );
}

export default PageElementJoinNewsletter;