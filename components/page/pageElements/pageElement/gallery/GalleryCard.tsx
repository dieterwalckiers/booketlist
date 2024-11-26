import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import React from "react";

import { client } from "../../../../../sanity/lib/client";

interface Props {
    imageData: any;
}

const GalleryCard: React.FC<Props> = ({
    imageData,
}) => {

    const imageProps: Record<string, any> = useNextSanityImage(
        client,
        imageData,
    );

    return (
        // <GridItem>
        //     <Image
        //         {...imageProps as any}
        //         style={{ width: "100%", height: 'auto' }}
        //         sizes="(max-width: 48em) 100vw,
        //                 600px"
        //         placeholder="blur"
        //         blurDataURL={imageData.asset.metadata.lqip}
        //         alt="" // TODO add alt text to cms
        //         // onClick={clickImg}
        //     />
        // </GridItem>
        // <Link
        //     href={`/books/${book.slug}`}
        //     as={NextLink}
        // >
        <Flex
            width={{ base: "100%", md: "250px" }}
            direction="column"
            justifyContent="center"
            alignItems="center"
            mx={{ base: 0, md: 6 }}
            my={{ base: 0, md: 6 }}
            cursor="pointer"
        >
            <Image
                {...imageProps as any}
                style={{ width: "100%", height: 'auto' }}
                sizes="(max-width: 48em) 100vw, 300px"
                placeholder="blur"
                blurDataURL={imageData.asset.metadata.lqip}
                alt="" // TODO add alt text to cms
            />
        </Flex>
        // </Link>

    )
}

export default GalleryCard;