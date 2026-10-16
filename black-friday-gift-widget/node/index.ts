import { Service, ServiceContext, RecorderState } from '@vtex/api'

declare global {
  type Context = ServiceContext
}

// Resolução do Resolver do GraphQL
export default new Service<any, RecorderState, Context>({
  graphql: {
    resolvers: {
      Query: {
        getBlackFridayGiftProgress: async () => {
          const TARGET_GOAL = 500.0 // Meta da Black Friday: R$ 500,00
          
          // Simulando o valor atual do carrinho do utilizador (R$ 320,00)
          // Em etapas avançadas, podemos ler este valor diretamente do OrderForm (Checkout API)
          const currentCartTotal = 320.0 

          const remainingAmount = Math.max(0, TARGET_GOAL - currentCartTotal)
          const progressPercentage = Math.min(
            100,
            Math.round((currentCartTotal / TARGET_GOAL) * 100)
          )
          const hasUnlockedGift = currentCartTotal >= TARGET_GOAL

          return {
            currentCartTotal,
            targetGoal: TARGET_GOAL,
            remainingAmount,
            progressPercentage,
            hasUnlockedGift,
            giftName: 'Bag Exclusiva Veste Black Friday',
          }
        },
      },
    },
  },
})