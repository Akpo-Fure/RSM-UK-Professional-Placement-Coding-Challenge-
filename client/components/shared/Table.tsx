import { JSX } from 'react'
import styled from 'styled-components'
import Proptypes from 'prop-types'
// import colors from '@/constants/colors'
import fontSizes from '@/constants/fontsizes'
import { OverflowWrapper } from '@/components/shared/Wrapper'
import EmptyState from '@/components/shared/EmptyState'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import { ResponsiveTableLoader } from '@/components/shared/loaders'
import Divider from '@/components/shared/Divider'
import Pagination from '@/components/shared/Pagination'

function StyledTable({
  labels,
  bodyRows,
  title,
  leftItem,
  rightItem,
  minWidth,
  setPage,
  totalPages,
  currentPage,
  emptyState,
  isTableLoading,
}: Proptypes.InferProps<typeof StyledTable.propTypes>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5em',
        width: '100%',
      }}
    >
      <div
        style={{
          background: 'white',
          boxShadow: '0px 4px 16px 0px #0000000D',
          border: `1.3px solid #E8E8E8`,
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1em',
            gap: '0.5em',
            borderRadius: '10px',
          }}
        >
          <FlexWrap>
            {leftItem ? leftItem : title && <Title>{title}</Title>}
            {rightItem}
          </FlexWrap>
        </div>
        <Divider />
        <OverflowWrapper minWidth={minWidth || '100%'}>
          <TableStyled>
            <thead>
              <tr
                style={{
                  position: 'relative',
                }}
              >
                {labels?.map((label, index) => <th key={index}>{label}</th>)}
              </tr>
            </thead>
            {bodyRows && (
              <tbody>
                {bodyRows?.map(
                  (
                    row: { [key: string]: string | JSX.Element },
                    index: number,
                  ) => (
                    <tr
                      key={index}
                      style={{
                        position: 'relative',
                      }}
                    >
                      {Object?.keys(row)?.map((key, index) => (
                        <td key={index}>{row[key]}</td>
                      ))}
                    </tr>
                  ),
                )}
              </tbody>
            )}
          </TableStyled>
        </OverflowWrapper>
        {!isTableLoading && bodyRows?.length === 0 && (
          <EmptyStateWrapper>
            <EmptyState
              title={emptyState?.title || 'No Data Found'}
              description={
                emptyState?.description || 'There is no data to display'
              }
              buttonText={emptyState?.buttonText ?? undefined}
              onClick={emptyState?.onclick ?? (() => {})}
              loading={emptyState?.loading || false}
              iconImage={
                <ResponsiveImage
                  height={emptyState?.imageHeight || '150px'}
                  width={emptyState?.imageWidth || '300px'}
                  src={emptyState?.imageSrc || '/icons/ghostIcon.svg'}
                />
              }
            />
          </EmptyStateWrapper>
        )}
        {isTableLoading && <ResponsiveTableLoader count={5} />}
      </div>
      {setPage &&
        totalPages !== undefined &&
        currentPage &&
        !isTableLoading && (
          <Pagination
            setPage={setPage}
            totalPages={totalPages || 1}
            currentPage={currentPage}
          />
        )}
    </div>
  )
}

StyledTable.propTypes = {
  labels: Proptypes.array.isRequired,
  bodyRows: Proptypes.array.isRequired,
  title: Proptypes.string,
  leftItem: Proptypes.node,
  rightItem: Proptypes.node,
  minWidth: Proptypes.string,
  setPage: Proptypes.func,
  totalPages: Proptypes.number,
  currentPage: Proptypes.number,
  isTableLoading: Proptypes.bool,
  emptyState: Proptypes.shape({
    title: Proptypes.string,
    description: Proptypes.string,
    imageSrc: Proptypes.any,
    buttonText: Proptypes.string,
    onclick: Proptypes.func,
    imageWidth: Proptypes.string,
    imageHeight: Proptypes.string,
    loading: Proptypes.bool,
  }),
}

export default StyledTable

const Title = styled.h1`
  font-size: ${fontSizes.xl};
  color: #101828;
  font-weight: 600;
  margin-top: 0.5em;
`

const TableStyled = styled.table<{ isDisabled?: boolean }>`
  width: 100%;
  thead {
    background-color: #f2f4f7;
    font-size: ${fontSizes.s};
    color: #667085;
    border-top: 1px solid #eaecf0;
    border-bottom: 1px solid #d0d5dd;
    th {
      padding: 1rem;
      font-weight: 600;
      padding-left: 1rem;
    }
  }
  tbody {
    border-bottom: 1px solid #d0d5dd;

    tr {
      background-color: ${({ isDisabled }) =>
        isDisabled === true ? '#F2F4F7' : 'transparent'};
      border-bottom: 1px solid#D0D5DD;
    }

    td {
      padding: 1rem;
      font-size: ${fontSizes.s};
      vertical-align: middle;
      padding-left: 1rem;
    }
  }
`

const FlexWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const EmptyStateWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5em;
`
