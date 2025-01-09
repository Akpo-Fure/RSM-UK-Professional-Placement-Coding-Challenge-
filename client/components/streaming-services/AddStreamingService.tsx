import { Form } from 'react-bootstrap'
import { validate } from '@/utils'
import { useState } from 'react'
import {
  CreateStreamingServiceDto,
  CreateStreamingServiceSchema,
} from '@/schema'
import { useCreateStreamingService } from '@/hooks/streaming-service.hook'
import { TextInput } from '@/components/shared/inputs'
import CenteredModal from '@/components/shared/CentreModal'
import { TransparentButton, LightBlueButton } from '@/components/shared/Button'
import fontSizes from '@/constants/fontsizes'
import { Currency } from '@/types'

function AddStreamingService({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const { mutate, isPending } = useCreateStreamingService()
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null)
  const [form, setForm] = useState<CreateStreamingServiceDto>({
    name: '',
    price: 9.99,
    currency: Currency.GBP,
  })

  const handleCreate = async () => {
    validate(CreateStreamingServiceSchema, form).then(({ errors }) => {
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
          Add Streaming Service
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
            {isPending ? 'Creating...' : 'Create'}
          </LightBlueButton>
        </div>
      }
    >
      <Form
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextInput
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          errors={errors?.name}
        />
        <TextInput
          label="Price"
          value={form.price}
          type="number"
          onChange={(e) => setForm({ ...form, price: +e.target.value })}
          errors={errors?.price}
        />
      </Form>
    </CenteredModal>
  )
}

export default AddStreamingService
