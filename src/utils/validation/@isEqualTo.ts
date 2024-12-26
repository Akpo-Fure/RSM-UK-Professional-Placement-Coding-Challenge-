import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator'

export function IsEqualToProperty(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEqualToProperty',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = args.object[relatedPropertyName]
          return value === relatedValue
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          return `${propertyName} must be the same as ${relatedPropertyName}`
        },
      },
    })
  }
}
