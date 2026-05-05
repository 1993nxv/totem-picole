import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { IdleMediaService, IdleMedia } from '../services/central'

const IDLE_TIMEOUT = 60000 // 1 minute

export function IdleTimer() {
  const { isIdle, setIdle, startSession } = useStore()
  const [media, setMedia] = useState<IdleMedia[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    IdleMediaService.list().then(setMedia).catch(console.error)
  }, [])

  const resetTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    
    if (isIdle) {
      setIdle(false)
      startSession()
    }

    timerRef.current = window.setTimeout(() => {
      setIdle(true)
    }, IDLE_TIMEOUT)
  }

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'touchstart', 'keydown']
    events.forEach((event) => window.addEventListener(event, resetTimer))
    
    resetTimer()

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer))
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [isIdle])

  useEffect(() => {
    if (isIdle && media.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % media.length)
      }, 10000) // Rotate media every 10s
      return () => clearInterval(interval)
    }
  }, [isIdle, media])

  if (!isIdle) return null

  const currentMedia = media[currentIndex] || {
    url: 'https://images.unsplash.com/photo-1567206244249-6e7cda2da44b?q=80&w=1920&auto=format&fit=crop',
    type: 'image'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black cursor-pointer flex items-center justify-center overflow-hidden"
        onClick={resetTimer}
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full"
        >
          {currentMedia.type === 'video' ? (
            <video
              src={currentMedia.url}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentMedia.url}
              alt="Idle"
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white text-3xl font-bold tracking-widest text-center"
        >
          TOQUE PARA COMEÇAR
          <div className="text-lg font-normal opacity-80 mt-2">Saboreie o melhor picolé artesanal</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
