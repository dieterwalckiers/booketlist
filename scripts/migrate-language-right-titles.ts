/**
 * Migration script: populates the `title` field on all languageRight documents.
 *
 * Usage:
 *   npx sanity exec scripts/migrate-language-right-titles.ts --with-user-token
 *
 * This requires you to be logged in to the Sanity CLI (`npx sanity login`).
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

const getLanguageLbl = (code: string) => {
  const names = new Intl.DisplayNames(['en'], { type: 'language' })
  return names.of(code)
}

async function migrate() {
  const docs = await client.fetch<
    { _id: string; languageCode: string; title?: string }[]
  >(`*[_type == "languageRight"]{ _id, languageCode, title }`)

  const toUpdate = docs.filter((doc) => {
    if (!doc.languageCode) return false
    const expected = getLanguageLbl(doc.languageCode)
    return doc.title !== expected
  })

  if (toUpdate.length === 0) {
    console.log('All languageRight documents already have correct titles.')
    return
  }

  console.log(`Updating ${toUpdate.length} languageRight document(s)...`)

  const transaction = client.transaction()

  for (const doc of toUpdate) {
    const title = getLanguageLbl(doc.languageCode)
    console.log(`  ${doc._id}: "${doc.languageCode}" → "${title}"`)
    transaction.patch(doc._id, (patch) => patch.set({ title }))
  }

  await transaction.commit()
  console.log('Done.')
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
