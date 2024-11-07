import { Store } from '@/data/stores'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Add ABI for ERC20 token
const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)"
]

interface StoreCardProps {
  store: Store
  isActive?: boolean
  onActivate?: () => void
  onExpand?: () => void
}

export const StoreCard = ({ store, isActive, onActivate, onExpand }: StoreCardProps) => {
  // Add state for token balance
  const [tokenBalance, setTokenBalance] = useState<string>('...')
  const [isPending, setIsPending] = useState(false)

  // Add effect to fetch token balance
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const fetchBalance = async () => {
      if (store.id === 1) {
        setIsPending(true)
        try {
          const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc')
          const tokenContract = new ethers.Contract(
            '0x7b0633549ecdfe057bdb8aa0d0bcdfbdb3968bbd',
            tokenABI,
            provider
          )
          const balance = await tokenContract.balanceOf('0x91d173Fb244b72007249aECc17F6ad6E035605A4')
          setTokenBalance(ethers.formatUnits(balance, 18)) // Assuming 18 decimals
        } catch (error) {
          console.error('Error fetching token balance:', error)
          setTokenBalance('Error')
        } finally {
          setIsPending(false)
        }
      }
    }

    // Initial fetch
    fetchBalance()
    
    // Set up interval
    if (store.id === 1) {
      intervalId = setInterval(fetchBalance, 3000)
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [store.id])

  return (
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
          {store.id === 1 
            ? `${tokenBalance} бонусов${isPending ? '' : ''}`
            : `${store.bonuses} бонусов`
          }
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
            <QRCodeSVG value={`store_id:${store.wallet}`} size={128} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`mt-4 ${isActive ? 'text-gray-700' : 'text-gray-600'}`}>
        <p className="text-sm">Нажмите для подробностей</p>
      </div>
    </motion.div>
  ) 
} 