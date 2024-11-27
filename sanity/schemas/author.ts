const author = {
    name: 'author',
    type: 'document',
    title: 'Author',
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
                { type: "galleryElement" },
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
        {
            name: 'showInMenu',
            type: 'boolean',
            title: 'Show in author menu',
        }
    ]
}
export default author