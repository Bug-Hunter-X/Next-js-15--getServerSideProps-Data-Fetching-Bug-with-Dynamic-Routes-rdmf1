// bugSolution.js
import {unstable_getServerSession} from 'next-auth/next'
import {authOptions} from '../pages/api/auth/[...nextauth]'

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  const {params} = context
  const id = params.id
  const res = await fetch(`https://api.example.com/data/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.accessToken}`,
    },
  })
  if (!res.ok) {
    console.error('Error fetching data:', res.status, res.statusText)
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    }
  }
  const data = await res.json()

  return {
    props: {
      data,
      session,
    },
  }
}

export default function MyComponent({data, session}){
  return (
    <div><h1>Data from API: {JSON.stringify(data)}</h1></div>
  )
}