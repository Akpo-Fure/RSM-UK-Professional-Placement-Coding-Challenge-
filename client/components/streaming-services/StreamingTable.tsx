import StyledTable from '@/components/shared/Table'
import PositionedModal from '@/components/shared/PositionModal'
import ListModal from '@/components/shared/ListItemModal'
import { useRouter } from 'next/router'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useMemo, useState } from 'react'
import {
  useGetStreamingServices,
  useDeleteStreamingService,
} from '@/hooks/streaming-service.hook'
import { GetStreamingServicesResponse } from '@/schema/streaming-service.schema'
import fontSizes from '@/constants/fontsizes'
import { TransparentButton } from '@/components/shared/Button'
import { AddStreamingService } from '.'
import { StreamingService } from '@/types'

function StreamingServiceTable() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [service, setService] = useState<StreamingService>()
  const [event, setEvent] = useState<React.MouseEvent>()
  const { data, isPending } = useGetStreamingServices()
  const {
    mutate: deleteStreamingService,
    isPending: isDeletingStreamingService,
  } = useDeleteStreamingService()
  const response = data?.data as GetStreamingServicesResponse

  const bodyRows = useMemo(() => {
    if (!response) return []
    return response.data.map((service) => [
      <span
        key={service.id}
        style={{
          fontWeight: 'bold',
        }}
      >
        {service.name}
      </span>,
      service.price,
      service.currency,
      service._count.film,
      service._count.tvShowStreamingService,
      <BsThreeDotsVertical
        key={service.id}
        style={{
          cursor: 'pointer',
        }}
        onClick={(e) => {
          setShowModal(true)
          setEvent(e)
          setService(service)
        }}
      />,
    ])
  }, [response])

  return (
    <>
      <StyledTable
        rightItem={
          <TransparentButton onClick={() => setAddModal(true)}>
            Add Streaming Service
          </TransparentButton>
        }
        title={'Streaming Services'}
        labels={[
          'Name',
          'Monthly Price',
          'Currency',
          'Films',
          'TV Shows',
          'Actions',
          '',
        ]}
        bodyRows={bodyRows}
        isTableLoading={isPending}
        minWidth={'800px'}
      />
      <PositionedModal setShowModal={setShowModal} show={showModal} e={event!}>
        <ListModal
          items={[
            <span
              style={{
                fontSize: fontSizes.s,
                cursor: 'pointer',
              }}
              key={service?.id + 'view'}
              onClick={() =>
                router.push(`/streaming-services/${service?.id}?name=${service?.name}
                `)
              }
            >
              View Streaming Service
            </span>,
            <span
              style={{
                fontSize: fontSizes.s,
                cursor: isDeletingStreamingService ? 'not-allowed' : 'pointer',
              }}
              key={service?.id + 'delete'}
              onClick={() => deleteStreamingService(service?.id as string)}
            >
              {isDeletingStreamingService
                ? 'Deleting...'
                : 'Delete Streaming Service'}
            </span>,
          ]}
        />
      </PositionedModal>
      <AddStreamingService isOpen={addModal} setIsOpen={setAddModal} />
    </>
  )
}

export default StreamingServiceTable
