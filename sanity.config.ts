/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

// see https://www.sanity.io/docs/api-versioning for how versioning works
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schema';

const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set(["home", "settings"]);

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  //edit schemas in './sanity/schema'
  plugins: [
    deskTool({
      structure: (S) => S.list()
        .title("Content")
        .items([
          S.listItem()
            .title("Home")
            .id("home")
            .child(
              // Instead of rendering a list of documents, we render a single
              // document, specifying the `documentId` manually to ensure
              // that we're editing the single instance of the document
              S.document()
                .schemaType("home")
                .documentId("home")
            ),
          S.listItem()
            .title("Settings")
            .id("settings")
            .child(
              // same as home (singleton)
              S.editor()
                .schemaType("settings")
                .documentId("settings")
            ),
          S.listItem()
            .title("Pages")
            .child(
              S.documentTypeList("page")
            ),
          S.listItem()
            .title("Book categories")
            .child(
              S.documentTypeList("bookCategory")
            ),
          S.listItem()
            .title("Books")
            .child(
              S.documentTypeList("book")
            ),
          S.listItem()
            .title("Authors & Illustrators")
            .child(
              S.documentTypeList("author")
            ),
          S.listItem()
            .title("Publishers")
            .child(
              S.documentTypeList("publisher")
            ),

        ])
    }),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schema.types,
    // Filter out singleton types from the global “New document” menu options
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
