import { FC } from 'react'
import { LoaderStyled } from './Loader.styled'
import { LoaderProps } from './Loader.types'

const Loader: FC<LoaderProps> = props => <LoaderStyled {...props} />

export default Loader
