import { Form } from 'react-bootstrap'
import colors from '@/constants/colors'
// import fontSizes from '@/constants/fontsizes'

type TextInputProps = {
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors?: string
  as?: 'input' | 'textarea'
  //   rows?: number
}

const TextInput = ({
  label,
  type,
  placeholder,
  required,
  value,
  onChange,
  errors,
  as,
  //   rows,
}: TextInputProps) => {
  return (
    <Form.Group
      style={{
        gap: '0em',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25em',
        }}
      >
        <Form.Label
          style={{
            marginBottom: '0em',
          }}
        >
          {label} {required && <span style={{ color: colors.error }}>*</span>}
        </Form.Label>
        <Form.Control
          //   rows={rows || 1}
          as={as || 'input'}
          required={required || false}
          type={type || 'text'}
          placeholder={placeholder || ''}
          value={value}
          onChange={onChange || (() => {})}
        />
      </div>
      {errors && (
        <Form.Text
          style={{
            color: colors.error,
          }}
        >
          {errors}
        </Form.Text>
      )}
    </Form.Group>
  )
}

export default TextInput
