# 🚀 Guia Rápido de Comandos

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview

# Verificar erros do ESLint
pnpm lint
```

## Testes

```bash
# Executar todos os testes uma vez
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com interface UI
pnpm test:ui

# Executar testes com relatório de cobertura
pnpm test:coverage
```

## Estrutura do Projeto

```
src/
├── features/users/          # Módulo de usuários
│   ├── components/          # Componentes específicos
│   ├── hooks/              # Hooks customizados
│   ├── services/           # API calls
│   ├── types/              # TypeScript types
│   └── schemas/            # Zod schemas
├── components/             # Componentes globais
├── hooks/                  # Hooks globais
├── pages/                  # Páginas/rotas
├── lib/                    # Utilitários
└── test/                   # Config de testes
```

## Principais Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TanStack Query** - State management
- **React Hook Form** - Formulários
- **Zod** - Validação
- **Vitest** - Testes
- **Tailwind CSS** - Estilos

## Otimizações Implementadas

### React.memo
Evita re-renders desnecessários de componentes

### useCallback
Memoiza funções entre renders

### useMemo
Cacheia valores computados

### TanStack Query
Gerencia cache e sincronização de dados

### Debounce
Otimiza buscas com delay

## Endpoints da API

```
GET    /users              # Lista usuários
GET    /users/:id          # Busca usuário
POST   /users              # Cria usuário
PUT    /users/:id          # Atualiza usuário
DELETE /users/:id          # Deleta usuário
GET    /users/stats        # Estatísticas
```

## Conceitos-Chave para Estudar

1. **Performance React**
   - React.memo
   - useCallback
   - useMemo
   - Lazy loading

2. **Estado Assíncrono**
   - TanStack Query
   - Cache management
   - Optimistic updates

3. **TypeScript**
   - Generics
   - Type inference
   - Utility types

4. **Testes**
   - Unit tests
   - Integration tests
   - Mocking
   - Coverage

5. **Boas Práticas**
   - Feature-based structure
   - Custom hooks
   - Error handling
   - Loading states

## Dicas para Entrevistas

### O que revisar:
- Como funciona o Virtual DOM
- Diferença entre useCallback e useMemo
- Quando usar React.memo
- Como funciona o TanStack Query
- Validação com Zod
- Testes com Vitest
- TypeScript avançado

### Perguntas Comuns:

**"Como você otimiza um componente React?"**
- Use React.memo
- Use useCallback para funções
- Use useMemo para valores
- Evite inline functions em props
- Lazy load quando possível

**"Como você gerencia estado?"**
- TanStack Query para estado assíncrono
- useState para estado local
- Context API para estado global
- URL params para filtros/paginação

**"Como você testa componentes?"**
- Vitest + Testing Library
- Teste comportamento, não implementação
- Mock de dependências externas
- Test utilities reutilizáveis

## Links Úteis

- [React Docs](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

---

**Bons estudos! 🎓**
