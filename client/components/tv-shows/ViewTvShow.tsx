import CenteredModal from '@/components/shared/CentreModal'
import { TvShowGetResponse } from '@/types'
import { ViewSeasons } from '@/components/tv-shows'

function ViewTvShow({
  tvShow,
  isOpen,
  setIsOpen,
}: {
  tvShow: TvShowGetResponse
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  return (
    <CenteredModal
      size="lg"
      show={isOpen}
      onHide={() => setIsOpen(false)}
      header={<h5>{tvShow?.tvShow.name}</h5>}
    >
      <div
        style={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5em',
        }}
      >
        <span>Genre: {tvShow?.tvShow.genre}</span>
        <span>Rating: {tvShow?.tvShow.rating}</span>
        <span>
          Created At: {new Date(tvShow?.tvShow.createdAt).toLocaleDateString()}
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5em',
          }}
        >
          <span>Seasons:</span>
          <ViewSeasons seasons={tvShow?.season ?? []} />
        </div>
      </div>
    </CenteredModal>
  )
}

export default ViewTvShow
