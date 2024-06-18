import { FC } from 'react'
import { SkeletonStyled } from './Skeleton.styled'
import { SkeletonProps } from './Skeleton.types'

const Skeleton: FC<SkeletonProps> = props => <SkeletonStyled {...props} />

export default Skeleton
