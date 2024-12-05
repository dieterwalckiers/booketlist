const imageElement = {
  type: "object",
  name: "imageElement",
  title: "Image",
  fields: [
    {
      name: "value",
      title: "Image",
      type: "image",
    },
    {
      name: "link",
      title: "Link",
      type: "string",
    },
    {
      name: "widthPercentage",
      title: "With percentage",
      type: "number",
      validation: Rule => Rule.min(1).max(100),
    },
  ],
  preview: {
    select: {
      image: "value.asset"
    },
    prepare(selection) {
      return {
        media: selection.image,
        title: " "
      };
    }
  }
};

export default imageElement;