import { FC } from 'react'
import { ButtonStyled } from './Button.styled'
import { ButtonProps } from './Button.types'
import { Loader } from '../../components/Loader'
import { ButtonClick } from '../../types'

const Button: FC<ButtonProps> = ({
  variant = 'filled',
  isDisabled,
  children,
  isLoading,
  onClick,
  ...rest
}) => {
  const onClickHandler: ButtonClick = e => {
    if (isLoading || isDisabled || !onClick) {
      return
    }

    onClick(e)
  }

  return (
    <ButtonStyled
      className={variant}
      disabled={isDisabled}
      isLoading={isLoading}
      onClick={onClickHandler}
      {...rest}
    >
      {isLoading ? <Loader /> : children}
    </ButtonStyled>
  )
}

export default Button
