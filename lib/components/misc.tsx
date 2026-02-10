import { Section } from '@/lib/components/ui'

export * from './headers'
export * from './tabs'

export function ProfileCard({ image, name, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <Section className="flex flex-col items-center">
        <img className="size-16 rounded-full object-cover" src={image}></img>
        <div className="text-lg font-semibold text-center mt-3">{name}</div>
      </Section>
    </div>
  )
}

export function UserAvatarsRow({
  images,
  sizeClass = 'size-10',
  marginClass = '-mr-4',
}: {
  images: any
  sizeClass?: string
  marginClass?: string
}) {
  return (
    <div className="flex flex-row items-center pr-4">
      {images?.map((image: any) => (
        <img
          key={image}
          className={`${sizeClass} rounded-full object-cover border-2 border-white dark:border-black ${marginClass}`}
          src={image}
        />
      ))}
    </div>
  )
}

export function userDefaultImage(username: string) {
  return `https://cdn.stamp.fyi/avatar/username--${encodeURIComponent(username)}?s=200`
}
