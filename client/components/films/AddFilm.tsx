import { Form } from 'react-bootstrap'
import { validate } from '@/utils'
import { useEffect, useState } from 'react'
import { AddFilmDto, AddFilmSchema } from '@/schema'
import { useAddFilm } from '@/hooks/film.hook'
import { TextInput, SelectInput } from '@/components/shared/inputs'
import CenteredModal from '@/components/shared/CentreModal'
import { LightBlueButton, TransparentButton } from '@/components/shared/Button'
import fontSizes from '@/constants/fontsizes'
import { Genre } from '@/types'

function AddFilm({
  isOpen,
  setIsOpen,
  streamingServiceId,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void

  streamingServiceId: string
}) {
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null)

  const [form, setForm] = useState<AddFilmDto>({
    name: '',
    year: 0,
    genre: Genre.ACTION,
    rating: 5,
    runtime: 0,
    streamingServiceId: streamingServiceId,
  })

  const { mutate, isPending } = useAddFilm(streamingServiceId)

  const handleCreate = async () => {
    validate(AddFilmSchema, form).then(({ errors }) => {
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
      streamingServiceId,
    }))
  }, [streamingServiceId])

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
          Add Film
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
          label={'Name'}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          errors={errors?.name}
        />
        <TextInput
          label={'Year'}
          type="number"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
          required
          errors={errors?.year}
        />
        <SelectInput
          label={'Genre'}
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value as Genre })}
          required
          options={Object.values(Genre)}
          list={Object.values(Genre)}
          errors={errors?.genre}
        />
        <TextInput
          label={'Rating'}
          type="number"
          value={form.rating}
          onChange={(e) =>
            setForm({ ...form, rating: parseInt(e.target.value) })
          }
          required
          errors={errors?.rating}
        />
        <TextInput
          label={'Runtime (in minutes)'}
          value={form.runtime}
          type="number"
          onChange={(e) =>
            setForm({
              ...form,
              runtime: parseInt(e.target.value),
            })
          }
          required
          errors={errors?.runtime}
        />
      </Form>
    </CenteredModal>
  )
}

export default AddFilm
