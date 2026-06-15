import { ResizingImageInput } from '../components/ResizingImageInput'
import { imageSizeValidation, imageUploadHint } from '../lib/imageValidation'

const settings = {
  name: 'settings',
  type: 'document',
  title: 'Settings',
  fields: [
    {
      name: 'logo',
      type: 'image',
      title: 'Logo',
      description: imageUploadHint,
      validation: imageSizeValidation,
      components: { input: ResizingImageInput },
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
}
export default settings
