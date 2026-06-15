import { ResizingImageInput } from '../components/ResizingImageInput'
import { imageSizeValidation, imageUploadHint } from '../lib/imageValidation'

const galleryImage = {
  type: 'object',
  name: 'galleryImage',
  title: 'Gallery image',
  fields: [
    {
      name: 'value',
      title: 'Image',
      type: 'image',
      description: imageUploadHint,
      validation: imageSizeValidation,
      components: { input: ResizingImageInput },
    },
    {
      name: 'link',
      title: 'Link',
      type: 'string',
    },
  ],
  preview: {
    select: {
      image: 'value.asset',
    },
    prepare(selection) {
      return {
        media: selection.image,
        title: ' ',
      }
    },
  },
}

export default galleryImage
