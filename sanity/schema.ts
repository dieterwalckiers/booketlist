import { SchemaTypeDefinition } from "sanity";

import author from "./schemas/author";
import book from "./schemas/book";
import imageElement from "./schemas/imageElement";
import page from "./schemas/page";
import publisher from "./schemas/publisher";
import richTextElement from "./schemas/richTextElement";
import settings from "./schemas/settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    settings,
    book,
    author,
    publisher,
    page,
    richTextElement,
    imageElement,
  ],
}
