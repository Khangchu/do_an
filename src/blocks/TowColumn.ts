import { CollectionConfig } from "payload";

export const TowColumn: CollectionConfig = {
 slug: 'towcolumn',
 labels: {
    singular:'Tow Column Block',
    plural: 'Tow Column Block',
 },
    fields:[
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
        },
        {
            name: 'direction',
            label:'Direction',
            type: 'select',
            options: [
                {
                    label:'Default',
                    value: 'default',
                },
                {
                    label:'Reverse',
                    value: 'reverse',
                },
                
            ]
        }
 ]
}