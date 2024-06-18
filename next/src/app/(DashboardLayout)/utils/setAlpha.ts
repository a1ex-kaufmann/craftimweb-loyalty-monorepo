import Color from 'color'

export const setAlpha = (baseColor: string, alpha: number) => Color(baseColor).alpha(alpha).string()
