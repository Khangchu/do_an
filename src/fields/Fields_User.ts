import type { Field } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const hero: Field = {
  name: 'Học Vấn',
  label: '',
  type: 'group',
  fields: [
    {
      name: 'degree',
      type: 'text',
      label: 'Bằng Cấp',
      required: true,
    },
    {
      name: 'university',
      type: 'text',
      label: 'Đại Học',
      required: true,
    },
    {
      name: 'specialization',
      type: 'text',
      label: 'Chuyên Ngành',
      required: true,
    },
    {
      name: 'Certificate',
      label: 'Chứng chỉ',
      type: 'array',
      fields: [
        {
          name: 'nameCertificate',
          label: 'Tên chững chỉ',
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
}
export const employee: Field = {
  name: 'employee',
  label: '',
  type: 'group',
  fields: [
    {
      name: 'position',
      label: 'Vị trí công việc',
      type: 'select',
      options: [
        {
          label: 'Trưởng Phòng',
          value: 'manager',
        },
        {
          label: 'Phó Phòng',
          value: 'deputyManager',
        },
        {
          label: 'Nhân Viên',
          value: 'employees',
        },
      ],
    },
    {
      name: 'department',
      label: 'Phòng ban',
      type: 'relationship',
      relationTo: 'department',
      hasMany: false,
      admin: {
        condition: (data) => {
          if (!data?.userID) return false
          return true
        },
        readOnly: true,
      },
    },
    {
      name: 'salary',
      label: 'Lương',
      type: 'number',
    },
    {
      name: 'assignedTasks',
      label: 'công việc được giao',
      type: 'relationship',
      relationTo: 'tasks',
    },
  ],
}
export const Skill: Field = {
  name: 'Skill',
  label: '',
  type: 'group',
  fields: [
    {
      name: 'richText',
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
}
export const WorkTime: Field = {
  name: 'WorkTime_User',
  label: '',
  type: 'join',
  collection: 'WorkTime',
  on: 'info_worktime',
}
