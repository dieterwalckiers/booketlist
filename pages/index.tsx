import { useEffect, useState } from "react";

import { client } from "../sanity/lib/client";

export default function IndexPage({ books }) {

  return (
    <>
      Start something new 💖<br />
      titles in db: {(books || []).map((book) => book.title)}
    </>
  )
}

export async function getStaticProps() {
  const authClient = client.withConfig({ useCdn: true, token: process.env.SANITY_API_READ_TOKEN })
  const books = await authClient.fetch(`*[_type == "book"]`);
  return {
    props: {
      books,
    }
  };
}