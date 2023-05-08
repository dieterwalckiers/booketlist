const imageElement = {
  type: "object",
  name: "imageElement",
  title: "Afbeelding",
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