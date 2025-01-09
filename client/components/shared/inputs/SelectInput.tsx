import { Form } from 'react-bootstrap'
import colors from '@/constants/colors'

type SelectInputProps = {
  value: string | number
  label: string
  options: string[]
  required?: boolean
  list: string[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  errors?: string
}

const SelectInput = ({
  value,
  label,
  options = [],
  required = false,
  list = [],
  onChange,
  errors = '',
}: SelectInputProps) => {
  if (options.length !== list.length) {
    throw new Error('Options and list must be the same length')
  }

  return (
    <Form.Group style={{ gap: '0em' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25em',
        }}
      >
        <Form.Label style={{ marginBottom: '0em' }}>
          {label} {required && <span style={{ color: colors.error }}>*</span>}
        </Form.Label>
        <Form.Select value={value} onChange={onChange}>
          {options.map((option, index) => (
            <option key={option} value={list[index]}>
              {option}
            </option>
          ))}
        </Form.Select>
      </div>

      {errors && (
        <Form.Text style={{ color: colors.error }}>{errors}</Form.Text>
      )}
    </Form.Group>
  )
}

export default SelectInput
