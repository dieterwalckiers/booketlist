import { LanguageRightForm } from '../components/LanguageRightForm'
import { LanguageSelector } from '../components/LanguageSelector'

const getLanguageLbl = (code: string) => {
  const names = new Intl.DisplayNames(['en'], { type: 'language' })
  return names.of(code)
}

const languageRight = {
  name: 'languageRight',
  type: 'document',
  title: 'Language right',
  components: {
    input: LanguageRightForm,
  },
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      hidden: true,
    },
    {
      name: 'languageCode',
      type: 'string',
      title: 'Language code',
      // validation: Rule => Rule.required(),
      components: {
        input: LanguageSelector,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      languageCode: 'languageCode',
    },
    prepare(selection: { title?: string; languageCode?: string }) {
      return {
        title: selection.title || getLanguageLbl(selection.languageCode || ''),
      }
    },
  },
}
export default languageRight
