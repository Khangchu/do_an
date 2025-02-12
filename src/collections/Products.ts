
import type { CollectionConfig } from "payload";
import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
  } from '@payloadcms/richtext-lexical'

export const Products: CollectionConfig = {
    slug: 'products',
    admin: {
    useAsTitle: 'productID'
    },
    labels: {
        singular: 'Sản Phẩm',
        plural: 'Sản Phẩm'
    },
    fields: [
        {
            name:'productID',
            label: 'ID Sản phẩm',
            type: 'text',
            admin: {
                readOnly: true,
            }
        },
        {
            name: 'nameProduct',
            label: 'Tên Sản Phẩm',
            type: 'text',
        },
        {
            name: 'category',
            label: 'Danh Mục',
            type: 'text'
        },
        {
            name: 'size',
            label: 'Kĩnh Cỡ',
            type:'text'
        },
        // {
        //     name: 'color',
        //     label: 'Màu Sắc',
        //     type: 'text',
        // }, 
        {
            name: 'material',
            label: 'Vật liệu',
            type: 'relationship',
            relationTo:'materials',
            hasMany:true
        },
        {
            name: 'quantity',
            label: 'Tồn Kho',
            type: 'join',
            collection: 'Products_Inventory',
            on:'productId'

        },
        {
            name: 'Price',
            label: 'Giá',
            type: 'number'
        },
        {
            name: 'description',
            label: 'Ghi Chú',
            type: 'richText',
            editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                    return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                            ]
                        }
                    }
                )
        },
            
    ],
    hooks: {
        beforeChange: [
          ({ data }) => {
            if (!data.productID) {
              data.productID = `ID-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            }
            return data;
          },
        ],
      },
}