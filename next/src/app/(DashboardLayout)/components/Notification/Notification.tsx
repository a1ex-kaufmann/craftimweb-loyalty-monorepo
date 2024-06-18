import { NotificationType } from '../../context/Notification'
import { FC, useState } from 'react'
import { Details, NotificationStyled, ShowDetailButton } from './Notification.styled'

const Notification: FC<NotificationType> = ({
  title,
  variant = 'success',
  onClick,
  text,
  link,
  details,
  button,
}) => {
  const [isOpenDetails, setIsOpenDetails] = useState(false)

  const onClickDetailsHandler = () => setIsOpenDetails(prev => !prev)

  return (
    <NotificationStyled onClick={onClick} variant={variant}>
      <div>{title}</div>
      <div>
        {text}{' '}
        {link?.url && (
          <a href={link.url} target='_blank'>
            {link.text}
          </a>
        )}
        {button}
        {details && (
          <>
            <ShowDetailButton onClick={onClickDetailsHandler}>Show details</ShowDetailButton>
            <Details onClick={onClickDetailsHandler} className={isOpenDetails ? 'open' : ''}>
              {details}
            </Details>
          </>
        )}
      </div>
    </NotificationStyled>
  )
}
export default Notification
