import Skeleton from 'react-loading-skeleton'
import { useResponsive } from '@/hooks'

const ResponsiveTableLoader = ({ count = 5 }: { count?: number }) => {
  const { isMobile } = useResponsive()
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%' }}>
          <tbody
            style={{ display: 'flex', flexDirection: 'column', gap: '0em' }}
          >
            {Array(count)
              .fill(0)
              .map((_, index) => (
                <tr
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5em 0.5em',
                  }}
                >
                  <td style={{ width: '20%', maxWidth: '45px' }}>
                    <Skeleton height={45} circle={true} />
                  </td>
                  <td style={{ width: isMobile ? '30%' : '15%' }}>
                    <Skeleton height={40} />
                  </td>
                  <td style={{ width: isMobile ? '50%' : '30%' }}>
                    <Skeleton height={40} />
                  </td>
                  {!isMobile && (
                    <td style={{ width: '37%' }}>
                      <Skeleton height={40} />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResponsiveTableLoader
