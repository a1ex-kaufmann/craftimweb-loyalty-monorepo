import localFont from '@next/font/local'

export const dmSansFont = localFont({
  src: [
    {
      path: './DMSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './DMSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export const montserratFont = localFont({
  src: [
    {
      path: './Montserrat-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
})
