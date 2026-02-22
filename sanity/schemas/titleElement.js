const titleElement = {
  type: 'object',
  name: 'titleElement',
  title: 'Titel',
  fields: [
    {
      name: 'value',
      title: 'Titel',
      type: 'string',
    },
  ],
  preview: {
    select: {
      value: 'value',
    },
    prepare(selection) {
      return {
        title: selection.value,
        media: <span>H2</span>,
      }
    },
  },
}

export default titleElement
