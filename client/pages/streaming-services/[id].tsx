import { FaLongArrowAltLeft } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { useResponsive } from '@/hooks'
import { FilmTable } from '@/components/films'
import { TvShowsTable } from '@/components/tv-shows'
import Background from '@/components/shared/Background'
import colors from '@/constants/colors'
import fontSizes from '@/constants/fontsizes'

function FilmsAndTvShows() {
  const router = useRouter()
  const { isMobile } = useResponsive()

  return (
    <Background>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: isMobile ? '0.5em' : '1em',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => router.back()}
        >
          <FaLongArrowAltLeft
            size={isMobile ? fontSizes.s : fontSizes.m}
            color={colors.black}
          />

          <span
            style={{
              fontSize: isMobile ? fontSizes.s : fontSizes.m,
              color: colors.black,
            }}
          >
            Back to Streaming Services
          </span>
        </div>

        <FilmTable />
        <TvShowsTable />
      </div>
    </Background>
  )
}

export default FilmsAndTvShows
