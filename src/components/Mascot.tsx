import { motion, AnimatePresence } from 'framer-motion'
import { useStore, MascotMood } from '../store/useStore'

const MASCOT_URL = 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2Fo6sUf6pk8TZtaOLTIFPJNCTM95w1%2F204D52A7-6A2A-470D-88D3-047AF8AD8510__686ff830.png?alt=media&token=bc76b00e-09e6-4e8c-8765-b4c58742a0e3'

const moodToPosition = (mood: MascotMood) => {
  switch (mood) {
    case 'happy':
    case 'excited':
      return 'left'
    case 'sad':
      return 'right'
    case 'neutral':
    default:
      return 'center'
  }
}

export function Mascot() {
  const mascotMood = useStore((state) => state.mascotMood)

  return (
    <motion.div
      className="mascot-container w-[300px] h-[400px] flex items-end justify-center pointer-events-none"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="relative w-full h-full flex items-end justify-center">
        <motion.div
          key={mascotMood}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-full h-full"
        >
          <img
            src={MASCOT_URL}
            alt="Picolé Mascot"
            className="w-full h-full object-cover animate-float"
            style={{ 
              objectPosition: moodToPosition(mascotMood),
              width: '300%', // Since there are 3 parrots, and we show 1/3 at a time
              maxWidth: 'none'
            }}
          />
        </motion.div>
        
        {/* Speech bubble or extra feedback could go here */}
        <AnimatePresence>
          {mascotMood === 'excited' && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: -20 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-bold shadow-lg"
            >
              Uau! Que escolha deliciosa! 🍦
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
