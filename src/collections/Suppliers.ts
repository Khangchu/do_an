import { CollectionConfig } from 'payload'

export const Suppliers: CollectionConfig = {
  slug: 'Suppliers',
  labels: {
    singular: 'Nhà Cung Cấp',
    plural: 'Nhà Cung Cấp',
  },
  admin: {
    useAsTitle: '',
  },
  fields: [
    {
      name: 'name',
      label: 'Tên Công Ty',
      type: 'text',
    },
    {
      name: 'ad',
      label: 'Tên Tiếng Anh',
      type: 'text',
    },
    {
      name: 'address',
      label: 'Địa Chỉ',
      type: 'text',
    },
    {
      name: 'sdt',
      label: 'Số Điện Thoại',
      type: 'text',
      validate: (value: unknown) => {
        if (typeof value !== 'string') {
          return 'Giá trị phải là chuỗi số'
        }
        const regex = /^0\d{9}$/
        return regex.test(value) ? true : 'Số điện thoại không hợp lệ!'
      },
    },

    {
      name: 'fax',
      label: 'Số Fax',
      type: 'number',
      min: 0,
      validate: (value: unknown) => {
        if (!Number.isInteger(value)) {
          return 'Phải là số nguyên!'
        }
        return true
      },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'webside',
      label: 'Webside',
      type: 'text',
      validate: (value: unknown) => {
        if (typeof value !== 'string') return 'Giá trị không hợp lệ'

        // Biểu thức chính quy để kiểm tra URL hợp lệ
        const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

        return regex.test(value) ? true : 'Vui lòng nhập một URL hợp lệ'
      },
    },
    {
      name: 'Imported materials',
      label: 'Nhập Vật Liệu',
      type: 'relationship',
      relationTo: 'materials',
      hasMany: true,
    },
  ],
}
