import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { useStore } from '../store/useStore'
import { CheckCircle2, Loader2, IceCream, Star, Heart } from 'lucide-react'

export function Success() {
  const { endSession, setMascotMood } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  useEffect(() => {
    setMascotMood('excited')
    
    // Step transitions
    const timers = [
      setTimeout(() => setStep(1), 2000), // Preparing
      setTimeout(() => setStep(2), 4000), // Ready
      setTimeout(() => {
        endSession()
        navigate({ to: '/' })
      }, 7000) // Back to idle
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Decorative floating elements */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 180, 270, 360],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-secondary rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 270, 180, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent rounded-full blur-3xl"
      />

      <div className="relative z-10 text-center max-w-2xl px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-12 inline-flex items-center justify-center w-32 h-32 rounded-full bg-white text-primary shadow-2xl"
        >
          {step === 2 ? <CheckCircle2 className="w-16 h-16" /> : <IceCream className="w-16 h-16" />}
        </motion.div>

        <motion.div
          key={step}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-6"
        >
          {step === 0 && (
            <>
              <h1 className="text-6xl font-black mb-4">Pagamento Confirmado!</h1>
              <p className="text-2xl font-bold opacity-80 flex items-center justify-center gap-3">
                <Loader2 className="animate-spin" /> Processando seu pedido...
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-6xl font-black mb-4 tracking-tight">Preparando seu Picolé</h1>
              <div className="flex justify-center gap-6 py-4">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><Star className="text-secondary w-8 h-8 fill-current" /></motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}><Heart className="text-accent w-8 h-8 fill-current" /></motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}><Star className="text-secondary w-8 h-8 fill-current" /></motion.div>
              </div>
              <p className="text-2xl font-bold opacity-90 italic">
                Aguarde um instante, a mágica está acontecendo!
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-7xl font-black mb-4 leading-tight">Prontinho!</h1>
              <p className="text-3xl font-bold opacity-100">
                Retire seu picolé na saída abaixo.
              </p>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-xl font-medium px-8 py-3 bg-white/10 rounded-full inline-block backdrop-blur-md"
              >
                Até a próxima! Volte sempre! 👋
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 text-center opacity-30 font-bold tracking-widest text-sm uppercase">
        Picolé Kiosk • Experiência Premium
      </div>
    </div>
  )
}
