import React from 'react'
import PropTypes from 'prop-types'
import Navbar from 'react-bootstrap/Navbar'
import { TransparentButton } from './Button'
import { useResponsive } from '@/hooks'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Container from 'react-bootstrap/Container'
import { BsPlus } from 'react-icons/bs'

type DrawerProps = {
  DrawerTitle: string
  DrawerBody: React.ReactNode
  Button: React.ReactNode
  ButtonName: string
  width?: string
  onClick: () => void
}

function Drawer({
  ButtonName,
  DrawerTitle,
  DrawerBody,
  width,
  Button,
  onClick,
}: DrawerProps) {
  const { isMobile, isTablet, isLaptop } = useResponsive()

  const defaultWidth = isMobile
    ? '100vw'
    : isTablet
      ? '70vw'
      : isLaptop
        ? '50vw'
        : '40vw'

  const margin = isMobile ? '5px' : '20px'
  return (
    <Navbar expand={false}>
      <Container fluid>
        <Navbar.Brand href="#"></Navbar.Brand>
        <Navbar.Toggle
          aria-controls={`offcanvasNavbar-expand-false`}
          style={{ background: 'none', border: 0 }}
        >
          {!Button && (
            <TransparentButton onClick={onClick}>
              {isMobile && <BsPlus size={20} />}
              {!isMobile && (
                <>
                  <BsPlus size={25} /> {ButtonName}{' '}
                </>
              )}
            </TransparentButton>
          )}
          {Button && Button}
        </Navbar.Toggle>
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-false`}
          aria-labelledby={`offcanvasNavbarLabel-expand-false`}
          placement="end"
          style={{
            width: width ? width : defaultWidth,
          }}
        >
          <Offcanvas.Header
            closeButton
            style={{ margin: margin, marginBottom: '0' }}
          >
            <Offcanvas.Title
              id={`offcanvasNavbarLabel-expand-false`}
              style={{
                color: '#101828',
                fontWeight: 'bold',
              }}
            >
              {DrawerTitle}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body
            style={{
              margin: margin,
              scrollbarWidth: 'thin',
            }}
          >
            {DrawerBody}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
Drawer.propTypes = {
  DrawerTitle: PropTypes.string.isRequired,
  DrawerBody: PropTypes.element.isRequired,
  Button: PropTypes.element,
  ButtonName: PropTypes.string,
  width: PropTypes.string,
}
export default Drawer
