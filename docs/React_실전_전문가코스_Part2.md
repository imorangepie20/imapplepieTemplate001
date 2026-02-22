# 🚀 실전 끝까지 따라하면 어느새 전문가 — Part 2
> 나머지 핵심 페이지를 완성하고, 고급 기능을 추가하는 심화 코스

**선수 과정**: `React_실전_전문가코스.md` (Part 1) 완료  
**목표**: Part 1에서 만든 공통 컴포넌트와 레이아웃을 활용하여 **나머지 모든 페이지를 완성**합니다.

---

## Part 2 로드맵

```
PHASE 6: 나머지 핵심 페이지 완성
├── Step 14. Products — 상품 카탈로그 (검색, 필터, 뷰 전환)
├── Step 15. Settings — 설정 페이지 (섹션 탭, 폼 입력)
├── Step 16. ScrumBoard — 칸반 보드 (중첩 인터페이스, 상태 이동)
└── Step 17. Calendar — 캘린더 (날짜 계산, 이벤트 표시)

PHASE 7: 고급 기능 추가
├── Step 18. FormElements — 다양한 폼 입력 요소
└── Step 19. 전체 프로젝트 통합 & 최종 점검
```

---

## PHASE 6: 나머지 핵심 페이지 완성

---

### Step 14. Products — 상품 카탈로그

**3가지 상태(검색어, 카테고리, 뷰 모드)**를 동시에 관리하는 실전 페이지입니다.

#### 14-1. 학습 목표

- `useState`에 Literal Union 제네릭 사용 (`'grid' | 'list'`)
- `Array.filter()` 다중 조건 필터링
- Grid ↔ List 뷰 전환 패턴
- `null` 값 처리 (할인가가 없는 상품)

#### 14-2. 코드 작성

```tsx
// src/pages/Products.tsx
import { useState } from 'react'
import { Search, Grid, List, Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import HudCard from '../components/common/HudCard'
import Button from '../components/common/Button'

// ⭐ 더미 상품 데이터 — oldPrice가 null인 상품 주의!
const products = [
    { id: 1, name: 'MacBook Pro 16"', category: 'Electronics', price: 2499, oldPrice: 2799, rating: 4.8, reviews: 256, stock: 45, image: '💻' },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Electronics', price: 1199, oldPrice: null, rating: 4.9, reviews: 512, stock: 120, image: '📱' },
    { id: 3, name: 'AirPods Pro 2', category: 'Accessories', price: 249, oldPrice: 279, rating: 4.7, reviews: 1024, stock: 200, image: '🎧' },
    { id: 4, name: 'Apple Watch Ultra', category: 'Wearables', price: 799, oldPrice: null, rating: 4.6, reviews: 89, stock: 30, image: '⌚' },
    { id: 5, name: 'iPad Pro 12.9"', category: 'Electronics', price: 1099, oldPrice: 1199, rating: 4.8, reviews: 342, stock: 60, image: '📱' },
    { id: 6, name: 'Magic Keyboard', category: 'Accessories', price: 299, oldPrice: null, rating: 4.5, reviews: 178, stock: 75, image: '⌨️' },
    { id: 7, name: 'Studio Display', category: 'Electronics', price: 1599, oldPrice: 1799, rating: 4.4, reviews: 67, stock: 15, image: '🖥️' },
    { id: 8, name: 'AirTag 4-Pack', category: 'Accessories', price: 99, oldPrice: null, rating: 4.3, reviews: 890, stock: 500, image: '📍' },
]

const categories = ['All', 'Electronics', 'Accessories', 'Wearables']

const Products = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    // ⭐ Literal Union 제네릭 — 'grid' 또는 'list'만 허용
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // ⭐ 다중 조건 필터링 — 검색어 AND 카테고리
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Products</h1>
                    <p className="text-hud-text-muted mt-1">Manage your product catalog.</p>
                </div>
                <Button variant="primary" glow>Add Product</Button>
            </div>

            {/* ⭐ 필터 바: 카테고리 탭 + 검색 + 뷰 전환 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* 카테고리 필터 */}
                <div className="flex items-center gap-3">
                    {categories.map((cat) => (
                        <button key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm transition-hud ${
                                selectedCategory === cat
                                    ? 'bg-hud-accent-primary text-hud-bg-primary'
                                    : 'bg-hud-bg-secondary text-hud-text-secondary hover:text-hud-text-primary'
                            }`}>
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {/* 검색 */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-hud-text-muted" size={16} />
                        <input type="text" value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-64 pl-9 pr-4 py-2 bg-hud-bg-secondary border border-hud-border-secondary rounded-lg text-sm text-hud-text-primary placeholder-hud-text-muted focus:outline-none focus:border-hud-accent-primary transition-hud" />
                    </div>

                    {/* ⭐ Grid/List 뷰 전환 토글 */}
                    <div className="flex items-center border border-hud-border-secondary rounded-lg overflow-hidden">
                        <button onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-hud-accent-primary text-hud-bg-primary' : 'text-hud-text-muted hover:text-hud-text-primary'}`}>
                            <Grid size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-hud-accent-primary text-hud-bg-primary' : 'text-hud-text-muted hover:text-hud-text-primary'}`}>
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ⭐ 뷰 모드에 따라 완전히 다른 레이아웃 렌더링 */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="hud-card hud-card-bottom rounded-lg overflow-hidden group">
                            {/* 이미지 영역 */}
                            <div className="relative h-48 bg-gradient-to-br from-hud-accent-primary/10 to-hud-accent-info/10 flex items-center justify-center">
                                <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>
                                {/* ⭐ oldPrice가 존재할 때만 Sale 뱃지 표시 */}
                                {product.oldPrice && (
                                    <span className="absolute top-3 left-3 px-2 py-1 bg-hud-accent-danger text-white text-xs rounded">Sale</span>
                                )}
                                {/* 호버 시 나타나는 액션 버튼 */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-hud-bg-secondary/80 backdrop-blur rounded-lg text-hud-text-muted hover:text-hud-accent-danger transition-hud">
                                        <Heart size={16} />
                                    </button>
                                    <button className="p-2 bg-hud-bg-secondary/80 backdrop-blur rounded-lg text-hud-text-muted hover:text-hud-accent-primary transition-hud">
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* 상품 정보 */}
                            <div className="p-4">
                                <p className="text-xs text-hud-accent-primary mb-1">{product.category}</p>
                                <h3 className="font-medium text-hud-text-primary">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <Star size={14} className="text-hud-accent-warning fill-current" />
                                    <span className="text-sm text-hud-text-primary">{product.rating}</span>
                                    <span className="text-xs text-hud-text-muted">({product.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-lg font-bold text-hud-accent-primary font-mono">${product.price}</span>
                                    {product.oldPrice && (
                                        <span className="text-sm text-hud-text-muted line-through">${product.oldPrice}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <Button variant="primary" size="sm" fullWidth leftIcon={<ShoppingCart size={14} />}>
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* ⭐ 리스트 뷰 — 같은 데이터, 다른 레이아웃 */
                <div className="space-y-4">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="hud-card hud-card-bottom rounded-lg p-4 flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-hud-accent-primary/10 to-hud-accent-info/10 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-3xl">{product.image}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-hud-accent-primary">{product.category}</p>
                                <h3 className="font-medium text-hud-text-primary">{product.name}</h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="text-hud-accent-warning fill-current" />
                                        <span className="text-xs text-hud-text-primary">{product.rating}</span>
                                    </div>
                                    <span className={`text-xs ${product.stock > 50 ? 'text-hud-accent-success' : 'text-hud-accent-warning'}`}>
                                        {product.stock} in stock
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-hud-accent-primary font-mono">${product.price}</span>
                                {product.oldPrice && (
                                    <span className="text-sm text-hud-text-muted line-through ml-2">${product.oldPrice}</span>
                                )}
                            </div>
                            <Button variant="primary" size="sm" leftIcon={<ShoppingCart size={14} />}>Add</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Products
```

#### 14-3. 핵심 패턴 분석

**① 다중 조건 필터링**
```tsx
// 두 조건을 AND(&&)로 결합
const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
})
```
> 💡 각 조건을 변수에 할당하면 가독성이 좋아집니다. 조건이 추가되면 변수만 추가하면 됩니다.

**② null 체크 패턴**
```tsx
// oldPrice가 null이 아닐 때만 렌더링
{product.oldPrice && (
    <span className="line-through">${product.oldPrice}</span>
)}
```
> 💡 TypeScript가 `oldPrice: number | null`로 자동 추론합니다. `&&` 패턴으로 안전하게 처리합니다.

**③ 조건부 클래스 (재고량 기반)**
```tsx
<span className={`text-xs ${product.stock > 50 ? 'text-hud-accent-success' : 'text-hud-accent-warning'}`}>
    {product.stock} in stock
</span>
```

#### 14-4. 배운 개념 정리

| 개념 | 적용 |
|---|---|
| **useState 제네릭** | `useState<'grid' \| 'list'>('grid')` |
| **다중 필터링** | AND 조건 결합 |
| **뷰 전환** | 같은 데이터 → 다른 UI (삼항 연산자) |
| **null 처리** | `oldPrice && (...)` — Truthiness 좁히기 |
| **group-hover** | CSS 부모 hover 시 자식 요소 변경 |

✅ **Step 14 완료!**

---

### Step 15. Settings — 설정 페이지

**섹션 탭 + 폼 입력**이 결합된 실전 패턴입니다.

#### 15-1. 학습 목표

- 사이드 탭 네비게이션 (activeSection 상태)
- 조건부 렌더링으로 섹션 전환
- 토글 스위치 구현
- `find()` + 옵셔널 체이닝 (`?.`) 실전 활용

#### 15-2. 코드 작성

```tsx
// src/pages/Settings.tsx
import { useState } from 'react'
import {
    User, Bell, Lock, Palette, Globe, Shield, CreditCard,
    Moon, Sun, Save,
} from 'lucide-react'
import HudCard from '../components/common/HudCard'
import Button from '../components/common/Button'

// ⭐ 설정 섹션 데이터 — 아이콘 + 라벨
const settingsSections = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'language', label: 'Language', icon: <Globe size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
]

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile')
    const [darkMode, setDarkMode] = useState(true)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* 헤더 — ⭐ 옵셔널 체이닝으로 현재 섹션 라벨 표시 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Settings</h1>
                    <p className="text-hud-text-muted mt-1">
                        {settingsSections.find(s => s.id === activeSection)?.label} settings
                    </p>
                </div>
                <Button variant="primary" glow leftIcon={<Save size={18} />}>
                    Save Changes
                </Button>
            </div>

            <div className="flex gap-6">
                {/* ⭐ 좌측 사이드 탭 네비게이션 */}
                <div className="w-56 flex-shrink-0">
                    <HudCard noPadding>
                        <div className="py-2">
                            {settingsSections.map((section) => (
                                <button key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-hud ${
                                        activeSection === section.id
                                            ? 'bg-hud-accent-primary/10 text-hud-accent-primary border-l-2 border-hud-accent-primary'
                                            : 'text-hud-text-secondary hover:bg-hud-bg-hover hover:text-hud-text-primary'
                                    }`}>
                                    {section.icon}
                                    <span className="text-sm">{section.label}</span>
                                </button>
                            ))}
                        </div>
                    </HudCard>
                </div>

                {/* ⭐ 우측 콘텐츠 — activeSection에 따라 다른 섹션 표시 */}
                <div className="flex-1 space-y-6">
                    {/* Profile 섹션 */}
                    {activeSection === 'profile' && (
                        <HudCard title="Profile Settings" subtitle="Update your personal information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">First Name</label>
                                    <input type="text" defaultValue="Admin"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud" />
                                </div>
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">Last Name</label>
                                    <input type="text" defaultValue="User"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud" />
                                </div>
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">Email</label>
                                    <input type="email" defaultValue="admin@hudadmin.com"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud" />
                                </div>
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">Phone</label>
                                    <input type="tel" defaultValue="+1 (555) 123-4567"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud" />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm text-hud-text-secondary mb-2">Bio</label>
                                <textarea rows={4} defaultValue="Full-stack developer and admin."
                                    className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud resize-none" />
                            </div>
                        </HudCard>
                    )}

                    {/* Appearance 섹션 — ⭐ 토글 스위치 */}
                    {activeSection === 'appearance' && (
                        <HudCard title="Appearance" subtitle="Customize the look and feel">
                            <div className="space-y-6">
                                {/* 다크모드 토글 */}
                                <div className="flex items-center justify-between p-4 rounded-lg bg-hud-bg-primary">
                                    <div className="flex items-center gap-3">
                                        {darkMode ? <Moon size={20} className="text-hud-accent-primary" /> : <Sun size={20} className="text-hud-accent-warning" />}
                                        <div>
                                            <p className="text-sm text-hud-text-primary">Dark Mode</p>
                                            <p className="text-xs text-hud-text-muted">
                                                {darkMode ? 'Dark theme is active' : 'Light theme is active'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* ⭐ CSS만으로 만든 토글 스위치 */}
                                    <button onClick={() => setDarkMode(!darkMode)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-hud-accent-primary' : 'bg-hud-text-muted'}`}>
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </HudCard>
                    )}

                    {/* Notifications 섹션 */}
                    {activeSection === 'notifications' && (
                        <HudCard title="Notification Preferences" subtitle="Choose what you get notified about">
                            <div className="space-y-4">
                                {['Email Notifications', 'Push Notifications', 'SMS Notifications', 'Weekly Digest'].map((item) => (
                                    <div key={item} className="flex items-center justify-between p-4 rounded-lg bg-hud-bg-primary">
                                        <span className="text-sm text-hud-text-primary">{item}</span>
                                        <button className="relative w-12 h-6 rounded-full bg-hud-accent-primary transition-colors">
                                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full translate-x-6" />
                                        </button>
                                    </div>
                                ))}
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

#### 15-3. 핵심 패턴 분석

**① find() + 옵셔널 체이닝**
```tsx
// 배열에서 현재 활성 섹션을 찾아 라벨 표시
// find()가 undefined를 반환할 수 있으므로 ?. 필수!
{settingsSections.find(s => s.id === activeSection)?.label}
```

**② CSS 토글 스위치 패턴**
```tsx
<button onClick={() => setDarkMode(!darkMode)}
    className={`relative w-12 h-6 rounded-full transition-colors
        ${darkMode ? 'bg-hud-accent-primary' : 'bg-hud-text-muted'}`}>
    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
        ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
</button>
```
> 💡 외부 라이브러리 없이 CSS `translate-x`만으로 토글 스위치를 구현합니다.

#### 15-4. 배운 개념 정리

| 개념 | 적용 |
|---|---|
| **탭 네비게이션** | activeSection 상태로 섹션 전환 |
| **find() + ?.** | 배열 검색 + 안전한 접근 |
| **조건부 렌더링** | `activeSection === 'profile' && (...)` |
| **CSS 토글** | translate-x로 스위치 애니메이션 |
| **defaultValue** | 비제어 컴포넌트 — 초기값만 설정 |

✅ **Step 15 완료!**

---

### Step 16. ScrumBoard — 칸반 보드

**가장 복잡한 데이터 구조**를 다루는 페이지입니다. 중첩 Interface와 상태 업데이트의 실전!

#### 16-1. 학습 목표

- 중첩 Interface 설계 (Task → Column → Board)
- `Record<string, string>` 유틸리티 타입 활용
- 복잡한 상태 업데이트 (칼럼 간 태스크 이동)

#### 16-2. Interface 설계 (먼저!)

```tsx
// ⭐ 먼저 데이터 구조를 설계합니다 — 코드의 50%!

interface Task {
    id: string
    title: string
    priority: 'high' | 'medium' | 'low'    // Literal Union
    labels: string[]                         // 라벨 배열
    assignee: string
    dueDate: string
}

interface Column {
    id: string
    title: string
    color: string
    tasks: Task[]              // ⭐ 중첩! Column 안에 Task 배열
}
```

#### 16-3. 코드 작성

```tsx
// src/pages/ScrumBoard.tsx
import { useState } from 'react'
import { Plus, MoreVertical, Clock, Tag, Users } from 'lucide-react'
import Button from '../components/common/Button'

interface Task {
    id: string
    title: string
    priority: 'high' | 'medium' | 'low'
    labels: string[]
    assignee: string
    dueDate: string
}

interface Column {
    id: string
    title: string
    color: string
    tasks: Task[]
}

// ⭐ Record<string, string> — 키-값 모두 문자열인 객체
const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
        high: 'text-hud-accent-danger bg-hud-accent-danger/10',
        medium: 'text-hud-accent-warning bg-hud-accent-warning/10',
        low: 'text-hud-accent-success bg-hud-accent-success/10',
    }
    return colors[priority] || 'text-hud-text-muted'
}

const getLabelColor = (label: string): string => {
    const colors: Record<string, string> = {
        'Design': 'bg-hud-accent-secondary/20 text-hud-accent-secondary',
        'Frontend': 'bg-hud-accent-primary/20 text-hud-accent-primary',
        'Backend': 'bg-hud-accent-info/20 text-hud-accent-info',
        'Bug': 'bg-hud-accent-danger/20 text-hud-accent-danger',
        'Feature': 'bg-hud-accent-success/20 text-hud-accent-success',
    }
    return colors[label] || 'bg-hud-bg-hover text-hud-text-muted'
}

// 초기 칼럼 데이터
const initialColumns: Column[] = [
    {
        id: 'todo', title: 'To Do', color: 'hud-accent-info',
        tasks: [
            { id: 't1', title: 'Design new landing page', priority: 'high', labels: ['Design', 'Frontend'], assignee: 'John', dueDate: 'Feb 28' },
            { id: 't2', title: 'Fix login bug', priority: 'high', labels: ['Bug', 'Backend'], assignee: 'Jane', dueDate: 'Feb 25' },
            { id: 't3', title: 'Add dark mode toggle', priority: 'medium', labels: ['Feature', 'Frontend'], assignee: 'Bob', dueDate: 'Mar 5' },
        ],
    },
    {
        id: 'progress', title: 'In Progress', color: 'hud-accent-warning',
        tasks: [
            { id: 't4', title: 'API integration', priority: 'high', labels: ['Backend'], assignee: 'Alice', dueDate: 'Feb 26' },
            { id: 't5', title: 'User profile page', priority: 'medium', labels: ['Frontend', 'Design'], assignee: 'Charlie', dueDate: 'Mar 1' },
        ],
    },
    {
        id: 'review', title: 'Review', color: 'hud-accent-secondary',
        tasks: [
            { id: 't6', title: 'Code review: auth module', priority: 'medium', labels: ['Backend'], assignee: 'John', dueDate: 'Feb 24' },
        ],
    },
    {
        id: 'done', title: 'Done', color: 'hud-accent-success',
        tasks: [
            { id: 't7', title: 'Setup CI/CD pipeline', priority: 'low', labels: ['Backend'], assignee: 'Jane', dueDate: 'Feb 20' },
            { id: 't8', title: 'Database schema design', priority: 'high', labels: ['Backend', 'Design'], assignee: 'Alice', dueDate: 'Feb 18' },
        ],
    },
]

const ScrumBoard = () => {
    // ⭐ 전체 보드 상태 — Column[] 안에 Task[]가 중첩
    const [columns, setColumns] = useState<Column[]>(initialColumns)

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Scrum Board</h1>
                    <p className="text-hud-text-muted mt-1">Manage your sprint tasks.</p>
                </div>
                <Button variant="primary" glow leftIcon={<Plus size={18} />}>Add Task</Button>
            </div>

            {/* ⭐ 칼럼 레이아웃 — 가로 스크롤 */}
            <div className="flex gap-6 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <div key={column.id} className="w-80 flex-shrink-0">
                        {/* 칼럼 헤더 */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-${column.color}`}
                                    style={{ background: column.color === 'hud-accent-info' ? '#6366F1' :
                                        column.color === 'hud-accent-warning' ? '#FFA500' :
                                        column.color === 'hud-accent-secondary' ? '#FF1493' : '#10B981' }} />
                                <h3 className="font-semibold text-hud-text-primary">{column.title}</h3>
                                <span className="text-xs text-hud-text-muted bg-hud-bg-hover px-2 py-0.5 rounded-full">
                                    {column.tasks.length}
                                </span>
                            </div>
                            <button className="p-1 rounded hover:bg-hud-bg-hover text-hud-text-muted">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        {/* ⭐ 태스크 카드 목록 */}
                        <div className="space-y-3">
                            {column.tasks.map((task) => (
                                <div key={task.id} className="hud-card hud-card-bottom rounded-lg p-4 cursor-pointer hover:border-hud-accent-primary/30 transition-hud">
                                    {/* 라벨 */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {task.labels.map((label) => (
                                            <span key={label} className={`text-xs px-2 py-0.5 rounded ${getLabelColor(label)}`}>
                                                {label}
                                            </span>
                                        ))}
                                    </div>

                                    <h4 className="text-sm font-medium text-hud-text-primary">{task.title}</h4>

                                    {/* 메타 정보 */}
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-hud-text-muted">
                                                <Clock size={12} />
                                                <span>{task.dueDate}</span>
                                            </div>
                                        </div>
                                        {/* 담당자 아바타 */}
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-hud-accent-primary to-hud-accent-info flex items-center justify-center text-xs text-hud-bg-primary font-medium">
                                            {task.assignee[0]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ScrumBoard
```

#### 16-4. 배운 개념 정리

| 개념 | 적용 |
|---|---|
| **중첩 Interface** | `Column.tasks: Task[]` — 2단계 중첩 |
| **Record<K,V>** | 색상 맵핑 — 동적 키 접근 |
| **Literal Union** | `priority: 'high' \| 'medium' \| 'low'` |
| **2중 map** | `columns.map → column.tasks.map` |
| **flex-shrink-0** | 가로 스크롤 카드 레이아웃 |

✅ **Step 16 완료!**

---

### Step 17. Calendar — 캘린더

**날짜 계산 로직 + 이벤트 표시**를 다루는 페이지입니다.

#### 17-1. 학습 목표

- JavaScript Date API 활용
- `Array.from()`으로 동적 배열 생성
- 날짜 비교와 이벤트 필터링

#### 17-2. 코드 작성

```tsx
// src/pages/Calendar.tsx
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import HudCard from '../components/common/HudCard'
import Button from '../components/common/Button'

// 이벤트 더미 데이터
const events = [
    { id: 1, title: 'Team Meeting', date: '2024-02-15', type: 'meeting', time: '10:00' },
    { id: 2, title: 'Project Deadline', date: '2024-02-20', type: 'deadline', time: '17:00' },
    { id: 3, title: 'Code Review', date: '2024-02-15', type: 'task', time: '14:00' },
    { id: 4, title: 'Sprint Planning', date: '2024-02-22', type: 'meeting', time: '09:00' },
    { id: 5, title: 'Release v2.0', date: '2024-02-28', type: 'release', time: '12:00' },
]

// ⭐ 이벤트 타입별 색상 맵핑
const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
        meeting: 'bg-hud-accent-primary/20 text-hud-accent-primary border-l-2 border-hud-accent-primary',
        deadline: 'bg-hud-accent-danger/20 text-hud-accent-danger border-l-2 border-hud-accent-danger',
        task: 'bg-hud-accent-info/20 text-hud-accent-info border-l-2 border-hud-accent-info',
        release: 'bg-hud-accent-success/20 text-hud-accent-success border-l-2 border-hud-accent-success',
    }
    return colors[type] || ''
}

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 1)) // 2024년 2월
    const [selectedDate, setSelectedDate] = useState<number | null>(null)

    // ⭐ 현재 월의 일 수 계산
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()

    // ⭐ Array.from()으로 빈 칸 + 날짜 배열 생성
    const calendarDays = [
        ...Array.from({ length: firstDayOfWeek }, () => null),    // 빈 칸
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),  // 1~28/30/31
    ]

    // 월 이동
    const prevMonth = () => setCurrentDate(new Date(year, month - 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1))

    // ⭐ 특정 날짜의 이벤트 필터링
    const getEventsForDate = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return events.filter(event => event.date === dateStr)
    }

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Calendar</h1>
                    <p className="text-hud-text-muted mt-1">Manage your schedule.</p>
                </div>
                <Button variant="primary" glow leftIcon={<Plus size={18} />}>Add Event</Button>
            </div>

            <HudCard>
                {/* 월 네비게이션 */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-hud-text-primary">
                        {monthNames[month]} {year}
                    </h2>
                    <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-hud-text-muted py-2">{day}</div>
                    ))}
                </div>

                {/* ⭐ 캘린더 그리드 */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="h-24" /> // 빈 칸
                        }
                        const dayEvents = getEventsForDate(day)
                        return (
                            <div key={day}
                                onClick={() => setSelectedDate(day)}
                                className={`h-24 p-2 rounded-lg cursor-pointer transition-hud border ${
                                    selectedDate === day
                                        ? 'border-hud-accent-primary bg-hud-accent-primary/5'
                                        : 'border-transparent hover:bg-hud-bg-hover'
                                }`}>
                                <span className="text-sm text-hud-text-primary">{day}</span>
                                {/* 이벤트 표시 */}
                                <div className="mt-1 space-y-1">
                                    {dayEvents.slice(0, 2).map(event => (
                                        <div key={event.id} className={`text-xs px-1.5 py-0.5 rounded truncate ${getEventColor(event.type)}`}>
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <p className="text-xs text-hud-text-muted">+{dayEvents.length - 2} more</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </HudCard>
        </div>
    )
}

export default Calendar
```

#### 17-3. 핵심 패턴 분석

**① Array.from()으로 동적 배열 생성**
```tsx
// { length: n } 객체를 배열로 변환 — 매우 유용한 패턴!
const emptySlots = Array.from({ length: firstDayOfWeek }, () => null)
const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
```

**② 날짜 문자열 포매팅**
```tsx
// padStart로 "2024-02-05" 형식 보장 (5 → "05")
const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
```

**③ slice로 표시 제한**
```tsx
// 최대 2개까지만 표시, 나머지는 "+N more"
{dayEvents.slice(0, 2).map(event => ...)}
{dayEvents.length > 2 && <p>+{dayEvents.length - 2} more</p>}
```

#### 17-4. 배운 개념 정리

| 개념 | 적용 |
|---|---|
| **Date API** | getFullYear, getMonth, getDay, getDate |
| **Array.from()** | 빈 칸 + 날짜 배열 동적 생성 |
| **Spread 결합** | `[...empty, ...days]` 두 배열 합치기 |
| **padStart** | 날짜 포매팅 (1자리 → 2자리) |
| **slice + 조건부** | 표시 제한 + "더보기" 패턴 |

✅ **Step 17 완료!**

---

## PHASE 7: 통합 & 최종 점검

---

### Step 18. 라우팅에 새 페이지 추가

Part 1에서 만든 `App.tsx`에 새 페이지들을 추가합니다.

```tsx
// src/App.tsx — 추가할 라우트
import Products from './pages/Products'
import Settings from './pages/Settings'
import ScrumBoard from './pages/ScrumBoard'
import Calendar from './pages/Calendar'

// <Route path="/" element={<MainLayout />}> 안에 추가:
<Route path="products" element={<Products />} />
<Route path="settings" element={<Settings />} />
<Route path="scrum-board" element={<ScrumBoard />} />
<Route path="calendar" element={<Calendar />} />
```

### Step 19. 최종 빌드 & 확인

```bash
npm run dev
# 각 페이지 접속 확인:
# /products    → 카테고리 필터, 검색, Grid/List 전환
# /settings    → 사이드 탭 전환, 토글 스위치
# /scrum-board → 4개 칼럼, 태스크 카드
# /calendar    → 월 이동, 날짜 클릭, 이벤트 표시

npm run build   # 프로덕션 빌드 확인
```

✅ **Part 2 전체 완료! 🎉**

---

## Part 2 총정리 🏆

### 완성한 페이지

| Step | 파일 | 줄 수 | 핵심 기능 | 핵심 개념 |
|---|---|---|---|---|
| 14 | Products.tsx | 189 | 검색, 카테고리 필터, Grid/List | useState 제네릭, 다중 필터, null 처리 |
| 15 | Settings.tsx | 265 | 섹션 탭, 프로필 폼, 토글 | find + ?., 조건부 렌더링, CSS 토글 |
| 16 | ScrumBoard.tsx | 195 | 칸반 보드, 태스크 카드 | 중첩 Interface, Record, 2중 map |
| 17 | Calendar.tsx | 221 | 월 네비게이션, 이벤트 표시 | Date API, Array.from, padStart |
| | **총합** | **~870줄** | | |

### Part 1 + Part 2 합계

```
Part 1: ~1,278줄 (기반 + 공통 + 레이아웃 + Dashboard)
Part 2: ~  870줄 (Products + Settings + ScrumBoard + Calendar)
─────────────────────────────────────────────────────
합계:   ~2,148줄 → 완성된 Admin Template! 🎯
```

### 전문가가 된 당신의 기술 맵

```
[기반 기술]
  React 18 ──── 컴포넌트, Props, 조건부 렌더링, 배열 렌더링
  TypeScript ── Interface, Union, Generic, Record, 타입 가드
  Tailwind ──── 커스텀 테마, 반응형, 다크모드, 애니메이션

[컴포넌트 설계]
  Props 설계 ── 선택적 Props, extends, ReactNode
  패턴 ──────── 객체 맵핑, 조건부 스타일, 컴포넌트 조합

[상태 관리]
  단일 상태 ── boolean, string
  다중 상태 ── 독립적 드롭다운, 필터 조합
  배열 상태 ── string[], 토글 패턴
  중첩 상태 ── Column[] > Task[]

[라우팅]
  중첩 라우팅 ── Layout + Outlet
  동적 경로 ─── :id 파라미터
  페이지 전환 ── Link, useLocation

[실전 패턴]
  필터링 ────── 다중 조건, 검색 + 카테고리
  뷰 전환 ────── Grid ↔ List
  탭 네비 ────── 사이드 탭, 섹션 전환
  날짜 처리 ─── Date API, Array.from, padStart
```

> 🎓 **축하합니다!** 이제 빈 프로젝트에서 출발하여 **20개 이상의 파일, 2,000줄 이상의 코드**로 이루어진 완전한 Admin Template을 직접 만들 수 있습니다. 당신은 이미 **전문가**입니다! 🚀
