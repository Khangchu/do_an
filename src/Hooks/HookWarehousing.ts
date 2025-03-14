/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CollectionBeforeChangeHook,
  CollectionAfterReadHook,
  CollectionAfterChangeHook,
  APIError,
  CollectionBeforeValidateHook,
} from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const priceProduct: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
  operation,
}) => {
  if (!data?.produce) return data
  const checkProduce = data.produce.map((dt: any) =>
    dt.sanpham
      ? req.payload.findByID({
          collection: 'products',
          id: dt.sanpham,
        })
      : null,
  )
  const checkout = await Promise.all(checkProduce)
  if (operation === 'create') {
    data.produce = data.produce.map((pc: any) => {
      if (!pc.sanpham) return pc
      const productData = checkout.find((dt: any) => dt && dt.id === pc.sanpham)
      if (productData) {
        pc.cost = productData.price
        pc.rate = productData.currency
      }
      return pc
    })
  }
  if (operation === 'update') {
    data.produce = data.produce.map((pc: any) => {
      if (originalDoc?.produce) {
        const checkOriginData = originalDoc.produce.find((od: any) => od?.id === pc.id)
        if (!checkOriginData) {
          if (!pc.sanpham) return pc
          const productData = checkout.find((dt: any) => dt && dt.id === pc.sanpham)
          if (productData) {
            pc.cost = productData.price
            pc.rate = productData.currency
          }
        }
      }
      return pc
    })
  }

  return data
}

export const totalValueProduce: CollectionAfterReadHook = async ({ doc }) => {
  if (!doc?.produce) return doc
  doc.produce.map((pc: any) => {
    if (pc.cost && pc.soluong) {
      pc.total = pc.cost * pc.soluong
      return pc
    }
  })

  const untiCai = doc.produce
    .filter((pc: any) => pc.unti === 'cai')
    .flatMap((dc: any) => dc.soluong)
  const untiBo = doc.produce.filter((pc: any) => pc.unti === 'bo').flatMap((dc: any) => dc.soluong)
  const untiDoi = doc.produce
    .filter((pc: any) => pc.unti === 'doi')
    .flatMap((dc: any) => dc.soluong)
  doc.report = doc.report || {}
  doc.report.cai = untiCai.reduce((sum: number, value: number) => sum + value, 0)
  doc.report.bo = untiBo.reduce((sum: number, value: number) => sum + value, 0)
  doc.report.doi = untiDoi.reduce((sum: number, value: number) => sum + value, 0)

  const totalValuesVnd = doc.produce
    .filter((pc: any) => pc.rate === 'VND')
    .flatMap((dc: any) => dc.total)

  const totalValuesUsd = doc.produce
    .filter((pc: any) => pc.rate === 'USD')
    .flatMap((dc: any) => dc.total)

  if (doc.report.rateValue === 'VND') {
    doc.report.totalValue = [
      ...totalValuesVnd,
      ...totalValuesUsd.map((value: any) => value * 25000),
    ].reduce((sum: number, value: number) => sum + value, 0)
  }
  if (doc.report.rateValue === 'USD') {
    doc.report.totalValue = [
      ...totalValuesVnd.map((value: any) => value / 25000),
      ...totalValuesUsd,
    ].reduce((sum: number, value: number) => sum + value, 0)
  }

  return doc
}

export const setUpdateSoluong: CollectionAfterChangeHook = async ({
  doc,
  req,
  previousDoc,
  operation,
}) => {
  const inventory = await req.payload.findByID({
    collection: 'Products_Inventory',
    id: doc.inventory,
  })
  if (operation === 'update') {
    const updatedCatalogue = await Promise.all(
      inventory.catalogueOfGoods?.map(async (dt) => {
        const matchingProduct = doc?.produce.filter((pc: any) =>
          typeof dt.productId === 'object' && dt.productId !== null
            ? dt.productId.id === pc.sanpham && dt.danhmuc?.unti === pc.unti
            : dt.productId === pc.sanpham,
        )
        if (!matchingProduct.length) return dt
        const newProducts = matchingProduct.filter(
          (pc: any) => !previousDoc.produce.some((prev: any) => prev.id === pc.id),
        )

        if (!newProducts.length) return dt
        const totalNewSoluong = newProducts.reduce((sum: number, np: any) => sum + np.soluong, 0)
        const remainingAmount = (dt.danhmuc?.amount || 0) - totalNewSoluong
        if (remainingAmount < 0) {
          return dt
        }
        return {
          ...dt,
          danhmuc: {
            ...dt.danhmuc,
            amount: remainingAmount,
          },
        }
      }) || [],
    )
    const validCatalogue = updatedCatalogue.filter(Boolean)

    await req.payload.update({
      collection: 'Products_Inventory',
      id: doc.inventory,
      data: {
        catalogueOfGoods: validCatalogue,
      },
    })
  }

  if (operation === 'create') {
    const updatedCatalogue = await Promise.all(
      inventory.catalogueOfGoods?.map(async (dt) => {
        const matchingProduct = doc?.produce.filter((pc: any) =>
          typeof dt.productId === 'object' && dt.productId !== null
            ? dt.productId.id === pc.sanpham && dt.danhmuc?.unti === pc.unti
            : dt.productId === pc.sanpham,
        )
        const matchingSoluong = matchingProduct.flatMap((mp: any) => mp.soluong)
        const totalSoluong = matchingSoluong.reduce((sum: number, value: number) => sum + value, 0)
        const remainingAmount = (dt.danhmuc?.amount || 0) - totalSoluong
        if (remainingAmount < 0) {
          return dt
        }
        return {
          ...dt,
          danhmuc: {
            ...dt.danhmuc,
            amount: remainingAmount,
          },
        }
      }) || [],
    )
    await req.payload.update({
      collection: 'Products_Inventory',
      id: doc.inventory,
      data: {
        catalogueOfGoods: updatedCatalogue,
      },
    })
  }
  return doc
}

export const checkValueSoluong: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data) return
  const errorSet = new Set<string>()
  const inventory = await req.payload.findByID({
    collection: 'Products_Inventory',
    id: data.inventory,
  })
  const inventoryMap = new Map()
  inventory.catalogueOfGoods?.forEach((dt) => {
    const productId =
      typeof dt.productId === 'object' && dt.productId !== null ? dt.productId.id : dt.productId
    const productName =
      typeof dt.productId === 'object' && dt.productId !== null
        ? dt.productId.nameProduct
        : 'Sản phẩm không xác định'
    inventoryMap.set(`${productId}-${dt.danhmuc?.unti}`, { ...dt, productName })
  })
  const nameProductMap = new Map()
  inventory.catalogueOfGoods?.forEach((inven) => {
    const nameProductId =
      typeof inven.productId === 'object' && inven.productId !== null
        ? inven.productId.id
        : inven.productId
    const nameProduct =
      typeof inven.productId === 'object' && inven.productId !== null
        ? inven.productId.nameProduct
        : 'Sản phẩm không xác định'
    nameProductMap.set(`${nameProductId}`, { ...inven, nameProduct })
  })
  if (operation === 'create') {
    await Promise.all(
      data?.produce.map(async (pc: any) => {
        const key = `${pc.sanpham}-${pc.unti}`
        const dt = inventoryMap.get(key)
        const keyName = `${pc.sanpham}`
        const name = nameProductMap.get(keyName)
        if (!dt) {
          if (pc.unti === 'cai') {
            errorSet.add(`Sản phẩm ${name.nameProduct} với đơn vị la cái không có trong kho`)
          } else if (pc.unti === 'bo') {
            errorSet.add(`Sản phẩm ${name.nameProduct} với đơn vị la bộ không có trong kho`)
          } else if (pc.unti === 'doi') {
            errorSet.add(`Sản phẩm ${name.nameProduct} với đơn vị la đôi không có trong kho`)
          }
        } else {
          dt.danhmuc.amount -= pc.soluong
          if (dt.danhmuc.amount < 0) {
            if (pc.unti === 'cai') {
              errorSet.add(
                `Sản phẩm ${dt.productName} với đơn vị la cái trong kho không đủ số lượng`,
              )
            } else if (pc.unti === 'bo') {
              errorSet.add(
                `Sản phẩm ${dt.productName} với đơn vị la bo trong kho không đủ số lượng`,
              )
            } else if (pc.unti === 'doi') {
              errorSet.add(
                `Sản phẩm ${dt.productName} với đơn vị la doi trong kho không đủ số lượng`,
              )
            }
          }
        }
      }) || [],
    )

    if (errorSet.size > 0) {
      throw new APIError(Array.from(errorSet).join('; '), 400)
    }
    return data
  }
  if (operation === 'update') {
    await Promise.all(
      data?.produce.map(async (pc: any) => {
        const originalDocs = originalDoc?.produce.find((od: any) => od?.id === pc?.id)
        if (!originalDocs) {
          const key = `${pc.sanpham}-${pc.unti}`
          const dt = inventoryMap.get(key)
          const keyName = `${pc.sanpham}`
          const name = nameProductMap.get(keyName)
          if (!dt) {
            if (pc.unti === 'cai') {
              errorSet.add(`Sản phẩm ${name.nameProduct} với đơn vị la cái không có trong kho`)
            } else if (pc.unti === 'bo') {
              errorSet.add(`Sản phẩm ${name.nameProduct} với đơn vị la bộ không có trong kho`)
            } else if (pc.unti === 'doi') {
              errorSet.add(`Sản phẩm ${name.nameProduct} với đơn vị la đôi không có trong kho`)
            }
          } else {
            dt.danhmuc.amount -= pc.soluong
            if (dt.danhmuc.amount < 0) {
              if (pc.unti === 'cai') {
                errorSet.add(
                  `Sản phẩm ${dt.productName} với đơn vị la cái trong kho không đủ số lượng`,
                )
              } else if (pc.unti === 'bo') {
                errorSet.add(
                  `Sản phẩm ${dt.productName} với đơn vị la bo trong kho không đủ số lượng`,
                )
              } else if (pc.unti === 'doi') {
                errorSet.add(
                  `Sản phẩm ${dt.productName} với đơn vị la doi trong kho không đủ số lượng`,
                )
              }
            }
          }
        }
      }) || [],
    )

    if (errorSet.size > 0) {
      throw new APIError(Array.from(errorSet).join('; '), 400)
    }
    return data
  }
}

export const rondomID: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return
  if (!data.goodsDeliveryNoteID) {
    const numberOnly = uuidv4().replace(/\D/g, '')
    data.goodsDeliveryNoteID = `XH${numberOnly.substring(0, 10)}`
  }
}

export const checkValue: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return
  const requiredFields = {
    date: 'Ngày nhập',
    inventory: 'Kho hàng',
    shipper: 'Người giao hàng',
    employee: 'Người nhận hàng',
    voucherMaker: 'Người lập phiếu',
  }

  const error = Object.entries(requiredFields)
    .filter(([key]) => !data[key])
    .map(([, label]) => label)

  if (error.length > 0) {
    throw new APIError(`Không được để trống: ${error.join(', ')}`, 400)
  }
}
