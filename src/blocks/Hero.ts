import { CollectionConfig } from "payload";

 export const Hero:CollectionConfig  = {
    slug: 'hero',
    labels: {
        singular:'Hero Block',
        plural: 'Hero Block',

    },
    fields: [
        {
            name: 'heading',
            label: 'Heading',
            type: 'text'
        },
        {
            name: 'text',
            label:'Test',
            type: 'textarea',
        },
        {
            name:'backgroundImage',
            label:'BackgroundImage',
            type: 'upload',
            relationTo: "media"
        }
    ]
 }