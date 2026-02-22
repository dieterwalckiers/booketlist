const blogPost = {
  name: 'blogPost',
  type: 'document',
  title: 'Blog Post',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      type: 'string',
      title: 'Author',
      initialValue: 'Sarah Claeys',
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      options: {
        placeholder: '(auto)',
      },
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      validation: (Rule) => Rule.max(300),
    },
    {
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date (Oldest)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      date: 'publishedAt',
      media: 'coverImage',
    },
    prepare({ title, author, date, media }) {
      return {
        title,
        subtitle: `${author || 'No author'} — ${
          date ? new Date(date).toLocaleDateString() : 'No date'
        }`,
        media,
      }
    },
  },
}

export default blogPost
