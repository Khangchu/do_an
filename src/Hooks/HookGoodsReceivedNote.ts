/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CollectionBeforeValidateHook,
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionAfterReadHook,
  APIError,
} from 'payload'
import { v4 as uuidv4 } from 'uuid'
export const showTitle: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return
  if (data.goodsReceivedNoteId) {
    data.title = data.goodsReceivedNoteId
  }
}
export const rondomID: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return
  if (!data.goodsReceivedNoteId) {
    const numberOnly = uuidv4().replace(/\D/g, '')
    data.goodsReceivedNoteId = `NH${numberOnly.substring(0, 10)}`
  }
}
export const showPrice: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data) return
  const inventory = await req.payload.findByID({
    collection: 'MaterialsAndMachine_Inventory',
    id: data.inventory,
  })
  if (data.materials.materialsProduce.length !== 0) {
    if (operation === 'create') {
      data.materials.materialsProduce.forEach((dt: any) => {
        inventory.material?.forEach((pc) => {
          const materialId =
            typeof pc.materialName === 'object' && pc.materialName !== null
              ? pc.materialName.id
              : pc.materialName
          const materialSupplier =
            typeof pc.suppliersMaterial === 'object' && pc.suppliersMaterial !== null
              ? pc.suppliersMaterial.id
              : pc.suppliersMaterial
          if (
            dt.materialsName === materialId &&
            dt.suppliersMaterials === materialSupplier &&
            pc.unitMaterial === dt.unitsMaterials
          ) {
            dt.priceMaterials = pc.priceMaterial
            dt.typePriceMaterials = pc.typePriceMaterial
          }
        })
      })
    }
    if (operation === 'update') {
      data.materials.materialsProduce.forEach((dt: any) => {
        inventory.material?.forEach((pc) => {
          const originalDocs =
            originalDoc.materials?.materialsProduce.find((od: any) => od?.id === pc?.id) || null
          if (!originalDocs || originalDocs === null) {
            const materialId =
              typeof pc.materialName === 'object' && pc.materialName !== null
                ? pc.materialName.id
                : pc.materialName
            const materialSupplier =
              typeof pc.suppliersMaterial === 'object' && pc.suppliersMaterial !== null
                ? pc.suppliersMaterial.id
                : pc.suppliersMaterial
            if (
              dt.materialsName === materialId &&
              dt.suppliersMaterials === materialSupplier &&
              pc.unitMaterial === dt.unitsMaterials
            ) {
              dt.priceMaterials = pc.priceMaterial
              dt.typePriceMaterials = pc.typePriceMaterial
            }
          }
        })
      })
    }
  }
  if (data.machine.machinesProduce.length !== 0) {
    if (operation === 'create') {
      data.machine.machinesProduce.forEach((dt: any) => {
        inventory.machine?.forEach((pc) => {
          const machineId =
            typeof pc.machineName === 'object' && pc.machineName !== null
              ? pc.machineName.id
              : pc.machineName
          const machineSupplier =
            typeof pc.suppliersMachine === 'object' && pc.suppliersMachine !== null
              ? pc.suppliersMachine.id
              : pc.suppliersMachine
          if (
            machineId === dt.machinesName &&
            machineSupplier === dt.suppliersMachines &&
            dt.unitsMachines === pc.unitMachine
          ) {
            dt.priceMachines = pc.priceMachine
            dt.typePriceMachines = pc.typePriceMachine
            dt.typePriceMachines = pc.typePriceMachine
          }
        })
      })
    }
    if (operation === 'update') {
      data.machine.machinesProduce.forEach((dt: any) => {
        inventory.machine?.forEach((pc) => {
          const originalDocs =
            originalDoc.machine?.machinesProduce.find((od: any) => od?.id === pc?.id) || null
          if (!originalDocs || originalDocs === null) {
            const machineId =
              typeof pc.machineName === 'object' && pc.machineName !== null
                ? pc.machineName.id
                : pc.machineName
            const machineSupplier =
              typeof pc.suppliersMachine === 'object' && pc.suppliersMachine !== null
                ? pc.suppliersMachine.id
                : pc.suppliersMachine
            if (
              machineId === dt.machinesName &&
              machineSupplier === dt.suppliersMachines &&
              dt.unitsMachines === pc.unitMachine
            ) {
              dt.priceMachines = pc.priceMachine
              dt.typePriceMachines = pc.typePriceMachine
            }
          }
        })
      })
    }
  }
}
export const totalPrice: CollectionAfterReadHook = async ({ doc }) => {
  if (doc.materials.materialsProduce.length !== 0) {
    doc.materials.materialsProduce.map((dt: any) => {
      if (dt.priceMaterials && dt.soluongMaterials) {
        dt.totalMaterials = dt.priceMaterials * dt.soluongMaterials
        return dt
      }
    })
  }
  if (doc.machine.machinesProduce.length !== 0) {
    doc.machine.machinesProduce.map((dt: any) => {
      if (dt.priceMachines && dt.soluongMachines) {
        dt.totalMachines = dt.priceMachines * dt.soluongMachines
        return dt
      }
    })
  }
}
export const setUpdateSoluong: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  if (!doc) return

  const inventory = await req.payload.findByID({
    collection: 'MaterialsAndMachine_Inventory',
    id: doc.inventory,
  })
  if (doc.materials?.materialsProduce?.length && inventory?.material?.length) {
    if (operation === 'create') {
      const updateSoluong = await Promise.all(
        inventory.material.map((dt) => {
          const materialId =
            typeof dt.materialName === 'object' && dt.materialName !== null
              ? dt.materialName.id
              : dt.materialName
          const materialSupplier =
            typeof dt.suppliersMaterial === 'object' && dt.suppliersMaterial !== null
              ? dt.suppliersMaterial.id
              : dt.suppliersMaterial
          const materialProduce = doc.materials.materialsProduce.filter(
            (pc: any) =>
              materialId === pc.materialsName &&
              materialSupplier === pc.suppliersMaterials &&
              dt.unitMaterial === pc.unitsMaterials,
          )
          const matchingSoluong = materialProduce.flatMap((mp: any) => mp.soluongMaterials)
          const totalSoluong = matchingSoluong.reduce(
            (sum: number, value: number) => sum + value,
            0,
          )
          const remainingAmount = (dt.soluongMaterial || 0) + totalSoluong
          if (remainingAmount < 0) {
            return dt
          }
          return {
            ...dt,
            soluongMaterial: remainingAmount,
          }
        }),
      )
      await req.payload.update({
        collection: 'MaterialsAndMachine_Inventory',
        id: doc.inventory,
        data: {
          material: updateSoluong,
        },
      })
    }
    if (operation === 'update') {
      const updateSoluong = await Promise.all(
        inventory.material.map((dt) => {
          const materialId =
            typeof dt.materialName === 'object' && dt.materialName !== null
              ? dt.materialName.id
              : dt.materialName
          const materialSupplier =
            typeof dt.suppliersMaterial === 'object' && dt.suppliersMaterial !== null
              ? dt.suppliersMaterial.id
              : dt.suppliersMaterial
          const materialProduce = doc.materials.materialsProduce.filter(
            (pc: any) =>
              materialId === pc.materialsName &&
              materialSupplier === pc.suppliersMaterials &&
              dt.unitMaterial === pc.unitsMaterials,
          )
          const newProducts = materialProduce.filter(
            (pc: any) =>
              !previousDoc.materials?.materialsProduce.some((prev: any) => prev.id === pc.id),
          )
          if (!newProducts.length) return dt
          const totalNewSoluong = newProducts.reduce(
            (sum: number, np: any) => sum + np.soluongMaterials,
            0,
          )
          const remainingAmount = (dt.soluongMaterial || 0) + totalNewSoluong
          if (remainingAmount < 0) {
            return dt
          }
          return {
            ...dt,
            soluongMaterial: remainingAmount,
          }
        }),
      )
      await req.payload.update({
        collection: 'MaterialsAndMachine_Inventory',
        id: doc.inventory,
        data: {
          material: updateSoluong,
        },
      })
    }
  }
  if (doc.machine.machinesProduce.length && inventory.machine?.length) {
    if (operation === 'create') {
      const updateSoluong = await Promise.all(
        inventory.machine.map((dt) => {
          const machineId =
            typeof dt.machineName === 'object' && dt.machineName !== null
              ? dt.machineName.id
              : dt.machineName
          const machineSupplier =
            typeof dt.suppliersMachine === 'object' && dt.suppliersMachine !== null
              ? dt.suppliersMachine.id
              : dt.suppliersMachine
          const machinesProduce = doc.machine.machinesProduce.filter(
            (pc: any) =>
              machineId === pc.machinesName &&
              machineSupplier === pc.suppliersMachines &&
              dt.unitMachine === pc.unitsMachines,
          )
          const totalSoluong = machinesProduce.reduce(
            (sum: number, value: any) => sum + value.soluongMachines,
            0,
          )
          const remainingAmount = (dt.soluongMachine || 0) + totalSoluong
          if (remainingAmount < 0) {
            return dt
          }
          return {
            ...dt,
            soluongMachine: remainingAmount,
          }
        }),
      )
      await req.payload.update({
        collection: 'MaterialsAndMachine_Inventory',
        id: doc.inventory,
        data: {
          machine: updateSoluong,
        },
      })
    }
    if (operation === 'update') {
      const updateSoluong = await Promise.all(
        inventory.machine.map((dt) => {
          const machineId =
            typeof dt.machineName === 'object' && dt.machineName !== null
              ? dt.machineName.id
              : dt.machineName
          const machineSupplier =
            typeof dt.suppliersMachine === 'object' && dt.suppliersMachine !== null
              ? dt.suppliersMachine.id
              : dt.suppliersMachine
          const machinesProduce = doc.machine.machinesProduce.filter(
            (pc: any) =>
              machineId === pc.machinesName &&
              machineSupplier === pc.suppliersMachines &&
              dt.unitMachine === pc.unitsMachines,
          )
          const newProducts = machinesProduce.filter(
            (pc: any) =>
              !previousDoc.machine.machinesProduce.some((prev: any) => prev.id === pc.id),
          )
          const totalSoluong = newProducts.reduce(
            (sum: number, value: any) => sum + value.soluongMachines,
            0,
          )
          if (!newProducts.length) return dt
          const remainingAmount = (dt.soluongMachine || 0) + totalSoluong
          if (remainingAmount < 0) {
            return dt
          }
          return {
            ...dt,
            soluongMachine: remainingAmount,
          }
        }),
      )
      await req.payload.update({
        collection: 'MaterialsAndMachine_Inventory',
        id: doc.inventory,
        data: {
          machine: updateSoluong,
        },
      })
    }
  }
}
export const showReport: CollectionAfterReadHook = ({ doc }) => {
  if (!doc) return
  if (doc.materials.materialsProduce.length !== 0) {
    const materialMap = new Map()

    doc.materials.materialsProduce.forEach((dt: any) => {
      const key = `${dt.materialsName}-${dt.unitsMaterials}`
      if (materialMap.has(key)) {
        materialMap.get(key).reportMaterialSoLuong += Number(dt.soluongMaterials) || 0
      } else {
        materialMap.set(key, {
          reportMaterialName: dt.materialsName,
          reportMaterialSoLuong: Number(dt.soluongMaterials) || 0,
          reportMaterialUnits: dt.unitsMaterials,
          reportNoteMaterial: dt.noteMaterial || '',
        })
      }
    })
    const reportMaterialArray = Array.from(materialMap.values())
    if (Array.isArray(reportMaterialArray)) {
      doc.report.reportMaterial = reportMaterialArray
    } else {
      doc.report.reportMaterial = []
    }
  } else {
    doc.report.reportMaterial = []
  }
  if (doc.machine.machinesProduce.length !== 0) {
    const machineMap = new Map()
    doc.machine.machinesProduce.forEach((dt: any) => {
      const key = `${dt.machinesName}-${dt.unitsMachines}`
      if (machineMap.has(key)) {
        machineMap.get(key).reportMachinesSoLuong += Number(dt.soluongMachines) || 0
      } else {
        machineMap.set(key, {
          reportMachinesName: dt.machinesName,
          reportMachinesSoLuong: Number(dt.soluongMachines) || 0,
          reportMachinesUnits: dt.unitsMachines,
          reportNoteMachines: dt.noteMachines || '',
        })
      }
    })
    const reportMachinesArray = Array.from(machineMap.values())
    if (Array.isArray(reportMachinesArray)) {
      doc.report.reportMachines = reportMachinesArray
    } else {
      doc.report.reportMachines = []
    }
  } else {
    doc.report.reportMachines = []
  }
  return doc
}
export const reportTotalPrice: CollectionAfterReadHook = ({ doc }) => {
  if (doc.materials.materialsProduce.length || doc.machine?.machinesProduce.length) {
    const exchangeRate = 25000
    const totalValueMaterialUsd = doc.materials.materialsProduce
      .filter((dt: any) => dt.typePriceMaterials === 'USD')
      .flatMap((pc: any) => pc.totalMaterials)
    const totalValueMaterialVnd = doc.materials.materialsProduce
      .filter((dt: any) => dt.typePriceMaterials === 'VND')
      .flatMap((pc: any) => pc.totalMaterials)
    const totalMachineUsd = doc.machine?.machinesProduce
      .filter((dt: any) => dt.typePriceMachines === 'USD')
      .flatMap((pc: any) => pc.totalMachines)
    const totalMachineVnd = doc.machine?.machinesProduce
      .filter((dt: any) => dt.typePriceMachines === 'VND')
      .flatMap((pc: any) => pc.totalMachines)
    if (doc.report.rateValue === 'VND') {
      const totalValueMateria = [
        ...totalValueMaterialVnd,
        ...totalValueMaterialUsd.map((value: any) => value * exchangeRate),
      ].reduce((sum: number, value: number) => sum + value, 0)
      const totalValueMachine = [
        ...totalMachineVnd,
        ...totalMachineUsd.map((value: any) => value * exchangeRate),
      ].reduce((sum: number, value: number) => sum + value, 0)
      doc.report.totalValue = totalValueMachine + totalValueMateria
      return doc
    }
    if (doc.report.rateValue === 'USD') {
      const totalValueMateria = [
        ...totalValueMaterialVnd.map((value: any) => value / exchangeRate),
        ...totalValueMaterialUsd,
      ].reduce((sum: number, value: number) => sum + value, 0)
      const totalValueMachine = [
        ...totalMachineVnd.map((value: any) => value / exchangeRate),
        ...totalMachineUsd,
      ].reduce((sum: number, value: number) => sum + value, 0)
      doc.report.totalValue = totalValueMachine + totalValueMateria
      return doc
    }
  }
}
export const checkSoluong: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data) return
  const inventoryMap = new Map()
  const errorSet = new Set<string>()
  const nameMaterialMap = new Map()
  const inventory = await req.payload.findByID({
    collection: 'MaterialsAndMachine_Inventory',
    id: data.inventory,
  })
  if (data.materials?.materialsProduce?.length) {
    const getMaterialDetails = (material: any) => {
      const materialId =
        typeof material.materialName === 'object' && material.materialName !== null
          ? material.materialName.id
          : material.materialName
      const materialSupplier =
        typeof material.suppliersMaterial === 'object' && material.suppliersMaterial !== null
          ? material.suppliersMaterial.id
          : material.suppliersMaterial
      const materialName =
        typeof material.materialName === 'object' && material.materialName !== null
          ? material.materialName.materialsName
          : material.materialName
      const materialSupplierName =
        typeof material.suppliersMaterial === 'object' && material.suppliersMaterial !== null
          ? material.suppliersMaterial.name
          : material.suppliersMaterial

      return { materialId, materialSupplier, materialName, materialSupplierName }
    }

    inventory.material?.forEach((dt) => {
      const { materialId, materialSupplier, materialName, materialSupplierName } =
        getMaterialDetails(dt)
      nameMaterialMap.set(`${materialId}-${materialSupplier}`, {
        ...dt,
        materialName,
        materialSupplierName,
      })
      inventoryMap.set(`${materialId}-${materialSupplier}-${dt.unitMaterial}`, {
        ...dt,
      })
    })
    if (operation === 'create') {
      data.materials?.materialsProduce.map((pc: any) => {
        const key = `${pc.materialsName}-${pc.suppliersMaterials}-${pc.unitsMaterials}`
        const keyName = `${pc.materialsName}-${pc.suppliersMaterials}`
        const dt = inventoryMap.get(key)
        const name = nameMaterialMap.get(keyName)
        if (!dt)
          if (name) {
            errorSet.add(
              `Vật liệu: ${name.materialName} với nhà cung cấp: ${name.materialSupplierName} không có trong kho`,
            )
          }
      })

      if (errorSet.size > 0) {
        throw new APIError(Array.from(errorSet).join('; '), 400)
      }
      return data
    }
    if (operation === 'update') {
      const errorMaterials = new Set<string>()
      data.materials?.materialsProduce.map((pc: any) => {
        const originalDocs =
          originalDoc.materials?.materialsProduce.find((od: any) => od?.id === pc?.id) || null
        if (!originalDocs || originalDocs === null) {
          const key = `${pc.materialsName}-${pc.suppliersMaterials}-${pc.unitsMaterials}`
          const keyName = `${pc.materialsName}-${pc.suppliersMaterials}`
          const dt = inventoryMap.get(key)
          const name = nameMaterialMap.get(keyName)
          if (!dt)
            if (name) {
              errorSet.add(
                `Vật liệu: ${name.materialName} với nhà cung cấp: ${name.materialSupplierName} không có trong kho`,
              )
            }
        } else {
          if (
            originalDocs.soluongMaterials !== pc.soluongMaterials ||
            originalDocs.materialsName !== pc.materialsName ||
            originalDocs.suppliersMaterials !== pc.suppliersMaterials ||
            originalDocs.unitsMaterials !== pc.unitsMaterials
          ) {
            errorMaterials.add('Không được chỉnh sửa phiểu đã tạo')
          }
        }
      })
      if (errorMaterials.size > 0) {
        throw new APIError(Array.from(errorMaterials).join('; '), 400)
      }
      if (errorSet.size > 0) {
        throw new APIError(Array.from(errorSet).join('; '), 400)
      }
      return data
    }
  }
  if (data.machine?.machinesProduce?.length !== 0) {
    const getMachineDetails = (machine: any) => {
      const machineId =
        typeof machine.machineName === 'object' && machine.machineName !== null
          ? machine.machineName.id
          : machine.machineName
      const machineSupplier =
        typeof machine.suppliersMachine === 'object' && machine.suppliersMachine !== null
          ? machine.suppliersMachine.id
          : machine.suppliersMachine
      const machineName =
        typeof machine.machineName === 'object' && machine.machineName !== null
          ? machine.machineName.nameMachine
          : machine.machineName
      const machineSupplierName =
        typeof machine.suppliersMachine === 'object' && machine.suppliersMachine !== null
          ? machine.suppliersMachine.name
          : machine.suppliersMachine

      return { machineId, machineSupplier, machineName, machineSupplierName }
    }
    inventory.machine?.forEach((dt) => {
      const { machineId, machineSupplier, machineName, machineSupplierName } = getMachineDetails(dt)
      nameMaterialMap.set(`${machineId}-${machineSupplier}`, {
        ...dt,
        machineName,
        machineSupplierName,
      })
      inventoryMap.set(`${machineId}-${machineSupplier}-${dt.unitMachine}`, {
        ...dt,
      })
    })
    if (operation === 'create') {
      data.machine?.machinesProduce.map((pc: any) => {
        const key = `${pc.machinesName}-${pc.suppliersMachines}-${pc.unitsMachines}`
        const keyName = `${pc.machinesName}-${pc.suppliersMachines}`
        const dt = inventoryMap.get(key)
        const name = nameMaterialMap.get(keyName)
        if (!dt)
          if (name) {
            errorSet.add(
              `Máy móc: ${name.machineName} với nhà cung cấp: ${name.machineSupplierName} không có trong kho`,
            )
          }
      })

      if (errorSet.size > 0) {
        throw new APIError(Array.from(errorSet).join('; '), 400)
      }
      return data
    }
    if (operation === 'update') {
      const errorMaterials = new Set<string>()
      data.machine?.machinesProduce.map((pc: any) => {
        const originalDocs =
          originalDoc.machine?.machinesProduce.find((od: any) => od?.id === pc?.id) || null
        if (!originalDocs || originalDocs === null) {
          const key = `${pc.machinesName}-${pc.suppliersMachines}-${pc.unitsMachines}`
          const keyName = `${pc.machinesName}-${pc.suppliersMachines}`
          const dt = inventoryMap.get(key)
          const name = nameMaterialMap.get(keyName)
          if (!dt)
            if (name) {
              errorSet.add(
                `Máy móc: ${name.machineName} với nhà cung cấp: ${name.machineSupplierName} không có trong kho`,
              )
            }
        } else {
          if (
            originalDocs.soluongMachines !== pc.soluongMachines ||
            originalDocs.machinesName !== pc.machinesName ||
            originalDocs.suppliersMachines !== pc.suppliersMachines ||
            originalDocs.unitsMachines !== pc.unitsMachines
          ) {
            errorMaterials.add('Không được chỉnh sửa phiểu đã tạo')
          }
        }
      })
      if (errorMaterials.size > 0) {
        throw new APIError(Array.from(errorMaterials).join('; '), 400)
      }
      if (errorSet.size > 0) {
        throw new APIError(Array.from(errorSet).join('; '), 400)
      }
      return data
    }
  }
}
export const checkTime: CollectionBeforeValidateHook = ({ data, originalDoc, operation }) => {
  if (!data) return
  const error: string[] = []
  const today = new Date()
  const threeDaysAgo = new Date()
  const oneNextDay = new Date()
  const inputDate = new Date(data.date)
  const inputOriginalDate = new Date(originalDoc.date)
  threeDaysAgo.setDate(today.getDate() - 3)
  oneNextDay.setDate(inputDate.getDate() + 1)
  const formatDate = (date: any) => {
    return new Date(date).toISOString().split('T')[0]
  }
  if (operation === 'create') {
    if (formatDate(inputDate) > formatDate(today)) {
      error.push('Ngày nhập không được ở tương lai.')
    }
    if (formatDate(inputDate) < formatDate(threeDaysAgo)) {
      error.push('Chỉ có thể tạo phiếu trong vòng 3 ngày trước.')
    }
    if (error.length > 0) {
      throw new APIError(`${error.join('; ')}`, 400)
    }
  }
  if (operation === 'update') {
    if (formatDate(inputOriginalDate) === formatDate(inputDate)) {
      if (today > oneNextDay) {
        error.push('Chỉ có thể sửa phiếu trong ngày hoặc ngày hôm sau.')
      }
    } else {
      error.push('Không thể sửa ngày nhập.')
    }
    if (error.length > 0) {
      throw new APIError(`${error.join('; ')}`, 400)
    }
  }
}
export const checkInfo: CollectionBeforeValidateHook = ({ data }) => {
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
