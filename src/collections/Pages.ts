import { Hero } from '@/blocks/Hero'
import { TowColumn } from '@/blocks/TowColumn'
import type { CollectionConfig } from 'payload'
 
export const Pages: CollectionConfig = {
    slug: 'pages',
    access: {
        read: () => true,
      },
    labels: {
        singular: 'trang',
        plural: 'pages'
    },
    fields: [
        {
            name: 'name',
            label: 'Name',
            type:'text',
            required: true
        },
        {
            name: 'slug',
            label: 'Slug',
            type : 'number',
            required: true,
        },
        {
            name: 'layout',
            label: 'Layout',
            type: 'blocks',
            blocks: [
                Hero,
                TowColumn
            ]
        }
    ]
}