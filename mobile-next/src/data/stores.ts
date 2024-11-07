export const stores = [
  { id: 1, name: 'Супермаркет', bonuses: 1000, color: 'from-emerald-50 to-emerald-200', conversionRate: 1, wallet: "0x91d173Fb244b72007249aECc17F6ad6E035605A4" },
  { id: 2, name: 'Аптека', bonuses: 750, color: 'from-violet-50 to-violet-200', conversionRate: 1.2, wallet: "0x91d173Fb244b72007249aECc17F6ad6E035605A4" },
  { id: 3, name: 'Кафе', bonuses: 500, color: 'from-amber-50 to-amber-200', conversionRate: 0.8, wallet: "0x91d173Fb244b72007249aECc17F6ad6E035605A4" },
  { id: 4, name: 'Кинотеатр', bonuses: 300, color: 'from-sky-50 to-sky-200', conversionRate: 1.5, wallet: "0x91d173Fb244b72007249aECc17F6ad6E035605A4" },
  { id: 5, name: 'Книжный', bonuses: 200, color: 'from-rose-50 to-rose-200', conversionRate: 0.9, wallet: "0x91d173Fb244b72007249aECc17F6ad6E035605A4" },
]

export type Store = typeof stores[0] 