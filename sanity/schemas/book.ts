const book = {
    name: 'book',
    type: 'document',
    title: 'Book',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title'
        },
        {
            name: 'authors',
            type: "array",
            of: [{ type: "reference", to: { type: "author" } }],
        },
        {
            name: 'description',
            type: 'array',
            of: [{ type: 'block' }],
            title: "Description",
        },
        {
            name: 'cover',
            type: 'image',
            title: 'Cover',
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
                source: (doc, { parent }) => parent && parent.title,
                maxLength: 96
            },
            validation: Rule => Rule.required(),
        },
    ]
}
export default book