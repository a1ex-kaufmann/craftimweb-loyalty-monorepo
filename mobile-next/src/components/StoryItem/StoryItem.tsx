import { motion } from 'framer-motion'
import { Placeholder } from '../Placeholder/Placeholder'

interface StoryItemProps {
  story: {
    id: number
    title: string
  }
}

export const StoryItem = ({ story }: StoryItemProps) => (
  <motion.div 
    className="flex flex-col items-center mr-4"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-200 to-green-400 p-0.5">
      <Placeholder width={60} height={60} className="mb-2" />
    </div>
    <span className="text-xs text-gray-600">{story.title}</span>
  </motion.div>
) 