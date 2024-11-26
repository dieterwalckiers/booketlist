import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import * as React from "react";

import { client } from "../../../../../sanity/lib/client";
import { PageElementGallery } from "../../../../../shared/contract";
import GalleryCard from "./GalleryCard";

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

    return (
        <Box w="100%">
            <Flex
                direction={{ base: "column", md: "row" }}
                flexWrap="wrap"
                justifyContent="center"
            >
                {imageDatas.map((imageData, index) => {
                    return (
                        <GalleryCard
                            key={`gallery${index}`}
                            imageData={imageData}
                        />
                        //     <Image
                        //         // key={`gallery${index}`}
                        //         // src={asset.url}
                        //         // alt=""
                        //         // width={asset.width}
                        //         // height={asset.height}
                        //         {...imageProps as any}
                        //         style={{ width: "100%", height: 'auto', cursor: element.link ? "pointer" : "default" }}
                        //         sizes="(max-width: 48em) 100vw,
                        //             600px"
                        //         placeholder="blur"
                        //         blurDataURL={imageData.asset.metadata.lqip}
                        //         alt="" // TODO add alt text to cms
                        //         onClick={clickImg}
                        //     />
                        // </GalleryGridItem>
                    )
                })}
            </Flex>
        </Box >
    );
}

export default PageElement