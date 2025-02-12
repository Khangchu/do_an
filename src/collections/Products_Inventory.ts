import { CollectionConfig } from "payload";

export const Products_Inventory: CollectionConfig = {
    slug: 'Products_Inventory',
    admin: {
        useAsTitle: ''
    },
    labels: {
        singular: 'Kho Sản Phẩm',
        plural:'Kho Sản Phẩm'
    },
    fields: [
        {
            name:'inventoryId',
            label: 'ID Kho Hàng',
            type: 'text',
            unique: true
        },
        {
            name: 'productId',
            label: 'ID Sản Phẩm',
            type: 'relationship',
            relationTo: 'products'
        },
        {
                type: 'row',
                fields: [
                    {
                        name: 'amount',
                        label: 'Số lượng',
                        type: 'number',
                        unique: true
                    },
                    {
                        name: 'unit',
                        label: 'Đơn Vị',
                        type: 'select',
                        options: [
                            {
                                label: 'Cái',
                                value: 'Cái',
                            },
                            {
                                label: 'Đôi',
                                value: 'Đôi',
                            },
                            {
                                label: 'Bộ',
                                value: 'Yến',
                            },
                        ]
                    }
                ]
            },
    ]
}