import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import React from "react";

import { client } from "../../../sanity/lib/client";

interface Props {
    bookTitle: string,
    image: any;
    index: number;
    onClick: (index: number) => void;
    isActive?: boolean;
}

const BookImageThumb: React.FC<Props> = ({
    bookTitle,
    image,
    index,
    onClick,
    isActive,
}) => {

    const bookImageProps: Record<string, any> = useNextSanityImage(
        client,
        image,
    );

    const buildOnClick = () => {
        return () => {
            onClick(index);
        }
    }

    return (
        <Box
            style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: isActive ? "2px solid #ef4e41" : "1px solid #ccc",
                cursor: "pointer",
            }}
            m={1}
            p={1}
            onClick={buildOnClick()}
        >
            {image.asset && (
                <Image
                    {...bookImageProps as any}
                    sizes="100px"
                    placeholder="blur"
                    blurDataURL={image.asset.metadata.lqip}
                    alt={`Image for ${bookTitle}`}
                />
            )}
        </Box>
    )
}

export default BookImageThumb