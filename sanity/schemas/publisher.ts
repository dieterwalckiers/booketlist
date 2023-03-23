const book = {
    name: 'publisher',
    type: 'document',
    title: 'Publisher',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name'
        },
        {
            name: "elements",
            title: "Elements",
            type: "array",
            of: [
                { type: "richTextElement" },
                { type: "imageElement" },
                { type: "titleElement" },
            ]
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
                source: (doc, { parent }) => parent && parent.name,
                maxLength: 96
            },
            validation: Rule => Rule.required(),
        },
    ]
}
export default book