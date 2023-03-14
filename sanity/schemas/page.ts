const page = {
    type: "document",
    name: "page",
    title: "Page",
    fields: [
        {
            name: "title",
            type: "string",
            title: "Title",
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
                source: (doc, { parent }) => parent && parent.title,
                maxLength: 96
            },
            validation: Rule => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: "title"
        },
        prepare(selection) {
            const { title } = selection;
            return {
                title: `Page: ${title}`
            };
        }
    }
};
export default page;