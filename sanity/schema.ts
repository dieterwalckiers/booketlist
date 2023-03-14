import { SchemaTypeDefinition } from "sanity";

import author from "./schemas/author";
import book from "./schemas/book";
import bookCategory from "./schemas/bookCategory";
import imageElement from "./schemas/imageElement";
import languageRight from "./schemas/languageRight";
import page from "./schemas/page";
import publisher from "./schemas/publisher";
import richTextElement from "./schemas/richTextElement";
import settings from "./schemas/settings";
import titleElement from "./schemas/titleElement";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    settings,
    book,
    bookCategory,
    author,
    publisher,
    page,
    richTextElement,
    imageElement,
    titleElement,
    languageRight,
  ],
}
