# BellaStore — Micro Frontend com Module Federation

Aplicação de e-commerce desenvolvida como desafio técnico, utilizando arquitetura **Micro Frontend** com **Webpack Module Federation**.

---

## Visão Geral

A aplicação é composta por 4 apps independentes que se comunicam em runtime:

| App | Porta | Responsabilidade |
|-----|-------|-----------------|
| `shell` | 3000 | Orquestra os MFEs, expõe `CartContext` e `types` |
| `header` | 3001 | Cabeçalho com menu de navegação e modal do carrinho |
| `footer` | 3002 | Rodapé com links institucionais |
| `cards` | 3003 | Listagem de produtos consumindo a API do DummyJSON |

---

## Tecnologias

- **React 18** + **TypeScript**
- **Webpack 5** + **Module Federation**
- **Babel** (transpilação e suporte a testes)
- **Jest** + **Testing Library** (testes unitários)
- **Concurrently** (execução simultânea dos apps)

---

## Pré-requisitos

- Node.js >= 18
- npm >= 9

---

## Instalação

Clone o repositório e instale as dependências de todos os apps:

```bash
git clone https://github.com/IzeQF/teste-tech-front-vr.git
cd teste-tech-front-vr
npm install
npm install --prefix shell
npm install --prefix header
npm install --prefix footer
npm install --prefix cards
```

---

## Rodando o projeto

Na raiz do monorepo, execute:

```bash
npm start
```

Isso sobe os 4 apps simultaneamente. Acesse **http://localhost:3000** para ver a aplicação completa.

> Os apps individuais ficam disponíveis nas portas 3001, 3002 e 3003, mas o shell (3000) é necessário para o funcionamento integrado.

---

## Testes

Cada app tem sua própria suíte de testes. Para rodar individualmente:

```bash
# CartContext (shell)
npm test --prefix shell

# ProductCard (cards)
npm test --prefix cards

# Header (header)
npm test --prefix header
```

**Total: 21 testes, todos passando.**

---

## Estrutura do projeto

```
monorepo/
├── shell/          # App principal — porta 3000
│   └── src/
│       ├── shared/
│       │   ├── CartContext.tsx   # Contexto global do carrinho
│       │   └── types.ts          # Tipos compartilhados (Product, CartItem)
│       └── components/
│           └── Hero.tsx
├── header/         # MFE Header — porta 3001
├── footer/         # MFE Footer — porta 3002
├── cards/          # MFE Cards — porta 3003
├── package.json    # Script raiz com concurrently
└── DECISIONS.md    # Registro de decisões técnicas
```

---

## Funcionalidades

- **Listagem de produtos** consumida da API [DummyJSON](https://dummyjson.com/products)
- **Adicionar ao carrinho** com controle de quantidade direto no card
- **Modal do carrinho** no header com:
  - Controles de quantidade (+/−) por item
  - Confirmação ao remover o último item
  - Total calculado em tempo real
  - Limpar carrinho
- **Estado compartilhado** entre os MFEs via `CartContext` (padrão singleton em `window`)
- **Responsivo** com menu hamburger em mobile

---

## Decisões técnicas

Consulte o arquivo [DECISIONS.md](./DECISIONS.md) para o registro completo das decisões de arquitetura, design e progresso das tarefas.
