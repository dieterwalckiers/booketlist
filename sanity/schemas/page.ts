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
            ]
        }
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