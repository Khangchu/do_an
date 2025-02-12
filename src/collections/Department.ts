import { CollectionConfig } from 'payload'
import { Os_Field } from '@/fields/Fields_Department'

export const department: CollectionConfig = {
  slug: 'department',
  labels: {
    singular: ' Phòng ban',
    plural: 'Phòng ban',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      label: '',
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin phòng ban',
          fields: [
            {
              name: 'nameDepartment',
              label: 'Tên phòng ban',
              type: 'text',
            },
            {
              name: 'idDepartment',
              label: 'Mã phòng ban',
              type: 'text',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'Note',
              label: 'Mô tả',
              type: 'textarea',
            },
            {
              name: 'title',
              label: '',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
          ],
        },
        {
          label: 'Cơ cấu phòng ban',
          fields: [Os_Field],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return
        if (!data.idDepartment) {
          data.idDepartment = `ID-${Date.now()}${Math.floor(Math.random() * 10000)}`
        }
        data.title = `${data.idDepartment}-${data.nameDepartment || 'Unknown'}`
      },
    ],
  },
}
