import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'


const bookCategory = {
    name: 'bookCategory',
    type: 'document',
    title: 'Book category',
    orderings: [orderRankOrdering],
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
        orderRankField({ type: "bookCategory" }),
    ]
}
export default bookCategory