import useSWR from 'swr'
import PersonComponent from '../components/Person'
import type { Person } from '../interfaces'
// import tracker from '@middleware.io/agent-apm-nextjs';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Index() {
  const { data, error, isLoading } = useSWR<Person[]>('/api/people', fetcher)
    console.log("myyyyy:", process.cwd())
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>
  if (!data) return null
    // tracker.warn("File accessed successfully...!");
  return (
      <>
        <ul>
          {data.map((p) => (
              <PersonComponent key={p.id} person={p} />
          ))}
        </ul>
          <button onClick={() => {window.open('/')}}>Press me</button>
      </>
  )
}
