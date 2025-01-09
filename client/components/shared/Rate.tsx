import { Form } from 'react-bootstrap'
import { TransparentButton } from './Button'
import CenteredModal from './CentreModal'
import { TextInput } from './inputs'
import fontSizes from '@/constants/fontsizes'

function Rate({
  isOpen,
  setIsOpen,
  title,
  rating,
  setRating,
  handleSubmit,
  error,
  isLooading,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title: string
  rating: number
  setRating: (rating: number) => void
  handleSubmit: () => void
  error: string
  isLooading: boolean
}) {
  return (
    <CenteredModal
      size="sm"
      show={isOpen}
      onHide={() => setIsOpen(false)}
      header={
        <h3
          style={{
            fontSize: fontSizes.xl,
          }}
        >
          {title}
        </h3>
      }
    >
      <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextInput
          label="Rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          errors={error}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <TransparentButton
            onClick={handleSubmit}
            style={{
              width: 'fit-content',
            }}
          >
            {isLooading ? 'Updating...' : 'Update Rating'}
          </TransparentButton>
        </div>
      </Form>
    </CenteredModal>
  )
}

export default Rate
