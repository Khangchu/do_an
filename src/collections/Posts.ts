import { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "category",
      label: "Danh mục",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
  ],
};
