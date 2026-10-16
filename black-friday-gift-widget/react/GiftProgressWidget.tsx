import React from 'react'
import { useQuery } from 'react-apollo'
import GET_GIFT_PROGRESS from './graphql/getGiftProgress.graphql'

const GiftProgressWidget: React.FC = () => {
  const { data, loading, error } = useQuery(GET_GIFT_PROGRESS)

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Carregando brinde da Black Friday...
      </div>
    )
  }

  if (error || !data?.getBlackFridayGiftProgress) {
    return null
  }

  const {
    remainingAmount,
    progressPercentage,
    hasUnlockedGift,
    giftName,
  } = data.getBlackFridayGiftProgress

  return (
    <div
      style={{
        border: '1px solid #111',
        borderRadius: '8px',
        padding: '24px',
        margin: '20px 0',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <h3 style={{ marginTop: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
        🎁 Especial Black Friday
      </h3>

      {hasUnlockedGift ? (
        <p style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '18px' }}>
          Parabéns! Você ganhou: {giftName}!
        </p>
      ) : (
        <>
          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            Faltam apenas{' '}
            <strong style={{ color: '#ffd700' }}>
              R$ {remainingAmount.toFixed(2)}
            </strong>{' '}
            para desbloquear seu presente exclusivo: <strong>{giftName}</strong>!
          </p>

          <div
            style={{
              width: '100%',
              backgroundColor: '#333',
              height: '16px',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: '#ffd700',
                height: '100%',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#ccc', marginTop: '4px', display: 'block' }}>
            {progressPercentage}% concluído
          </span>
        </>
      )}
    </div>
  )
}

export default GiftProgressWidget