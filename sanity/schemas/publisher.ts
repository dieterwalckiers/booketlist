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
            name: 'pageContent',
            type: 'array',
            of: [{ type: 'block' }],
            title: 'Page content'
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