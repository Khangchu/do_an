import {
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  CollectionBeforeReadHook,
} from 'payload'
import { APIError } from 'payload'

export const CheckValueUsers: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create') {
    const error: string[] = []
    const { ID, phone } = data
    const checkID = await req.payload.find({
      collection: 'users',
      where: { ID: { equals: ID } },
    })
    if (checkID.docs.length > 0) {
      error.push('Căn cước công dân bị trùng, vui lòng nhập lại.')
    }
    const checkPhone = await req.payload.find({
      collection: 'users',
      where: { phone: { equals: phone } },
    })
    if (checkPhone.docs.length > 0) {
      error.push('Số điện thoại bị trùng, vui lòng nhập lại.')
    }
    if (error.length > 0) {
      throw new APIError(error.map((err, index) => `${index + 1}. ${err}`).join('\n'), 400)
    }
  }

  console.log('--- Checking User Department Before Change ---', data)

  // Nếu user đã có phòng ban, không cần tìm lại
  if (data?.employee?.department) return

  // Tìm phòng ban mà user này thuộc về
  const checkDepartments = await req.payload.find({
    collection: 'department',
    where: {
      or: [
        { 'Os_Field.manager': { equals: data.id } },
        { 'Os_Field.deputyManager': { equals: data.id } },
        { 'Os_Field.employees': { contains: data.id } },
      ],
    },
  })

  console.log(
    '--- Found Departments ---',
    checkDepartments.docs.map((d) => d.id),
  )

  // Gán phòng ban đầu tiên tìm được vào user trước khi lưu
  if (checkDepartments.docs.length > 0) {
    data.employee = data.employee || {}
    data.employee.department = checkDepartments.docs[0].id
  }
}
export const BeforeValidateUser: CollectionBeforeValidateHook = async ({ data }) => {
  if (!data) return
  if (!data.userID) {
    data.userID = `ID-${Date.now()}${Math.floor(Math.random() * 10000)}`
  }
  data.title = `${data.userID}-${data.fullName || 'Unknown'}`
}
export const BeforeRead: CollectionBeforeReadHook = async ({ req, doc }) => {
  if (!doc.department) {
    const department = await req.payload.find({
      collection: 'department',
      where: {
        or: [
          { 'Os_Field.manager.id': { equals: doc.id } },
          { 'Os_Field.deputyManager.id': { equals: doc.id } },
          { 'Os_Field.employees.id': { contains: doc.id } },
        ],
      },
    })

    if (department.docs.length > 0) {
      doc.department = department.docs[0].id
    }
  }
  return doc
}
