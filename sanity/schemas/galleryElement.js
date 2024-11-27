const galleryElement = {
  type: "object",
  name: "galleryElement",
  title: "Gallerij",
  fields: [
    {
      name: "value",
      title: "Array",
      type: "array",
      of: [
        {
          type: "image",
        },
      ],
    },
  ],
  preview: {
    select: {
      image: "value.0.asset",
    },
    prepare(selection) {
      return {
        media: selection.image,
        title: "Gallerij",
      };
    },
  },
};

export default galleryElement;