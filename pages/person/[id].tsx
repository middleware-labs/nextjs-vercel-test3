import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import type { Person, ResponseError } from '../../interfaces'
import styles from '../../styles/person-page.module.css'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const fields: { key: keyof Person; label: string }[] = [
  { key: 'height', label: 'Height' },
  { key: 'mass', label: 'Mass' },
  { key: 'hair_color', label: 'Hair color' },
  { key: 'skin_color', label: 'Skin color' },
  { key: 'eye_color', label: 'Eye color' },
  { key: 'gender', label: 'Gender' },
]

function genderClass(gender: string): {
  avatar: string
  value: string
} {
  if (gender === 'Male') {
    return { avatar: styles.avatarMale, value: styles.genderMale }
  }
  if (gender === 'Female') {
    return { avatar: styles.avatarFemale, value: styles.genderFemale }
  }
  return { avatar: styles.avatarNa, value: styles.genderNa }
}

function AvatarIcon() {
  return (
    <svg className={styles.avatarIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

function StatusMessage({ children, tone }: { children: React.ReactNode; tone: 'loading' | 'error' }) {
  return (
    <div className={styles.page}>
      <div className={tone === 'error' ? styles.statusError : styles.statusLoading}>
        {children}
      </div>
    </div>
  )
}

export default function PersonPage() {
  const { query } = useRouter()
  const { data, error, isLoading, isValidating } = useSWR<Person, ResponseError>(
    () => (query.id ? `/api/people/${query.id}` : null),
    fetcher
  )

  if (error) {
    return <StatusMessage tone="error">{error.message}</StatusMessage>
  }

  if (isLoading) {
    return <StatusMessage tone="loading">Loading profile…</StatusMessage>
  }

  if (!data) return null

  const genderStyles = genderClass(data.gender)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <article className={styles.card}>
          <header className={styles.header}>
            <span className={styles.profileId}>Profile #{data.id}</span>
            <div className={styles.nameRow}>
              <div className={genderStyles.avatar}>
                <AvatarIcon />
              </div>
              <h1 className={styles.name}>{data.name}</h1>
            </div>
            {isValidating && <span className={styles.validating}>Refreshing…</span>}
          </header>

          <div className={styles.detailsGrid}>
            {fields.map(({ key, label }) => (
              <div key={key} className={styles.field}>
                <dt className={styles.fieldLabel}>{label}</dt>
                <dd
                  className={
                    key === 'gender'
                      ? `${styles.fieldValue} ${genderStyles.value}`
                      : styles.fieldValue
                  }
                >
                  {isValidating ? '…' : data[key]}
                </dd>
              </div>
            ))}
          </div>
        </article>

        <Link href="/" className={styles.backLink}>
          ← Back to list
        </Link>
      </div>
    </div>
  )
}
