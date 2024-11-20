const home = {
    type: "document",
    name: "home",
    title: "Home",
    fields: [
        {
            name: "elements",
            title: "Elements",
            type: "array",
            of: [
                { type: "richTextElement" },
                { type: "imageElement" },
                { type: "titleElement" },
                { type: "highlightedBooksElement" },
                { type: "joinNewsletterElement" },
            ]
        },
    ],
};
export default home;