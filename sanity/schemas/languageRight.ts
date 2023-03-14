const languageRight = {
    name: 'languageRight',
    type: 'document',
    title: 'Language right',
    fields: [
        {
            name: 'languageCode',
            type: 'string',
            title: 'Language code',
            validation: Rule => Rule.required(),
        },
        {
            name: 'isSold',
            type: 'boolean',
            title: 'Is sold',
        },
    ]
}
export default languageRight;