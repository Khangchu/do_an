import { CollectionConfig } from 'payload'
export const Materials_Inventory: CollectionConfig = {
  slug: 'Materials_Inventory',
  labels: {
    singular: 'Kho Vật Liêu',
    plural: 'Kho Vật Liêu',
  },
  admin: {
    useAsTitle: '',
  },
  fields: [
    {
      name: 'inventoryId',
      label: 'ID Kho Hàng',
      type: 'text',
    },
    {
      name: 'materialsID',
      label: 'ID Sản Phẩm',
      type: 'relationship',
      relationTo: 'materials',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'amount',
          label: 'Số lượng',
          type: 'number',
          min: 0,
          validate: (value: unknown) => {
            if (!Number.isInteger(value)) {
              //giá trị nhập phải là số nguyên
              return 'Phải là số nguyên!'
            }
            return true
          },
        },
        {
          name: 'unit',
          label: 'Đơn Vị',
          type: 'select',
          options: [
            {
              label: 'Tấn',
              value: 'Tấn',
            },
            {
              label: 'Tạ',
              value: 'Tạ',
            },
            {
              label: 'Yến',
              value: 'Yến',
            },
            {
              label: 'Kg',
              value: 'Kg',
            },
          ],
        },
      ],
    },
    {
      name: 'location',
      label: 'Địa Chỉ',
      type: 'textarea',
    },
  ],
}
