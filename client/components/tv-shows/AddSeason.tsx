import { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { validate } from '@/utils'
import { AddSeasonToTvShowDto, AddSeasonToTvShowSchema } from '@/schema'
import { useAddSeasonToTvShow } from '@/hooks/tv-show.hook'
import { TextInput } from '@/components/shared/inputs'
import { LightBlueButton, TransparentButton } from '@/components/shared/Button'
import { Season } from '@/types'
import CenteredModal from '../shared/CentreModal'

function AddSeason({
  isOpen,
  setIsOpen,
  seasons,
  tvShowId,
  streamingServiceId,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  seasons: Season[]
  tvShowId: string
  streamingServiceId: string
}) {
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null)

  const [form, setForm] = useState<AddSeasonToTvShowDto>({
    season: {
      number: 0,
      year: 0,
      noOfEpisodes: 0,
    },
    tvShowId,
    streamingServiceId,
  })

  const { mutate, isPending } = useAddSeasonToTvShow(tvShowId)

  const handleCreate = async () => {
    const seasonExists = seasons.some(
      (season) => season.number === form.season.number,
    )

    if (seasonExists) {
      setErrors({ number: 'Season number already exists' })
      return
    }

    validate(AddSeasonToTvShowSchema, form).then(({ errors }) => {
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

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      tvShowId,
      streamingServiceId,
    }))
  }, [tvShowId, streamingServiceId])

  return (
    <CenteredModal
      size="lg"
      show={isOpen}
      onHide={() => setIsOpen(false)}
      header={<h5>Add Season</h5>}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1em',
          }}
        >
          <TransparentButton onClick={() => setIsOpen(false)}>
            Cancel
          </TransparentButton>
          <LightBlueButton onClick={handleCreate} disabled={isPending}>
            {isPending ? 'Adding...' : 'Add'}
          </LightBlueButton>
        </div>
      }
    >
      <Form>
        <TextInput
          label="Season Number"
          type="number"
          value={form.season.number}
          onChange={(e) =>
            setForm((prevForm) => ({
              ...prevForm,
              season: {
                ...prevForm.season,
                number: parseInt(e.target.value),
              },
            }))
          }
          errors={errors?.number}
        />
        <TextInput
          label="Year"
          type="number"
          value={form.season.year}
          onChange={(e) =>
            setForm((prevForm) => ({
              ...prevForm,
              season: {
                ...prevForm.season,
                year: parseInt(e.target.value),
              },
            }))
          }
          errors={errors?.year}
        />
        <TextInput
          label="Number of Episodes"
          type="number"
          value={form.season.noOfEpisodes}
          onChange={(e) =>
            setForm((prevForm) => ({
              ...prevForm,
              season: {
                ...prevForm.season,
                noOfEpisodes: parseInt(e.target.value),
              },
            }))
          }
          errors={errors?.noOfEpisodes}
        />
      </Form>
    </CenteredModal>
  )
}

export default AddSeason
