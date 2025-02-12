import { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
    slug: 'orders',
    labels: {
        singular: 'Đơn Hàng',
        plural: 'Đơn Hàng'
    },
    admin:{
        useAsTitle:''
    },
    fields: [
        {
            name: 'orderId',
            label: 'ID đơn hàng',
            type: 'text',
        },
        {
            name: 'customerName',
            label: 'Tên khách hàng',
            type : 'text',
        },
        {
            name: 'customerEmail',
            label: 'Email khách hàng',
            type: 'text'
        },
        {
            label: 'Danh sách sản phẩm trong đơn hàng',
            type: 'collapsible',
            fields: [
                {
                    name:'productId',
                    label:'ID Sản Phẩm',
                    type: 'text'
                },
                {
                    name: 'quantity',
                    label: 'Số lượng',
                    type: 'number'
                }
            ]
        },
        {
            name:'totalAmount',
            label: 'Tổng giá trị đơn hàng',
            type: 'number'
        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select',
            options: [
                {
                    label:'đang xử lý',
                    value: 'đang xử lý'
                },
                {
                    label: 'đã giao',
                    value: 'đã giao'
                },
                {
                    label: 'đã hủy',
                    value: 'đã hủy'
                }
            ]
        }
    ]
}