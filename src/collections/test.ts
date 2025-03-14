import { APIError, CollectionConfig } from 'payload'
export const Test1: CollectionConfig = {
  slug: 'test1',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          admin: {
            width: '45%',
          },
        },
        {
          name: 'value',
          label: 'Value',
          type: 'text',
          required: true,
          admin: {
            width: '45%',
          },
        },
      ],
    },
  ],
}
