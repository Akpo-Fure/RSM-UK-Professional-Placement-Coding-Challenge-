import { Form } from 'react-bootstrap'
import { validate } from '@/utils'
import { useEffect, useState } from 'react'
import { AddSeasonDto, AddTvShowDto, AddTvShowSchema } from '@/schema'
import { TvShow } from '@/types'
import {
  useAddTvShow,
  useGetTvShowsOnOtherServices,
  useAddTvShowToService,
} from '@/hooks/tv-show.hook'
import { TextInput, SelectInput } from '@/components/shared/inputs'
import CenteredModal from '@/components/shared/CentreModal'
import { LightBlueButton, TransparentButton } from '@/components/shared/Button'
import fontSizes from '@/constants/fontsizes'
import { Genre } from '@/types'
import { toast } from 'react-toastify'
import ViewSeasons from './ViewSeasons'

function AddTvShow({
  isOpen,
  setIsOpen,
  streamingServiceId,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  streamingServiceId: string
}) {
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null)
  const [addFromOtherServices, setAddFromOtherServices] = useState(false)

  const { data: response } = useGetTvShowsOnOtherServices(streamingServiceId)

  const tvShows = response?.data?.data as TvShow[]

  const [tvShowId, setTvShowId] = useState<string | null>(null)

  const { mutate: addTvShowToService, isPending: isAddTvShowToServicePending } =
    useAddTvShowToService(tvShowId!, streamingServiceId)

  const [form, setForm] = useState<AddTvShowDto>({
    name: '',
    genre: Genre.SCIENCE_FICTION,
    rating: 0,
    streamingServiceId: streamingServiceId,
    seasons: [],
  })

  const [seasonForm, setSeasonForm] = useState<AddSeasonDto>({
    number: 0,
    year: 0,
    noOfEpisodes: 0,
  })

  const [addSeasonModal, setAddSeasonModal] = useState(false)

  const { mutate, isPending } = useAddTvShow(streamingServiceId)

  const handleCreate = async () => {
    validate(AddTvShowSchema, form).then(({ errors }) => {
      if (errors) {
        setErrors(errors)
        return
      }

      mutate(form, {
        onSuccess: () => {
          setIsOpen(false)
        },
      })
    })
  }

  const handleAddSeason = async (seasonForm: AddSeasonDto) => {
    const seasonExists = form.seasons.find(
      (season) => season.number === seasonForm.number,
    )

    if (seasonExists) {
      toast.error('Season number already exists')
      return
    }

    if (seasonForm.year < 1900 || seasonForm.year > new Date().getFullYear()) {
      toast.error('Invalid year')
      return
    }

    setForm((prevForm) => ({
      ...prevForm,
      seasons: [...prevForm.seasons, seasonForm],
    }))

    setSeasonForm({
      number: 0,
      year: 0,
      noOfEpisodes: 0,
    })
  }

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      streamingServiceId,
    }))
  }, [streamingServiceId])

  useEffect(() => {
    if (tvShows?.length > 0) {
      setTvShowId(tvShows[0].id)
    }
  }, [tvShows])

  return (
    <CenteredModal
      size={'lg'}
      show={isOpen}
      onHide={() => setIsOpen(false)}
      header={
        <h5
          style={{
            fontSize: fontSizes.xl,
          }}
        >
          Add Tv Show
        </h5>
      }
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1em',
          }}
        >
          {!addFromOtherServices ? (
            <>
              <TransparentButton onClick={() => setIsOpen(false)}>
                Close
              </TransparentButton>
              <LightBlueButton
                onClick={() => handleCreate()}
                disabled={isPending}
              >
                {isPending ? 'Adding...' : 'Add'}
              </LightBlueButton>
            </>
          ) : (
            <LightBlueButton
              onClick={() => {
                addTvShowToService()
              }}
              disabled={isAddTvShowToServicePending}
            >
              {isAddTvShowToServicePending ? 'Adding...' : 'Add'}
            </LightBlueButton>
          )}
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1em',
          }}
        >
          <span>Add from other services</span>
          <input
            type="checkbox"
            checked={addFromOtherServices}
            onChange={(e) => setAddFromOtherServices(e.target.checked)}
          />
        </div>
        {!addFromOtherServices ? (
          <Form>
            <TextInput
              label={'Name'}
              value={form.name}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  name: e.target.value,
                }))
              }
              errors={errors?.name}
            />
            <SelectInput
              label={'Genre'}
              value={form.genre}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  genre: e.target.value as Genre,
                }))
              }
              options={Object.values(Genre)}
              list={Object.values(Genre)}
              errors={errors?.genre}
            />
            <TextInput
              label={'Rating'}
              type={'number'}
              value={form.rating}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  rating: parseInt(e.target.value),
                }))
              }
              errors={errors?.rating}
            />
          </Form>
        ) : (
          <Form>
            <SelectInput
              label={'Tv Show'}
              value={form.name}
              onChange={(e) => setTvShowId(e.target.value)}
              options={tvShows?.map((tvShow) => tvShow.name) || []}
              list={tvShows?.map((tvShow) => tvShow.id) || []}
              errors={errors?.name}
            />
          </Form>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
          <CenteredModal
            size={'sm'}
            show={addSeasonModal}
            onHide={() => setAddSeasonModal(false)}
            header={
              <h5
                style={{
                  fontSize: fontSizes.xl,
                }}
              >
                Add Season
              </h5>
            }
            footer={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1em',
                }}
              >
                <TransparentButton
                  style={{ width: 'fit-content' }}
                  onClick={() => {
                    handleAddSeason(seasonForm)
                    setAddSeasonModal(false)
                  }}
                >
                  Save
                </TransparentButton>
                <LightBlueButton
                  style={{ width: 'fit-content' }}
                  onClick={() => {
                    handleAddSeason(seasonForm)
                  }}
                >
                  Save & Add Another
                </LightBlueButton>
              </div>
            }
          >
            <Form>
              <TextInput
                label={'Season Number'}
                type={'number'}
                value={seasonForm.number}
                onChange={(e) =>
                  setSeasonForm((prevForm) => ({
                    ...prevForm,
                    number: parseInt(e.target.value),
                  }))
                }
                errors={errors?.seasons}
              />
              <TextInput
                label={'Number of Episodes'}
                type={'number'}
                value={seasonForm.noOfEpisodes}
                onChange={(e) =>
                  setSeasonForm((prevForm) => ({
                    ...prevForm,
                    noOfEpisodes: parseInt(e.target.value),
                  }))
                }
                errors={errors?.seasons}
              />
              <TextInput
                label={'Year'}
                type={'number'}
                value={seasonForm.year}
                onChange={(e) =>
                  setSeasonForm((prevForm) => ({
                    ...prevForm,
                    year: parseInt(e.target.value),
                  }))
                }
                errors={errors?.seasons}
              />
            </Form>
          </CenteredModal>
          {!addFromOtherServices && (
            <>
              <ViewSeasons
                seasons={form.seasons}
                onRemove={(number) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    seasons: prevForm.seasons.filter(
                      (s) => s.number !== number,
                    ),
                  }))
                }
              />

              <TransparentButton onClick={() => setAddSeasonModal(true)}>
                Add Season
              </TransparentButton>
            </>
          )}
        </div>
      </div>
    </CenteredModal>
  )
}

export default AddTvShow
