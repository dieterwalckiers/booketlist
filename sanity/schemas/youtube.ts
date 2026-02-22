const youtube = {
  name: 'youtube',
  type: 'object',
  title: 'YouTube Video',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'YouTube URL',
      validation: (Rule) => Rule.required(),
    },
  ],
}
export default youtube
