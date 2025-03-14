import type { CollectionConfig } from 'payload'

export const Products_Inventory: CollectionConfig = {
  slug: 'Products_Inventory',
  admin: {
    useAsTitle: '',
  },
  labels: {
    singular: 'Kho Sản Phẩm',
    plural: 'Kho Sản Phẩm',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin kho hàng',
          fields: [
            {
              name: 'inventoryId',
              label: 'ID Kho Hàng',
              type: 'text',
              unique: true,
            },
            {
              name: 'address',
              label: 'Địa chỉ',
              type: 'text',
            },
            {
              name: 'employee',
              label: 'Người quản lý',
              type: 'relationship',
              relationTo: 'users',
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
            {
              name: 'area',
              label: 'Diên tích kho',
              type: 'text',
            },
          ],
        },
        {
          label: 'Sản phẩm',
          fields: [
            {
              name: 'catalogueOfGoods',
              label: 'Danh mục hàng hóa',
              type: 'array',
              fields: [
                {
                  name: 'productId',
                  label: 'ID Sản Phẩm',
                  type: 'relationship',
                  relationTo: 'products',
                },
                {
                  name: 'danhmuc',
                  type: 'group',
                  label: '',
                  fields: [
                    {
                      name: 'amount',
                      label: 'Số lượng',
                      type: 'number',
                    },
                    {
                      name: 'unti',
                      label: 'Đơn vị tính',
                      type: 'select',
                      options: [
                        { label: 'Cái', value: 'cai' },
                        { label: 'Bộ', value: 'bo' },
                        { label: 'Đôi', value: 'doi' },
                      ],
                    },
                  ],
                },
                {
                  name: 'cost',
                  label: '',
                  type: 'group',
                  fields: [
                    {
                      name: 'importPrice',
                      label: 'Giá nhập',
                      type: 'number',
                      admin: {
                        width: 50,
                      },
                    },
                    {
                      name: 'unitPrice',
                      label: 'Đơn vị',
                      type: 'select',
                      options: [
                        { value: 'VND', label: 'VND' },
                        { value: 'USD', label: 'USD' },
                      ],
                      admin: {
                        width: 50,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
