# 🚀 실전 끝까지 따라하면 어느새 전문가 — Part 3
> 고급 기능 추가와 프로덕션 레벨 완성

**선수 과정**: `React_실전_전문가코스.md` (Part 1), `React_실전_전문가코스_Part2.md` (Part 2) 완료
**목표**: 심화 상태 관리, 성능 최적화, 테스트, 배포까지 **프로덕션 레벨**의 Admin Template을 완성합니다.

---

## Part 3 로드맵

```
PHASE 8: 고급 상태 관리 구현
├── Step 20. AuthContext — 인증 시스템 구축
├── Step 21. ThemeContext — 다크모드 토글
└── Step 22. useLocalStorage + useDebounce Custom Hooks

PHASE 9: 성능 최적화
├── Step 23. React.memo & useMemo 불필요한 리렌더링 제거
├── Step 24. Code Splitting & Lazy Loading
└── Step 25. Virtual Scroll (대량 데이터 렌더링)

PHASE 10: 테스트 & 배포
├── Step 26. Vitest & React Testing Library
├── Step 27. E2E 테스트 (Playwright)
└── Step 28. 프로덕션 빌드 & 배포
```

---

## PHASE 8: 고급 상태 관리 구현

`React_심화_강의노트.md`에서 배운 **useContext, Custom Hooks**를 실전 프로젝트에 적용합니다.

---

### Step 20. AuthContext — 인증 시스템 구축

로그인/로그아웃 상태를 전역으로 관리하고, 인증된 사용자만 특정 페이지에 접근하게 합니다.

#### 20-1. 학습 목표

- Context로 전역 인증 상태 관리
- ProtectedRoute로 인증 가드 구현
- localStorage에 토큰 영속성
- TypeScript로 타입 안전성 확보

#### 20-2. AuthContext 작성

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from 'react'

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
                    // 실제 프로젝트에서는 API 호출
                    const userData: User = {
                        id: '1',
                        name: 'Admin User',
                        email: 'admin@hudadmin.com',
                        role: 'admin',
                    }
                    setUser(userData)
                } catch {
                    localStorage.removeItem('auth_token')
                }
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        // 실제 프로젝트에서는 API 호출
        const userData: User = {
            id: '1',
            name: 'Admin User',
            email,
            role: 'admin',
        }
        localStorage.setItem('auth_token', 'fake_token')
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

#### 20-3. ProtectedRoute 구현

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hud-accent-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
```

#### 20-4. App.tsx에 인증 적용

```tsx
// src/App.tsx (전체 코드)
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'

// Lazy Loading으로 페이지 분할
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const Products = lazy(() => import('./pages/Products'))
const Settings = lazy(() => import('./pages/Settings'))
const ScrumBoard = lazy(() => import('./pages/ScrumBoard'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Login = lazy(() => import('./pages/auth/Login'))

// 로딩 fallback 컴포넌트
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hud-accent-primary mx-auto mb-4"></div>
            <p className="text-hud-text-muted">페이지를 불러오는 중...</p>
        </div>
    </div>
)

function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* 공개 페이지 */}
                        <Route path="/login" element={<Login />} />

                        {/* 인증 필요 페이지 */}
                        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route index element={<Dashboard />} />
                            <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1></div>} />
                            <Route path="products" element={<Products />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="scrum-board" element={<ScrumBoard />} />
                            <Route path="calendar" element={<Calendar />} />
                        </Route>
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    )
}

export default App
```

#### 20-5. Login 페이지 구현

```tsx
// src/pages/auth/Login.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '../../components/common/Button'
import HudCard from '../../components/common/HudCard'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState('admin@hudadmin.com')
    const [password, setPassword] = useState('password')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            await login(email, password)
            navigate('/')
        } catch (err) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-hud-bg-primary hud-grid-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-hud-accent-primary to-hud-accent-info rounded-xl flex items-center justify-center font-bold text-2xl text-hud-bg-primary mx-auto mb-4">
                        H
                    </div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">ALPHA TEAM</h1>
                    <p className="text-hud-text-muted mt-2">Admin Dashboard</p>
                </div>

                <HudCard>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-hud-accent-danger/10 border border-hud-accent-danger/30 rounded-lg text-hud-accent-danger text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-hud-text-secondary mb-2">이메일</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-hud-text-muted" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                    placeholder="admin@hudadmin.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-hud-text-secondary mb-2">비밀번호</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-hud-text-muted" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                    placeholder="•••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-hud-text-muted hover:text-hud-text-primary"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-hud-text-secondary cursor-pointer">
                                <input type="checkbox" className="rounded border-hud-border-secondary" />
                                로그인 상태 유지
                            </label>
                            <Link to="/forgot-password" className="text-hud-accent-primary hover:underline">
                                비밀번호 찾기
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            glow
                            disabled={isLoading}
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>
                </HudCard>

                <p className="text-center text-sm text-hud-text-muted mt-6">
                    계정이 없으신가요?{' '}
                    <Link to="/register" className="text-hud-accent-primary hover:underline">
                        회원가입
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
```

#### 20-6. 배운 개념 정리

| 개념 | 적용 |
|---|---|
| **useContext** | AuthContext로 전역 인증 상태 관리 |
| **Custom Hook** | `useAuth()`로 Context 사용 간소화 |
| **useEffect** | localStorage에서 토큰 확인 |
| **ProtectedRoute** | 인증 가드 패턴 |
| **localStorage** | 토큰 영속성 |

✅ **Step 20 완료!**

---

### Step 21. ThemeContext — 다크모드 토글

시스템 테마(라이트/다크)를 전역으로 관리하고 사용자가 선택할 수 있게 합니다.

#### 21-1. ThemeContext 작성

```tsx
// src/contexts/ThemeContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme') as Theme
        return saved || 'dark'
    })

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme은 ThemeProvider 내부에서 사용하세요')
    return context
}
```

#### 21-2. Settings 페이지에 테마 토글 적용

```tsx
// src/pages/Settings.tsx (일부 수정 - appearance 섹션만)
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const Settings = () => {
    const { theme, toggleTheme } = useTheme()
    const [activeSection, setActiveSection] = useState('profile')

    return (
        <div className="space-y-6 animate-fade-in">
            {/* 헤더 부분은 기존과 동일 */}

            <div className="flex gap-6">
                {/* 사이드바 메뉴는 기존과 동일 */}

                {/* 우측 콘텐츠 */}
                <div className="flex-1 space-y-6">
                    {/* Appearance 섹션 */}
                    {activeSection === 'appearance' && (
                        <HudCard title="Appearance" subtitle="Customize the look and feel">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-hud-bg-primary">
                                    <div className="flex items-center gap-3">
                                        {theme === 'dark' ? (
                                            <Moon size={20} className="text-hud-accent-primary" />
                                        ) : (
                                            <Sun size={20} className="text-hud-accent-warning" />
                                        )}
                                        <div>
                                            <p className="text-sm text-hud-text-primary">Dark Mode</p>
                                            <p className="text-xs text-hud-text-muted">
                                                {theme === 'dark' ? 'Dark theme is active' : 'Light theme is active'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            theme === 'dark' ? 'bg-hud-accent-primary' : 'bg-hud-text-muted'
                                        }`}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                            theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </HudCard>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings
```

#### 21-3. main.tsx에 Provider 추가

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
)
```

✅ **Step 21 완료!**

---

### Step 22. Custom Hooks — useLocalStorage & useDebounce

`React_심화_강의노트.md`에서 배운 Custom Hooks를 실전 프로젝트에 적용합니다.

#### 22-1. useLocalStorage Hook

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch {
            return initialValue
        }
    })

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

#### 22-2. useDebounce Hook

```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}

export default useDebounce
```

#### 22-3. Products 페이지에 useDebounce 적용

```tsx
// src/pages/Products.tsx (수정 - import 추가)
import { useState } from 'react'
import { Search, Grid, List, Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import useDebounce from '../hooks/useDebounce'
import HudCard from '../components/common/HudCard'
import Button from '../components/common/Button'

// products 데이터는 기존과 동일

const Products = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // 검색어 입력 후 500ms 후에만 필터링 적용
    const debouncedSearch = useDebounce(searchQuery, 500)

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // ... 나머지 코드는 기존과 동일
}

export default Products
```

✅ **Step 22 완료!**

---

## PHASE 9: 성능 최적화

대규모 앱에서 필수적인 최적화 기법들을 적용합니다.

---

### Step 23. React.memo & useMemo — 불필요한 리렌더링 제거

#### 23-1. StatCard 최적화 (React.memo)

```tsx
// src/components/common/StatCard.tsx (전체 코드 - 수정 버전)
import { memo, ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    change?: number
    changeLabel?: string
    icon?: ReactNode
    variant?: 'default' | 'primary' | 'secondary' | 'warning' | 'danger'
}

const StatCard = memo(({
    title,
    value,
    change,
    changeLabel = 'vs last month',
    icon,
    variant = 'default'
}: StatCardProps) => {
    const isPositive = change !== undefined && change >= 0

    const variantStyles = {
        default: 'from-hud-accent-primary/20 to-transparent border-hud-accent-primary/30',
        primary: 'from-hud-accent-primary/20 to-transparent border-hud-accent-primary/30',
        secondary: 'from-hud-accent-info/20 to-transparent border-hud-accent-info/30',
        warning: 'from-hud-accent-warning/20 to-transparent border-hud-accent-warning/30',
        danger: 'from-hud-accent-danger/20 to-transparent border-hud-accent-danger/30',
    }

    const iconColors = {
        default: 'text-hud-accent-primary',
        primary: 'text-hud-accent-primary',
        secondary: 'text-hud-accent-info',
        warning: 'text-hud-accent-warning',
        danger: 'text-hud-accent-danger',
    }

    return (
        <div className={`hud-card hud-card-bottom rounded-lg bg-gradient-to-br ${variantStyles[variant]} p-5`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-hud-text-muted uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-bold text-hud-text-primary mt-2 font-mono">{value}</p>

                    {change !== undefined && (
                        <div className="flex items-center gap-1.5 mt-3">
                            {isPositive ? (
                                <TrendingUp size={16} className="text-hud-accent-success" />
                            ) : (
                                <TrendingDown size={16} className="text-hud-accent-danger" />
                            )}
                            <span className={`text-sm font-medium ${isPositive ? 'text-hud-accent-success' : 'text-hud-accent-danger'}`}>
                                {isPositive ? '+' : ''}{change}%
                            </span>
                            <span className="text-xs text-hud-text-muted">{changeLabel}</span>
                        </div>
                    )}
                </div>

                {icon && (
                    <div className={`p-3 rounded-lg bg-hud-bg-primary/50 ${iconColors[variant]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
})

StatCard.displayName = 'StatCard'

export default StatCard
```

#### 23-2. Dashboard 최적화 (useMemo)

```tsx
// src/pages/dashboard/Dashboard.tsx (일부 수정 - import와 useMemo 추가)
import { useMemo } from 'react'
// ... 기존 import

const Dashboard = () => {
    // ... 기존 상태와 데이터

    // expensive 계산을 useMemo로 감싸서 재계산 방지
    const topProductsSorted = useMemo(() => {
        return topProducts
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5)
    }, [topProducts])

    const chartHeights = useMemo(() => [40, 55, 45, 60, 75, 65, 80, 70, 85, 75, 90, 95], [])

    // ... 나머지 코드는 기존과 동일
}
```

#### 23-3. 배운 개념 정리

| 개념 | 사용 상황 |
|---|---|
| **React.memo** | props가 자주 변경되지 않는 컴포넌트 |
| **useMemo** | 비싼 계산 결과 캐싱 |
| **useCallback** | 함수 참조 안정화 (자식 컴포넌트에 전달 시) |

✅ **Step 23 완료!**

---

### Step 24. Code Splitting & Lazy Loading

초기 로딩 속도를 개선하기 위해 페이지를 필요할 때만 로드합니다.

**이미 Step 20-4의 App.tsx에서 구현 완료!**

> 💡 **효과**: 초기 번들 크기가 줄어들고, 각 페이지를 방문할 때만 해당 코드를 다운로드합니다.

✅ **Step 24 완료!**

---

### Step 25. Virtual Scroll — 대량 데이터 렌더링

수천 개의 항목을 렌더링할 때 화면에 보이는 항목만 렌더링합니다.

#### 25-1. 가상 스크롤 컴포넌트

```tsx
// src/components/VirtualList.tsx
import { useMemo, useRef, useState } from 'react'
import { ReactNode } from 'react'

interface VirtualListProps<T> {
    items: T[]
    itemHeight: number
    containerHeight: number
    renderItem: (item: T, index: number) => ReactNode
}

function VirtualList<T>({ items, itemHeight, containerHeight, renderItem }: VirtualListProps<T>) {
    const [scrollTop, setScrollTop] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null)

    const { visibleItems, totalHeight, startY } = useMemo(() => {
        const startIndex = Math.floor(scrollTop / itemHeight)
        const endIndex = Math.min(
            startIndex + Math.ceil(containerHeight / itemHeight) + 1,
            items.length
        )

        const visibleItems = items.slice(startIndex, endIndex).map((item, i) => ({
            item,
            index: startIndex + i,
        }))

        return {
            visibleItems,
            totalHeight: items.length * itemHeight,
            startY: startIndex * itemHeight,
        }
    }, [items, scrollTop, itemHeight, containerHeight])

    return (
        <div
            ref={scrollRef}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            style={{ height: `${containerHeight}px`, overflow: 'auto' }}
        >
            <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                <div style={{ transform: `translateY(${startY}px)` }}>
                    {visibleItems.map(({ item, index }) => (
                        <div key={index} style={{ height: `${itemHeight}px` }}>
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VirtualList
```

#### 25-2. BigList 페이지

```tsx
// src/pages/large-data/BigList.tsx
import VirtualList from '../../components/VirtualList'
import HudCard from '../../components/common/HudCard'

interface DataItem {
    id: number
    name: string
    value: number
}

const BigList = () => {
    // 10,000개의 더미 데이터
    const items = useMemo(() =>
        Array.from({ length: 10000 }, (_, i) => ({
            id: i,
            name: `Item ${i + 1}`,
            value: Math.floor(Math.random() * 1000),
        })), []
    )

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Large Data List</h1>
                    <p className="text-hud-text-muted mt-1">Virtual Scroll with 10,000 items</p>
                </div>
            </div>

            <HudCard title="Performance Demo" subtitle="Only visible items are rendered">
                <VirtualList
                    items={items}
                    itemHeight={60}
                    containerHeight={600}
                    renderItem={(item) => (
                        <div className="flex items-center justify-between p-4 border-b border-hud-border-secondary hover:bg-hud-bg-hover">
                            <span className="text-hud-text-primary">{item.name}</span>
                            <span className="text-hud-accent-primary font-mono">{item.value}</span>
                        </div>
                    )}
                />
            </HudCard>
        </div>
    )
}

export default BigList
```

#### 25-3. App.tsx에 BigList 라우트 추가

```tsx
// src/App.tsx (수정 - BigList import 추가)
const BigList = lazy(() => import('./pages/large-data/BigList'))

// <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}> 안에 추가:
<Route path="big-list" element={<BigList />} />
```

✅ **Step 25 완료!**

---

## PHASE 10: 테스트 & 배포

프로덕션 배포를 위한 테스트와 빌드 최적화를 진행합니다.

---

### Step 26. Vitest & React Testing Library

#### 26-1. 테스트 환경 설정

```bash
# Vitest 및 Testing Library 설치
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

#### 26-2. vitest.config.ts 설정

```tsx
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
```

#### 26-3. 테스트 설정 파일

```tsx
// src/test/setup.ts
import '@testing-library/jest-dom'
```

#### 26-4. Button 컴포넌트 테스트

```tsx
// src/components/common/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('calls onClick when clicked', async () => {
        const handleClick = vi.fn()
        const user = userEvent.setup()

        render(<Button onClick={handleClick}>Click me</Button>)

        await user.click(screen.getByRole('button'))

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Click me</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('applies correct variant classes', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>)
        expect(screen.getByRole('button')).toHaveClass('bg-hud-accent-primary')

        rerender(<Button variant="danger">Danger</Button>)
        expect(screen.getByRole('button')).toHaveClass('bg-hud-accent-danger')
    })

    it('shows loading state when isLoading is true', () => {
        render(<Button isLoading>Loading</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
        expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
})
```

#### 26-5. StatCard 컴포넌트 테스트

```tsx
// src/components/common/__tests__/StatCard.test.tsx
import { render, screen } from '@testing-library/react'
import StatCard from '../StatCard'

describe('StatCard', () => {
    it('renders title and value', () => {
        render(<StatCard title="Total Users" value="1,234" />)

        expect(screen.getByText('Total Users')).toBeInTheDocument()
        expect(screen.getByText('1,234')).toBeInTheDocument()
    })

    it('shows change indicator when change prop is provided', () => {
        render(<StatCard title="Revenue" value="$5,000" change={12.5} />)

        expect(screen.getByText('+12.5%')).toBeInTheDocument()
        expect(screen.getByText(/vs last month/i)).toBeInTheDocument()
    })

    it('displays icon when provided', () => {
        const icon = <span data-testid="test-icon">📊</span>
        render(<StatCard title="Sales" value="100" icon={icon} />)

        expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('applies correct variant styles', () => {
        const { container } = render(<StatCard title="Test" value="100" variant="primary" />)
        expect(container.firstChild).toHaveClass('from-hud-accent-primary/20')
    })
})
```

#### 26-6. package.json에 테스트 스크립트 추가

```json
{
    "scripts": {
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage"
    }
}
```

✅ **Step 26 완료!**

---

### Step 27. E2E 테스트 (Playwright)

#### 27-1. Playwright 설치

```bash
npm install -D @playwright/test
npx playwright install
```

#### 27-2. playwright.config.ts 설정

```tsx
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
    },
})
```

#### 27-3. 로그인 E2E 테스트

```tsx
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Login', () => {
    test('successfully logs in with valid credentials', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[type="email"]', 'admin@hudadmin.com')
        await page.fill('input[type="password"]', 'password')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('/')
        await expect(page.locator('text=Dashboard')).toBeVisible()
    })

    test('shows error with invalid credentials', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[type="email"]', 'wrong@email.com')
        await page.fill('input[type="password"]', 'wrongpassword')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=이메일 또는 비밀번호가 올바르지 않습니다')).toBeVisible()
    })

    test('toggles password visibility', async ({ page }) => {
        await page.goto('/login')

        const passwordInput = page.locator('input[type="password"]')
        const toggleButton = page.locator('button').filter({ hasText: 'toggle' }).first()

        expect(await passwordInput.getAttribute('type')).toBe('password')

        await toggleButton.click()
        expect(await passwordInput.getAttribute('type')).toBe('text')
    })
})
```

#### 27-4. 네비게이션 E2E 테스트

```tsx
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // 로그인 먼저 수행
        await page.goto('/login')
        await page.fill('input[type="email"]', 'admin@hudadmin.com')
        await page.fill('input[type="password"]', 'password')
        await page.click('button[type="submit"]')
        await page.waitForURL('/')
    })

    test('navigates to Products page', async ({ page }) => {
        await page.click('text=Products')
        await expect(page).toHaveURL('/products')
        await expect(page.locator('h1')).toContainText('Products')
    })

    test('navigates to Settings page', async ({ page }) => {
        await page.click('text=Settings')
        await expect(page).toHaveURL('/settings')
        await expect(page.locator('h1')).toContainText('Settings')
    })

    test('sidebar toggle works', async ({ page }) => {
        const sidebar = page.locator('aside').first()
        const mainContent = page.locator('main').first()

        // 사이드바 접기
        await page.click('[aria-label="toggle menu"]')

        await expect(sidebar).toHaveClass(/w-20/)
        await expect(mainContent).toHaveCSS('margin-left', '80px')
    })
})
```

#### 27-5. package.json에 E2E 스크립트 추가

```json
{
    "scripts": {
        "e2e": "playwright test",
        "e2e:ui": "playwright test --ui",
        "e2e:debug": "playwright test --debug"
    }
}
```

✅ **Step 27 완료!**

---

### Step 28. 프로덕션 빌드 & 배포

#### 28-1. 빌드 최적화 확인

```bash
# 빌드 실행
npm run build

# 빌드 결과 미리보기
npm run preview
```

#### 28-2. Vite 번들 분석

```bash
# rollup-plugin-visualizer 설치
npm install -D rollup-plugin-visualizer
```

```tsx
// vite.config.ts (수정된 전체 코드)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer({ open: true, gzipSize: true, brotliSize: true })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        host: true,
        port: 5173,
    },
})
```

```bash
# 빌드 후 stats.html 생성
npm run build
# stats.html 파일이 자동으로 열림
```

#### 28-3. 환경 변수 설정

```bash
# .env.production
VITE_API_URL=https://api.production.com
VITE_APP_NAME=ALPHA TEAM Admin
VITE_SENTRY_DSN=your-sentry-dsn
```

```tsx
// src/config/index.ts (새 파일)
export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.dev.com',
    appName: import.meta.env.VITE_APP_NAME || 'HUD Admin',
    isProduction: import.meta.env.PROD,
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
}
```

#### 28-4. Vercel 배포 설정

```json
// vercel.json (새 파일)
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "vite",
    "env": {
        "VITE_API_URL": "@api_url"
    }
}
```

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

#### 28-5. Docker 설정

```dockerfile
# Dockerfile (새 파일)
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx.conf 생성 필요
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf (새 파일)
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

```bash
# Docker 빌드 & 실행
docker build -t hud-admin .
docker run -p 80:80 hud-admin
```

#### 28-6. .dockerignore

```text
# .dockerignore (새 파일)
node_modules
npm-debug.log
dist
.git
.env
.env.local
.env.*.local
```

✅ **Step 28 완료!**

---

## Part 3 완성 체크리스트

### 폴더 구조 확인

```
src/
├── components/
│   ├── VirtualList.tsx          ✅ 가상 스크롤 컴포넌트
│   ├── ProtectedRoute.tsx        ✅ 인증 가드
│   └── common/
│       └── __tests__/           ✅ 테스트 폴더
│           ├── Button.test.tsx
│           └── StatCard.test.tsx
├── contexts/
│   ├── AuthContext.tsx          ✅ 인증 Context
│   └── ThemeContext.tsx         ✅ 테마 Context
├── hooks/
│   ├── useLocalStorage.ts        ✅ localStorage Hook
│   └── useDebounce.ts            ✅ debounce Hook
├── pages/
│   ├── auth/
│   │   └── Login.tsx              ✅ 로그인 페이지
│   └── large-data/
│       └── BigList.tsx            ✅ 대량 데이터 페이지
├── test/
│   └── setup.ts                  ✅ 테스트 설정
├── config/
│   └── index.ts                  ✅ 환경 변수 설정
├── App.tsx                        ✅ Lazy Loading 적용
├── main.tsx                      ✅ Provider 적용
├── vitest.config.ts               ✅ Vitest 설정
├── playwright.config.ts           ✅ Playwright 설정
├── vite.config.ts                 ✅ 번들 분석 추가
├── Dockerfile                     ✅ Docker 설정
├── nginx.conf                     ✅ Nginx 설정
├── vercel.json                   ✅ Vercel 설정
└── .env.production               ✅ 프로덕션 환경 변수

e2e/
├── login.spec.ts                 ✅ 로그인 E2E
└── navigation.spec.ts            ✅ 네비게이션 E2E
```

### 실행 가능 명령어

```bash
# 개발 서버
npm run dev

# 테스트
npm run test              # 유닛 테스트
npm run test:coverage    # 커버리지
npm run e2e               # E2E 테스트
npm run e2e:ui            # E2E UI 모드

# 빌드
npm run build            # 프로덕션 빌드
npm run preview          # 빌드 미리보기
```

---

## Part 3 총정리 🏆

### 완성한 기능

| Step | 파일/기능 | 핵심 기능 | 핵심 개념 |
|---|---|---|---|
| 20 | AuthContext + ProtectedRoute | 인증 시스템, 라우트 가드 | useContext, localStorage |
| 21 | ThemeContext | 다크모드 전역 토글 | Context, DOM 조작 |
| 22 | useLocalStorage, useDebounce | 로직 재사용 | Custom Hooks |
| 23 | React.memo, useMemo | 불필요한 리렌더링 제거 | 성능 최적화 |
| 24 | Lazy Loading | 코드 분할 | React.lazy, Suspense |
| 25 | VirtualList + BigList | 10,000개 항목 렌더링 | 가상 스크롤 |
| 26 | Vitest + 테스트 파일 | 유닛 테스트 | Testing Library |
| 27 | Playwright + E2E 파일 | E2E 테스트 | 브라우저 자동화 |
| 28 | 배포 설정 파일들 | 프로덕션 배포 | Vercel, Docker, 분석 |

### Part 1 + Part 2 + Part 3 합계

```
Part 1: ~1,278줄 (기반 + 공통 + 레이아웃 + Dashboard)
Part 2: ~  870줄 (Products + Settings + ScrumBoard + Calendar)
Part 3: ~  850줄 (인증 + 최적화 + 테스트 + 배포 + 추가 파일들)
─────────────────────────────────────────────────────
합계:   ~2,998줄 → 완전한 프로덕션 레벨 Admin Template! 🚀
```

### 전문가가 된 당신의 기술 스택

```
[프론트엔드 핵심]
  React 18 ──── Hooks 전체 (useState, useEffect, useContext, Custom)
  TypeScript ── 완전한 타입 안전성
  React Router ── 중첩 라우팅, 동적 파라미터, 가드

[상태 관리]
  Context ────── 인증, 테마 전역 상태
  Custom Hooks ── 로직 재사용
  Props Drilling 해결

[성능 최적화]
  React.memo ─── 컴포넌트 메모이제이션
  useMemo ────── 값 메모이제이션
  Lazy Loading ─ 코드 분할
  Virtual Scroll ─ 대량 데이터 최적화

[테스트]
  Vitest ─────── 유닛 테스트
  Testing Library ── 사용자 중심 테스트
  Playwright ─── E2E 테스트

[배포]
  Vite ────────── 빠른 빌드
  Vercel ──────── 간편한 배포
  Docker ─────── 컨테이너화
```

---

> 🎓 **축하합니다!** 이제 단순한 토이 프로젝트가 아닌, **프로덕션 레벨의 완전한 Admin Template**을 직접 만들 수 있습니다. 당신은 이미 **시니어 개발자** 수준의 프로젝트를 완성했습니다! 🚀
```

---

> 📖 **참고 순서**
> 1. `React_강의노트.md` - React 기초
> 2. `React_심화_강의노트.md` - React 심화
> 3. `TypeScript_강의노트.md` - TypeScript
> 4. `React_실전_전문가코스.md` (Part 1) - 기반 & 공통 & 레이아웃
> 5. `React_실전_전문가코스_Part2.md` (Part 2) - 핵심 페이지들
> 6. `React_실전_전문가코스_Part3.md` (Part 3) - 인증 & 최적화 & 테스트 & 배포
