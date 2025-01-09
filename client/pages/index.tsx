import Head from 'next/head'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useGetAPI } from '@/hooks/home.hook'

const Main = styled.main`
  height: 100vh;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  display: flex;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.5s;
    animation: shake 0.5s;
  }
`

export default function Home() {
  const router = useRouter()
  const { data } = useGetAPI()
  console.log(data) // For testing purposes

  return (
    <>
      <Head>
        <title>RSM Uk Professional Placement Coding Challenge</title>
        <meta
          name="description"
          content="This is a coding challenge for the RSM Uk Professional Placement."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/RSM-UK-Logo.png" />
      </Head>
      <Main>
        <Container onClick={() => router.push('/streaming-services')}>
          <ResponsiveImage
            src="/images/RSM-UK-Logo.png"
            width="200px"
            height="200px"
            alt="RSM Uk Professional Placement"
          />
        </Container>
      </Main>
    </>
  )
}
