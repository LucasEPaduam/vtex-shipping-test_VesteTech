import React from 'react'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import GET_GIFT_PROGRESS from './graphql/getGiftProgress.graphql'

interface GiftProgressQueryData {
  orderForm?: {
    value?: number | null
  } | null
}

// Declaramos os CSS handles que serão utilizados no componente
const CSS_HANDLES = [
  'container',
  'title',
  'message',
  'progressBarContainer',
  'progressBarFill',
  'percentageText',
] as const

const GiftProgressWidget: React.FC = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const { data, loading, error } = useQuery<GiftProgressQueryData>(
    GET_GIFT_PROGRESS,
    { ssr: false, pollInterval: 3000 }
  )

  if (loading) {
    return (
      <div className={`${handles.container} ${handles.container}--loading`}>
        Carregando brinde da Black Friday...
      </div>
    )
  }

  if (error || !data?.orderForm) {
    console.error('Erro ao carregar o progresso do brinde:', error)

    return (
      <div role="alert" className={`${handles.container} ${handles.container}--error`}>
        Não foi possível carregar o progresso do brinde. Tente novamente mais tarde.
      </div>
    )
  }

  const targetGoal = 500
  const currentCartTotal = Number(data.orderForm.value ?? 0) / 100
  const remainingAmount = Math.max(0, targetGoal - currentCartTotal)
  const hasUnlockedGift = currentCartTotal >= targetGoal  
  const progressPercentage = hasUnlockedGift
    ? 100
    : Math.min(99, Math.floor((currentCartTotal / targetGoal) * 100))
  
  const giftName = 'Bag Exclusiva Veste Black Friday'

  return (
    <div className={handles.container}>
      <h3 className={handles.title}>
        🎁 Especial Black Friday
      </h3>

      {hasUnlockedGift ? (
        <p className={`${handles.message} ${handles.message}--unlocked`}>
          Parabéns! Você ganhou: {giftName}!
        </p>
      ) : (
        <>
          <p className={`${handles.message} ${handles.message}--progress`}>
            Faltam apenas{' '}
            <span className={`${handles.message}__highlight`}>
              R$ {remainingAmount.toFixed(2)}
            </span>{' '}
            para desbloquear seu presente exclusivo: <strong>{giftName}</strong>!
          </p>

          <div className={handles.progressBarContainer}>
            <div
              className={handles.progressBarFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className={handles.percentageText}>
            {progressPercentage}% concluído
          </span>
        </>
      )}
    </div>
  )
}

export default GiftProgressWidget