export class ResponseDto<T> {
  message: string
  data?: T
  currentPage?: number
  count?: number
  totalPages?: number

  constructor(
    message: string,
    data?: T,
    currentPage?: number,
    count?: number,
    totalPages?: number,
  ) {
    this.message = message
    this.data = data
    this.currentPage = Number(currentPage)
    this.count = Number(count)
    this.totalPages = Number(totalPages)
  }
}
