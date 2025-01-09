import * as Yup from 'yup'

const validate = async (schema: Yup.ObjectSchema<Yup.AnyObject>, data = {}) => {
  if (!schema) return { errors: null, data }
  try {
    await schema.validate(data, { abortEarly: false })
    return { errors: null, data }
  } catch (error: unknown) {
    if (error instanceof Yup.ValidationError) {
      const errors: { [key: string]: string } = {}
      error.inner.forEach((e) => {
        errors[e.path as string] = e.message
      })
      return { errors, data: null }
    }
    return { errors: { general: 'An error occurred' }, data: null }
  }
}

export default validate
