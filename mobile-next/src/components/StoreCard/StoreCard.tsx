import { Store } from '@/data/stores'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'

interface StoreCardProps {
  store: Store
  isActive?: boolean
  onActivate?: () => void
  onExpand?: () => void
}

export const StoreCard = ({ store, isActive, onActivate, onExpand }: StoreCardProps) => (
  <motion.div 
    className={`w-72 h-96 rounded-3xl shadow-lg p-6 
                flex flex-col justify-between cursor-pointer
                backdrop-filter bg-opacity-30
                bg-gradient-to-br ${store.color}`}
    onClick={() => {
      onActivate?.()
      onExpand?.()
    }}
    whileHover={{ scale: isActive ? 1.05 : 0.95 }}
    whileTap={{ scale: 0.98 }}
    layout
  >
    <div>
      <h2 className={`text-2xl font-bold ${isActive ? 'text-gray-800' : 'text-gray-800'}`}>
        {store.name}
      </h2>
      <p className={`text-xl mt-2 ${isActive ? 'text-gray-700' : 'text-gray-600'}`}>
        {store.bonuses} бонусов
      </p>
    </div>
    <AnimatePresence>
      {(
        <motion.div 
          className="mt-4 flex justify-center items-center bg-white bg-opacity-80 p-4 rounded-xl"
        //   initial={{ opacity: 0, y: 20 }}
        //   animate={{ opacity: 1, y: 0 }}
        //   exit={{ opacity: 0, y: -20 }}
        //   transition={{ duration: 0.1 }}
        >
          <QRCodeSVG value={`store_id:${store.id}`} size={128} />
        </motion.div>
      )}
    </AnimatePresence>
    <div className={`mt-4 ${isActive ? 'text-gray-700' : 'text-gray-600'}`}>
      <p className="text-sm">Нажмите для подробностей</p>
    </div>
  </motion.div>
) 