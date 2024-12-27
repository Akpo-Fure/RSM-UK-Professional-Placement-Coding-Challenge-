import { ValidationOptions, registerDecorator } from 'class-validator'

export function IsSeasonNumbersUnique(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsSeasonNumbersUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(seasons) {
          if (!Array.isArray(seasons)) {
            return false
          }
          const seasonNumbers = seasons.map((season) => season.number)
          const uniqueNumbers = new Set(seasonNumbers)
          return seasonNumbers.length === uniqueNumbers.size
        },
        defaultMessage() {
          return `Season numbers in the seasons array must be unique`
        },
      },
    })
  }
}
