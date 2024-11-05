import { motion } from 'framer-motion'

interface PlaceholderProps {
  width: number
  height: number
  className?: string
}

export const Placeholder = ({ width, height, className = '' }: PlaceholderProps) => (
  <motion.div 
    className={`bg-gray-200 rounded-full ${className}`}
    style={{ width, height }}
    animate={{ 
      opacity: [0.5, 0.7, 0.5],
      scale: [1, 1.02, 1]
    }}
    transition={{
      duration: 2,
      repeat: Infinity
    }}
  />
) 