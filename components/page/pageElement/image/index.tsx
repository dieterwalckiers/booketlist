import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import * as React from "react";

import { client } from "../../../../sanity/lib/client";
import { PageElementImage } from "../../../../shared/contract";

interface IProps {
    element: PageElementImage;
}

const PageElementImage: React.FC<IProps> = ({ element }) => {

    console.log("img el", element);

    const imageData = element?.value;
    const imageProps: Record<string, any> = useNextSanityImage(
        client,
        imageData,
    );

    return imageData && (
        <Box w="100%">
            <Image
                {...imageProps as any}
                style={{ width: "100%", height: 'auto' }}
                sizes="(max-width: 48em) 100vw,
                        600px"
                placeholder="blur"
                blurDataURL={imageData.asset.metadata.lqip}
                alt="" // TODO add alt text to cms
            />
        </Box >
    );
}

export default PageElementImage