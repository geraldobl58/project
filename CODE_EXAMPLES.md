# 📖 Exemplos de Código Comentados

Este arquivo contém exemplos detalhados dos principais conceitos implementados no projeto, com explicações linha por linha.

---

## 1. React.memo - Otimização de Componentes

```typescript
// ❌ ANTES - Componente re-renderiza sempre que o pai renderiza
export const UsersFilter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      <Input value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} />
      <Button onClick={() => handleSearchChange("")}>Limpar</Button>
    </div>
  );
};

// ✅ DEPOIS - Componente só re-renderiza quando props mudam
import { memo, useCallback } from "react";

// 1. Crie o componente internamente
const UsersFilterComponent = ({ searchTerm, handleSearchChange }) => {
  // 2. Memoize funções inline para evitar criar novas referências
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(e.target.value);
    },
    [handleSearchChange] // Só recria se handleSearchChange mudar
  );

  const handleClear = useCallback(() => {
    handleSearchChange("");
  }, [handleSearchChange]);

  return (
    <div>
      <Input value={searchTerm} onChange={handleInputChange} />
      <Button onClick={handleClear}>Limpar</Button>
    </div>
  );
};

// 3. Exporte com memo
export const UsersFilter = memo(UsersFilterComponent);

/*
 * EXPLICAÇÃO:
 * - memo() faz shallow comparison das props
 * - Se props não mudaram, pula o re-render
 * - Economiza processamento em listas grandes
 * - QUANDO USAR: Componentes que renderizam frequentemente ou são pesados
 */
```

---

## 2. useCallback - Memoização de Funções

```typescript
import { useCallback, useState } from "react";

// ❌ PROBLEMA: Nova função criada em todo render
const Component = () => {
  const [count, setCount] = useState(0);
  
  // Esta função é recriada em CADA render
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return <ExpensiveChild onClick={handleClick} />;
};

// ✅ SOLUÇÃO: useCallback mantém mesma referência
const Component = () => {
  const [count, setCount] = useState(0);
  
  // Função é recriada APENAS se 'count' mudar
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]); // Array de dependências
  
  // Melhor ainda: usar functional update
  const handleClickOptimized = useCallback(() => {
    setCount(prev => prev + 1); // Não depende de 'count'
  }, []); // Array vazio = nunca recria
  
  return <ExpensiveChild onClick={handleClickOptimized} />;
};

/*
 * EXPLICAÇÃO:
 * - useCallback retorna versão memoizada da função
 * - Só cria nova função se dependências mudarem
 * - Evita re-renders de componentes filhos memorizados
 * 
 * QUANDO USAR:
 * 1. Passar função para componente filho memoizado
 * 2. Função é dependência de useEffect
 * 3. Otimizar event handlers em listas
 */

// EXEMPLO PRÁTICO: Lista de usuários
const UsersList = () => {
  const { users } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();
  
  // ❌ RUIM: Nova função para cada item
  return (
    <>
      {users.map(user => (
        <UserItem 
          key={user.id}
          user={user}
          onDelete={() => deleteUser(user.id)} // Nova função!
        />
      ))}
    </>
  );
  
  // ✅ BOM: Função memoizada
  const handleDelete = useCallback((userId: string) => {
    deleteUser(userId);
  }, [deleteUser]);
  
  return (
    <>
      {users.map(user => (
        <UserItem 
          key={user.id}
          user={user}
          onDelete={handleDelete} // Mesma referência!
        />
      ))}
    </>
  );
};
```

---

## 3. useMemo - Memoização de Valores

```typescript
import { useMemo } from "react";

// ❌ PROBLEMA: Cálculo executado em todo render
const Component = ({ items }) => {
  // Este cálculo roda em CADA render, mesmo se items não mudou
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const average = total / items.length;
  const sorted = [...items].sort((a, b) => b.price - a.price);
  
  return <div>{total}</div>;
};

// ✅ SOLUÇÃO: useMemo cacheia o resultado
const Component = ({ items }) => {
  // Só recalcula se 'items' mudar
  const calculations = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const average = total / items.length;
    const sorted = [...items].sort((a, b) => b.price - a.price);
    
    return { total, average, sorted };
  }, [items]); // Dependências
  
  return <div>{calculations.total}</div>;
};

/*
 * EXPLICAÇÃO:
 * - useMemo retorna valor memoizado
 * - Só recalcula quando dependências mudam
 * - Economiza CPU em cálculos pesados
 * 
 * QUANDO USAR:
 * 1. Cálculos complexos ou pesados
 * 2. Transformações de dados
 * 3. Filtros/ordenação de arrays grandes
 * 4. Criação de objetos/arrays para props
 */

// EXEMPLO PRÁTICO: Paginação complexa
const UsersPagination = ({ currentPage, totalPages }) => {
  // Cálculo complexo de quais páginas mostrar
  const pages = useMemo(() => {
    const maxPagesToShow = 5;
    
    // Lógica complexa usando reduce
    const { startPage, endPage } = [currentPage, totalPages, maxPagesToShow].reduce(
      (_acc, _value, _index, arr) => {
        const [current, total, maxPages] = arr;
        
        // Múltiplas condições
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
    
    // Gera array final
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => index)
      .reduce((pageNumbers: number[], index) => {
        pageNumbers.push(startPage + index);
        return pageNumbers;
      }, []);
  }, [currentPage, totalPages]); // Só recalcula se página mudar
  
  return (
    <div>
      {pages.map(page => (
        <PageButton key={page} page={page} />
      ))}
    </div>
  );
};
```

---

## 4. Custom Hook com TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

// Hook customizado que encapsula lógica de API
export const useUsers = (params?: UsersQueryParams) => {
  // 1. Define chave única para o cache
  const queryKey = ["users", params];

  // 2. Configura query com TanStack Query
  const query = useQuery<UsersListResponse, Error>({
    queryKey,                    // Chave para identificar no cache
    queryFn: async () => {       // Função que busca os dados
      return await getUsers(params);
    },
    staleTime: 5 * 60 * 1000,   // 5min - Tempo que dados são "frescos"
    gcTime: 10 * 60 * 1000,     // 10min - Tempo no cache antes de garbage collection
    retry: 2,                    // Tenta 2x se falhar
    retryDelay: (attemptIndex) => {
      // Delay exponencial: 1s, 2s, 4s...
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });

  // 3. Memoiza função de refetch
  const refetch = useCallback(() => {
    void query.refetch();
  }, [query]);

  // 4. Retorna interface limpa
  return {
    users: query.data?.data || [],         // Dados ou array vazio
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    limit: query.data?.limit || 10,
    totalPages: query.data?.totalPages || 1,
    isLoading: query.isPending,            // Estado de loading
    isError: query.isError,                // Estado de erro
    error: query.error,                    // Objeto de erro
    refetch,                               // Função para refetch manual
  };
};

/*
 * BENEFÍCIOS DO TANSTACK QUERY:
 * 
 * 1. CACHE AUTOMÁTICO:
 *    - Dados ficam em cache por gcTime
 *    - Evita requisições duplicadas
 *    - Compartilha dados entre componentes
 * 
 * 2. STALE TIME:
 *    - Define quando dados estão "velhos"
 *    - Refetch automático em background
 *    - Balance entre freshness e performance
 * 
 * 3. RETRY LOGIC:
 *    - Retry automático em caso de erro
 *    - Delay configurável
 *    - Melhora UX em redes instáveis
 * 
 * 4. ESTADOS AUTOMÁTICOS:
 *    - isLoading, isError, isSuccess
 *    - Simplifica lógica de UI
 *    - Reduz código boilerplate
 */

// Hook para mutações (CREATE, UPDATE, DELETE)
export const useCreateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UsersRequest) => {
      return await createUser(data);
    },
    onSuccess: () => {
      // Invalida cache para forçar refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
  });

  // Memoiza função de mutate
  const mutate = useCallback((data: UsersRequest) => {
    mutation.mutate(data);
  }, [mutation]);

  return {
    mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

/*
 * FLUXO DE MUTAÇÃO:
 * 1. Usuário clica em "Salvar"
 * 2. mutate() envia dados para API
 * 3. onSuccess() invalida cache de ["users"]
 * 4. TanStack Query refetch automaticamente
 * 5. UI atualiza com novos dados
 */
```

---

## 5. Debounce Hook

```typescript
import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  // Estado para armazenar valor debounced
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria timer que atualiza após delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancela timer anterior se value mudar
    return () => clearTimeout(handler);
  }, [value, delay]); // Re-run se value ou delay mudar

  return debouncedValue;
};

/*
 * COMO FUNCIONA:
 * 
 * Tempo ->  0ms    100ms   200ms   300ms   500ms
 * User:     "J"    "Jo"    "Joh"   "John"   
 * Timer:    [500]  [500]   [500]   [500]   FIRE!
 * API:                                      Request("John")
 * 
 * - Cada digitação reseta o timer
 * - Só faz request quando usuário para de digitar
 * - Economiza requisições e recursos
 */

// USO PRÁTICO
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Valor debounced - só atualiza após 500ms de inatividade
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Hook que busca usuários
  const { users, isLoading } = useUsers({
    search: debouncedSearchTerm, // Usa valor debounced
  });
  
  return (
    <div>
      <input 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      {isLoading && <p>Buscando...</p>}
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
};

/*
 * SEM DEBOUNCE:
 * Usuário digita "John" (4 caracteres)
 * Resultado: 4 requisições à API
 * 
 * COM DEBOUNCE:
 * Usuário digita "John" (4 caracteres)
 * Resultado: 1 requisição à API (após 500ms)
 * 
 * ECONOMIA: 75% menos requisições!
 */
```

---

## 6. Validação com Zod + React Hook Form

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// 1. Define schema de validação com Zod
export const userSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .transform(val => val.trim()),
  
  username: z
    .string()
    .min(3, "Usuário deve ter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e underscore"),
  
  phone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^\d+$/, "Apenas números"),
  
  city: z
    .string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres"),
  
  age: z
    .number()
    .int("Idade deve ser número inteiro")
    .min(18, "Deve ter pelo menos 18 anos")
    .max(120, "Idade inválida")
    .optional(),
});

// 2. Infere tipo TypeScript do schema
export type UserFormData = z.infer<typeof userSchema>;

/*
 * BENEFÍCIOS DO ZOD:
 * - Validação runtime + compile time
 * - TypeScript inference automático
 * - Mensagens de erro customizadas
 * - Transformações de dados
 * - Composição de schemas
 */

// 3. Usa no componente com React Hook Form
const UsersForm = () => {
  const {
    register,           // Registra inputs
    handleSubmit,       // Handler de submit
    formState: { errors }, // Erros de validação
    reset,             // Reseta form
    setValue,          // Seta valor programaticamente
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema), // Integra Zod
    defaultValues: {
      name: "",
      email: "",
      username: "",
      phone: "",
      city: "",
    },
  });

  // Handler de submit (só executa se validação passar)
  const onSubmit = useCallback((data: UserFormData) => {
    // data é tipo UserFormData
    // data já está validado pelo Zod
    console.log(data);
    createUser(data);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Input de nome */}
      <div>
        <label>Nome:</label>
        <input 
          {...register("name")} // Registra input
          placeholder="Digite o nome"
        />
        {/* Mostra erro se houver */}
        {errors.name && (
          <p className="error">{errors.name.message}</p>
        )}
      </div>

      {/* Input de email */}
      <div>
        <label>Email:</label>
        <input 
          {...register("email")}
          type="email"
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="error">{errors.email.message}</p>
        )}
      </div>

      <button type="submit">Salvar</button>
    </form>
  );
};

/*
 * FLUXO DE VALIDAÇÃO:
 * 
 * 1. Usuário digita no input
 * 2. React Hook Form captura valor
 * 3. Ao submeter, Zod valida dados
 * 4. Se válido: onSubmit é chamado
 * 5. Se inválido: errors são populados
 * 6. UI mostra mensagens de erro
 */
```

---

## 7. Testes com Vitest

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// TESTE DE HOOK
describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Usa timers falsos para controlar tempo
  });

  afterEach(() => {
    vi.useRealTimers(); // Restaura timers reais
  });

  it('should debounce value changes', async () => {
    // Renderiza hook
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Valor inicial deve ser imediato
    expect(result.current).toBe('initial');

    // Muda valor
    rerender({ value: 'updated', delay: 500 });

    // Valor não deve ter mudado ainda
    expect(result.current).toBe('initial');

    // Avança tempo em 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Agora valor deve ter mudado
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });
});

// TESTE DE COMPONENTE
describe('UsersFilter Component', () => {
  it('should call onChange when user types', async () => {
    // Mock da função
    const handleSearchChange = vi.fn();
    
    // Renderiza componente
    renderWithProviders(
      <UsersFilter 
        searchTerm="" 
        handleSearchChange={handleSearchChange} 
      />
    );

    // Encontra input
    const input = screen.getByRole('textbox');
    
    // Simula digitação
    const user = userEvent.setup();
    await user.type(input, 'John');

    // Verifica se função foi chamada
    expect(handleSearchChange).toHaveBeenCalled();
  });

  it('should clear search when button is clicked', async () => {
    const handleSearchChange = vi.fn();
    
    renderWithProviders(
      <UsersFilter 
        searchTerm="test" 
        handleSearchChange={handleSearchChange} 
      />
    );

    // Encontra e clica no botão
    const clearButton = screen.getByRole('button', { name: /limpar/i });
    await userEvent.setup().click(clearButton);

    // Verifica se foi chamado com string vazia
    expect(handleSearchChange).toHaveBeenCalledWith('');
  });
});

/*
 * PADRÕES DE TESTE:
 * 
 * 1. ARRANGE (Preparar):
 *    - Criar mocks
 *    - Renderizar componente
 *    - Setup inicial
 * 
 * 2. ACT (Agir):
 *    - Simular interações
 *    - Chamar funções
 *    - Mudar estado
 * 
 * 3. ASSERT (Verificar):
 *    - Verificar resultados
 *    - Checar chamadas de função
 *    - Validar estado final
 */
```

---

## 8. TypeScript Avançado

```typescript
// GENERICS em funções
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);        // T = number
const str = identity("hello");   // T = string

// GENERICS em hooks
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // ...
  return debouncedValue;
};

// UTILITY TYPES
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - Todos campos opcionais
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; }

// Pick - Seleciona campos
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string; }

// Omit - Remove campos
type UserWithoutPassword = Omit<User, "password">;
// { id: number; name: string; email: string; }

// Required - Todos campos obrigatórios
type RequiredUser = Required<PartialUser>;

// DISCRIMINATED UNIONS
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: User };
type ErrorState = { status: "error"; error: Error };

type State = LoadingState | SuccessState | ErrorState;

function handleState(state: State) {
  // TypeScript sabe o tipo baseado em 'status'
  switch (state.status) {
    case "loading":
      return <Loading />;
    case "success":
      return <UserView user={state.data} />; // data existe!
    case "error":
      return <Error message={state.error.message} />; // error existe!
  }
}

// TYPE GUARDS
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj
  );
}

// INFER TYPES de Zod
const schema = z.object({
  name: z.string(),
  age: z.number(),
});

type SchemaType = z.infer<typeof schema>;
// { name: string; age: number; }
```

---

**Este guia contém os principais padrões usados no projeto. Use como referência durante estudos e entrevistas! 📚**
