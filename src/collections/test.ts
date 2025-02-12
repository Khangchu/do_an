import { APIError, CollectionConfig } from 'payload'
export const Test1: CollectionConfig = {
  slug: 'test1',
  admin: {
    useAsTitle: 'test',
  },
  fields: [
    {
      name: 'test',
      label: 'name',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      unique: true, // Đảm bảo email là duy nhất
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        const { name } = data
        console.log('check', name)
      },
    ],
  },
}
