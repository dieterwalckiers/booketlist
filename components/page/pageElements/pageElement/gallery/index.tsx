import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import * as React from "react";

import { client } from "../../../../../sanity/lib/client";
import { PageElementGallery } from "../../../../../shared/contract";
import GalleryCard from "./GalleryCard";
import { useMemo } from "react";

interface IProps {
    element: PageElementGallery;
}

const PageElement: React.FC<IProps> = ({ element }) => {

    console.log("gallery el", element);

    const imageDatas = element?.value ? (element.value as Array<any>) : [];
    // const imageProps: Record<string, any> = useNextSanityImage(
    //     client,
    //     imageData,
    // );

    // const clickImg = () => {
    //     if (!(element.link)) {
    //         return;
    //     }
    //     window.open(element.link, "_blank");
    // }

    console.log("imageDatas", imageDatas)

    const cardWidthMd = useMemo(() => {
        if (imageDatas.length === 1) {
            return "80%";
        }
        if (imageDatas.length === 2) {
            return "48%";
        }
        return "32%";
    }, [imageDatas.length]);

    return (
        <Box w="100%">
            <Flex
                direction={{ base: "column", md: "row" }}
                flexWrap="wrap"
                justifyContent={imageDatas.length === 1 ? "center": "space-between"}
                className="flx"
            >
                {imageDatas.map((imageData, index) => {
                    return (
                        <GalleryCard
                            key={`gallery${index}`}
                            imageData={imageData}
                            cardWidthMd={cardWidthMd}
                        />
                    )
                })}
            </Flex>
        </Box >
    );
}

export default PageElement