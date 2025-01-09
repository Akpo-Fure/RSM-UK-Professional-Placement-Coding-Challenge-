import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types'

function CenteredModal({
  show,
  onHide,
  size,
  header,
  footer,
  children,
}: PropTypes.InferProps<typeof CenteredModal.propTypes>) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size={size as 'sm' | 'lg' | 'xl'}
    >
      <Modal.Header closeButton>{header}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  )
}

CenteredModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'lg', 'xl']).isRequired,
  header: PropTypes.element,
  footer: PropTypes.element,
  children: PropTypes.element.isRequired,
}

export default CenteredModal
