import { ChakraBaseProvider, Text,VStack } from "@chakra-ui/react"
import { buildNavItems } from "components/navbar/helpers";

import Navbar from "../components/navbar";
import { client } from "../sanity/lib/client";

export default function IndexPage({ books, navItems, settings }) {
  return (
    <ChakraBaseProvider>
      <VStack
        id="layout"
        width={{ base: "auto", md: "60vw" }}
        margin="auto"
      >
        <Navbar navItems={navItems} />
        <Text>
          Start something new 💖<br />
          titles in db: {(books || []).map((book) => book.title)}
        </Text>
      </VStack>
    </ChakraBaseProvider>
  )
}

export async function getStaticProps() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const books = await authClient.fetch(`*[_type == "book"]`);
  const settings = await authClient.fetch(`*[_type == "settings"]`);
  const publishers = await authClient.fetch(`*[_type == "publisher"]`);
  const navItems = buildNavItems(books, publishers);


  return {
    props: {
      books,
      navItems,
      settings,
    }
  };
}