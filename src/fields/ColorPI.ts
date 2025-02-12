import type { Field } from 'payload'
export const validateHexColor = (value: string): boolean | string => {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value) || `${value} is not a valid hex color`
}

export const colorField: Field = {
  name: 'color',
  type: 'text',
  validate: validateHexColor,
  required: true,
}
