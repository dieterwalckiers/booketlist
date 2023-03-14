import React from "react"

const richTextElement = {
  type: "object",
  name: "richTextElement",
  title: "Tekst",
  fields: [
    {
      name: "value",
      title: "Content",
      type: "array",
      of: [{
        type: "block",
      }],
    },
  ],
  preview: {
    select: {
      value: "value",
    },
    prepare(selection) {
      const block = (selection.value || []).find(block => block._type === "block")
      let title = block
        ? block.children
          .filter(child => child._type === "span")
          .map(span => span.text)
          .join("") :
        "";
      title += "...";
      return {
        media: <span>txt</span>,
        title,
      };
    }
  }
};

export default richTextElement;