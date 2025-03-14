/* eslint-disable @typescript-eslint/no-explicit-any */
import { CollectionConfig } from 'payload'
import {
  priceProduct,
  totalValueProduce,
  setUpdateSoluong,
  checkValueSoluong,
  rondomID,
  checkValue,
} from '@/Hooks/HookWarehousing'
export const goodsDeliveryNote: CollectionConfig = {
  slug: 'goodsDeliveryNote',
  labels: {
    singular: 'Xuất kho',
    plural: 'Xuất kho',
  },
  admin: {
    useAsTitle: 'goodsDeliveryNoteID',
  },
  fields: [
    {
      name: 'saved',
      type: 'checkbox',
      label: 'Đã lưu',
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
              name: 'goodsDeliveryNoteID',
              label: 'Mã phiếu Xuất',
              type: 'text',
              admin: {
                condition: (data) => {
                  if (!data.goodsDeliveryNoteID) return false
                  return true
                },
                readOnly: true,
              },
            },
            {
              name: 'date',
              label: 'Ngày nhập',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'd MMM yyyy',
                },
              },
            },
            {
              name: 'inventory',
              label: 'Kho hàng',
              type: 'relationship',
              relationTo: 'Products_Inventory',
            },
            {
              name: 'shipper',
              label: 'Người giao hàng',
              type: 'text',
            },
            {
              name: 'employee',
              label: 'Người nhận hàng',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'voucherMaker',
              label: 'Người lập phiếu',
              type: 'relationship',
              relationTo: 'users',
            },
          ],
          label: 'Thông Tin Phiếu Xuất',
        },
        {
          label: 'Sản phẩm Xuất',
          fields: [
            {
              name: 'produce',
              type: 'array',
              fields: [
                {
                  name: 'sanpham',
                  label: 'Sản phẩm',
                  type: 'relationship',
                  relationTo: 'products',
                  admin: {
                    condition: (data) => {
                      if (!data.inventory) return false
                      return true
                    },
                  },
                  filterOptions: async ({ data, req }) => {
                    if (data.inventory) {
                      const inventory = await req.payload.findByID({
                        collection: 'Products_Inventory',
                        id: data.inventory,
                      })
                      const checkout = inventory?.catalogueOfGoods?.flatMap((dt) => dt.productId)
                      const checkoutId = checkout?.flatMap((dt) =>
                        typeof dt === 'object' && dt !== null ? dt.id : dt,
                      )
                      return {
                        id: { in: checkoutId },
                      }
                    }
                    return true
                  },
                },
                {
                  name: 'soluong',
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
                {
                  name: 'cost',
                  label: 'Đơn giá',
                  type: 'number',
                  admin: {
                    condition: (data) => {
                      if (!data.goodsDeliveryNoteID) return false
                      return true
                    },
                    readOnly: true,
                  },
                },
                {
                  name: 'rate',
                  label: 'Tiền ',
                  type: 'text',
                  admin: {
                    condition: (data) => {
                      if (!data.goodsDeliveryNoteID) return false
                      return true
                    },
                    readOnly: true,
                  },
                },
                {
                  name: 'total',
                  label: 'Thành tiền',
                  type: 'number',
                  admin: {
                    condition: (data) => {
                      return data.produce?.some((dt: any) => dt.rate && dt.cost) ?? false
                    },
                    readOnly: true,
                  },
                },
                {
                  name: 'note',
                  label: 'Ghi chú',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'report',
              label: 'Báo cáo',
              type: 'group',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Tổng số lượng sản phẩm nhập',
                  fields: [
                    { name: 'cai', label: 'Cái', type: 'text', admin: { readOnly: true } },
                    { name: 'bo', label: 'Bộ', type: 'text', admin: { readOnly: true } },
                    { name: 'doi', label: 'Đôi', type: 'text', admin: { readOnly: true } },
                  ],
                },
                {
                  label: 'Tổng giá trị nhập kho',
                  type: 'collapsible',
                  fields: [
                    {
                      name: 'totalValue',
                      label: 'Tổng tiền',
                      type: 'text',
                      admin: { readOnly: true },
                    },
                    {
                      name: 'rateValue',
                      label: 'Loại Tiền',
                      type: 'select',
                      options: [
                        { value: 'VND', label: 'VND' },
                        { value: 'USD', label: 'USD' },
                      ],
                      defaultValue: 'VND',
                    },
                  ],
                },
                {
                  name: 'payType',
                  label: 'Hình thức thanh toán',
                  type: 'select',
                  options: [
                    { label: 'Tiền mặt', value: 'tienmat' },
                    { label: 'Chuyển khoản', value: 'chuyenkhoan' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [priceProduct],
    afterRead: [totalValueProduce],
    afterChange: [setUpdateSoluong],
    beforeValidate: [rondomID, checkValue, checkValueSoluong],
  },
}
