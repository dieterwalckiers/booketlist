import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import * as React from "react";

import { client } from "../../../../../sanity/lib/client";
import { PageElementImage } from "../../../../../shared/contract";

interface IProps {
    element: PageElementImage;
}

const PageElement: React.FC<IProps> = ({ element }) => {

    const imageData = element?.value;

    const imageProps: Record<string, any> = useNextSanityImage(
        client,
        imageData,
    );

    const clickImg = () => {
        if (!(element.link)) {
            return;
        }
        window.open(element.link, "_blank");
    }

    const width = element.widthPercentage ? `${element.widthPercentage}%` : "100%";

    return imageData?.asset && (
        <Flex w="100%" justifyContent="center" >
            <Image
                {...imageProps as any}
                style={{ width, height: 'auto', cursor: element.link ? "pointer" : "default" }}
                sizes="(max-width: 48em) 100vw,
                        600px"
                placeholder="blur"
                blurDataURL={imageData.asset.metadata.lqip}
                alt="" // TODO add alt text to cms
                onClick={clickImg}
            />
        </Flex >
    );
}

export default PageElement