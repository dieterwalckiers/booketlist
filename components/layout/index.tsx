import { Box, ChakraBaseProvider, Stack } from "@chakra-ui/react";
import Navbar from "components/navbar";
import { NavItem } from "components/navbar/contract";
import React, { useMemo } from "react";

import { client } from "../../sanity/lib/client";

interface Props {
    navItems: NavItem[];
    settings: any;
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ navItems, settings, children }) => {

    const logoData = useMemo(() => settings?.logo, [settings])

    return (
        <ChakraBaseProvider>
            <Stack
                direction="column"
                id="layout"
                width={{ base: "auto", md: "min(70vw, 1300px)" }}
                margin="auto"
            >
                <Navbar navItems={navItems} logoData={logoData} />
                <Box
                    id="content"
                    pt={{ base: 2, md: 4 }}
                    px={{ base: 4, md: 0 }}
                >
                    {children}
                </Box>
            </Stack>
        </ChakraBaseProvider>
    )
}

export default Layout;

