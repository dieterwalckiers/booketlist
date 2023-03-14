const book = {
    name: 'book',
    type: 'document',
    title: 'Book',
    fields: [
        {
            name: 'bookCategory',
            type: "reference", to: { type: "bookCategory" },
        },
        {
            name: 'title',
            type: 'string',
            title: 'Title',
            validation: Rule => Rule.required(),
        },
        {
            name: 'authors',
            type: "array",
            of: [{ type: "reference", to: { type: "author" } }],
        },
        {
            name: 'illustrators',
            type: "array",
            of: [{ type: "reference", to: { type: "author" } }],
        },
        {
            name: 'publisher',
            type: "reference", to: { type: "publisher" },
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
            name: "age",
            type: "number",
            title: "Age",
        },
        {
            name: 'languageRights',
            type: "array",
            of: [{ type: "languageRight" }],
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