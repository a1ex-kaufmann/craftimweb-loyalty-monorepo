import { CreditCard, ArrowLeftRight, Settings as SettingsIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => (
  <motion.nav 
    className="fixed bottom-0 left-0 right-0 max-w-[375px] mx-auto bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg py-2 shadow-md h-[60px]"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3 }}
  >
    <div className="flex justify-around items-center max-w-md mx-auto">
      <motion.button 
        onClick={() => onTabChange('cards')}
        className={`flex flex-col items-center ${activeTab === 'cards' ? 'text-green-500' : 'text-gray-600'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <CreditCard size={24} />
        <span className="text-xs mt-1">Карты</span>
      </motion.button>

      <motion.button 
        onClick={() => onTabChange('conversion')}
        className={`flex flex-col items-center ${activeTab === 'conversion' ? 'text-green-500' : 'text-gray-600'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeftRight size={24} />
        <span className="text-xs mt-1">Конвертация</span>
      </motion.button>

      <motion.button 
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center ${activeTab === 'settings' ? 'text-green-500' : 'text-gray-600'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SettingsIcon size={24} />
        <span className="text-xs mt-1">Настройки</span>
      </motion.button>
    </div>
  </motion.nav>
) 