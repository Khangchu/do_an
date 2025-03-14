import { Field } from 'payload'

export const Os_Field: Field = {
  name: 'Os_Field',
  label: '',
  type: 'group',
  fields: [
    {
      name: 'manager',
      type: 'relationship',
      label: 'Trưởng phòng',
      relationTo: 'users',
      filterOptions: async ({ req, data }) => {
        const checkManager = await req.payload.find({
          collection: 'department',
          where: { 'Os_Field.manager': { exists: true } },
        })
        const excludedManagers = checkManager.docs
          .map((doc) => doc?.Os_Field?.manager?.id)
          .filter((id) => id !== data?.Os_Field?.manager)
        return {
          and: [
            { 'employee.position': { equals: 'manager' } },
            {
              or: [{ id: { not_in: excludedManagers } }],
            },
          ],
        }
      },
    },
    {
      name: 'deputyManager',
      type: 'relationship',
      label: 'Phó phòng (nếu có)',
      relationTo: 'users',
      filterOptions: async ({ req, data }) => {
        const checkDeputyManager = await req.payload.find({
          collection: 'department',
          where: { 'Os_Field.deputyManager': { exists: true } },
        })
        const excludedDeputyManagers = checkDeputyManager.docs
          .map((doc) => doc?.Os_Field?.deputyManager?.id)
          .filter((id) => id && id !== data?.Os_Field?.deputyManager)
        return {
          and: [
            { 'employee.position': { equals: 'deputyManager' } },
            {
              or: [{ id: { not_in: excludedDeputyManagers } }],
            },
          ],
        }
      },
    },
    {
      name: 'employees',
      type: 'relationship',
      label: 'Nhân viên',
      relationTo: 'users',
      hasMany: true,
      filterOptions: async ({ req, data }) => {
        const checkEmployees = await req.payload.find({
          collection: 'department',
          where: {
            'Os_Field.employees': { exists: true },
          },
        })
        const docCheckEmployees = checkEmployees?.docs ?? []
        const checkOutEmployees = docCheckEmployees.flatMap((doc) =>
          (doc?.Os_Field?.employees ?? [])
            .map((emp) => emp?.id)
            .filter((id) => id && !data?.Os_Field?.employees?.includes(id)),
        )
        return {
          and: [
            { 'employee.position': { equals: 'employees' } },
            {
              or: [{ id: { not_in: checkOutEmployees } }],
            },
          ],
        }
      },
    },
  ],
}
