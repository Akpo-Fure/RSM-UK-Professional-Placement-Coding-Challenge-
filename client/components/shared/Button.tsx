import styled, { css } from 'styled-components'

const BtnStyles = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: fit-content;
  white-space: nowrap;
`

const TransparentButton = styled.button<{ disabled?: boolean }>`
  ${BtnStyles};
  background-color: transparent;
  color: #344054;
  border: 1px solid #d0d5dd;

  ${({ disabled }) => disabled && 'opacity: 0.5;'}

  &:hover,
  &:focus {
    opacity: 0.65;
  }

  &:disabled {
    cursor: not-allowed;
  }
`

const LightBlueButton = styled.button<{ disabled?: boolean }>`
  ${BtnStyles};
  background-color: #1a73e8;
  color: #fff;
  border: 1px solid #d0d5dd;

  ${({ disabled }) => disabled && 'opacity: 0.5;'}

  &:hover,
  &:focus {
    opacity: 0.65;
  }

  &:disabled {
    cursor: not-allowed;
  }
`

export { TransparentButton, LightBlueButton }
