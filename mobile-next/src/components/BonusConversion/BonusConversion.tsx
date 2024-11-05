import { useState } from 'react'
import { Store } from '@/data/stores'
import { stores } from '@/data/stores'
import { ArrowLeftRight, Repeat, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BonusConversionProps {
  store: Store
  isOpen: boolean
  onClose: () => void
}

export const BonusConversion = ({ store, isOpen, onClose }: BonusConversionProps) => {
  const [fromStore, setFromStore] = useState(store)
  const [toStore, setToStore] = useState(stores.find(s => s.id !== store.id) || stores[0])
  const [amount, setAmount] = useState('')

  const handleSwapStores = () => {
    setFromStore(toStore)
    setToStore(fromStore)
  }

  const calculateConversion = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return 0
    const rate = toStore.conversionRate / fromStore.conversionRate
    return Math.round(numAmount * rate)
  }

  const handleConvert = () => {
    const converted = calculateConversion()
    alert(`Конвертировано ${amount} бонусов из ${fromStore.name} в ${converted} бонусов ${toStore.name}`)
    onClose()
  }

  return (
    <motion.div 
      className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6"
    //   initial={{ opacity: 0.5, y: 10 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Конвертация бонусов</h2>
        {/* <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={24} className="text-gray-600" />
        </motion.button> */}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col w-[40%]">
            <label className="text-sm text-gray-600 mb-2">Из</label>
            <select
              value={fromStore.id}
              onChange={(e) => setFromStore(stores.find(s => s.id === Number(e.target.value)) || stores[0])}
              className="p-2 border rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={handleSwapStores}
            className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeftRight size={24} className="text-gray-600" />
          </motion.button>

          <div className="flex flex-col w-[40%]">
            <label className="text-sm text-gray-600 mb-2">В</label>
            <select
              value={toStore.id}
              onChange={(e) => setToStore(stores.find(s => s.id === Number(e.target.value)) || stores[0])}
              className="p-2 border rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">Количество бонусов</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Введите количество бонусов"
          />
        </div>

        {/* <motion.div 
          className="bg-gray-50 p-4 rounded-xl space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        > */}
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Курс обмена:</span>
            <span className="font-medium text-gray-700">
              1 бонус {fromStore.name} = {(toStore.conversionRate / fromStore.conversionRate).toFixed(2)} бонусов {toStore.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Вы получите:</span>
            <span className="text-lg font-bold text-emerald-600">{calculateConversion()} бонусов</span>
          </div>
        {/* </motion.div> */}

        <div className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center">
          <Repeat className="mr-2" size={20} />
          Конвертировать
        
        </div> */
      </div>
    </motion.div>
  )
} 