import React, { useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import styles from './styles.css'

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
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])

  const selectedItem = productContext?.selectedItem

  // Helper para formatar a string de estimativa de entrega da VTEX (ex: "3bd" -> "em até 3 dias úteis")
  const formatShippingEstimate = (estimate: string) => {
    if (!estimate) return ''
    const hasBd = estimate.includes('bd')
    const hasD = estimate.includes('d') && !hasBd
    const numbers = estimate.replace(/\D/g, '')

    if (hasBd) {
      const isPlural = Number(numbers) > 1
      return `em até ${numbers} ${isPlural ? 'dias úteis' : 'dia útil'}`
    }
    if (hasD) {
      const isPlural = Number(numbers) > 1
      return `em até ${numbers} ${isPlural ? 'dias' : 'dia'}`
    }
    return estimate
  }

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCep = postalCode.replace(/\D/g, '')

    if (cleanCep.length !== 8) {
      setError(true)
      return
    }

    setLoading(true)
    setError(false)
    setDeliveryOptions([])

    // 1. Obter itens do carrinho atual (orderForm) garantindo que as quantidades sejam números
    const cartItems = (orderForm?.items || []).map((item: any) => ({
      id: String(item.id),
      quantity: Number(item.quantity) || 1,
      seller: String(item.seller || '1'),
    }))

    // 2. Mesclar com o SKU atual da PDP
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
      // 3. Chamada REST para a API nativa de simulação da VTEX
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

      // 4. Mapear os SLAs (Service Level Agreements) de entrega retornados
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
          placeholder="Digite seu CEP"
          maxLength={9}
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
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

        {deliveryOptions.length > 0 && (
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