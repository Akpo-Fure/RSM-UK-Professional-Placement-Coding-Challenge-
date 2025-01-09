import StyledTable from '@/components/shared/Table'
import PositionedModal from '@/components/shared/PositionModal'
import ListModal from '@/components/shared/ListItemModal'
import { useRouter } from 'next/router'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useMemo, useState } from 'react'
import {
  useGetFilmsByService,
  useRateFilm,
  useDeleteFilm,
} from '@/hooks/film.hook'
import {
  GetFilmsResponse,
  RateFilmSchema,
  RateFilmDto,
} from '@/schema/film.schema'
import fontSizes from '@/constants/fontsizes'
import { AddFilm } from '.'
import { TransparentButton } from '@/components/shared/Button'
import Rate from '../shared/Rate'
import { validate, runtimeInHHMMSS } from '@/utils'
import { Film } from '@/types'

function FilmTable() {
  const router = useRouter()
  const streamingServiceId = router.query.id as string
  const serviceeName = router.query.name as string
  const [showModal, setShowModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [rateModal, setRateModal] = useState(false)
  const [ratingError, setRatingError] = useState('')
  const [film, setFilm] = useState<Film>()
  const [event, setEvent] = useState<React.MouseEvent>()
  const { data, isPending } = useGetFilmsByService(streamingServiceId)
  const { mutate: rateFilm, isPending: isRatingFilm } = useRateFilm(
    film?.id as string,
  )
  const { mutate: deleteFilm, isPending: isDeletingFilm } = useDeleteFilm(
    film?.id as string,
    streamingServiceId,
  )

  const [ratingForm, setRatingForm] = useState<RateFilmDto>({
    rating: film?.rating || 0,
  })

  const response = data?.data as GetFilmsResponse

  const bodyRows = useMemo(() => {
    if (!response) return []
    return response.data.map((film) => [
      <span
        key={film.id}
        style={{
          fontWeight: 'bold',
        }}
      >
        {film.name}
      </span>,
      film.year,
      film.genre,
      film.rating,
      `${runtimeInHHMMSS({ runtime: film.runtime })}`,
      new Date(film.createdAt).toLocaleDateString(),
      <BsThreeDotsVertical
        key={film.id}
        style={{
          cursor: 'pointer',
        }}
        onClick={(e) => {
          setShowModal(true)
          setEvent(e)
          setFilm(film)
          setRatingForm({
            rating: film.rating,
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

      rateFilm(ratingForm, {
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
            Add Film
          </TransparentButton>
        }
        title={'Films on ' + serviceeName}
        labels={[
          'Name',
          'Year',
          'Genre',
          'Rating',
          'Runtime',
          'Date Added',
          'Actions',
          '',
        ]}
        bodyRows={bodyRows}
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
              key={film?.id + 'rate'}
              onClick={() => setRateModal(true)}
            >
              Rate Film
            </span>,
            <span
              style={{
                fontSize: fontSizes.s,
                cursor: isDeletingFilm ? 'not-allowed' : 'pointer',
              }}
              key={film?.id + 'delete'}
              onClick={() => deleteFilm()}
            >
              {isDeletingFilm ? 'Deleting...' : 'Delete Film'}
            </span>,
          ]}
        />
      </PositionedModal>
      <AddFilm
        isOpen={addModal}
        setIsOpen={setAddModal}
        streamingServiceId={streamingServiceId}
      />
      <Rate
        isOpen={rateModal}
        setIsOpen={setRateModal}
        title={`Rate ${film?.name} (${film?.year})`}
        rating={ratingForm.rating}
        setRating={(rating) =>
          setRatingForm((prev) => ({
            ...prev,
            rating,
          }))
        }
        handleSubmit={handleRateFilm}
        error={ratingError}
        isLooading={isRatingFilm}
      />
    </>
  )
}

export default FilmTable
