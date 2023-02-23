/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

// see https://www.sanity.io/docs/api-versioning for how versioning works
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schema'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  //edit schemas in './sanity/schema'
  schema,
  plugins: [
    deskTool({
      structure: (S) => S.list()
        .title("Content")
        .items([
          S.listItem()
            .title("Settings")
            .child(
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
})
