import { ChangeEvent, MouseEvent } from 'react'

export type ButtonClick = (event: MouseEvent<HTMLButtonElement>) => void
export type HTMLElementClick = (event: MouseEvent<HTMLElement>) => void

export type OnChangeInput = (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>
export type OnChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => void | Promise<void>
