import { Box, BoxProps } from '../../ui-kit/box'
import { FC } from 'react'

const Center: FC<BoxProps> = props => (
  <Box display='flex' alignItems='center' justifyContent='center' {...props} />
)

export default Center
