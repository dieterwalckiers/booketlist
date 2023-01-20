import { Stack } from "@chakra-ui/react";
import Image from 'next/image';
import { useNextSanityImage } from "next-sanity-image";
import React from "react";

import { client } from "../../../sanity/lib/client";

interface IProps {
    logoData: any;
}

const Logo: React.FC<IProps> = ({ logoData }) => {

    const logoImageProps: Record<string, any> = useNextSanityImage(
        client,
        logoData,
    );

    return (
        <Stack id="logo" width="300px" height="auto">
            {logoData && (
                <Image
                    {...logoImageProps as any}
                    style={{ width: '300px', height: 'auto' }}
                    sizes="300px"
                    placeholder="blur"
                    blurDataURL={logoData.asset.metadata.lqip}
                    alt="Booketlist"
                />
            )}
        </Stack>
    )
}

export default Logo