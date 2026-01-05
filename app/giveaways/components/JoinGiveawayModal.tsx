'use client'

import { useState, useEffect } from 'react'
import { X, Send, User, Sparkles, Gift, PartyPopper, Rocket, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Turnstile } from '@marsidev/react-turnstile'

interface JoinGiveawayModalProps {
  isOpen: boolean
  onClose: () => void
  giveaway: any | null
}

export default function JoinGiveawayModal({
  isOpen,
  onClose,
  giveaway,
}: JoinGiveawayModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    telegram: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [fingerprint, setFingerprint] = useState<string>('')
  const [isCheckingParticipation, setIsCheckingParticipation] = useState(false)

  // Generate fingerprint on mount
  useEffect(() => {
    if (isOpen) {
      generateFingerprint().then(setFingerprint)
    }
  }, [isOpen])

  // Pre-check participation when modal opens
  useEffect(() => {
    if (isOpen && giveaway && fingerprint) {
      checkParticipation()
    }
  }, [isOpen, giveaway, fingerprint])

  const checkParticipation = async () => {
    if (!fingerprint || !giveaway) return

    setIsCheckingParticipation(true)
    try {
      const response = await fetch(`/api/v1/giveaway/${giveaway.id}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_handle: formData.telegram || null,
          fingerprint,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.participated) {
          toast.info(data.message || 'You have already participated', {
            description: 'Check your Telegram for updates',
            duration: 5000,
          })
        }
      }
    } catch (error) {
      console.error('Error checking participation:', error)
    } finally {
      setIsCheckingParticipation(false)
    }
  }

  const validateTelegramHandle = (handle: string): boolean => {
    // Remove @ if present for validation
    const cleanHandle = handle.replace('@', '')
    
    // Must be 5-32 characters, alphanumeric and underscore only
    const regex = /^[a-zA-Z0-9_]{5,32}$/
    return regex.test(cleanHandle)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate name
    if (!formData.name.trim()) {
      setError('Please enter your name')
      toast.error('Please enter your name')
      return
    }

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      toast.error('Name must be at least 2 characters')
      return
    }

    // Validate telegram handle
    if (!formData.telegram.trim()) {
      setError('Please enter your Telegram handle')
      toast.error('Please enter your Telegram handle')
      return
    }

    if (!validateTelegramHandle(formData.telegram)) {
      setError('Invalid Telegram handle. Use @username (5-32 characters, letters, numbers, and underscores only)')
      toast.error('Invalid Telegram handle', {
        description: 'Format: @username (5-32 characters)',
        duration: 5000,
      })
      return
    }

    // Check Turnstile token
    const turnstileEnabled = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (turnstileEnabled && !turnstileToken) {
      setError('Please complete the verification challenge')
      toast.error('Please complete the verification')
      return
    }

    if (!fingerprint) {
      setError('Device verification failed. Please refresh and try again.')
      toast.error('Device verification failed')
      return
    }

    // Normalize telegram handle
    let telegramHandle = formData.telegram.trim()
    if (!telegramHandle.startsWith('@')) {
      telegramHandle = '@' + telegramHandle
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/v1/giveaway/${giveaway.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: formData.name.trim(),
          telegram_handle: telegramHandle.toLowerCase(),
          fingerprint,
          turnstile_token: turnstileToken,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsSuccess(true)
        toast.success('Successfully joined!', {
          description: `You're now participating in ${giveaway.title}`,
          duration: 5000,
        })
        
        setTimeout(() => {
          setIsSuccess(false)
          setFormData({ name: '', telegram: '' })
          setTurnstileToken(null)
          onClose()
          router.refresh()
        }, 2500)
      } else {
        const errorMessage = data.error || 'Failed to join giveaway'
        setError(errorMessage)
        
        if (data.already_participated) {
          toast.error('Already participated', {
            description: errorMessage,
            duration: 5000,
          })
        } else {
          toast.error(errorMessage, {
            duration: 5000,
          })
        }
      }
    } catch (err) {
      const errorMessage = 'Network error. Please check your connection and try again.'
      setError(errorMessage)
      toast.error('Connection error', {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', telegram: '' })
      setIsSuccess(false)
      setError('')
      setTurnstileToken(null)
      onClose()
    }
  }

  if (!isOpen || !giveaway) return null

  const turnstileEnabled = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{ background: 'hsl(222 47% 6% / 0.95)' }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full sm:max-w-sm mx-0 sm:mx-4 border-t sm:border rounded-t-3xl sm:rounded-3xl overflow-hidden animate-scale-in shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, hsl(222 47% 10% / 0.95), hsl(222 47% 8% / 0.95))',
          backdropFilter: 'blur(20px)',
          borderColor: 'hsl(180 100% 50% / 0.3)',
          boxShadow: '0 -10px 60px rgba(0,245,255,0.15), 0 0 100px rgba(0,255,136,0.08)',
        }}
      >
        {/* Header Glow Line */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-full" 
          style={{ background: 'linear-gradient(to right, transparent, hsl(180 100% 50%), transparent)' }}
        />

        {/* Mobile Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full" style={{ background: 'hsl(215 20% 40%)' }} />
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2.5 rounded-full transition-all z-10 active:scale-95 disabled:opacity-50"
          style={{ background: 'hsl(222 47% 12% / 0.6)', color: 'hsl(215 20% 65%)' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-6 animate-fade-in">
              {/* Confetti Effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: ['hsl(180 100% 50%)', 'hsl(150 100% 50%)', 'hsl(330 100% 65%)', 'hsl(45 100% 60%)'][i % 4],
                      opacity: 0.6,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${2 + Math.random()}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative w-24 h-24 mx-auto mb-6">
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{ background: 'linear-gradient(135deg, hsl(150 100% 50% / 0.3), hsl(180 100% 50% / 0.3))' }}
                />
                <div 
                  className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, hsl(150 100% 50% / 0.2), hsl(180 100% 50% / 0.2))' }}
                >
                  <PartyPopper className="w-12 h-12" style={{ color: 'hsl(150 100% 70%)' }} />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'hsl(210 40% 98%)' }}>
                ¡Listo!
              </h3>
              <p className="text-lg" style={{ color: 'hsl(215 20% 65%)' }}>
                Ya estás participando
              </p>
              <p className="font-medium mt-2" style={{ color: 'hsl(180 100% 70%)' }}>{giveaway.title}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, hsl(180 100% 50% / 0.15), hsl(150 100% 50% / 0.08))' }}
                >
                  <Gift className="w-8 h-8" style={{ color: 'hsl(180 100% 70%)' }} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: 'hsl(210 40% 98%)' }}>
                  ¡Únete al Sorteo!
                </h3>
                <p className="text-sm line-clamp-1" style={{ color: 'hsl(215 20% 65%)' }}>
                  {giveaway.title}
                </p>
                <div 
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: 'hsl(180 100% 50% / 0.15)', color: 'hsl(180 100% 70%)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  {giveaway.description || giveaway.prize || 'Cuenta Premium'}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(180 100% 70%)' }} />
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                    minLength={2}
                    maxLength={50}
                    className="pl-12 h-14 text-lg rounded-2xl transition-all"
                    style={{
                      background: 'hsl(222 47% 12% / 0.6)',
                      border: '1px solid hsl(222 47% 20%)',
                      color: 'hsl(210 40% 98%)',
                    }}
                  />
                </div>

                <div className="relative">
                  <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(150 100% 70%)' }} />
                  <Input
                    type="text"
                    placeholder="@tu_telegram"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    required
                    disabled={isSubmitting}
                    pattern="@?[a-zA-Z0-9_]{5,32}"
                    title="Telegram handle: 5-32 characters, letters, numbers, and underscores"
                    className="pl-12 h-14 text-lg rounded-2xl transition-all"
                    style={{
                      background: 'hsl(222 47% 12% / 0.6)',
                      border: '1px solid hsl(222 47% 20%)',
                      color: 'hsl(210 40% 98%)',
                    }}
                  />
                  <p className="text-xs mt-1.5 ml-1" style={{ color: 'hsl(215 20% 60%)' }}>
                    Ejemplo: @username (5-32 caracteres)
                  </p>
                </div>

                {/* Turnstile Widget */}
                {turnstileEnabled && (
                  <div className="flex justify-center py-2">
                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                      onSuccess={(token) => {
                        setTurnstileToken(token)
                        setError('')
                      }}
                      onError={() => {
                        setTurnstileToken(null)
                        toast.error('Verification failed. Please try again.')
                      }}
                      onExpire={() => {
                        setTurnstileToken(null)
                        toast.info('Verification expired. Please verify again.')
                      }}
                      theme="dark"
                      size="normal"
                    />
                  </div>
                )}

                {error && (
                  <div 
                    className="text-sm rounded-lg p-3 flex items-start gap-2"
                    style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0 84% 70%)' }}
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || (turnstileEnabled && !turnstileToken)}
                  className="w-full h-14 mt-2 font-bold text-lg rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(to right, hsl(180 100% 50%), hsl(150 100% 50%))',
                    color: 'hsl(222 47% 6%)',
                    boxShadow: '0 0 30px rgba(0,245,255,0.3)',
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 border-2 rounded-full animate-spin"
                        style={{ 
                          borderColor: 'hsl(222 47% 6% / 0.3)',
                          borderTopColor: 'hsl(222 47% 6%)',
                        }}
                      />
                      Registrando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      ¡Participar Ahora!
                    </div>
                  )}
                </Button>

                <p className="text-center text-xs pt-2" style={{ color: 'hsl(215 20% 60%)' }}>
                  Al participar aceptas los términos del sorteo
                </p>
              </form>
            </>
          )}
        </div>

        {/* Decorative Bottom Gradient */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" 
          style={{ background: 'linear-gradient(to top, hsl(180 100% 50% / 0.05), transparent)' }}
        />
      </div>
    </div>
  )
}

// Browser fingerprinting function
async function generateFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('fingerprint', 2, 2)
  }
  const canvasData = canvas.toDataURL()

  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(',') || '',
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    canvas: canvasData,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
  }

  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(JSON.stringify(data))
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

