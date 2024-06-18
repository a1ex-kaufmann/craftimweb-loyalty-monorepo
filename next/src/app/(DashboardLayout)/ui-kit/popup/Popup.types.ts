import { PropsWithChildren } from 'react'

export type PopupPros = PropsWithChildren<{
  onClickClose: VoidFunction
  title: string
}>
