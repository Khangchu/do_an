/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from 'payload'

export const materials: Field = {
  name: 'materials',
  label: '',
  type: 'group',
  fields: [
    {
      name: 'materialsProduce',
      label: '',
      type: 'array',
      fields: [
        {
          name: 'materialsName',
          label: 'Tên vật liệu',
          type: 'relationship',
          relationTo: 'materials',
          admin: {
            condition: (data) => !!data.inventory,
          },
          filterOptions: async ({ data, req }) => {
            if (!data.inventory) return false
            const inventory = await req.payload.findByID({
              collection: 'MaterialsAndMachine_Inventory',
              id: data.inventory,
            })
            const checkout = inventory.material?.flatMap((dt: any) => dt.materialName.id)
            return {
              id: { in: checkout },
            }
          },
        },
        {
          name: 'suppliersMaterials',
          label: 'Nhà cung cấp',
          type: 'relationship',
          relationTo: 'Suppliers',
          admin: {
            condition: (data, siblingData) => !!siblingData.materialsName,
          },
          filterOptions: async ({ req, siblingData }) => {
            const materialData = siblingData as { materialsName?: string }
            if (!materialData.materialsName) return true
            const showMaterial = await req.payload.findByID({
              collection: 'materials',
              id: materialData.materialsName,
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
        },
        {
          type: 'row',
          fields: [
            {
              name: 'soluongMaterials',
              label: 'Số lượng',
              type: 'number',
              admin: {
                condition: (data, siblingData) => !!siblingData.materialsName,
              },
            },
            {
              name: 'unitsMaterials',
              label: 'Đơn Vị Tính',
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
                condition: (data, siblingData) => !!siblingData.materialsName,
              },
            },
          ],
        },
        {
          name: 'priceMaterials',
          label: 'Giá nhập',
          type: 'number',
          admin: {
            readOnly: true,
            condition: (data, siblingData) => !!siblingData.materialsName,
          },
        },
        {
          name: 'totalMaterials',
          label: 'Thành tiền',
          type: 'number',
          admin: {
            readOnly: true,
            condition: (data, siblingData) => !!siblingData.materialsName,
          },
        },
        {
          name: 'typePriceMaterials',
          label: 'Loại tiền',
          type: 'text',
          admin: {
            readOnly: true,
            condition: (data, siblingData) => !!siblingData.materialsName,
          },
        },
        {
          name: 'noteMaterial',
          label: 'Ghi chú',
          type: 'textarea',
        },
      ],
    },
  ],
}
export const machine: Field = {
  name: 'machine',
  label: '',
  type: 'group',
  fields: [
    {
      name: 'machinesProduce',
      label: '',
      type: 'array',
      fields: [
        {
          name: 'machinesName',
          label: 'Tên vật liệu',
          type: 'relationship',
          relationTo: 'machine',
          admin: {
            condition: (data) => !!data.inventory,
          },
          filterOptions: async ({ data, req }) => {
            if (!data.inventory) return false
            const inventory = await req.payload.findByID({
              collection: 'MaterialsAndMachine_Inventory',
              id: data.inventory,
            })
            const checkout = inventory.machine?.flatMap((dt: any) => dt.machineName.id)
            return {
              id: { in: checkout },
            }
          },
        },
        {
          name: 'suppliersMachines',
          label: 'Nhà cung cấp',
          type: 'relationship',
          relationTo: 'Suppliers',
          admin: {
            condition: (data, siblingData) => !!siblingData.machinesName,
          },
          filterOptions: async ({ req, siblingData }) => {
            const machineData = siblingData as { machinesName?: string }
            if (!machineData.machinesName) return true
            const showMaterial = await req.payload.findByID({
              collection: 'machine',
              id: machineData.machinesName,
            })
            if (
              !showMaterial ||
              !showMaterial.suppliers ||
              showMaterial.suppliers.docs?.length === 0
            ) {
              return false
            }
            return {
              id: {
                in: showMaterial.suppliers.docs?.map((supplier: any) => supplier.id),
              },
            }
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'soluongMachines',
              label: 'Số lượng',
              type: 'number',
              admin: {
                condition: (data, siblingData) => !!siblingData.machinesName,
              },
            },
            {
              name: 'unitsMachines',
              label: 'Đơn Vị Tính',
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
                condition: (data, siblingData) => !!siblingData.machinesName,
              },
            },
          ],
        },
        {
          name: 'priceMachines',
          label: 'Giá nhập',
          type: 'number',
          admin: {
            readOnly: true,
            condition: (data, siblingData) => !!siblingData.machinesName,
          },
        },
        {
          name: 'totalMachines',
          label: 'Thành tiền',
          type: 'number',
          admin: {
            readOnly: true,
            condition: (data, siblingData) => !!siblingData.machinesName,
          },
        },
        {
          name: 'typePriceMachines',
          label: 'Loại tiền',
          type: 'text',
          admin: {
            readOnly: true,
            condition: (data, siblingData) => !!siblingData.machinesName,
          },
        },
        {
          name: 'noteMachines',
          label: 'Ghi chú',
          type: 'textarea',
        },
      ],
    },
  ],
}

export const report: Field = {
  name: 'report',
  label: '',
  type: 'group',
  admin: { description: 'Thống kê vật liệu đã nhập' },
  fields: [
    {
      name: 'reportMaterial',
      label: 'Vật liệu',
      type: 'array',
      admin: { description: 'Thống kê vật liệu đã nhập' },
      fields: [
        {
          name: 'reportMaterialName',
          label: 'Tên vật liệu',
          type: 'relationship',
          relationTo: 'materials',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'reportMaterialSoLuong',
          label: 'Số lượng',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'reportMaterialUnits',
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
            readOnly: true,
          },
        },
        {
          name: 'reportNoteMaterial',
          label: 'Ghi chú',
          type: 'textarea',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'reportMachines',
      label: 'Vật liệu',
      type: 'array',
      admin: { description: 'Thống kê vật liệu đã nhập' },
      fields: [
        {
          name: 'reportMachinesName',
          label: 'Tên máy mócmóc',
          type: 'relationship',
          relationTo: 'machine',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'reportMachinesSoLuong',
          label: 'Số lượng',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'reportMachinesUnits',
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
            readOnly: true,
          },
        },
        {
          name: 'reportNoteMachines',
          label: 'Ghi chú',
          type: 'textarea',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      label: 'Tổng giá trị nhập kho',
      type: 'collapsible',
      fields: [
        {
          name: 'totalValue',
          label: 'Tổng tiền',
          type: 'number',
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
}
