export const Genre = {
  ACTION: 'ACTION',
  ADVENTURE: 'ADVENTURE',
  COMEDY: 'COMEDY',
  CRIME: 'CRIME',
  DRAMA: 'DRAMA',
  FANTASY: 'FANTASY',
  HISTORICAL: 'HISTORICAL',
  HORROR: 'HORROR',
  MYSTERY: 'MYSTERY',
  PHILOSOPHICAL: 'PHILOSOPHICAL',
  POLITICAL: 'POLITICAL',
  ROMANCE: 'ROMANCE',
  SAGA: 'SAGA',
  SATIRE: 'SATIRE',
  SCIENCE_FICTION: 'SCIENCE_FICTION',
  THRILLER: 'THRILLER',
  URBAN: 'URBAN',
  WESTERN: 'WESTERN',
}

export type Genre = (typeof Genre)[keyof typeof Genre]

export const Currency = {
  GBP: 'GBP',
  USD: 'USD',
  EUR: 'EUR',
  NGN: 'NGN',
}

export type Currency = (typeof Currency)[keyof typeof Currency]

export type Film = {
  id: string
  streamingServiceId: string
  name: string
  year: number
  genre: Genre
  rating: number
  runtime: number
  createdAt: Date
  updatedAt: Date
}

export type StreamingService = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  price: number
  currency: Currency
  deleted: boolean
}

export type StreamingServiceGetResponse = {
  _count: {
    film: number
    tvShowStreamingService: number
  }
} & StreamingService

export type Season = {
  number: number
  year: number
  noOfEpisodes: number
  id: string
  tvShowStreamingServiceId: string
  createdAt: Date
  updatedAt: Date
}

export type TvShow = {
  id: string
  deleted: boolean
  name: string
  createdAt: Date
  updatedAt: Date
  genre: Genre
  rating: number
}

export type TvShowGetResponse = {
  season: Season[]
  tvShow: TvShow
} & {
  id: string
  tvShowId: string
  streamingServiceId: string
  deleted: boolean
}
