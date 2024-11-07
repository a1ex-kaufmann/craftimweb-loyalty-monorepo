'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { StoryItem } from '@/components/StoryItem/StoryItem'
import { StoreCard } from '@/components/StoreCard/StoreCard'
import { BonusConversion } from '@/components/BonusConversion/BonusConversion'
import { Navigation } from '@/components/Navigation/Navigation'
import { stores } from '@/data/stores'
import { stories } from '@/data/stories'
import { ExpandedCard } from '@/components/ExpandedCard/ExpandedCard'
import { Settings } from '@/components/Settings/Settings'

type Store = {
  id: number
  name: string
  bonuses: number
  color: string
  conversionRate: number
  wallet: string
}

export default function Home() {
  const [activeStore, setActiveStore] = useState(stores[0])
  const [activeTab, setActiveTab] = useState('cards')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedStore, setExpandedStore] = useState<Store | null>(null)
  const cardsRef = useRef(null)
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })

  const filteredStores = useMemo(() => 
    stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  )

  const activeIndex = filteredStores.findIndex(store => store.id === activeStore.id)

  const nextStore = useCallback(() => {
    setActiveStore(filteredStores[(activeIndex + 1) % filteredStores.length])
  }, [activeIndex, filteredStores])

  const prevStore = useCallback(() => {
    setActiveStore(filteredStores[(activeIndex - 1 + filteredStores.length) % filteredStores.length])
  }, [activeIndex, filteredStores])

  useEffect(() => {
    setDragConstraints({ 
      left: -((filteredStores.length - 1) * (window.innerWidth * 0.8)), 
      right: 0 
    })
  }, [filteredStores.length])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-[375px] h-[667px] mx-auto relative overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto">
          {activeTab === 'cards' && (
            <>
              <div className="w-full max-w-md mb-6 overflow-x-auto">
                <div className="flex">
                  {stories.map(story => (
                    <StoryItem key={story.id} story={story} />
                  ))}
                </div>
              </div>
              
              <motion.div className="w-full max-w-md mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск магазинов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 border rounded-full bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </motion.div>

              <motion.div 
                className="relative w-full max-w-md overflow-visible h-96 px-6" 
                ref={cardsRef}
              >
                <motion.div 
                  className="flex h-full"
                  drag="x"
                  dragConstraints={dragConstraints}
                  dragElastic={0.2}
                  dragMomentum={false}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    
                    if (Math.abs(swipe) > 100) {
                      if (swipe > 0 && activeIndex > 0) {
                        prevStore();
                      }
                      
                      if (swipe < 0 && activeIndex < filteredStores.length - 1) {
                        nextStore();
                      }
                    }
                  }}
                  animate={{ x: `-${activeIndex * 100}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {filteredStores.map((store) => (
                    <motion.div 
                      key={store.id} 
                      className="w-full flex-shrink-0 px-2" 
                      layout
                    >
                      <StoreCard 
                        store={store}
                        isActive={store.id === activeStore.id}
                        onActivate={() => setActiveStore(store)}
                        onExpand={() => setExpandedStore(store)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </>
          )}
          
          {activeTab === 'conversion' && (
            <BonusConversion 
              store={activeStore} 
              isOpen={activeTab === 'conversion'} 
              onClose={() => setActiveTab('cards')} 
            />
          )}
          
          {activeTab === 'settings' && <Settings />}
        </div>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <AnimatePresence>
        {expandedStore && (
          <ExpandedCard 
            store={expandedStore} 
            onClose={() => setExpandedStore(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
