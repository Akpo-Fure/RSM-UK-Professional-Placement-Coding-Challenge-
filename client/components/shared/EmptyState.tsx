import React, { JSX } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import fontSizes from '@/constants/fontsizes'
import colors from '@/constants/colors'
import device from '@/constants/breakpoints'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  text-align: center;
  padding: 2rem;
`
const Paragraph = styled.p`
  font-size: ${fontSizes.s};
  color: #667085;
  width: 70%;
  @media ${device.mobile} {
    font-size: ${fontSizes.xs};
  }
`

const Title = styled.h2`
  font-size: ${fontSizes.l};
  font-weight: 600;
  color: #101828;
  margin-bottom: 0.2rem;
  @media ${device.mobile} {
    font-size: ${fontSizes.m};
  }
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const ButtonStyle = styled.button`
  margin: 0 0.5rem;
  background-color: #1a73e8;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: ${fontSizes.m};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
const CancelStyle = styled.button`
  margin: 0 0.5rem;
  background-color: ${colors.white};
  color: ${colors.black};
  border: 1px solid #d0d5dd;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: ${fontSizes.m};
`
const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
`

const RowFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`

function EmptyState({
  iconImage,
  title,
  description,
  buttonIcon,
  buttonText,
  cancelBtn,
  onClick = () => {},
  onCancelClick = () => {},
  loading,
}: PropTypes.InferProps<typeof EmptyState.propTypes>): JSX.Element {
  return (
    <Wrapper>
      {iconImage}
      <TextWrapper>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </TextWrapper>
      <BtnWrapper>
        {buttonText && (
          <ButtonStyle
            onClick={onClick as () => void}
            disabled={loading || false}
          >
            {!loading ? (
              <RowFlex>
                {buttonIcon}
                <span>{buttonText}</span>
              </RowFlex>
            ) : (
              'Loading...'
            )}
          </ButtonStyle>
        )}
        {cancelBtn && (
          <CancelStyle onClick={onCancelClick as () => void}>
            Cancel
          </CancelStyle>
        )}
      </BtnWrapper>
    </Wrapper>
  )
}

EmptyState.propTypes = {
  iconImage: PropTypes.element,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonIcon: PropTypes.element,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  cancelBtn: PropTypes.bool,
  onCancelClick: PropTypes.func,
}
export default EmptyState
