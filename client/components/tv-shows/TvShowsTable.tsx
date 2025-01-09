import StyledTable from '@/components/shared/Table'
import PositionedModal from '@/components/shared/PositionModal'
import ListModal from '@/components/shared/ListItemModal'
import { useRouter } from 'next/router'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useMemo, useState } from 'react'
import fontSizes from '@/constants/fontsizes'
import { useGetTvShowsByService, useRateTvShow } from '@/hooks/tv-show.hook'
import { GetTvShowsResponse } from '@/schema/tv-show.schema'
import { TransparentButton } from '@/components/shared/Button'
import { AddTvShow, ViewTvShow } from '.'
import { RateFilmSchema, RateFilmDto } from '@/schema/film.schema'
import { TvShow, TvShowGetResponse } from '@/types'
import Rate from '../shared/Rate'
import { validate } from '@/utils'
import AddSeason from './AddSeason'

function TvShowsTable() {
  const router = useRouter()
  const streamingServiceId = router.query.id as string
  const serviceeName = router.query.name as string
  const [showModal, setShowModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [rateModal, setRateModal] = useState(false)
  const [addSeason, setAddSeason] = useState(false)
  const [ratingError, setRatingError] = useState('')
  const [tvShow, setTvShow] = useState<TvShow>()
  const [viewModal, setViewModal] = useState(false)
  const [viewTvShow, setViewTvShow] = useState<TvShowGetResponse>()
  const [event, setEvent] = useState<React.MouseEvent>()
  const { data, isPending } = useGetTvShowsByService(streamingServiceId)
  const { mutate: rateTvShow, isPending: isRatingTvShow } = useRateTvShow(
    tvShow?.id as string,
  )

  const [ratingForm, setRatingForm] = useState<RateFilmDto>({
    rating: tvShow?.rating || 0,
  })

  const response = data?.data as GetTvShowsResponse

  const bodyRows = useMemo(() => {
    if (!response) return []
    return response.data.map((tvShow) => [
      <span
        key={tvShow.id}
        style={{
          fontWeight: 'bold',
        }}
      >
        {tvShow.tvShow.name}
      </span>,
      tvShow.tvShow.genre,
      tvShow.tvShow.rating,
      tvShow.season.length,
      new Date(tvShow.tvShow.createdAt).toLocaleDateString(),
      <BsThreeDotsVertical
        key={tvShow.id}
        style={{
          cursor: 'pointer',
        }}
        onClick={(e) => {
          setShowModal(true)
          setEvent(e)
          setTvShow(tvShow.tvShow)
          setViewTvShow(tvShow)
          setRatingForm({
            rating: tvShow.tvShow.rating,
          })
        }}
      />,
    ])
  }, [response])

  const handleRateFilm = async () => {
    validate(RateFilmSchema, ratingForm).then(({ errors }) => {
      if (errors) {
        setRatingError(errors.rating)
        return
      }

      rateTvShow(ratingForm, {
        onSuccess: () => {
          setRateModal(false)
        },
      })
    })
  }

  return (
    <>
      <StyledTable
        rightItem={
          <TransparentButton
            style={{
              width: 'fit-content',
            }}
            onClick={() => setAddModal(true)}
          >
            Add Tv Show
          </TransparentButton>
        }
        title={'Tv Shows on ' + serviceeName}
        bodyRows={bodyRows}
        labels={['Name', 'Genre', 'Rating', 'seasons', 'Date Added', 'Actions']}
        isTableLoading={isPending}
        minWidth={'800px'}
      />
      <PositionedModal setShowModal={setShowModal} show={showModal} e={event!}>
        <ListModal
          items={[
            <span
              style={{
                fontSize: fontSizes.s,
                cursor: 'pointer',
              }}
              key={tvShow?.id + 'view'}
              onClick={() => {
                setViewTvShow(viewTvShow)
                setViewModal(true)
              }}
            >
              View Tv Show
            </span>,

            <span
              style={{
                fontSize: fontSizes.s,
                cursor: 'pointer',
              }}
              key={tvShow?.id + 'rate'}
              onClick={() => setRateModal(true)}
            >
              Rate Tv Show
            </span>,
            <span
              style={{
                fontSize: fontSizes.s,
                cursor: 'pointer',
              }}
              key={tvShow?.id + 'add season'}
              onClick={() => setAddSeason(true)}
            >
              Add a season
            </span>,
          ]}
        />
      </PositionedModal>
      <AddTvShow
        isOpen={addModal}
        setIsOpen={setAddModal}
        streamingServiceId={streamingServiceId}
      />
      <Rate
        isOpen={rateModal}
        setIsOpen={setRateModal}
        title={`Rate ${tvShow?.name}`}
        rating={ratingForm.rating}
        setRating={(rating) =>
          setRatingForm((prev) => ({
            ...prev,
            rating,
          }))
        }
        handleSubmit={handleRateFilm}
        error={ratingError}
        isLooading={isRatingTvShow}
      />
      <ViewTvShow
        tvShow={viewTvShow as TvShowGetResponse}
        isOpen={viewModal}
        setIsOpen={setViewModal}
      />
      <AddSeason
        isOpen={addSeason}
        setIsOpen={setAddSeason}
        seasons={viewTvShow?.season ?? []}
        tvShowId={viewTvShow?.tvShow.id as string}
        streamingServiceId={streamingServiceId}
      />
    </>
  )
}

export default TvShowsTable
