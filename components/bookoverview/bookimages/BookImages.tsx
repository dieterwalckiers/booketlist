import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useNextSanityImage } from 'next-sanity-image';
import React from "react";
import { Book } from "shared/contract";

import { client } from "../../../sanity/lib/client";
import BookImageThumb from "./BookImageThumb";

interface Props {
    book: Book;
}

const BookImages: React.FC<Props> = ({
    book,
}) => {

    const [activeImageIndex, setActiveImageIndex] = React.useState(0);

    const additionalImages = book.additionalImages || [];
    const allImages = [
        ...(book.cover ? [book.cover] : []),
        ...additionalImages
    ];

    const activeImageProps: Record<string, any> = useNextSanityImage(
        client,
        allImages[activeImageIndex],
    );

    return (
        <Box>
            {book.cover?.asset && (
                <Image
                    {...activeImageProps as any}
                    style={{ width: "100%", height: 'auto' }}
                    sizes="(max-width: 48em) 100vw,
                        33vw"
                    placeholder="blur"
                    blurDataURL={book.cover.asset.metadata.lqip}
                    alt={`Cover for ${book.title}`}
                />
            )}
            {allImages.length > 1 && (
                <Flex mt={4}>
                    {allImages.map((image, index) => {
                        return (
                            <BookImageThumb
                                key={`bi${index}`}
                                image={image}
                                bookTitle={book.title}
                                index={index}
                                onClick={setActiveImageIndex}
                                isActive={index === activeImageIndex}
                            />
                        )
                    })
                    }
                </Flex>
            )}
        </Box>
    )
}

export default BookImages