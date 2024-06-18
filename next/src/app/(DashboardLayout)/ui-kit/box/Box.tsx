import { BoxStyled } from './Box.styled'
import { forwardRef } from 'react'
import { BoxProps } from './Box.types'

const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => <BoxStyled {...props} ref={ref} />)

export default Box
