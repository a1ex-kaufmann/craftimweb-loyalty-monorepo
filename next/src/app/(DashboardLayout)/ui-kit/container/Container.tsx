import { FC } from 'react'
import { ContainerProps } from './Container.types'
import { ContainerStyled } from './Container.styled'
import { BoxProps } from '../../ui-kit/box'

const Container: FC<ContainerProps & BoxProps> = props => <ContainerStyled {...props} />

export default Container
