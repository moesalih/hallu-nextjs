import { useState } from 'react'

import { BackIcon, LoaderIcon, ShareIcon } from '@/lib/components/icons'
import { formatJSON } from '@/lib/utils/format'

export function Section({ children, ...props }: any) {
  const sectionClass = `p-5 rounded-3xl bg-neutral-400/15  ${props.className || ''}`
  return (
    <div className={sectionClass} onClick={props.onClick}>
      {children}
    </div>
  )
}

export const Input = ({ ...props }) => {
  let sizeStyles = 'text-md px-3 py-1'
  if (props.sm || props.size == 'sm') sizeStyles = 'text-sm px-2 py-1'
  if (props.lg || props.size == 'lg') sizeStyles = 'text-lg px-3 py-2'
  const className = `
	border-0 bg-inherit text-inherit rounded-xl shadow-sm 
	ring-1 ring-inset ring-neutral-400 dark:ring-neutral-600 
	focus:ring-2 focus:ring-inset focus:ring-neutral-600 dark:focus:ring-neutral-300
	placeholder:text-neutral-500 placeholder:opacity-50 disabled:opacity-50 disabled:bg-neutral-200/70 dark:disabled:bg-neutral-800/70
	${sizeStyles}
	${props.className || ''}
	`

  return <input type="text" autoComplete="off" {...props} className={className} />
}

export const TextArea = ({ ...props }) => {
  const className = `
	border-0 bg-inherit text-inherit rounded-xl shadow-sm px-3 py-2
	ring-1 ring-inset ring-neutral-400 dark:ring-neutral-600 
	focus:ring-2 focus:ring-inset focus:ring-neutral-600 dark:focus:ring-neutral-300
	placeholder:text-neutral-500 placeholder:opacity-50  
	${props.className || ''}
	`

  return <textarea autoComplete="off" {...props} className={className} />
}

export const Select = ({ ...props }) => {
  const className = `
	border-0 bg-inherit text-inherit rounded-xl shadow-sm px-3 py-2
	ring-1 ring-inset ring-neutral-400 dark:ring-neutral-600 
	focus:ring-2 focus:ring-inset focus:ring-neutral-600 dark:focus:ring-neutral-300
	${props.className || ''}
	`

  return <select {...props} className={className} />
}

export const Checkbox = ({ label, ...props }) => {
  const className = `
	h-4 w-4 rounded-xl bg-inherit text-neutral-700
	border border-neutral-400 dark:border-neutral-600  focus:ring-neutral-700 dark:focus:ring-neutral-300 
	xfocus:ring-0 xfocus:outline-red-500 focus:ring-offset-transparent focus:ring-offset-0
	${props.className || ''}
	`

  return (
    <div className="relative flex gap-x-2">
      <div className="flex  items-center">
        <input type="checkbox" {...props} className={className} />
      </div>
      <div className="text-sm flex  items-center">
        <label htmlFor={props.id} className={props?.checked ? 'font-medium' : 'opacity-50'}>
          {label}
        </label>
      </div>
    </div>
  )
}

export const Button = ({ ...props }) => {
  let sizeStyles = 'text-md px-3 py-1'
  if (props.sm || props.size == 'sm') sizeStyles = 'text-sm px-2 py-1'
  if (props.lg || props.size == 'lg') sizeStyles = 'text-lg px-4 py-2'
  let variantStyles =
    'bg-neutral-900 border border-transparent dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 '
  if (props.variant === 'outline') {
    variantStyles =
      'bg-transparent border border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100'
  }

  const className = `
	flex flex-row justify-center items-center   rounded-xl font-semibold  cursor-pointer
	${variantStyles}
	shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600  
	opacity-95 hover:opacity-100 disabled:opacity-50
	${sizeStyles}
	${props.className || ''}
	`

  if (props.href && !props.disabled) return <a {...props} className={className} />
  return <button {...props} className={className} />
}

export function MonoButton(props: any) {
  return (
    <Button {...props}>
      <div className="font-mono text-sm font-normal">{props.children}</div>
    </Button>
  )
}

export function MonoButtonWithStatus(props: any) {
  const [status, setStatus] = useState<any>()
  const handleClick = async () => {
    try {
      setStatus('...')
      const result = await props.onClick?.()
      setStatus(formatJSON(result))
    } catch (err) {
      console.error(err)
      setStatus('Error: ' + err)
    }
  }

  return (
    <div>
      <MonoButton {...props} onClick={handleClick} />
      {status && <div className="mt-2 font-mono text-xs opacity-50 whitespace-pre-wrap break-all">{status}</div>}
    </div>
  )
}

export function Separator({ className = '' }) {
  return <div className={`border-b border-neutral-400/25 ${className}`}></div>
}

export function PaddedSpinner() {
  return (
    <div className="flex flex-row items-center justify-center p-4 opacity-50 h-32">
      <LoaderIcon className="animate-spin" />
    </div>
  )
}

export function PaddedError({ message }) {
  return (
    <div className="flex flex-row items-center justify-center p-4 opacity-50 h-32">
      <div className="text-sm">{message}</div>
    </div>
  )
}

export function StatsRows({ stats }) {
  return (
    <div className="flex flex-col ">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-row items-start justify-between gap-4 p-4 border-b border-neutral-400/10"
        >
          <div className="opacity-50">{stat.label}</div>
          <div className="whitespace-pre-wrap text-right">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

export function Debug({ title, data, className = '' }) {
  return (
    <div className={className}>
      <h3 className="font-semibold">{title}</h3>
      <pre className="whitespace-pre-wrap break-all text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export function BackButton() {
  return <BackIcon className="w-5 h-5 m-2 cursor-pointer opacity-50" onClick={() => (window.location.href = '/')} />
}

export function ShareButton({ onClick }) {
  return <ShareIcon className="w-5 h-5 m-2 cursor-pointer opacity-50" onClick={onClick} />
}
