import { PropsWithChildren } from 'react'

export type DialogProps = PropsWithChildren & {
  isOpen: boolean
  onClose: VoidFunction
  title: string
}
