import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'container',
  'contentWrapper',
  'title',
  'subtitle',
  'countdownWrapper',
  'timeBox',
  'timeNumber',
  'timeLabel',
  'buttonCTA'
] as const

interface BlackFridayBannerProps {
  title?: string
  subtitle?: string
  targetDate?: string
  buttonText?: string
  buttonLink?: string
}

const BlackFridayBanner: React.FC<BlackFridayBannerProps> = ({
  title = 'BLACK FRIDAY IMPERDÍVEL UAU!',
  subtitle = 'Aproveite os maiores descontos do ano antes que o tempo acabe!',
  targetDate = '2026-11-27T00:00:00',
  buttonText = 'GARANTIR OFERTAS',
  buttonLink = '/black-friday'
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className={handles.container}>
      <div className={handles.contentWrapper}>
        <h2 className={handles.title}>{title}</h2>
        <p className={handles.subtitle}>{subtitle}</p>

        <div className={handles.countdownWrapper}>
          <div className={handles.timeBox}>
            <span className={handles.timeNumber}>{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className={handles.timeLabel}>Horas</span>
          </div>
          <div className={handles.timeBox}>
            <span className={handles.timeNumber}>{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className={handles.timeLabel}>Min</span>
          </div>
          <div className={handles.timeBox}>
            <span className={handles.timeNumber}>{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className={handles.timeLabel}>Seg</span>
          </div>
        </div>

        <a href={buttonLink} className={handles.buttonCTA}>
          {buttonText}
        </a>
      </div>
    </div>
  )
}

// Configuração do esquema para edição no Site Editor do Admin VTEX
;(BlackFridayBanner as any).schema = {
  title: 'Black Friday Banner',
  description: 'Configurações da Landing Page de Black Friday',
  type: 'object',
  properties: {
    title: {
      title: 'Título do Banner',
      type: 'string',
      default: 'BLACK FRIDAY IMPERDÍVEL UAU!',
    },
    subtitle: {
      title: 'Subtítulo',
      type: 'string',
      default: 'Aproveite os maiores descontos do ano antes que o tempo acabe!',
    },
    targetDate: {
      title: 'Data/Hora Limite (ISO)',
      type: 'string',
      default: '2026-11-27T00:00:00',
    },
    buttonText: {
      title: 'Texto do Botão',
      type: 'string',
      default: 'GARANTIR OFERTAS',
    },
    buttonLink: {
      title: 'Link de Destino do Botão',
      type: 'string',
      default: '/black-friday',
    },
  },
}

export default BlackFridayBanner