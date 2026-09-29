# 🚚 Simulador de Frete - Componente VTEX IO

![VTEX IO](https://img.shields.io/badge/VTEX%20IO-0.321.0-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Componente Store VTEX IO customizado desenvolvido para calcular estimativas de frete diretamente na Página de Detalhes do Produto (PDP). O aplicativo combina dinamicamente os itens já presentes no carrinho do usuário (`orderForm`) com o SKU atualmente selecionado na PDP, consultando a API de Simulação do Checkout da VTEX em tempo real.

---

## 📌 Funcionalidades & Requisitos Implementados

- **Simulação de Frete na PDP**: Permite que os usuários calculem o frete diretamente na página do produto informando o Código de Endereçamento Postal (CEP).
- **Fusão (*Merging*) do Carrinho e SKU da PDP**: Combina automaticamente os itens que já estão no carrinho ativo (`orderForm`) com o SKU selecionado na PDP antes de enviar a requisição de simulação.
- **Validação e Máscara no Input**: Formatação automática de CEP (`00000-000`), sanitização de entrada (extração apenas de dígitos) e pré-validação antes da chamada à API.
- **Feedback Dinâmico de SLA**:
  - Exibe o nome da transportadora, preço e estimativa de prazo de entrega.
  - Destaca opções com custo zero utilizando o rótulo **"Grátis"**.
  - Exibe mensagens amigáveis caso nenhuma opção de entrega esteja disponível.
- **Internacionalização (i18n)**: Totalmente estruturado utilizando o sistema nativo da pasta `messages/` do VTEX IO (com suporte para `pt`, `en` e `es`).
- **Tratamento de Erros Robusto**: Feedback em tempo real para falhas de rede ou CEPs inválidos sem quebrar a interface do usuário.

---

## 🏛️ Arquitetura & Decisões Técnicas

### API REST vs. GraphQL

O enunciado do desafio permite obter o resultado da simulação via `vtex.store-graphql` ou diretamente através da API REST de Checkout da VTEX (`POST /api/checkout/pub/orderForms/simulation`). **A opção por API REST foi selecionada para esta implementação com base nas boas práticas da plataforma:**

1. **Redução de Latência (Requisição Direta)**: O app `vtex.store-graphql` atua como uma camada BFF (*Backend For Frontend*). Chamar a API REST diretamente elimina essa camada intermediária de resolução do GraphQL, reduzindo o tempo de resposta (*round-trip latency*).
2. **Fusão de Itens Previsível**: O endpoint REST de Checkout aceita um payload explícito de objetos `{ id, quantity, seller }`. Montar esse payload diretamente no componente React (via `useOrderForm` e `useProduct`) garante controle total sobre a soma e incremento de quantidades.
3. **Dados Dinâmicos sem Cache**: O cálculo de frete depende do estado dinâmico e mutável do carrinho e do CEP digitado pelo usuário. Evitar a sobrecarga de cache do Apollo Client mantém a aplicação leve e com alta performance.
4. **Tamanho de Bundle Otimizado**: Eliminar declarações de queries GraphQL e dependências do Apollo Client reduz o tamanho final do pacote da aplicação frontend.

---

## 🛠️ Estrutura do Projeto

```text
shipping-simulator/
├── manifest.json                # Metadados do app VTEX IO e configurações de builders
├── messages/                    # Arquivos de internacionalização (i18n)
│   ├── context.json             # Esquema das chaves de tradução
│   ├── pt.json                  # Traduções em Português
│   ├── en.json                  # Traduções em Inglês
│   └── es.json                  # Traduções em Espanhol
└── react/                       # Código-fonte React / TypeScript
    ├── ShippingSimulator.tsx    # Componente React Principal
    ├── styles.css               # Estilização com CSS Modules
    ├── tsconfig.json            # Configurações do TypeScript
    ├── typings/                 # Definições de tipos
    │   ├── css.d.ts
    │   └── global.d.ts
    └── utils/                   # Funções utilitárias
        └── postalCode.ts        # Lógica de sanitização e validação de CEP
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [VTEX Toolbelt CLI](https://vtex.io/docs/concepts/vtex-toolbelt/) instalado globalmente (`npm install -g vtex`)
- Acesso a uma conta e workspace de desenvolvimento na VTEX

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/LucasEPaduam/vtex-shipping-test_VesteTech.git
   cd vtex-shipping-test/shipping-simulator
   ```

2. **Fazer login no VTEX CLI:**
   ```bash
   vtex login <nome-da-conta>
   ```

3. **Alternar para um workspace de desenvolvimento:**
   ```bash
   vtex use <nome-do-workspace>
   ```

4. **Vincular o aplicativo (Link):**
   ```bash
   vtex link
   ```
   *O VTEX Builder Hub irá compilar a aplicação, sincronizar os arquivos de localização e publicá-los no seu workspace.*

---


## 📦 Checklist de Entrega

- [x] Limpeza de código e remoção de dependências e contextos não utilizados.
- [x] Tipagem estrita de componentes React e hooks da VTEX (`useProduct`, `useOrderForm`).
- [x] Validação completa de formulário e tratamento de estados de erro.