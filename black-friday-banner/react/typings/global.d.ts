declare module '*.graphql' {
  import { DocumentNode } from 'graphql'
  const value: DocumentNode
  export default value
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql'
  const Schema: DocumentNode
  export default Schema
}

declare module 'react-apollo' {
  export * from 'react-apollo'
  export const useQuery: any
  export const useLazyQuery: any
  export const useMutation: any
}

declare module 'vtex.product-context' {
  export const useProduct: () => any
  export const ProductContext: any
}

declare module 'vtex.order-manager/OrderForm' {
  export const useOrderForm: () => { orderForm: any }
}

/// <reference types="./css.d.ts" />

declare module 'vtex.product-context' {
  export const useProduct: () => any
  export const ProductContext: any
}

declare module 'vtex.order-manager/OrderForm' {
  export const useOrderForm: () => { orderForm: any }
}