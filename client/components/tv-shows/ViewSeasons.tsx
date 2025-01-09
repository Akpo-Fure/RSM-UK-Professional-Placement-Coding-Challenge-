import { FiX } from 'react-icons/fi'

function ViewSeasons({
  seasons,
  onRemove,
}: {
  seasons: { number: number; year: number; noOfEpisodes: number }[]
  onRemove?: (number: number) => void
}) {
  return (
    <div
      style={{
        flexDirection: 'column',
        gap: '1em',
        width: '100%',
      }}
    >
      {seasons.map((season, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '16px',
              alignItems: 'center',
            }}
          >
            Season {season.number} &bull; {season.noOfEpisodes} Episodes &bull;{' '}
            {season.year}
          </span>

          {onRemove && (
            <FiX
              style={{
                cursor: 'pointer',
              }}
              onClick={() => onRemove(season.number)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ViewSeasons
