import { type CollectionConfig } from 'payload'
import { hero, employee, Skill, WorkTime } from '@/fields/Fields_User'
import { CheckValueUsers, BeforeValidateUser } from '@/Hooks/CheckValueUsees'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'title',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'userID',
              label: 'User ID',
              type: 'text',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'fullName',
              label: 'Họ và Tên',
              type: 'text',
              required: true,
            },
            {
              name: 'sex',
              label: 'Giới Tính',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Nam',
                  value: 'Nam',
                },
                {
                  label: 'Nữ',
                  value: 'Nữ',
                },
              ],
            },
            {
              name: 'ID',
              label: 'Căn cước công dân',
              type: 'text',
              required: true,
              validate: (value: unknown) => {
                if (typeof value !== 'string') {
                  return 'Giá trị phải là chuỗi số'
                }
                const regex = /^(\d{9}|\d{12})$/
                return regex.test(value) ? true : 'Căn Cước gồm 9 hoặc 12 số'
              },
            },
            {
              name: 'Date_of_birth',
              label: 'Ngày Sinh',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'd MMM yyy',
                },
              },
            },
            {
              name: 'address',
              label: 'Địa Chỉ',
              type: 'text',
            },
            {
              name: 'phone',
              label: 'Số Điện Thoại',
              type: 'text',
              validate: (value: unknown) => {
                if (typeof value !== 'string') {
                  return 'Giá trị phải là chuỗi số'
                }
                const regex = /^0\d{9}$/
                return regex.test(value) ? true : 'Số điện thoại gồm 10 số'
              },
            },
          ],
          label: 'Thông Tin Cá Nhân',
        },
        {
          fields: [hero],
          label: 'Học Vấn',
          admin: {
            condition: () => false,
          },
        },
        {
          fields: [Skill],
          label: 'Kỹ Năng',
        },
        {
          fields: [employee],
          label: 'Nhân Sự',
        },
        {
          fields: [WorkTime],
          label: 'Đăng Ký lịch làm',
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [BeforeValidateUser],
    beforeChange: [CheckValueUsers],
  },
}
