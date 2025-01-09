import 'bootstrap/dist/css/bootstrap.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { SkeletonTheme } from 'react-loading-skeleton'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            staleTime: Infinity,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor={'#E6E6E6'} highlightColor={'#C7C7C7'}>
        <Component {...pageProps} />
      </SkeletonTheme>
      <ToastContainer />
    </QueryClientProvider>
  )
}
