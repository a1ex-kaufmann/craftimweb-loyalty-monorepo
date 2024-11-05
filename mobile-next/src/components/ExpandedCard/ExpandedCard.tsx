import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Store } from '@/data/stores'
import { QRCodeSVG } from 'qrcode.react'

interface ExpandedCardProps {
  store: Store
  onClose: () => void
}

export const ExpandedCard = ({ store, onClose }: ExpandedCardProps) => (
  <motion.div 
    className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div 
      className={`bg-gradient-to-br ${store.color} p-8 rounded-3xl shadow-lg w-[375px] mx-auto`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    //   transition={{ duration: 0.1 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{store.name}</h2>
          <p className="text-gray-600">{store.bonuses} бонусов</p>
        </div>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2"
        >
          <X size={24} />
        </motion.button>
      </div>
      
      <motion.div 
        className="bg-white rounded-xl p-8 flex justify-center items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        // transition={{ delay: 0.1 }}
      >
        <QRCodeSVG value={`store_id:${store.id}`} size={256} />
      </motion.div>
    </motion.div>
  </motion.div>
)
