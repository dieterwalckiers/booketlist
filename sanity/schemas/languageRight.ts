import { LanguageSelector } from "../components/LanguageSelector";

const getLanguageLbl = (code: string) => {
    const names = new Intl.DisplayNames(["en"], { type: 'language' });
    return names.of(code);
}

const languageRight = {
    name: 'languageRight',
    type: 'document',
    title: 'Language right',
    fields: [
        {
            name: 'languageCode',
            type: 'string',
            title: 'Language code',
            // validation: Rule => Rule.required(),
            components: {
                input: LanguageSelector,
            },
        }
    ],
    preview: {
        select: {
            languageCode: "languageCode"
        },
        prepare(selection) {
            return {
                title: getLanguageLbl(selection.languageCode),
            };
        }
    }
}
export default languageRight;