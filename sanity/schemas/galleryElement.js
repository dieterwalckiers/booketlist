const galleryElement = {
  type: 'object',
  name: 'galleryElement',
  title: 'Gallery',
  fields: [
    {
      name: 'value',
      title: 'Array',
      type: 'array',
      of: [
        {
          type: 'galleryImage',
        },
      ],
    },
  ],
  preview: {
    select: {
      image: 'value.0.asset',
    },
    prepare(selection) {
      return {
        media: selection.image,
        title: 'Gallery',
      }
    },
  },
}

export default galleryElement
