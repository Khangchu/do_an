/* eslint-disable @typescript-eslint/no-explicit-any */
import { CollectionConfig } from 'payload'
import { showTitle, totalPrice, rondomID, checkValue } from '@/Hooks/HookInventory'
export const MaterialsAndMachine_Inventory: CollectionConfig = {
  slug: 'MaterialsAndMachine_Inventory',
  labels: {
    singular: 'Kho Vật Liêu và máy móc',
    plural: 'Kho Vật Liêu và máy móc',
  },
  admin: {
    useAsTitle: 'inventoryName',
  },
  fields: [
    {
      name: 'titel',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin Kho',
          fields: [
            {
              name: 'inventoryId',
              label: 'ID Kho Hàng',
              type: 'text',
              admin: {
                readOnly: true,
                condition: (data) => !!data.inventoryId,
              },
            },
            {
              name: 'inventoryName',
              label: 'Tên kho',
              type: 'text',
            },
            {
              name: 'location',
              label: 'Địa Chỉ',
              type: 'textarea',
            },
            {
              name: 'managerInventory',
              label: 'Người quản lý',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'phoneInventory',
              label: 'Số điện thoại liên hệ',
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
        },
        {
          label: 'Vật liệu',
          fields: [
            {
              type: 'array',
              name: 'material',
              label: 'Vật liệu',
              fields: [
                {
                  name: 'materialName',
                  label: 'Vật liệu',
                  type: 'relationship',
                  relationTo: 'materials',
                },
                {
                  name: 'suppliersMaterial',
                  label: 'Nhà cung cấp',
                  type: 'relationship',
                  relationTo: 'Suppliers',
                  filterOptions: async ({ req, siblingData }) => {
                    const materialData = siblingData as { materialName?: string }
                    if (!materialData.materialName) return true
                    const showMaterial = await req.payload.findByID({
                      collection: 'materials',
                      id: materialData.materialName,
                    })
                    if (
                      !showMaterial ||
                      !showMaterial.supplier ||
                      showMaterial.supplier.docs?.length === 0
                    ) {
                      return false
                    }
                    return {
                      id: {
                        in: showMaterial.supplier.docs?.map((supplier: any) => supplier.id),
                      },
                    }
                  },
                  admin: {
                    condition: (data, siblingData) => {
                      return !!siblingData.materialName
                    },
                  },
                },
                {
                  name: 'soluongMaterial',
                  label: 'Số lượng',
                  type: 'number',
                },
                {
                  name: 'unitMaterial',
                  label: 'Đơn vị tính',
                  type: 'select',
                  options: [
                    { label: 'Kilogram (Kg)', value: 'kg' },
                    { label: 'Gram (g)', value: 'g' },
                    { label: 'Tấn (T)', value: 't' },
                    { label: 'Mét (m)', value: 'm' },
                    { label: 'Cuộn', value: 'cuon' },
                    { label: 'Lít (L)', value: 'l' },
                    { label: 'Cái', value: 'cai' },
                    { label: 'Bộ', value: 'bo' },
                    { label: 'Thùng', value: 'thung' },
                    { label: 'Hộp', value: 'hop' },
                    { label: 'Bao', value: 'bao' },
                    { label: 'Pallet', value: 'pallet' },
                  ],
                  admin: {
                    condition: (data, siblingData) => {
                      return !!siblingData.soluongMaterial
                    },
                  },
                },
                {
                  label: 'Giá trị tồn Kho',
                  type: 'collapsible',
                  fields: [
                    {
                      name: 'priceMaterial',
                      label: 'Đơn giá',
                      type: 'number',
                    },
                    {
                      name: 'totalPriceMaterial',
                      label: 'Tổng giá',
                      type: 'number',
                      admin: {
                        readOnly: true,
                      },
                    },
                    {
                      name: 'typePriceMaterial',
                      label: 'Loại tiền',
                      type: 'select',
                      options: [
                        { label: 'VND', value: 'VND' },
                        { label: 'USD', value: 'USD' },
                      ],
                      defaultValue: 'VND',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Máy móc',
          fields: [
            {
              type: 'array',
              name: 'machine',
              label: '',
              fields: [
                {
                  name: 'machineName',
                  label: 'Máy móc',
                  type: 'relationship',
                  relationTo: 'machine',
                },
                {
                  name: 'suppliersMachine',
                  label: 'Nhà cung cấp',
                  type: 'relationship',
                  relationTo: 'Suppliers',
                  filterOptions: async ({ siblingData, req }) => {
                    const machineData = siblingData as { machineName?: string }
                    if (!machineData.machineName) return true
                    const showMachine = await req.payload.findByID({
                      collection: 'machine',
                      id: machineData.machineName,
                    })
                    if (
                      !showMachine ||
                      !showMachine.suppliers ||
                      showMachine.suppliers.docs?.length === 0
                    ) {
                      return false
                    }
                    return {
                      id: {
                        in: showMachine.suppliers.docs?.map((sup: any) => sup.id),
                      },
                    }
                  },
                  admin: {
                    condition: (data, siblingData) => {
                      return !!siblingData.machineName
                    },
                  },
                },
                {
                  name: 'soluongMachine',
                  label: 'Số lượng',
                  type: 'number',
                },
                {
                  name: 'unitMachine',
                  label: 'Đơn vị tính',
                  type: 'select',
                  options: [
                    { label: 'Cái', value: 'cai' },
                    { label: 'Bộ', value: 'bo' },
                    { label: 'Chiếc', value: 'chiec' },
                    { label: 'Hệ thống', value: 'he-thong' },
                    { label: 'Máy', value: 'may' },
                    { label: 'Tấn (T)', value: 't' },
                    { label: 'Kilogram (Kg)', value: 'kg' },
                    { label: 'Thùng', value: 'thung' },
                    { label: 'Hộp', value: 'hop' },
                    { label: 'Bao', value: 'bao' },
                    { label: 'Pallet', value: 'pallet' },
                    { label: 'Lô', value: 'lo' },
                    { label: 'Cuộn', value: 'cuon' },
                    { label: 'Mét (m)', value: 'm' },
                  ],
                  admin: {
                    condition: (data, siblingData) => {
                      return !!siblingData.soluongMachine
                    },
                  },
                },
                {
                  label: 'Giá trị tồn Kho',
                  type: 'collapsible',
                  fields: [
                    {
                      name: 'priceMachine',
                      label: 'Giá',
                      type: 'number',
                    },
                    {
                      name: 'totalPriceMachine',
                      label: 'Tổng giá',
                      type: 'text',
                      admin: {
                        readOnly: true,
                      },
                    },
                    {
                      name: 'typePriceMachine',
                      label: 'Loại tiền',
                      type: 'select',
                      options: [
                        { label: 'VND', value: 'VND' },
                        { label: 'USD', value: 'USD' },
                      ],
                      defaultValue: 'VND',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Lịch sư xuất nhập kho',
          fields: [
            {
              name: 'goodsDeliveryNote',
              label: 'Lịch sử xuất kho',
              type: 'text',
            },
            {
              name: 'goodsReceivedNote',
              label: 'Lịch sử nhập kho',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [checkValue, rondomID, showTitle],
    afterChange: [totalPrice],
  },
}
