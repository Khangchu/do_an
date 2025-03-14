import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { beforeChange, BeforeValidate } from '@/Hooks/HookProducts'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'nameProduct',
  },
  labels: {
    singular: 'Sản Phẩm',
    plural: 'Sản Phẩm',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'productID',
              label: 'ID Sản phẩm',
              type: 'text',
              admin: {
                readOnly: true,
                condition: (data) => {
                  if (!data?.productID) return false
                  return true
                },
              },
            },
            {
              name: 'nameProduct',
              label: 'Tên Sản Phẩm',
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
              name: 'category',
              label: 'Danh mmục',
              type: 'relationship',
              relationTo: 'categories',
              filterOptions: () => {
                return {
                  status: { equals: 'active' },
                }
              },
            },
            {
              name: 'subcategory',
              label: 'Danh mục con',
              type: 'relationship',
              relationTo: 'subCategories',
              filterOptions: async ({ data, req }) => {
                if (!data?.category) return false
                const categoryId =
                  typeof data.category === 'object' ? data.category.id : data.category
                const checkSubCategory = await req.payload.find({
                  collection: 'subCategories',
                  where: { 'parentCategory.id': { equals: categoryId } },
                })
                const checkOutParentCategory = checkSubCategory.docs.map((pc) =>
                  typeof pc.parentCategory === 'object' && pc.parentCategory !== null
                    ? pc.parentCategory.id
                    : pc.parentCategory,
                )
                return {
                  parentCategory: { in: checkOutParentCategory },
                }
              },
              admin: {
                condition: (data) => {
                  return !!data?.category
                },
              },
            },
            {
              name: 'origin',
              label: 'Xuất xứ',
              type: 'text',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: 'Giá',
                  type: 'number',
                  required: true,
                  validate: (value: unknown) => {
                    if (!value) {
                      return 'Không được để trống'
                    }
                    if (typeof value !== 'number') {
                      return 'Giá trị phải là chuỗi số'
                    }
                    return true
                  },
                },
                {
                  name: 'currency',
                  label: 'Loại tiền tệ',
                  type: 'select',
                  options: [
                    { label: 'USD', value: 'USD' },
                    { label: 'VND', value: 'VND' },
                  ],
                  defaultValue: 'VND',
                },
                {
                  name: 'previousCurrency',
                  type: 'text',
                  admin: { hidden: true },
                },
              ],
            },
          ],
          label: 'Thông tin chung',
        },
        {
          fields: [
            {
              name: 'material',
              label: 'Vật liệu',
              type: 'relationship',
              relationTo: 'materials',
              hasMany: true,
            },
            {
              name: 'sizes',
              type: 'array',
              label: 'Các kích cỡ',
              fields: [
                {
                  name: 'size',
                  type: 'text',
                  label: 'Kích cỡ',
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
              ],
            },
            {
              name: 'color',
              label: 'Màu Sắc',
              type: 'relationship',
              relationTo: 'colors',
              hasMany: true,
            },
            {
              name: 'specialfeatures',
              label: 'Tính năng đặc biệt',
              type: 'textarea',
            },
          ],
          label: 'Thông số kỹ thuật',
        },
        {
          fields: [
            {
              name: 'QualityStandards',
              label: 'Tiêu chuẩn chất lượng',
              type: 'array',
              fields: [
                {
                  name: 'nameCertificate',
                  label: 'Chứng nhận',
                  type: 'text',
                },
                {
                  name: 'img',
                  label: 'Minh chứng',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'Note',
                  label: 'Ghi chú',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'SafetyCertification',
              label: 'Chứng nhận an toàn',
              type: 'array',
              fields: [
                {
                  name: 'nameCertificate',
                  label: 'Chứng nhận',
                  type: 'text',
                },
                {
                  name: 'img',
                  label: 'Minh chứng',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'Note',
                  label: 'Ghi chú',
                  type: 'textarea',
                },
              ],
            },
          ],
          label: 'Tiêu chuẩn & Chứng nhận',
        },
        {
          fields: [
            {
              name: 'quantity',
              label: 'Tồn Kho',
              type: 'join',
              collection: 'Products_Inventory',
              on: 'catalogueOfGoods.productId',
            },
          ],
          label: 'Kho',
        },
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
            },
          ],
          label: 'Ghi Chú',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [beforeChange],
    beforeValidate: [BeforeValidate],
  },
}
