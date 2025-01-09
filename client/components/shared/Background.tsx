import PropTypes from 'prop-types'
import styled from 'styled-components'
import device from '@/constants/breakpoints'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import useResponsive from '@/hooks/useResponsive'

const BackgroundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  min-height: 100vh;
  padding: 1em;
  gap: 1em;

  @media ${device.mobile} {
    padding: 0;
  }

  @media ${device.tablet} {
    padding: 0;
  }
`

function Background({
  children,
}: PropTypes.InferProps<typeof Background.propTypes>) {
  const { isMobile } = useResponsive()
  return (
    <BackgroundWrapper>
      <ResponsiveImage
        src="/images/RSM-UK-Logo.png"
        width={isMobile ? '100px' : '200px'}
        height={isMobile ? '100px' : '200px'}
        minHeight={isMobile ? '100px' : '200px'}
        alt="RSM Uk Professional Placement"
      />
      {children}
    </BackgroundWrapper>
  )
}

Background.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Background
