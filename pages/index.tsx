import { ChakraBaseProvider, Stack, Text } from "@chakra-ui/react";
import { Raleway } from "@next/font/google";
import { buildNavItems } from "components/navbar/helpers";
import { useEffect, useMemo } from "react";

import Navbar from "../components/navbar";
import { client } from "../sanity/lib/client";

export default function IndexPage({ books, navItems, settings }) {

  const logoData = useMemo(() => settings?.logo, [settings])
  useEffect(() => console.log("logoData", logoData), [logoData]);

  return (
    <ChakraBaseProvider>
      <Stack
        direction="column"
        id="layout"
        width={{ base: "auto", md: "min(65vw, 1600px)" }}
        margin="auto"
      >
        <Navbar navItems={navItems} logoData={logoData} />
        <Text>
          Start something new 💖<br />
          titles in db: {(books || []).map((book) => book.title)}
        </Text>
      </Stack>
    </ChakraBaseProvider>
  )
}

export async function getStaticProps() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const books = await authClient.fetch(`*[_type == "book"]`);
  const settings = await authClient.fetch(`
    *[_type == "settings"][0] {
      logo {
        asset->{
          ...,
          metadata
        }
      }
    }
  `);
  const publishers = await authClient.fetch(`*[_type == "publisher"]`);
  const navItems = buildNavItems(books, publishers);

  console.log("settings", settings);

  return {
    props: {
      books,
      navItems,
      settings,
    }
  };
}