import type { CollectionConfig } from 'payload'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { text } from 'stream/consumers'

export const Materials: CollectionConfig = {
  slug: 'materials',
  labels: {
    singular: 'Vật Liệu',
    plural: 'Vật Liệu',
  },
  admin: {
    useAsTitle: 'materialsName',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'materialsID',
      label: 'Mã Vật Liệu',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'materialsName',
      label: 'Tên Vật Liệu',
      type: 'text',
    },
    {
      name: 'tonkho',
      label: 'Tồn Kho',
      type: 'join',
      collection: 'Materials_Inventory',
      on: 'materialsID',
    },
    {
      name: 'supplier',
      label: 'Nhà Cung Cấp',
      type: 'join',
      collection: 'Suppliers',
      on: 'Imported materials',
    },
    {
      name: 'cost',
      label: 'giá',
      type: 'number',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.materialsID) {
          data.materialsID = `ID-${Date.now()}-${Math.floor(Math.random() * 10000)}`
        }
        return data
      },
    ],
  },
}
