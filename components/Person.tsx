import Link from 'next/link'
import { Person } from '../interfaces'
import styles from '../styles/person-card.module.css'

type PersonProps = {
  person: Person
}

function ribbonClass(gender: string): string {
  if (gender === 'Male') return styles.ribbonMale
  if (gender === 'Female') return styles.ribbonFemale
  return styles.ribbonNa
}

export default function PersonComponent({ person }: PersonProps) {
  console.log('Console Error Triggered...')
  return (
    <li className={styles.item}>
      <Link href="/person/[id]" as={`/person/${person.id}`} className={styles.card}>
        <span
          className={ribbonClass(person.gender)}
          aria-label={`Gender: ${person.gender}`}
          title={person.gender}
        />
        <span className={styles.id}>#{person.id}</span>
        <span className={styles.name} title={person.name}>
          {person.name}
        </span>
        <span className={styles.cta}>View profile →</span>
      </Link>
    </li>
  )
}
