/* eslint-disable @typescript-eslint/no-explicit-any */
import { CollectionBeforeValidateHook, CollectionAfterChangeHook, APIError } from 'payload'
import { v4 as uuidv4 } from 'uuid'
export const showTitle: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (!data) return
  if (operation === 'create') {
    if (data.inventoryId) {
      data.title = data.inventoryId
    }
  }
}

export const rondomID: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (!data) return
  if (operation === 'create') {
    if (!data.inventoryId) {
      const numberOnly = uuidv4().replace(/\D/g, '')
      data.inventoryId = `NH${numberOnly.substring(0, 10)}`
    }
  }
}

export const totalPrice: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  if (!doc) return
  const exchangeRate = 25000
  doc?.material.forEach((dc: any) => {
    if (dc.soluongMaterial && dc.priceMaterial) {
      dc.totalPriceMaterial = dc.soluongMaterial * dc.priceMaterial
    }
    previousDoc?.material.forEach((pd: any) => {
      if (dc.typePriceMaterial !== pd.typePriceMaterial) {
        if (dc.typePriceMaterial === 'VND' && pd.typePriceMaterial === 'USD') {
          dc.priceMaterial = dc.priceMaterial * exchangeRate
          dc.totalPriceMaterial = dc.totalPriceMaterial * exchangeRate
        }
        if (dc.typePriceMaterial === 'USD' && pd.typePriceMaterial === 'VND') {
          dc.priceMaterial = dc.priceMaterial / exchangeRate
          dc.totalPriceMaterial = dc.totalPriceMaterial / exchangeRate
        }
      }
    })
  })
  doc?.machine.forEach((dc: any) => {
    if (dc.soluongMachine && dc.priceMachine) {
      dc.totalPriceMachine = dc.soluongMachine * dc.priceMachine
    }
    previousDoc?.material.forEach((pd: any) => {
      if (dc.typePriceMachine !== pd.typePriceMachine) {
        if (dc.typePriceMachine === 'VND' && pd.typePriceMachine === 'USD') {
          dc.priceMachine = dc.priceMachine * exchangeRate
          dc.totalPriceMachine = dc.totalPriceMachine * exchangeRate
        }
        if (dc.typePriceMachine === 'USD' && pd.typePriceMachine === 'VND') {
          dc.priceMachine = dc.priceMachine / exchangeRate
          dc.totalPriceMachine = dc.totalPriceMachine / exchangeRate
        }
      }
    })
  })
}

export const checkValue: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return
  const requiredFields = {
    inventoryName: 'Tên kho',
    location: 'Địa chỉchỉ',
    managerInventory: 'Người quản lý',
    phoneInventory: 'Số điện thoại',
  }

  const error = Object.entries(requiredFields)
    .filter(([key]) => !data[key])
    .map(([, label]) => label)

  if (error.length > 0) {
    throw new APIError(`Không được để trống: ${error.join(', ')}`, 400)
  }
}
