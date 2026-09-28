declare global {
  interface StorefrontFunctionComponent<P = Record<string, unknown>>
    extends React.FunctionComponent<P> {
    schema?: Record<string, unknown>
    getSchema?(props?: P): Record<string, unknown>
  }
}

export {}