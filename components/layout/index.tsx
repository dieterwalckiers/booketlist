import { Box, ChakraProvider, Stack } from "@chakra-ui/react";
import Footer from "components/footer/Footer";
import Navbar from "components/navbar";
import { NavItem } from "components/navbar/contract";
import React, { useMemo } from "react";

import theme from "../../theme";

interface Props {
    navItems: NavItem[];
    settings: any;
    children: React.ReactNode;
    alignLeft?: boolean
}

const Layout: React.FC<Props> = ({ navItems, settings, children, alignLeft }) => {

    const logoData = useMemo(() => settings?.logo, [settings])

    return (
        <ChakraProvider theme={theme}>
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
                    display="flex"
                    justifyContent={alignLeft ? "flex-start" : "center"}
                >
                    {children}
                </Box>
            </Stack>
            <Footer />
        </ChakraProvider>
    )
}

export default Layout;
