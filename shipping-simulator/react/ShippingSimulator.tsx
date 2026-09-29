import React, { useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import styles from './styles.css'
import { formatPostalCode, isValidPostalCode, sanitizePostalCode } from './utils/postalCode'

interface DeliveryOption {
  id: string
  name: string
  price: number
  estimate: string
}

const ShippingSimulator: React.FC = () => {
  const productContext = useProduct()
  const { orderForm } = useOrderForm()

  const [postalCode, setPostalCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [searched, setSearched] = useState(false)
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])

  const selectedItem = productContext?.selectedItem

  const formatShippingEstimate = (estimate: string) => {
    if (!estimate) return ''
    const hasBd = estimate.includes('bd')
    const hasD = estimate.includes('d') && !hasBd
    const numbers = Number(estimate.replace(/\D/g, '')) || 0

    if (hasBd) {
      const isPlural = numbers > 1
      return `em até ${numbers} ${isPlural ? 'dias úteis' : 'dia útil'}`
    }
    if (hasD) {
      const isPlural = numbers > 1
      return `em até ${numbers} ${isPlural ? 'dias' : 'dia'}`
    }
    return estimate
  }

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault()

    setDeliveryOptions([])
    setSearched(false)

    const cleanCep = sanitizePostalCode(postalCode)

    if (!isValidPostalCode(cleanCep)) {
      setError(true)
      return
    }

    setLoading(true)
    setError(false)

    const cartItems = (orderForm?.items || []).map((item: any) => ({
      id: String(item.id),
      quantity: Number(item.quantity) || 1,
      seller: String(item.seller || '1'),
    }))

    const simulationItems = [...cartItems]
    if (selectedItem) {
      const existingIndex = simulationItems.findIndex(
        (item) => item.id === String(selectedItem.itemId)
      )
      if (existingIndex >= 0) {
        simulationItems[existingIndex].quantity += 1
      } else {
        simulationItems.push({
          id: String(selectedItem.itemId),
          quantity: 1,
          seller: String(selectedItem.sellers?.[0]?.sellerId || '1'),
        })
      }
    }

    try {
      const response = await fetch('/api/checkout/pub/orderForms/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          postalCode: cleanCep,
          country: 'BRA',
          items: simulationItems,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha na requisição de simulação')
      }

      const data = await response.json()

      const slas: DeliveryOption[] = []
      if (data?.logisticsInfo) {
        data.logisticsInfo.forEach((itemLogistics: any) => {
          itemLogistics.slas?.forEach((sla: any) => {
            if (!slas.some((s) => s.id === sla.id)) {
              slas.push({
                id: sla.id,
                name: sla.name,
                price: sla.price,
                estimate: sla.shippingEstimate,
              })
            }
          })
        })
      }

      setDeliveryOptions(slas)
      setSearched(true)
    } catch (err) {
      console.error('Erro na simulação de frete REST:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.container} aria-labelledby="shipping-simulator-title">
      <h3 id="shipping-simulator-title" style={{ display: 'none' }}>
        Simulador de Frete
      </h3>

      <form onSubmit={handleCalculateShipping} className={styles.form}>
        <label htmlFor="cep-input" style={{ display: 'none' }}>
          Digite seu CEP
        </label>
        <input
          id="cep-input"
          type="text"
          placeholder="00000-000"
          maxLength={9}
          value={postalCode}
          onChange={(e) => {
            setPostalCode(formatPostalCode(sanitizePostalCode(e.target.value)))
            if (error) setError(false)
          }}
          className={styles.input}
          aria-label="CEP para cálculo de frete"
        />
        <button
          type="submit"
          disabled={loading}
          className={styles.button}
          aria-busy={loading}
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>

      <div aria-live="polite">
        {error && (
          <p className={styles.error} role="alert">
            Erro ao calcular o frete. Verifique o CEP digitado e tente novamente.
          </p>
        )}

        {!error && searched && deliveryOptions.length === 0 && (
          <p className={styles.error} role="alert">
            Nenhuma opção de frete disponível para o CEP informado.
          </p>
        )}

        {!error && deliveryOptions.length > 0 && (
          <ul className={styles.list} aria-label="Opções de frete disponíveis">
            {deliveryOptions.map((option) => (
              <li key={option.id} className={styles.listItem}>
                <span className={styles.optionName}>
                  {option.name} ({formatShippingEstimate(option.estimate)})
                </span>
                <strong className={styles.optionPrice}>
                  {option.price === 0 ? 'Grátis' : `R$ ${(option.price / 100).toFixed(2)}`}
                </strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default ShippingSimulator