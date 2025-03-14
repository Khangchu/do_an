import { Field } from 'payload'

export const material: Field = {
  name: 'material',
  label: '',
  type: 'group',
  fields: [
    {
      type: 'array',
      name: 'listMaterial',
      fields: [
        {
          name: 'materialName',
          label: 'Vật liệu',
          type: 'relationship',
          relationTo: 'materials',
        },
        {
          name: 'suppliers',
          label: 'Nhà cung cấp',
          type: 'relationship',
          relationTo: 'Suppliers',
        },
        {
          name: 'soluong',
          label: 'Số lượng',
          type: 'number',
        },
      ],
    },
  ],
}
