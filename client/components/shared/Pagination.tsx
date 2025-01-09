import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from '@/constants/colors'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useResponsive } from '@/hooks'

function PaginationComponent({
  currentPage,
  totalPages,
  setPage,
}: PropTypes.InferProps<typeof PaginationComponent.propTypes>) {
  const { isMobile, isTablet, isLaptop } = useResponsive()

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1)
    }
  }

  const renderPagination = useMemo(() => {
    const pages = []
    const maxPagesToShow = isMobile ? 5 : isTablet ? 8 : isLaptop ? 12 : 15
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2)
    let startPage = Math.max(1, currentPage - halfMaxPagesToShow)
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Text
          key={i}
          currentPage={currentPage === i}
          onClick={() => setPage(i)}
        >
          {i}
        </Text>,
      )
    }

    return pages
  }, [currentPage, totalPages, isMobile, isTablet, isLaptop, setPage])

  if (totalPages <= 1) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5em',
      }}
    >
      <ButtonContainer
        disabled={currentPage === 1}
        onClick={handlePreviousPage}
      >
        <FiArrowLeft size={20} />
      </ButtonContainer>
      <div
        style={{
          display: 'flex',
          gap: '0.5em',
          alignItems: 'center',
        }}
      >
        {renderPagination}
      </div>
      <ButtonContainer
        disabled={currentPage === totalPages}
        onClick={handleNextPage}
      >
        <FiArrowRight size={20} />
      </ButtonContainer>
    </div>
  )
}

export default PaginationComponent

PaginationComponent.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
}

const Text = styled.span<{ currentPage: boolean }>`
  border-radius: 5px;
  background-color: ${({ currentPage }) =>
    currentPage === true ? '#FFF' : 'transparent'};
  color: ${({ currentPage }) => (currentPage === true ? '#E86217' : '#797979')};
  font-weight: ${({ currentPage }) => (currentPage === true ? 600 : 400)};
  cursor: pointer;
  padding: 0.5em 0.75em;
  &:hover {
    color: #fdcbaf;
    opacity: 0.8;
  }
`

const ButtonContainer = styled.button`
  padding: 0.5rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  //   background-color: ${colors.success};
  color: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
