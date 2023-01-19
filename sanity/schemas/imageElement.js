const imageElement = {
  type: "object",
  name: "imageElement",
  title: "Image element",
  fields: [
    {
      name: "value",
      title: "Image",
      type: "image",
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