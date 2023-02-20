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
export default author