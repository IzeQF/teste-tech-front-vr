# UniStore — Micro Frontend com Module Federation

Aplicação de e-commerce desenvolvida como desafio técnico, utilizando arquitetura **Micro Frontend** com **Webpack Module Federation**.

📄 [Ver instruções do desafio](./docs/desafio.pdf)

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

## Build para produção

Na raiz do monorepo, execute:

```bash
npm run build
```

Isso gera os artefatos de todos os 4 apps em paralelo. Os arquivos de saída ficam em:

| App | Diretório |
|-----|-----------|
| `shell` | `shell/dist/` |
| `header` | `header/dist/` |
| `footer` | `footer/dist/` |
| `cards` | `cards/dist/` |

> Cada app gera seu próprio `remoteEntry.js`. Em produção, ajuste as URLs dos remotes no `webpack.config.js` de cada app para apontar para os hosts corretos antes de buildar.

---

## Testes

Para rodar todos os testes:

```bash
npm test
```

Ou individualmente por app:

```bash
npm test --prefix shell
npm test --prefix cards
npm test --prefix header
npm test --prefix footer
```

**Total: 69 testes, todos passando.**

---

## Estrutura do projeto

```
monorepo/
├── shell/                        # App principal — porta 3000
│   └── src/
│       ├── shared/
│       │   ├── CartContext.tsx   # Contexto global do carrinho
│       │   ├── cartService.ts    # Serviço de integração com DummyJSON
│       │   └── types.ts          # Tipos compartilhados (Product, CartItem)
│       ├── components/
│       │   ├── Carousel.tsx      # Carrossel reutilizável de produtos
│       │   └── Hero.tsx
│       └── pages/
│           ├── Home.tsx          # Home com 6 carrosséis de produtos
│           ├── Contact.tsx       # Página de contato com formulário
│           └── ProductDetail.tsx # Detalhe do produto com galeria e avaliações
├── header/                       # MFE Header — porta 3001
├── footer/                       # MFE Footer — porta 3002
├── cards/                        # MFE Cards — porta 3003
│   └── src/
│       ├── hooks/
│       │   ├── useProducts.ts    # Listagem com paginação e filtros
│       │   └── useFavorites.ts   # Favoritos com persistência no localStorage
│       └── components/
│           └── ProductCard.tsx
├── docs/
│   └── desafio.pdf               # Enunciado do desafio técnico
└── package.json                  # Scripts raiz com concurrently
```

---

## Funcionalidades

- **Home Page** com 6 carrosséis:
  - 🔥 Maiores Descontos (top 10 por desconto)
  - 👗 Moda, 💻 Tecnologia, 🏠 Casa, 💄 Beleza, ⚽ Esportes
- **Listagem de produtos** com filtro por categoria, ordenação e paginação
- **Favoritos** com persistência no `localStorage`
- **Detalhe do produto** com galeria de imagens, avaliações e controle de estoque
- **Carrinho compartilhado** entre os MFEs via `CartContext`:
  - Controles de quantidade (+/−) por item
  - Confirmação ao remover o último item
  - Total calculado em tempo real
  - Limpar carrinho
- **Página de Contato** com formulário e estado de sucesso
- **Responsivo** com menu hamburger em mobile

---

## Rotas

| Rota | Página |
|------|--------|
| `/` | Home com carrosséis |
| `/produtos` | Listagem de produtos (Cards MFE) |
| `/produto/:id` | Detalhe do produto |
| `/contato` | Página de contato |

---

## Decisões técnicas

- **Module Federation** escolhido para permitir deploy independente de cada MFE sem recompilar os demais
- **CartContext exposto pelo shell** e consumido via `window.__CART_CONTEXT__` para garantir instância única entre os remotes
- **DummyJSON** usado como API de e-commerce com suporte a carrinho, produtos e categorias
- **Concurrently** na raiz para simplificar o comando de start/build/test de todos os apps de uma vez
