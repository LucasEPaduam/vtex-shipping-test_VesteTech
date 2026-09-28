export const bannerSchema = {
  title: 'Benefits Banner',
  description: 'Selos de benefícios da loja',
  type: 'object',
  properties: {
    sectionTitle: {
      title: 'Título da seção',
      type: 'string',
      default: 'Por que comprar aqui?',
    },
    layout: {
      title: 'Layout',
      type: 'string',
      enum: ['row', 'column'],
      default: 'row',
    },
    benefits: {
      title: 'Selos',
      type: 'array',
      default: [
        { 
          icon: 'https://partnersigrowdev.vtexassets.com/assets/vtex.file-manager-graphql/images/14ff7a7e-de07-4c56-b33d-e30d447fe8cf___a93c6a9d6015a568a6cbdc7c3b63bec1.png', 
          title: 'Frete grátis', 
          subtitle: 'Em compras acima de R$199', 
          highlight: true 
        },
        { 
          icon: 'https://partnersigrowdev.vtexassets.com/assets/vtex.file-manager-graphql/images/87d6f513-69b6-4200-93b2-7cd44bbebee8___8b3e074e61acb9db9a2e17f2e3c4dffc.png', 
          title: 'Pagamento seguro', 
          subtitle: 'Seus dados protegidos', 
          highlight: false 
        },
        { 
          icon: 'https://partnersigrowdev.vtexassets.com/assets/vtex.file-manager-graphql/images/4b0e01e4-8cec-48a2-98b7-02c5255c3723___0c9cad64f68199a418903d23abe3488d.png', 
          title: 'Troca fácil', 
          subtitle: 'Até 30 dias após a compra', 
          highlight: false 
        },
      ],
      items: {
        title: 'Selo',
        type: 'object',
        properties: {
          icon: { title: 'URL imagem', type: 'string' },
          title: { title: 'Texto principal', type: 'string' },
          subtitle: { title: 'Texto de suporte', type: 'string' },
          highlight: { title: 'Destacar?', type: 'boolean' },
        },
      },
    },
  },
}