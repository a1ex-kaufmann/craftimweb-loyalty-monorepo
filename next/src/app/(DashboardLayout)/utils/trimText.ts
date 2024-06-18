export const shortAddress = (address: string): string =>
  address ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : ''

export const hiddenEmail = (email: string) =>
  email.replace(/^(.)(.*)(?=@)/, (match, first, middle) => {
    const middleHidden = middle.replace(/./g, '*')

    return `${first}${middleHidden}`
  })
