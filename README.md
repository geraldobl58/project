# 🚀 Sistema de Gerenciamento de Usuários - React + TypeScript

> **Projeto completo para estudos e entrevistas técnicas**  
> Sistema fullstack otimizado com React 19, TypeScript, Vite, TanStack Query, React Hook Form, Zod e Vitest

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura do Projeto](#-arquitetura-do-projeto)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Padrões de Otimização](#-padrões-de-otimização)
5. [Estrutura de Pastas](#-estrutura-de-pastas)
6. [Principais Conceitos Implementados](#-principais-conceitos-implementados)
7. [Instalação e Execução](#-instalação-e-execução)
8. [Testes](#-testes)
9. [Guia de Estudo](#-guia-de-estudo)
10. [Boas Práticas](#-boas-práticas)

---

## 🎯 Visão Geral

Este é um **sistema completo de gerenciamento de usuários** desenvolvido com as melhores práticas e padrões modernos do React. O projeto foi criado especialmente para:

- ✅ Demonstrar conhecimento avançado em React e TypeScript
- ✅ Aplicar otimizações de performance com hooks
- ✅ Implementar testes unitários com Vitest e Testing Library
- ✅ Seguir arquitetura escalável e manutenível
- ✅ Preparação para entrevistas técnicas

### Funcionalidades

- 📝 CRUD completo de usuários (Create, Read, Update, Delete)
- 🔍 Busca com debounce otimizado
- 📄 Paginação eficiente
- 📊 Dashboard com estatísticas
- ⚡ Performance otimizada com React.memo, useCallback e useMemo
- 🧪 Testes unitários abrangentes
- 🎨 UI moderna com Tailwind CSS e shadcn/ui

---

## 🏗️ Arquitetura do Projeto

### Padrão de Arquitetura: **Feature-Based**

O projeto segue uma arquitetura **feature-based**, onde cada funcionalidade possui sua própria pasta com componentes, hooks, services, types e schemas relacionados.

```
src/
├── features/           # Módulos por funcionalidade
│   └── users/         # Funcionalidade de usuários
│       ├── components/ # Componentes específicos
│       ├── hooks/     # Hooks customizados
│       ├── services/  # Chamadas à API
│       ├── types/     # TypeScript types
│       └── schemas/   # Validação Zod
├── components/        # Componentes globais
├── hooks/            # Hooks globais
├── pages/            # Páginas/rotas
├── lib/              # Utilitários
└── test/             # Configuração de testes
```

### Camadas da Aplicação

1. **Presentation Layer (Páginas e Componentes)**
   - Responsável pela UI e interação do usuário
   - Componentes otimizados com React.memo

2. **Business Logic Layer (Hooks)**
   - Lógica de negócio isolada
   - Hooks customizados com useCallback e useMemo

3. **Data Layer (Services)**
   - Comunicação com API
   - Gerenciamento de estado com TanStack Query

4. **Validation Layer (Schemas)**
   - Validação de formulários com Zod
   - Tipagem forte com TypeScript

---

## 🛠️ Tecnologias Utilizadas

### Core

| Tecnologia | Versão | Propósito |
|-----------|---------|-----------|
| **React** | 19.1.1 | Biblioteca UI |
| **TypeScript** | 5.9.3 | Tipagem estática |
| **Vite** | 7.1.7 | Build tool |
| **React Router** | 7.9.5 | Roteamento |

### State Management & Data Fetching

| Tecnologia | Propósito |
|-----------|-----------|
| **TanStack Query** | Gerenciamento de estado assíncrono, cache e sincronização |
| **React Hook Form** | Gerenciamento de formulários |
| **Zod** | Validação de schemas e tipos |

### UI & Styling

| Tecnologia | Propósito |
|-----------|-----------|
| **Tailwind CSS** | Utility-first CSS |
| **shadcn/ui** | Componentes UI reutilizáveis |
| **Radix UI** | Componentes acessíveis |
| **Lucide React** | Ícones |

### Testing

| Tecnologia | Propósito |
|-----------|-----------|
| **Vitest** | Framework de testes |
| **Testing Library** | Testes de componentes |
| **@testing-library/user-event** | Simulação de interações |

---

## ⚡ Padrões de Otimização

### 1. **React.memo** - Memoização de Componentes

Evita re-renderizações desnecessárias de componentes quando as props não mudam.

```typescript
// Antes
export const UsersFilter = ({ searchTerm, handleSearchChange }) => {
  return <div>...</div>;
};

// Depois - Otimizado
const UsersFilterComponent = ({ searchTerm, handleSearchChange }) => {
  return <div>...</div>;
};

export const UsersFilter = memo(UsersFilterComponent);
```

**Quando usar:**
- Componentes que renderizam frequentemente
- Componentes com props complexas
- Listas de componentes

**Componentes memorizados no projeto:**
- `UsersFilter`
- `UsersForm`
- `UsersList`
- `UsersPagination`
- `UsersCount`
- `AlertInformation`
- `Loading`

### 2. **useCallback** - Memoização de Funções

Mantém a mesma referência de função entre re-renders, evitando recriação.

```typescript
// Antes
const handleDelete = (userId: string) => {
  deleteUser(userId);
};

// Depois - Otimizado
const handleDelete = useCallback((userId: string) => {
  deleteUser(userId);
}, [deleteUser]);
```

**Benefícios:**
- Evita re-renderizações de componentes filhos
- Melhora performance em listas
- Reduz consumo de memória

**Exemplos no projeto:**
```typescript
// Em users-list.tsx
const handleSearchChange = useCallback(
  (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams();
    if (term) params.set("search", term);
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  },
  [setSearchParams]
);

const handleDelete = useCallback((userId: string | number) => {
  if (confirm("Tem certeza que deseja deletar este usuário?")) {
    deleteUserMutate(userId);
  }
}, [deleteUserMutate]);
```

### 3. **useMemo** - Memoização de Valores

Cacheia resultados de cálculos pesados, recalculando apenas quando dependências mudam.

```typescript
// Antes
const pages = getPageNumbers();

// Depois - Otimizado
const pages = useMemo(() => {
  const maxPagesToShow = 5;
  // Lógica complexa de paginação
  return calculatedPages;
}, [currentPage, totalPages]);
```

**Quando usar:**
- Cálculos complexos
- Transformações de dados
- Criação de objetos ou arrays

**Exemplos no projeto:**
```typescript
// Em users-details-page.tsx
const userInfo = useMemo(() => {
  if (!user) return [];
  return [
    { label: "ID", value: user.id },
    { label: "Email", value: user.email },
    { label: "Usuário", value: user.username },
    // ...
  ];
}, [user]);

// Em users-pagination.tsx
const pages = useMemo(() => {
  const maxPagesToShow = 5;
  const { startPage, endPage } = [currentPage, totalPages, maxPagesToShow].reduce(
    (_acc, _value, _index, arr) => {
      const [current, total, maxPages] = arr;
      // Lógica de paginação
      return { startPage, endPage };
    },
    { startPage: 1, endPage: 1 }
  );
  
  return Array.from({ length: endPage - startPage + 1 }, (_, index) => index)
    .reduce((pageNumbers: number[], index) => {
      pageNumbers.push(startPage + index);
      return pageNumbers;
    }, []);
}, [currentPage, totalPages]);
```

### 4. **Custom Hooks** - Reutilização de Lógica

Encapsula lógica complexa em hooks reutilizáveis.

```typescript
// useDebounce.ts
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Uso no componente
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

### 5. **TanStack Query** - Otimização de Requisições

Gerencia cache, sincronização e estado de requisições automaticamente.

```typescript
export const useUsers = (params?: UsersQueryParams): UseUsersReturn => {
  const queryKey = ["users", params];

  const query = useQuery<UsersListResponse, Error>({
    queryKey,
    queryFn: async () => await getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos (cache time)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refetch = useCallback(() => {
    void query.refetch();
  }, [query]);

  return {
    users: query.data?.data || [],
    total: query.data?.total || 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch,
  };
};
```

**Benefícios:**
- Cache automático
- Retry logic
- Invalidação de cache inteligente
- Loading e error states automáticos
- Sincronização em múltiplas tabs

---

## 📁 Estrutura de Pastas

```
project/
├── src/
│   ├── features/
│   │   └── users/
│   │       ├── components/
│   │       │   ├── users-filter.tsx       # Filtro com memo + useCallback
│   │       │   ├── users-form.tsx         # Form com memo + useMemo
│   │       │   ├── users-list.tsx         # Lista com memo + useMemo
│   │       │   └── users-pagination.tsx   # Paginação otimizada
│   │       ├── hooks/
│   │       │   └── users.ts               # Hooks do TanStack Query
│   │       ├── services/
│   │       │   └── users.ts               # API calls
│   │       ├── types/
│   │       │   └── users.ts               # TypeScript types
│   │       └── schemas/
│   │           └── users.ts               # Zod schemas
│   ├── components/
│   │   ├── alert-information.tsx          # Alert com memo
│   │   ├── loading.tsx                    # Loading com memo
│   │   └── ui/                            # shadcn/ui components
│   ├── hooks/
│   │   └── useDebounce.ts                 # Debounce hook
│   ├── pages/
│   │   └── users/
│   │       ├── users-page.tsx             # Lista de usuários
│   │       ├── user-create-update.tsx     # Criar/Editar
│   │       ├── users-details-page.tsx     # Detalhes
│   │       └── users-count.tsx            # Estatísticas
│   ├── lib/
│   │   ├── api.ts                         # Axios config
│   │   └── utils.ts                       # Utilitários
│   ├── test/
│   │   ├── setup.ts                       # Setup do Vitest
│   │   └── test-utils.tsx                 # Test utilities
│   ├── App.tsx
│   └── main.tsx
├── vitest.config.ts                       # Config do Vitest
├── vite.config.ts                         # Config do Vite
├── tsconfig.json                          # TypeScript config
├── tailwind.config.js                     # Tailwind config
└── package.json
```

---

## 💡 Principais Conceitos Implementados

### 1. Gerenciamento de Estado Global com TanStack Query

```typescript
// Hook customizado que encapsula TanStack Query
export const useUsers = (params?: UsersQueryParams): UseUsersReturn => {
  const queryKey = ["users", params];

  const query = useQuery<UsersListResponse, Error>({
    queryKey,
    queryFn: async () => await getUsers(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Função memoizada para refetch
  const refetch = useCallback(() => {
    void query.refetch();
  }, [query]);

  return {
    users: query.data?.data || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    limit: query.data?.limit || 10,
    totalPages: query.data?.totalPages || 1,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch,
  };
};
```

**Por que TanStack Query?**
- ✅ Gerenciamento automático de cache
- ✅ Sincronização de dados em background
- ✅ Retry automático em caso de erro
- ✅ Invalidação de cache inteligente
- ✅ Estados de loading e error prontos

### 2. Validação de Formulários com Zod + React Hook Form

```typescript
// Schema de validação
export const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
});

// Uso no componente
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(userSchema),
  defaultValues: {
    name: "",
    email: "",
    username: "",
    phone: "",
    city: "",
  },
});
```

**Benefícios:**
- ✅ Validação type-safe
- ✅ Mensagens de erro customizadas
- ✅ Validação em tempo real
- ✅ Integração perfeita com TypeScript

### 3. Debounce para Otimização de Busca

```typescript
// Hook useDebounce
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Uso no componente
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// Só faz requisição após 500ms de inatividade
const { users } = useUsers({
  search: debouncedSearchTerm,
  page: currentPage,
});
```

**Por que usar debounce?**
- ✅ Reduz número de requisições à API
- ✅ Melhora UX (menos loading states)
- ✅ Economiza recursos do servidor
- ✅ Previne race conditions

### 4. Paginação com Lógica Complexa Usando reduce()

```typescript
const pages = useMemo(() => {
  const maxPagesToShow = 5;

  // Determina o range de páginas usando reduce
  const { startPage, endPage } = [currentPage, totalPages, maxPagesToShow].reduce(
    (_acc, _value, _index, arr) => {
      const [current, total, maxPages] = arr;
      
      if (total <= maxPages) {
        return { startPage: 1, endPage: total };
      }
      
      if (current <= 3) {
        return { startPage: 1, endPage: maxPages };
      }
      
      if (current > total - 3) {
        return { startPage: total - maxPages + 1, endPage: total };
      }
      
      return { startPage: current - 2, endPage: current + 2 };
    },
    { startPage: 1, endPage: 1 }
  );

  // Gera array de páginas usando reduce
  return Array.from({ length: endPage - startPage + 1 }, (_, index) => index)
    .reduce((pageNumbers: number[], index) => {
      pageNumbers.push(startPage + index);
      return pageNumbers;
    }, []);
}, [currentPage, totalPages]);
```

**Padrões de paginação:**
- Total ≤ 5: Mostra todas as páginas
- Página atual ≤ 3: Mostra primeiras 5 páginas
- Página atual ≥ total - 3: Mostra últimas 5 páginas
- Caso contrário: Mostra 2 antes e 2 depois da página atual

### 5. Otimização de Re-renders com useMemo

```typescript
// Sem otimização - recalcula em todo render
const tableRows = users.map((user) => (
  <TableRow key={user.id}>
    {/* ... */}
  </TableRow>
));

// Com otimização - só recalcula quando users muda
const tableRows = useMemo(
  () => users.map((user) => (
    <TableRow key={user.id}>
      {/* ... */}
    </TableRow>
  )),
  [users, handleViewUser, handleEditUser, handleDelete]
);
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm

### Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Entre na pasta do projeto
cd project

# Instale as dependências
pnpm install
```

### Executar em Desenvolvimento

```bash
pnpm dev
```

Aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
pnpm build
```

### Preview do Build

```bash
pnpm preview
```

---

## 🧪 Testes

### Estrutura de Testes

O projeto utiliza **Vitest** com **Testing Library** para testes unitários.

```
src/
├── hooks/
│   └── useDebounce.test.ts
├── features/
│   ├── hooks/
│   │   └── users.test.ts
│   └── components/
│       ├── users-filter.test.tsx
│       └── users-pagination.test.tsx
└── test/
    ├── setup.ts              # Configuração global
    └── test-utils.tsx        # Utilitários de teste
```

### Executar Testes

```bash
# Executar todos os testes
pnpm test

# Executar em modo watch
pnpm test:watch

# Executar com UI
pnpm test:ui

# Executar com coverage
pnpm test:coverage
```

### Exemplos de Testes

#### 1. Teste de Hook (useDebounce)

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });
});
```

#### 2. Teste de Componente (UsersFilter)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { UsersFilter } from '@/features/components/users-filter';

describe('UsersFilter Component', () => {
  it('should render search input and clear button', () => {
    const handleSearchChange = vi.fn();
    renderWithProviders(
      <UsersFilter searchTerm="" handleSearchChange={handleSearchChange} />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
  });

  it('should call handleSearchChange with empty string when clear is clicked', async () => {
    const user = userEvent.setup();
    const handleSearchChange = vi.fn();

    renderWithProviders(
      <UsersFilter searchTerm="test" handleSearchChange={handleSearchChange} />
    );

    await user.click(screen.getByRole('button', { name: /limpar/i }));
    expect(handleSearchChange).toHaveBeenCalledWith('');
  });
});
```

### Cobertura de Testes

O projeto inclui testes para:
- ✅ Hooks customizados (useDebounce, useUsers, etc.)
- ✅ Componentes principais (UsersFilter, UsersPagination)
- ✅ Funções utilitárias
- ✅ Integração de componentes

---

## 📚 Guia de Estudo

### Para Entrevistas - Tópicos Importantes

#### 1. **Performance React**

**Pergunta comum:** "Como você otimiza um componente React?"

**Resposta:**
```typescript
// 1. Use React.memo para evitar re-renders desnecessários
const MyComponent = memo(({ data, onAction }) => {
  // 2. Use useCallback para memoizar funções
  const handleClick = useCallback(() => {
    onAction(data.id);
  }, [onAction, data.id]);

  // 3. Use useMemo para valores computados
  const expensiveValue = useMemo(() => {
    return data.items.reduce((sum, item) => sum + item.price, 0);
  }, [data.items]);

  return <div onClick={handleClick}>{expensiveValue}</div>;
});
```

#### 2. **Estado Assíncrono**

**Pergunta comum:** "Como você gerencia estado de API calls?"

**Resposta:**
```typescript
// Use TanStack Query para gerenciamento eficiente
const { data, isLoading, error } = useQuery({
  queryKey: ['users', params],
  queryFn: () => fetchUsers(params),
  staleTime: 5 * 60 * 1000, // Cache por 5 minutos
});

// Para mutações
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

#### 3. **TypeScript Avançado**

**Pergunta comum:** "Como você garante type-safety?"

**Resposta:**
```typescript
// 1. Defina interfaces claras
interface User {
  id: number;
  name: string;
  email: string;
}

// 2. Use generics em hooks
const useDebounce = <T>(value: T, delay: number): T => {
  // ...
};

// 3. Use Zod para validação runtime + types
const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

type UserFormData = z.infer<typeof userSchema>;
```

#### 4. **Arquitetura de Código**

**Pergunta comum:** "Como você organiza um projeto grande?"

**Resposta:**
```
- Feature-based structure
- Separação de concerns (components, hooks, services)
- Custom hooks para reutilização
- Types e schemas isolados
- Testes próximos ao código
```

---

## ✨ Boas Práticas

### 1. **Nomenclatura**

```typescript
// ✅ Bom
const handleUserClick = () => {};
const isUserActive = true;
const userData = {};

// ❌ Evitar
const click = () => {};
const active = true;
const data = {};
```

### 2. **Componentização**

```typescript
// ✅ Componentes pequenos e focados
const UserCard = ({ user }) => (
  <Card>
    <UserAvatar user={user} />
    <UserInfo user={user} />
    <UserActions user={user} />
  </Card>
);

// ❌ Componentes muito grandes
const UserCard = ({ user }) => {
  // 500 linhas de código...
};
```

### 3. **Hooks Customizados**

```typescript
// ✅ Extrair lógica complexa em hooks
const useUserManagement = (userId) => {
  const { data: user } = useViewUser(userId);
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const handleUpdate = useCallback((data) => {
    updateUser({ id: userId, data });
  }, [userId, updateUser]);

  return { user, handleUpdate, deleteUser };
};

// No componente
const UserProfile = ({ userId }) => {
  const { user, handleUpdate } = useUserManagement(userId);
  // ...
};
```

### 4. **Tratamento de Erros**

```typescript
// ✅ Bom
if (isError) {
  return (
    <AlertInformation
      variant="destructive"
      title="Erro ao carregar dados"
      description={error?.message}
    />
  );
}

// ✅ Com boundary
<ErrorBoundary fallback={<ErrorPage />}>
  <UsersList />
</ErrorBoundary>
```

### 5. **Loading States**

```typescript
// ✅ Bom - Feedback claro
if (isLoading) {
  return <Loading message="Carregando usuários..." />;
}

// ✅ Skeleton loading
if (isLoading) {
  return <UsersSkeleton count={5} />;
}
```

---

## 🎓 Conceitos-Chave para Entrevistas

### 1. React Hooks

- **useState:** Estado local do componente
- **useEffect:** Side effects e lifecycle
- **useCallback:** Memoização de funções
- **useMemo:** Memoização de valores
- **useRef:** Referências mutáveis
- **useContext:** Context API

### 2. Performance

- **React.memo:** Previne re-renders
- **useCallback:** Estabiliza referências de funções
- **useMemo:** Cacheia cálculos
- **Lazy loading:** Code splitting
- **Virtualization:** Para listas grandes

### 3. TypeScript

- **Interfaces vs Types**
- **Generics**
- **Utility Types** (Partial, Pick, Omit)
- **Type Guards**
- **Discriminated Unions**

### 4. Testes

- **Unit Tests:** Testar unidades isoladas
- **Integration Tests:** Testar fluxos completos
- **Mocking:** Simular dependências
- **Coverage:** Cobertura de código

### 5. Padrões de Design

- **Container/Presentational**
- **Render Props**
- **HOC (Higher Order Components)**
- **Custom Hooks**
- **Compound Components**

---

## 📝 Checklist de Revisão

Antes da entrevista, revise:

- [ ] Como funciona o Virtual DOM do React
- [ ] Diferença entre useCallback e useMemo
- [ ] Quando usar React.memo
- [ ] Como funciona o TanStack Query (cache, stale time, gc time)
- [ ] Validação com Zod e React Hook Form
- [ ] Testes com Vitest e Testing Library
- [ ] TypeScript: tipos, interfaces, generics
- [ ] Debounce e otimização de performance
- [ ] Paginação e filtros
- [ ] Estrutura de pastas e arquitetura

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido para fins educacionais e demonstração de habilidades técnicas.

---

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

---

**Bons estudos e boa sorte nas entrevistas! 🚀**
