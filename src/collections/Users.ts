import { type CollectionConfig } from 'payload'
import { hero, employee, Skill, WorkTime } from '@/fields/Fields_User'
import { CheckValueUsers, BeforeValidateUser } from '@/Hooks/CheckValueUsees'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'title',
    group: 'nhan su',
  },
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
    },
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
              validate: (value: unknown) => {
                if (!value) {
                  return 'Không được để trống'
                }
                if (typeof value !== 'string') {
                  return 'Giá trị phải là chuỗi số'
                }
                return true
              },
            },
            {
              name: 'sex',
              label: 'Giới Tính',
              type: 'select',
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
              validate: (value: unknown) => {
                if (!value) {
                  return 'Không được để trống'
                }
                if (typeof value !== 'string') {
                  return 'Giá trị phải là chuỗi số'
                }
                return true
              },
            },
            {
              name: 'ID',
              label: 'Căn cước công dân',
              type: 'text',
              validate: (value: unknown) => {
                if (!value) {
                  return 'Không được để trống'
                }
                if (typeof value !== 'string') {
                  return 'Giá trị phải là chuỗi số'
                }
                const regex = /^(\d{9}|\d{12})$/
                if (!regex.test(value)) {
                  return 'Căn Cước phải gồm 9 hoặc 12 số'
                }
                return true // Trả về true nếu hợp lệ
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
              validate: (value: unknown) => {
                if (!value) {
                  return 'Không được để trống'
                }

                if (typeof value !== 'string') {
                  return 'Giá trị phải là chuỗi ngày tháng'
                }
                const birthDate = new Date(value)
                const today = new Date()
                const age = today.getFullYear() - birthDate.getFullYear()
                const monthDiff = today.getMonth() - birthDate.getMonth()
                const dayDiff = today.getDate() - birthDate.getDate()
                if (
                  age < 18 ||
                  (age === 18 && monthDiff < 0) ||
                  (age === 18 && monthDiff === 0 && dayDiff < 0)
                ) {
                  return 'Bạn phải đủ 18 tuổi'
                }
                return true
              },
            },
            {
              name: 'address',
              label: 'Địa Chỉ',
              type: 'text',
              validate: (value: unknown) => {
                if (!value) {
                  return 'Không được để trống'
                }
                if (typeof value !== 'string') {
                  return 'Giá trị phải là chuỗi số'
                }
                return true
              },
            },
            {
              name: 'phone',
              label: 'Số Điện Thoại',
              type: 'text',
              validate: (value: unknown) => {
                if (!value) {
                  return 'Không được để trống'
                }
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
