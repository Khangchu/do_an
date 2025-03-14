import { APIError, CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload'

export const BeforeValidate: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return
  if (!data.productID) {
    data.productID = `ID-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  }
  console.log('check', data)
  return data
}
export const beforeChange: CollectionBeforeChangeHook = ({ data, originalDoc, operation }) => {
  if (!data) return
  if (operation === 'update') {
    const exchangeRate = 25000

    if (originalDoc?.currency && originalDoc.currency !== data.currency) {
      if (originalDoc.currency === 'VND' && data.currency === 'USD') {
        data.price = data.price / exchangeRate
      } else if (originalDoc.currency === 'USD' && data.currency === 'VND') {
        data.price = data.price * exchangeRate
      }
    }

    data.previousCurrency = data.currency
    return data
  }
  const error: string[] = []
  if (!data.nameProduct) {
    error.push('Tên sản phẩm')
  }
  if (!data.category) {
    error.push('Danh mục')
  }
  if (!data.sizes) {
    error.push('Kích cỡ')
  }
  if (!data.color) {
    error.push('Màu sắc')
  }
  if (!data.material) {
    error.push('Vật liệu')
  }
  if (!data.price) {
    error.push('Giá tiền')
  }
  const throwError = error.map((err) => err).join(',')
  if (error.length > 0) {
    throw new APIError(`Không được để trống:${throwError}`, 400)
  }
}
