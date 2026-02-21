# React 심화 완전 정복 강의 노트
> React 기초 강의 노트의 후속편 — 실전 프로젝트 기반 심화 가이드

**대상**: React 기초(컴포넌트, Props, State, Router) 학습 완료자  
**선수 지식**: `React_강의노트.md` Chapter 1~10

---

## 목차
1. [useEffect: 사이드 이펙트 처리](#chapter-1-useeffect-사이드-이펙트-처리)
2. [useContext: 전역 상태 관리](#chapter-2-usecontext-전역-상태-관리)
3. [Custom Hooks: 로직 재사용](#chapter-3-custom-hooks-로직-재사용)
4. [useReducer: 복잡한 상태 관리](#chapter-4-usereducer-복잡한-상태-관리)
5. [React Query / SWR: 서버 상태 관리](#chapter-5-react-query--swr-서버-상태-관리)
6. [상태 관리 라이브러리: Zustand, Redux Toolkit](#chapter-6-상태-관리-라이브러리-zustand-redux-toolkit)

---

## Chapter 1: useEffect — 사이드 이펙트 처리

### 1.1 사이드 이펙트(Side Effect)란?

React 컴포넌트는 **렌더링**, 즉 Props와 State를 기반으로 UI를 그리는 것이 본질입니다. 그 **외의 모든 작업**을 사이드 이펙트라고 합니다.

| 사이드 이펙트 종류 | 예시 |
|---|---|
| **API 호출** | 서버에서 데이터 가져오기 |
| **구독(Subscription)** | WebSocket, 이벤트 리스너 등록 |
| **DOM 직접 조작** | `document.title` 변경, 스크롤 위치 조작 |
| **타이머** | `setTimeout`, `setInterval` |
| **로컬 스토리지** | `localStorage.getItem/setItem` |

> 💡 **왜 분리하는가?** 렌더링 중에 API를 호출하면 무한 루프가 발생할 수 있습니다. `useEffect`는 **렌더링이 완료된 후** 사이드 이펙트를 안전하게 실행합니다.

### 1.2 useEffect 기본 문법

```tsx
import { useEffect } from 'react'

useEffect(() => {
    // 실행할 사이드 이펙트
    console.log('컴포넌트가 렌더링되었습니다!')
    
    return () => {
        // 정리(Cleanup) 함수 (선택적)
        console.log('정리 작업 실행!')
    }
}, [의존성1, 의존성2])  // 의존성 배열
```

**세 가지 구성 요소:**
1. **콜백 함수**: 실행할 사이드 이펙트 로직
2. **정리(Cleanup) 함수**: 컴포넌트 언마운트 또는 재실행 전 정리 작업 (return으로 반환)
3. **의존성 배열**: 이 값이 변할 때만 이펙트 재실행

### 1.3 의존성 배열에 따른 동작 차이

이것을 정확히 이해하는 것이 `useEffect` 마스터의 핵심입니다.

```tsx
// (1) 의존성 배열 없음 → 매 렌더링마다 실행
useEffect(() => {
    console.log('렌더링될 때마다 실행됩니다')
})

// (2) 빈 배열 → 마운트 시 1회만 실행
useEffect(() => {
    console.log('컴포넌트가 처음 나타날 때 1번만 실행')
    
    return () => {
        console.log('컴포넌트가 사라질 때 1번만 실행')
    }
}, [])

// (3) 의존성 있음 → 해당 값이 변경될 때만 실행
useEffect(() => {
    console.log(`userId가 ${userId}로 변경되었습니다`)
}, [userId])
```

> ⚠️ **주의**: 의존성 배열을 생략하면(1번 케이스), 상태 변경 → 렌더링 → useEffect 실행 → 상태 변경의 **무한 루프**에 빠질 수 있습니다!

### 1.4 실전 예시 ① — API 데이터 가져오기

가장 흔한 useEffect 사용 사례입니다.

```tsx
import { useState, useEffect } from 'react'

interface User {
    id: number
    name: string
    email: string
}

const UserProfile = ({ userId }: { userId: number }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // 비동기 함수를 내부에서 선언 (useEffect 콜백 자체는 async가 될 수 없음!)
        const fetchUser = async () => {
            try {
                setLoading(true)
                setError(null)
                
                const response = await fetch(`/api/users/${userId}`)
                
                if (!response.ok) {
                    throw new Error('사용자를 찾을 수 없습니다')
                }
                
                const data: User = await response.json()
                setUser(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류')
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [userId])  // userId가 바뀔 때마다 새로운 유저 정보를 가져옴

    if (loading) return <div className="animate-pulse">로딩 중...</div>
    if (error) return <div className="text-red-500">에러: {error}</div>
    if (!user) return null

    return (
        <div className="p-6 bg-hud-bg-card rounded-xl border border-hud-border">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-hud-text-muted">{user.email}</p>
        </div>
    )
}
```

> ⚠️ **왜 `useEffect(async () => {...})` 로 쓰면 안 되나요?**  
> `useEffect`의 콜백은 `undefined` 또는 **정리 함수(클린업)**를 반환해야 합니다. `async` 함수는 `Promise`를 반환하므로 React가 혼란에 빠집니다. 반드시 내부에 별도 async 함수를 선언하세요.

### 1.5 실전 예시 ② — 이벤트 리스너 등록 & 정리

```tsx
const WindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    useEffect(() => {
        // 이벤트 핸들러 정의
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        // 이벤트 리스너 등록
        window.addEventListener('resize', handleResize)

        // 🧹 정리(Cleanup): 컴포넌트 언마운트 시 리스너 제거
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])  // 빈 배열 → 마운트 시 1번만 등록

    return (
        <p>
            현재 창 크기: {windowSize.width} × {windowSize.height}
        </p>
    )
}
```

> 💡 **Cleanup이 없으면?** 컴포넌트가 사라져도 이벤트 리스너가 계속 살아있어 **메모리 누수(Memory Leak)**가 발생합니다. 구독/리스너 등록 시 반드시 정리 함수를 작성하세요.

### 1.6 실전 예시 ③ — document.title 변경

```tsx
const PageTitle = ({ title }: { title: string }) => {
    useEffect(() => {
        const previousTitle = document.title
        document.title = `${title} | HUD Admin`

        return () => {
            document.title = previousTitle  // 이전 타이틀 복원
        }
    }, [title])

    return null  // UI를 렌더링하지 않는 유틸리티 컴포넌트
}

// 사용
const Dashboard = () => (
    <>
        <PageTitle title="Dashboard" />
        <h1>Dashboard</h1>
    </>
)
```

### 1.7 useEffect 의존성 배열 함정과 해결

```tsx
// ❌ 무한 루프 — 렌더링마다 새로운 객체/배열이 생성됨
useEffect(() => {
    fetchData(options)
}, [options])  // options = { page: 1, limit: 10 } 이 매 렌더링마다 새로 생성

// ✅ 해결 1: 원시값으로 분리
useEffect(() => {
    fetchData({ page, limit })
}, [page, limit])

// ✅ 해결 2: useMemo로 메모이제이션
const options = useMemo(() => ({ page, limit }), [page, limit])
useEffect(() => {
    fetchData(options)
}, [options])
```

### 1.8 useEffect 흐름 정리

```
컴포넌트 마운트
    ↓
초기 렌더링
    ↓
useEffect 실행 ←──────────────────┐
    ↓                              │
사용자 인터랙션 → State 변경        │
    ↓                              │
리렌더링                            │
    ↓                              │
이전 Cleanup 실행                   │
    ↓                              │
의존성 변경 확인 ── 변경됨 ──────────┘
    │
    └── 변경 안 됨 → 이펙트 스킵

컴포넌트 언마운트
    ↓
마지막 Cleanup 실행
```

---

## Chapter 2: useContext — 전역 상태 관리

### 2.1 Props Drilling 문제

기초편에서 배운 Props 전달은 **하위 컴포넌트가 깊어질수록** 불편해집니다.

```
App (theme="dark")
 └─ MainLayout (theme="dark")      ← 전달만 할 뿐 사용 안 함
     └─ Sidebar (theme="dark")     ← 전달만 할 뿐 사용 안 함
         └─ MenuItem (theme="dark") ← 여기서만 사용!
```

이처럼 중간 컴포넌트들이 **자신은 사용하지도 않는 Props를 전달만**하는 것을 **Props Drilling**이라 합니다. useContext는 이 문제를 해결합니다.

### 2.2 Context 3단계

Context는 **생성 → 제공 → 소비** 3단계로 사용합니다.

#### Step 1: Context 생성

```tsx
// src/contexts/ThemeContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react'

// 1-1. Context에 담길 데이터의 타입 정의
interface ThemeContextType {
    theme: 'light' | 'dark'
    toggleTheme: () => void
}

// 1-2. Context 생성 (기본값은 undefined)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
```

#### Step 2: Provider로 값 제공

```tsx
// 2. Provider 컴포넌트 생성
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
```

#### Step 3: useContext로 값 소비

```tsx
// 3. 커스텀 Hook으로 편리하게 사용
export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme은 ThemeProvider 내부에서만 사용할 수 있습니다')
    }
    return context
}
```

### 2.3 전체 적용 예시

```tsx
// main.tsx — 최상위에서 Provider 감싸기
import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>,
)
```

```tsx
// 아무 하위 컴포넌트에서 바로 사용 — Props Drilling 없음!
const MenuItem = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        >
            {theme === 'dark' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
        </button>
    )
}
```

### 2.4 실전 예시 — 인증(Auth) Context

실무에서 가장 많이 사용되는 Context 패턴입니다.

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react'

interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
    avatar?: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // 앱 시작 시 저장된 토큰으로 자동 로그인 시도
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token')
            if (token) {
                try {
                    const response = await fetch('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (response.ok) {
                        const userData = await response.json()
                        setUser(userData)
                    }
                } catch {
                    localStorage.removeItem('auth_token')
                }
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        if (!response.ok) throw new Error('로그인 실패')

        const { token, user: userData } = await response.json()
        localStorage.setItem('auth_token', token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('auth_token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth는 AuthProvider 내부에서 사용하세요')
    return context
}
```

```tsx
// 사용 예: 로그인 상태에 따른 조건부 렌더링
const Header = () => {
    const { user, isAuthenticated, logout } = useAuth()

    return (
        <header>
            {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <span>안녕하세요, {user?.name}님!</span>
                    <button onClick={logout}>로그아웃</button>
                </div>
            ) : (
                <Link to="/login">로그인</Link>
            )}
        </header>
    )
}
```

### 2.5 여러 Context 조합 (Provider 구성)

```tsx
// main.tsx — 여러 Provider를 중첩
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>,
)
```

### 2.6 Context 사용 시 주의사항

| 상황 | 권장 방법 |
|---|---|
| 2~3단계 Props 전달 | Props로 충분 (Context 불필요) |
| 앱 전체에서 공유하는 데이터 | ✅ Context 적합 (테마, 인증, 언어) |
| 자주 변경되는 데이터 | ⚠️ 성능 문제 가능 → Zustand 고려 |
| 서버에서 가져오는 데이터 | React Query 추천 (Chapter 5) |

> ⚠️ **성능 주의**: Context 값이 변경되면 **해당 Context를 구독하는 모든 컴포넌트**가 리렌더링됩니다. 자주 변하는 값은 Context를 분리하세요.

---

## Chapter 3: Custom Hooks — 로직 재사용

### 3.1 Custom Hook이란?

Custom Hook은 **`use`로 시작하는 함수**로, 여러 컴포넌트에서 공통된 로직을 재사용하기 위한 패턴입니다.

```
컴포넌트 A ─┐
            ├─── 같은 로직 반복 ───→ Custom Hook으로 추출!
컴포넌트 B ─┘
```

**규칙:**
1. 이름이 반드시 `use`로 시작해야 함
2. 다른 Hook(useState, useEffect 등)을 내부에서 호출 가능
3. 일반 함수가 아닌 **Hook의 규칙**을 따름

### 3.2 기본 예시 — useToggle

```tsx
// src/hooks/useToggle.ts
import { useState, useCallback } from 'react'

const useToggle = (initialValue: boolean = false) => {
    const [value, setValue] = useState(initialValue)

    const toggle = useCallback(() => setValue(prev => !prev), [])
    const setTrue = useCallback(() => setValue(true), [])
    const setFalse = useCallback(() => setValue(false), [])

    return { value, toggle, setTrue, setFalse }
}

export default useToggle
```

```tsx
// 사용 — 모달, 사이드바, 드롭다운 등 어디서든!
const Settings = () => {
    const modal = useToggle()
    const sidebar = useToggle(true)

    return (
        <>
            <button onClick={sidebar.toggle}>
                사이드바 {sidebar.value ? '닫기' : '열기'}
            </button>
            <button onClick={modal.setTrue}>모달 열기</button>
            {modal.value && <Modal onClose={modal.setFalse} />}
        </>
    )
}
```

### 3.3 실전 예시 ① — useLocalStorage

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
    // localStorage에서 초기값 로드
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch {
            return initialValue
        }
    })

    // 값이 변경될 때마다 localStorage에 저장
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch (error) {
            console.error('localStorage 저장 실패:', error)
        }
    }, [key, storedValue])

    return [storedValue, setStoredValue] as const
}

export default useLocalStorage
```

```tsx
// 사용 — useState와 동일한 API, 하지만 새로고침해도 값 유지!
const Settings = () => {
    const [theme, setTheme] = useLocalStorage('theme', 'dark')
    const [fontSize, setFontSize] = useLocalStorage('fontSize', 14)

    return (
        <div>
            <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
            >
                <option value="dark">다크</option>
                <option value="light">라이트</option>
            </select>
        </div>
    )
}
```

### 3.4 실전 예시 ② — useFetch (API 호출 추상화)

```tsx
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => void
}

function useFetch<T>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [trigger, setTrigger] = useState(0)

    useEffect(() => {
        let cancelled = false  // 경쟁 조건(Race Condition) 방지

        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(url)
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const result = await response.json()

                if (!cancelled) {
                    setData(result)
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : '오류 발생')
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchData()

        // Cleanup: 컴포넌트 언마운트 시 상태 업데이트 방지
        return () => {
            cancelled = true
        }
    }, [url, trigger])

    const refetch = () => setTrigger(prev => prev + 1)

    return { data, loading, error, refetch }
}

export default useFetch
```

```tsx
// 사용 — 3줄로 API 호출 완료!
const UserList = () => {
    const { data: users, loading, error, refetch } = useFetch<User[]>('/api/users')

    if (loading) return <div>로딩 중...</div>
    if (error) return <div>에러: {error} <button onClick={refetch}>재시도</button></div>

    return (
        <ul>
            {users?.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
    )
}
```

> 💡 **경쟁 조건(Race Condition)이란?** userId가 1→2→3으로 빠르게 바뀌면 API 응답이 3→1→2 순서로 돌아올 수 있습니다. `cancelled` 플래그로 이전 요청의 결과를 무시합니다.

### 3.5 실전 예시 ③ — useDebounce (검색 최적화)

```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(timer)  // 값이 바뀌면 이전 타이머 취소
    }, [value, delay])

    return debouncedValue
}

export default useDebounce
```

```tsx
// 사용 — 검색어 입력 시 500ms 후에만 API 호출
const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const { data: results } = useFetch<SearchResult[]>(
        `/api/search?q=${debouncedSearch}`
    )

    return (
        <div>
            <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요..."
            />
            {/* 타이핑할 때마다가 아닌, 멈춘 후 500ms 후에 결과 표시 */}
            {results?.map(item => <div key={item.id}>{item.title}</div>)}
        </div>
    )
}
```

### 3.6 Custom Hook 설계 원칙

| 원칙 | 설명 |
|---|---|
| **단일 책임** | 하나의 Hook은 하나의 관심사만 |
| **use 접두사** | 반드시 `use`로 시작 |
| **반환값 설계** | 객체(이름 있는 값) 또는 튜플([값, 설정함수]) |
| **제네릭 활용** | `useFetch<T>()` 처럼 타입 유연성 확보 |
| **테스트 용이성** | UI와 분리되어 독립적으로 테스트 가능 |

---

## Chapter 4: useReducer — 복잡한 상태 관리

### 4.1 useState의 한계

`useState`는 간단한 상태에 적합하지만, **상태가 복잡해지면** 코드가 난잡해집니다.

```tsx
// ❌ useState로 복잡한 상태를 관리하면...
const [items, setItems] = useState<Item[]>([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(0)
const [sortBy, setSortBy] = useState('name')
const [filterBy, setFilterBy] = useState('all')
// ...상태 변경 함수가 7개, 어떤 조합으로 호출해야 하는지 추적이 어려움
```

### 4.2 useReducer 기본 개념

`useReducer`는 **Redux 패턴**에서 영감을 받은 Hook으로, 상태 변경 로직을 **액션(Action)** 기반으로 관리합니다.

```
현재 상태(State) + 액션(Action) → Reducer 함수 → 새로운 상태(State)
```

### 4.3 기본 문법

```tsx
import { useReducer } from 'react'

// 1. 상태 타입 정의
interface State {
    count: number
}

// 2. 액션 타입 정의
type Action =
    | { type: 'INCREMENT' }
    | { type: 'DECREMENT' }
    | { type: 'SET'; payload: number }

// 3. Reducer 함수 — 순수 함수로 상태 변경 로직 집중
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 }
        case 'DECREMENT':
            return { count: state.count - 1 }
        case 'SET':
            return { count: action.payload }
        default:
            return state
    }
}

// 4. 컴포넌트에서 사용
const Counter = () => {
    const [state, dispatch] = useReducer(reducer, { count: 0 })

    return (
        <div>
            <p>카운트: {state.count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
            <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>
                100으로 설정
            </button>
        </div>
    )
}
```

### 4.4 실전 예시 — 할 일 목록(Todo List)

`useReducer`가 빛을 발하는 대표적인 예시입니다.

```tsx
// 타입 정의
interface Todo {
    id: number
    text: string
    completed: boolean
}

interface TodoState {
    todos: Todo[]
    filter: 'all' | 'active' | 'completed'
    nextId: number
}

// 모든 가능한 액션을 유니온 타입으로 정의
type TodoAction =
    | { type: 'ADD_TODO'; payload: string }
    | { type: 'TOGGLE_TODO'; payload: number }
    | { type: 'DELETE_TODO'; payload: number }
    | { type: 'SET_FILTER'; payload: TodoState['filter'] }
    | { type: 'CLEAR_COMPLETED' }

// Reducer — 상태 변경의 모든 경우를 한 곳에서 관리
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [
                    ...state.todos,
                    { id: state.nextId, text: action.payload, completed: false }
                ],
                nextId: state.nextId + 1,
            }

        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
            }

        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload),
            }

        case 'SET_FILTER':
            return { ...state, filter: action.payload }

        case 'CLEAR_COMPLETED':
            return {
                ...state,
                todos: state.todos.filter(todo => !todo.completed),
            }

        default:
            return state
    }
}

// 초기 상태
const initialState: TodoState = {
    todos: [],
    filter: 'all',
    nextId: 1,
}
```

```tsx
// 컴포넌트에서 사용
const TodoApp = () => {
    const [state, dispatch] = useReducer(todoReducer, initialState)
    const [newTodo, setNewTodo] = useState('')

    // 필터링된 할 일 목록
    const filteredTodos = state.todos.filter(todo => {
        if (state.filter === 'active') return !todo.completed
        if (state.filter === 'completed') return todo.completed
        return true
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (newTodo.trim()) {
            dispatch({ type: 'ADD_TODO', payload: newTodo.trim() })
            setNewTodo('')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <form onSubmit={handleSubmit}>
                <input
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    placeholder="할 일을 입력하세요..."
                />
                <button type="submit">추가</button>
            </form>

            {/* 필터 버튼 */}
            <div className="flex gap-2 my-4">
                {(['all', 'active', 'completed'] as const).map(filter => (
                    <button
                        key={filter}
                        onClick={() => dispatch({ type: 'SET_FILTER', payload: filter })}
                        className={state.filter === filter ? 'font-bold' : ''}
                    >
                        {filter === 'all' ? '전체' : filter === 'active' ? '진행 중' : '완료'}
                    </button>
                ))}
            </div>

            {/* 할 일 목록 */}
            <ul>
                {filteredTodos.map(todo => (
                    <li key={todo.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                        />
                        <span className={todo.completed ? 'line-through opacity-50' : ''}>
                            {todo.text}
                        </span>
                        <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
                            🗑️
                        </button>
                    </li>
                ))}
            </ul>

            <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}>
                완료된 항목 삭제
            </button>
        </div>
    )
}
```

### 4.5 useReducer + useContext 조합

이 조합은 **미니 Redux**와 같은 전역 상태 관리 시스템을 만들 수 있습니다.

```tsx
// src/contexts/TodoContext.tsx
import { createContext, useReducer, useContext, ReactNode } from 'react'

// Context 생성
const TodoContext = createContext<{
    state: TodoState
    dispatch: React.Dispatch<TodoAction>
} | undefined>(undefined)

// Provider
export const TodoProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(todoReducer, initialState)

    return (
        <TodoContext.Provider value={{ state, dispatch }}>
            {children}
        </TodoContext.Provider>
    )
}

// 커스텀 Hook
export const useTodo = () => {
    const context = useContext(TodoContext)
    if (!context) throw new Error('useTodo는 TodoProvider 내부에서 사용하세요')
    return context
}
```

```tsx
// 어디서든 사용 — Props 전달 불필요!
const TodoItem = ({ todo }: { todo: Todo }) => {
    const { dispatch } = useTodo()

    return (
        <li>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
            {todo.text}
        </li>
    )
}
```

### 4.6 useState vs useReducer 선택 기준

| 기준 | useState | useReducer |
|---|---|---|
| **상태 개수** | 1~2개 | 3개 이상 연관된 상태 |
| **상태 변경 로직** | 단순 (set, toggle) | 복잡 (조건 분기, 연쇄 변경) |
| **상태 변경 추적** | 어려움 | 액션 타입으로 명확 |
| **테스트** | 컴포넌트 전체 테스트 필요 | Reducer 함수만 단위 테스트 가능 |
| **예시** | 모달 열기/닫기, 입력값 | 폼 상태, 쇼핑카트, 데이터 CRUD |

---

## Chapter 5: React Query / SWR — 서버 상태 관리

### 5.1 클라이언트 상태 vs 서버 상태

지금까지 배운 useState, useReducer, useContext는 모두 **클라이언트 상태**를 관리합니다. 하지만 실제 앱에서는 **서버에서 오는 데이터**를 다루는 일이 훨씬 많습니다.

| 구분 | 클라이언트 상태 | 서버 상태 |
|---|---|---|
| **소유권** | 프론트엔드가 소유 | 서버(DB)가 소유 |
| **예시** | 모달 열기/닫기, 테마, 폼 입력 | 사용자 목록, 게시글, 상품 정보 |
| **동기화** | 필요 없음 | 서버와 항상 동기화 필요 |
| **문제** | 비교적 단순 | 캐싱, 갱신, 에러 처리, 로딩 상태 등 복잡 |

> 💡 **핵심 깨달음**: 서버 상태를 useState로 관리하면 캐싱, 자동 갱신, 에러 재시도, 로딩 상태 등을 **모두 직접 구현**해야 합니다. React Query/SWR은 이 모든 것을 자동으로 처리합니다.

### 5.2 React Query (TanStack Query)

현재 가장 인기 있는 서버 상태 관리 라이브러리입니다.

```bash
# 설치
npm install @tanstack/react-query
```

#### 기본 설정

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,    // 5분간 데이터를 "신선"하다고 판단
            retry: 3,                     // 실패 시 3번 재시도
            refetchOnWindowFocus: true,   // 탭 포커스 시 자동 갱신
        },
    },
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
)
```

#### useQuery — 데이터 조회

```tsx
import { useQuery } from '@tanstack/react-query'

interface User {
    id: number
    name: string
    email: string
}

// API 호출 함수 (React Query와 분리)
const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('사용자 목록을 불러올 수 없습니다')
    return response.json()
}

const UserList = () => {
    const {
        data: users,      // 서버에서 가져온 데이터
        isLoading,        // 최초 로딩 중
        isError,          // 에러 발생 여부
        error,            // 에러 객체
        refetch,          // 수동 재조회
        isFetching,       // 백그라운드 갱신 중
    } = useQuery({
        queryKey: ['users'],           // 캐시 키 (고유 식별자)
        queryFn: fetchUsers,           // 데이터를 가져오는 함수
    })

    if (isLoading) return <div className="animate-pulse">로딩 중...</div>
    if (isError) return <div>에러: {error.message}</div>

    return (
        <div>
            {isFetching && <span className="text-xs">갱신 중...</span>}
            <ul>
                {users?.map(user => (
                    <li key={user.id}>{user.name} ({user.email})</li>
                ))}
            </ul>
            <button onClick={() => refetch()}>새로고침</button>
        </div>
    )
}
```

> 💡 **queryKey의 중요성**: `['users']`라는 키로 캐싱됩니다. 같은 키를 사용하는 다른 컴포넌트는 **API를 다시 호출하지 않고 캐시된 데이터를 즉시 표시**합니다.

#### 동적 queryKey — 파라미터가 있는 조회

```tsx
// userId에 따라 다른 데이터를 캐싱
const UserProfile = ({ userId }: { userId: number }) => {
    const { data: user } = useQuery({
        queryKey: ['user', userId],   // userId가 바뀌면 새로 조회
        queryFn: () => fetchUser(userId),
        enabled: userId > 0,          // userId가 유효할 때만 조회
    })

    return <div>{user?.name}</div>
}
```

#### useMutation — 데이터 생성/수정/삭제

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

const CreateUserForm = () => {
    const queryClient = useQueryClient()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const createUser = useMutation({
        // 실제 API 호출
        mutationFn: async (newUser: { name: string; email: string }) => {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            })
            if (!response.ok) throw new Error('사용자 생성 실패')
            return response.json()
        },

        // 성공 시: 사용자 목록 캐시를 무효화하여 자동 갱신
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setName('')
            setEmail('')
        },

        // 에러 시
        onError: (error) => {
            alert(`오류: ${error.message}`)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createUser.mutate({ name, email })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="이름" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" />
            <button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? '생성 중...' : '사용자 추가'}
            </button>
        </form>
    )
}
```

### 5.3 SWR (Stale-While-Revalidate)

Vercel(Next.js 팀)이 만든 경량 데이터 페칭 라이브러리입니다.

```bash
# 설치
npm install swr
```

```tsx
import useSWR from 'swr'

// fetcher 함수 정의
const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error('데이터를 불러올 수 없습니다')
    return res.json()
})

const UserList = () => {
    const {
        data: users,
        error,
        isLoading,
        mutate,   // 캐시를 수동으로 갱신
    } = useSWR<User[]>('/api/users', fetcher, {
        revalidateOnFocus: true,       // 탭 포커스 시 재검증
        revalidateOnReconnect: true,   // 네트워크 복구 시 재검증
        refreshInterval: 30000,        // 30초마다 자동 갱신
    })

    if (isLoading) return <div>로딩 중...</div>
    if (error) return <div>에러: {error.message}</div>

    return (
        <ul>
            {users?.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
    )
}
```

> 💡 **SWR 이름의 의미**: "Stale-While-Revalidate" — 오래된(stale) 캐시를 먼저 보여주고, 동시에 서버에서 최신 데이터를 가져와(revalidate) 갱신합니다. 사용자는 로딩 없이 즉시 데이터를 봅니다!

### 5.4 React Query vs SWR 비교

| 기능 | React Query | SWR |
|---|---|---|
| **번들 크기** | ~39KB | ~12KB |
| **Mutation 지원** | ✅ 강력한 useMutation | ⚠️ 수동 처리 |
| **캐시 무효화** | ✅ invalidateQueries | ⚠️ mutate로 수동 |
| **DevTools** | ✅ 공식 DevTools | ⚠️ 커뮤니티 도구 |
| **페이지네이션** | ✅ useInfiniteQuery | ✅ useSWRInfinite |
| **낙관적 업데이트** | ✅ 내장 | ✅ mutate의 optimistic 옵션 |
| **학습 곡선** | 중간 | 낮음 |
| **추천 상황** | 복잡한 CRUD 앱 | 간단한 데이터 조회 중심 앱 |

> 💡 **결론**: CRUD가 많고 복잡한 앱은 **React Query**, 읽기 위주의 간단한 앱은 **SWR**이 적합합니다.

### 5.5 React Query의 캐시 흐름

```
컴포넌트 마운트
    ↓
queryKey ['users'] 확인
    ↓
캐시에 데이터 있음? ─── 없음 → API 호출 → 캐시에 저장 → 화면 표시
    │
    └── 있음 → 캐시된 데이터 즉시 표시
                  ↓
              staleTime 경과? ─── 아니오 → 끝 (신선한 데이터)
                  │
                  └── 예 → 백그라운드에서 API 재호출
                              ↓
                          새 데이터로 캐시 갱신
                              ↓
                          화면 자동 업데이트
```

---

## Chapter 6: 상태 관리 라이브러리 — Zustand, Redux Toolkit

### 6.1 왜 외부 상태 관리 라이브러리가 필요한가?

Chapter 2에서 useContext, Chapter 4에서 useReducer를 배웠습니다. 이 둘을 조합하면 전역 상태 관리가 가능하지만, **한계**가 있습니다.

| 문제 | 설명 |
|---|---|
| **성능** | Context 값이 바뀌면 구독 컴포넌트 **전체** 리렌더링 |
| **보일러플레이트** | Provider, Context, Reducer, Action 타입... 코드가 많음 |
| **미들웨어 부재** | 로깅, 비동기 처리, 영속성 등을 직접 구현해야 함 |
| **디버깅** | 상태 변화 추적이 어려움 |

### 6.2 Zustand — 심플함의 극치

Zustand(독일어로 "상태")는 **최소한의 코드**로 전역 상태를 관리할 수 있는 라이브러리입니다.

```bash
# 설치
npm install zustand
```

#### 기본 사용법

```tsx
// src/stores/useCounterStore.ts
import { create } from 'zustand'

// 1. 스토어 인터페이스 정의
interface CounterState {
    count: number
    increment: () => void
    decrement: () => void
    reset: () => void
}

// 2. 스토어 생성 — 이것이 전부입니다!
const useCounterStore = create<CounterState>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
}))

export default useCounterStore
```

```tsx
// 컴포넌트에서 사용 — Provider 없이 바로!
const Counter = () => {
    const { count, increment, decrement, reset } = useCounterStore()

    return (
        <div>
            <p>카운트: {count}</p>
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
            <button onClick={reset}>초기화</button>
        </div>
    )
}
```

> 💡 **Zustand의 핵심 장점**: Provider로 감쌀 필요가 **없습니다**! `create`로 스토어를 만들고, 컴포넌트에서 Hook처럼 바로 사용합니다.

#### 실전 예시 — 쇼핑카트 스토어

```tsx
// src/stores/useCartStore.ts
import { create } from 'zustand'

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
}

interface CartState {
    items: CartItem[]
    // 액션 (상태 변경 함수)
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    // 계산된 값 (Getter)
    getTotalPrice: () => number
    getTotalItems: () => number
}

const useCartStore = create<CartState>((set, get) => ({
    items: [],

    addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id)
        if (existing) {
            // 이미 있으면 수량 +1
            return {
                items: state.items.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            }
        }
        // 없으면 새로 추가
        return { items: [...state.items, { ...item, quantity: 1 }] }
    }),

    removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id),
    })),

    updateQuantity: (id, quantity) => set((state) => ({
        items: quantity <= 0
            ? state.items.filter(i => i.id !== id)
            : state.items.map(i =>
                i.id === id ? { ...i, quantity } : i
              ),
    })),

    clearCart: () => set({ items: [] }),

    // get()으로 현재 상태에 접근
    getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },

    getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
    },
}))

export default useCartStore
```

```tsx
// 상품 목록 컴포넌트
const ProductCard = ({ product }: { product: { id: number; name: string; price: number } }) => {
    const addItem = useCartStore(state => state.addItem)  // 필요한 것만 선택!

    return (
        <div className="p-4 border rounded-xl">
            <h3>{product.name}</h3>
            <p>{product.price.toLocaleString()}원</p>
            <button onClick={() => addItem(product)}>
                장바구니 담기
            </button>
        </div>
    )
}

// 장바구니 아이콘 (헤더에서 사용)
const CartIcon = () => {
    const totalItems = useCartStore(state => state.getTotalItems())

    return (
        <div className="relative">
            🛒
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                </span>
            )}
        </div>
    )
}
```

> ⚠️ **성능 팁**: `useCartStore(state => state.addItem)` 처럼 **필요한 값만 선택(selector)**하면, 해당 값이 변경될 때만 리렌더링됩니다. `useCartStore()` 로 전체를 가져오면 **아무 값이 변해도** 리렌더링됩니다.

#### Zustand 미들웨어 — 영속성(Persist)

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// persist 미들웨어로 localStorage에 자동 저장/복원
const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => set((state) => {
                // ...동일한 로직
            }),
            // ...나머지 액션
        }),
        {
            name: 'cart-storage',  // localStorage 키 이름
        }
    )
)
// 이제 페이지를 새로고침해도 장바구니가 유지됩니다!
```

### 6.3 Redux Toolkit (RTK) — 엔터프라이즈 표준

Redux Toolkit은 Redux의 공식 도구 모음으로, Redux의 복잡함을 대폭 줄였습니다.

```bash
# 설치
npm install @reduxjs/toolkit react-redux
```

#### 기본 구조

```
src/
├── store/
│   ├── index.ts          # 스토어 설정
│   └── slices/
│       ├── userSlice.ts   # 사용자 상태 관리
│       └── cartSlice.ts   # 장바구니 상태 관리
```

#### Step 1: Slice 생성 (상태 + 액션 + 리듀서를 한 곳에서)

```tsx
// src/store/slices/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
    value: number
}

const initialState: CounterState = {
    value: 0,
}

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        // 각 reducer가 자동으로 Action Creator가 됨
        increment: (state) => {
            state.value += 1  // Immer 덕분에 직접 수정 가능!
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },
        reset: (state) => {
            state.value = 0
        },
    },
})

// Action Creator 자동 생성
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions

// Reducer 내보내기
export default counterSlice.reducer
```

> 💡 **Immer 내장**: 기존 Redux에서는 `{ ...state, value: state.value + 1 }` 처럼 불변성을 지켜야 했습니다. RTK는 Immer를 내장하여 `state.value += 1` 처럼 **직접 수정하는 것처럼** 작성해도 내부적으로 불변 업데이트를 수행합니다.

#### Step 2: 스토어 설정

```tsx
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        cart: cartReducer,
    },
})

// TypeScript용 타입 추론
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

#### Step 3: Provider 연결

```tsx
// main.tsx
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
)
```

#### Step 4: 컴포넌트에서 사용

```tsx
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { increment, decrement, incrementByAmount, reset } from '../store/slices/counterSlice'

const Counter = () => {
    // 상태 읽기
    const count = useSelector((state: RootState) => state.counter.value)
    // 액션 발행
    const dispatch = useDispatch<AppDispatch>()

    return (
        <div>
            <p>카운트: {count}</p>
            <button onClick={() => dispatch(increment())}>+1</button>
            <button onClick={() => dispatch(decrement())}>-1</button>
            <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
            <button onClick={() => dispatch(reset())}>초기화</button>
        </div>
    )
}
```

#### 실전 예시 — 비동기 액션 (createAsyncThunk)

```tsx
// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id: number
    name: string
    email: string
}

interface UserState {
    users: User[]
    loading: boolean
    error: string | null
}

// 비동기 Thunk 생성 — API 호출을 캡슐화
export const fetchUsers = createAsyncThunk(
    'users/fetchAll',  // 액션 타입 접두사
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/users')
            if (!response.ok) throw new Error('사용자 목록 조회 실패')
            return await response.json() as User[]
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : '알 수 없는 오류'
            )
        }
    }
)

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
    } as UserState,
    reducers: {
        clearUsers: (state) => {
            state.users = []
        },
    },
    // 비동기 액션의 상태 처리
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearUsers } = userSlice.actions
export default userSlice.reducer
```

```tsx
// 컴포넌트에서 비동기 액션 사용
const UserList = () => {
    const { users, loading, error } = useSelector((state: RootState) => state.users)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    if (loading) return <div>로딩 중...</div>
    if (error) return <div>에러: {error}</div>

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    )
}
```

### 6.4 Zustand vs Redux Toolkit 비교

| 기준 | Zustand | Redux Toolkit |
|---|---|---|
| **코드량** | 매우 적음 | 상대적으로 많음 |
| **Provider 필요** | ❌ 불필요 | ✅ 필요 |
| **학습 곡선** | 낮음 | 중간 |
| **DevTools** | 미들웨어로 지원 | ✅ 강력한 Redux DevTools |
| **미들웨어** | persist, devtools 등 | 내장 (thunk, serializable check) |
| **비동기 처리** | 액션 함수 내에서 자유롭게 | createAsyncThunk로 구조화 |
| **팀 규모** | 소~중규모 | 중~대규모 |
| **생태계** | 성장 중 | 매우 풍부 |
| **추천 상황** | 빠른 개발, 간단~중간 복잡도 | 대규모 앱, 팀 협업, 엄격한 패턴 필요 |

### 6.5 어떤 것을 선택할까? — 의사결정 가이드

```
프로젝트 시작
    ↓
전역 상태가 필요한가?
    │
    ├── 아니오 → useState + Props로 충분
    │
    └── 예 → 어떤 종류의 상태인가?
              │
              ├── 서버 데이터 (API) → React Query / SWR
              │
              └── 클라이언트 상태 → 규모는?
                    │
                    ├── 간단 (테마, 인증) → useContext
                    │
                    ├── 중간 복잡도 → Zustand ✨ (가장 인기)
                    │
                    └── 대규모 + 팀 협업 → Redux Toolkit
```

---

## 학습 체크리스트

### Chapter 1: useEffect
- [ ] 사이드 이펙트의 개념을 설명할 수 있다
- [ ] 의존성 배열의 세 가지 패턴(없음/빈배열/값)을 구분할 수 있다
- [ ] API 데이터 가져오기를 useEffect로 구현할 수 있다
- [ ] Cleanup 함수의 역할과 필요한 시점을 알고 있다
- [ ] 무한 루프를 방지하는 방법을 이해한다

### Chapter 2: useContext
- [ ] Props Drilling 문제를 설명할 수 있다
- [ ] Context를 생성하고 Provider/Consumer 패턴을 구현할 수 있다
- [ ] 커스텀 Hook으로 Context 사용을 간소화할 수 있다
- [ ] Context 사용이 적합한 상황과 부적합한 상황을 구분할 수 있다

### Chapter 3: Custom Hooks
- [ ] Custom Hook을 만들고 컴포넌트에서 사용할 수 있다
- [ ] useLocalStorage, useFetch 같은 실용적인 Hook을 구현할 수 있다
- [ ] useDebounce로 검색 최적화를 구현할 수 있다

### Chapter 4: useReducer
- [ ] useState와 useReducer의 차이를 설명할 수 있다
- [ ] Reducer 함수와 Action 타입을 정의할 수 있다
- [ ] useReducer + useContext 조합으로 전역 상태를 관리할 수 있다

### Chapter 5: React Query / SWR
- [ ] 클라이언트 상태와 서버 상태의 차이를 이해한다
- [ ] useQuery와 useMutation을 사용할 수 있다
- [ ] queryKey와 캐시의 관계를 설명할 수 있다
- [ ] React Query와 SWR의 차이를 비교할 수 있다

### Chapter 6: 상태 관리 라이브러리
- [ ] Zustand로 스토어를 만들고 컴포넌트에서 사용할 수 있다
- [ ] Redux Toolkit으로 Slice, Store를 설정할 수 있다
- [ ] createAsyncThunk로 비동기 액션을 처리할 수 있다
- [ ] 프로젝트 규모에 맞는 상태 관리 도구를 선택할 수 있다

---

## 전체 상태 관리 도구 비교 총정리

| 도구 | 복잡도 | 적합한 상황 | 핵심 키워드 |
|---|---|---|---|
| **useState** | ⭐ | 단순한 컴포넌트 로컬 상태 | 간단, 로컬 |
| **useReducer** | ⭐⭐ | 복잡한 로컬 상태 | 액션 기반, 예측 가능 |
| **useContext** | ⭐⭐ | 앱 전역 상태 (소규모) | Provider, 전역, 간단 |
| **Zustand** | ⭐⭐ | 중규모 전역 상태 | 최소 코드, Provider 불필요 |
| **Redux Toolkit** | ⭐⭐⭐ | 대규모 앱, 팀 협업 | 구조화, DevTools, 미들웨어 |
| **React Query** | ⭐⭐ | 서버 데이터 관리 | 캐싱, 자동 갱신, 비동기 |
| **SWR** | ⭐⭐ | 경량 서버 데이터 관리 | 경량, 실시간 갱신 |

---

> 📖 이 강의 노트는 기초편(`React_강의노트.md`)과 함께 React의 전체 그림을 완성합니다.  
> **기초편** → 컴포넌트, JSX, Props, State, Router  
> **심화편** → 사이드 이펙트, 전역 상태, 로직 재사용, 서버 상태, 외부 라이브러리
