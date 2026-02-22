# TypeScript 완전 정복 강의 노트
> imapplepie20 Admin Template 프로젝트 소스 코드 기반 실습 가이드

**대상**: JavaScript 기초 지식 보유, TypeScript 입문~중급 학습자  
**교재 소스**: `imapplepieTemplate001` 프로젝트 전체 코드

---

## 목차

### 기초편
1. [TypeScript 소개와 환경 설정](#chapter-1-typescript-소개와-환경-설정)
2. [기본 타입](#chapter-2-기본-타입)
3. [함수와 타입](#chapter-3-함수와-타입)
4. [객체와 Interface](#chapter-4-객체와-interface)
5. [배열과 Tuple](#chapter-5-배열과-tuple)

### 중급편
6. [Union 타입과 Literal 타입](#chapter-6-union-타입과-literal-타입)
7. [Type Alias vs Interface](#chapter-7-type-alias-vs-interface)
8. [제네릭(Generics)](#chapter-8-제네릭generics)
9. [타입 가드와 타입 좁히기](#chapter-9-타입-가드와-타입-좁히기)
10. [유틸리티 타입](#chapter-10-유틸리티-타입)
11. [React에서의 TypeScript 실전](#chapter-11-react에서의-typescript-실전)
12. [tsconfig.json 해부](#chapter-12-tsconfigjson-해부)

---

## Chapter 1: TypeScript 소개와 환경 설정

### 1.1 TypeScript란?

TypeScript는 Microsoft가 개발한 **JavaScript의 상위 집합(Superset)** 언어입니다.

```
JavaScript + 타입 시스템 = TypeScript
```

| 비교 | JavaScript | TypeScript |
|---|---|---|
| **타입 검사** | 런타임 (실행 시 오류 발견) | 컴파일 타임 (코드 작성 시 오류 발견) |
| **파일 확장자** | `.js`, `.jsx` | `.ts`, `.tsx` |
| **실행** | 브라우저/Node.js 직접 실행 | 먼저 JavaScript로 변환 후 실행 |
| **학습 곡선** | 낮음 | JavaScript 기반이라 점진적 학습 가능 |

> 💡 **핵심 이점**: TypeScript는 **코드를 실행하기 전에** 버그를 잡아줍니다. 오타, 잘못된 함수 호출, 누락된 속성 등을 에디터에서 바로 알 수 있습니다.

### 1.2 TypeScript가 잡아주는 오류 예시

```tsx
// JavaScript — 아무 경고 없이 실행됨, 런타임에서 에러
const user = { name: '김철수', age: 25 };
console.log(user.email);  // undefined (오류가 아닌 undefined!)
user.age.toUpperCase();   // 💥 런타임 에러: toUpperCase is not a function

// TypeScript — 코드 작성 시 즉시 빨간 줄
const user = { name: '김철수', age: 25 };
console.log(user.email);  // ❌ 'email' 속성이 존재하지 않습니다
user.age.toUpperCase();   // ❌ 'number' 타입에 'toUpperCase' 메서드가 없습니다
```

### 1.3 프로젝트에서의 TypeScript 설정

우리 프로젝트는 **Vite + React + TypeScript** 환경입니다.

```
imapplepieTemplate001/
├── tsconfig.json          ← TypeScript 설정 파일 (Chapter 12에서 상세 설명)
├── tsconfig.node.json     ← Vite 빌드 도구용 설정
├── vite.config.ts         ← Vite 설정 (TypeScript로 작성!)
├── src/
│   ├── main.tsx           ← .tsx = TypeScript + JSX
│   ├── App.tsx
│   ├── vite-env.d.ts      ← 타입 선언 파일
│   └── ...
```

**파일 확장자 규칙:**
- `.ts` — TypeScript 파일 (JSX 없음)
- `.tsx` — TypeScript + JSX 파일 (React 컴포넌트)
- `.d.ts` — 타입 선언 전용 파일 (코드 없이 타입만 정의)

### 1.4 vite-env.d.ts의 역할

```tsx
// src/vite-env.d.ts
/// <reference types="vite/client" />
```

이 한 줄이 하는 일:
- Vite가 제공하는 기능(환경변수, 정적 파일 import 등)의 **타입을 등록**합니다
- 예: `import.meta.env.VITE_API_URL` 같은 환경 변수를 TypeScript가 인식할 수 있게 합니다

---

## Chapter 2: 기본 타입

### 2.1 타입 어노테이션 (Type Annotation)

변수 뒤에 `: 타입`을 붙여 타입을 선언합니다.

```tsx
// 기본 타입들
let name: string = '김철수'
let age: number = 25
let isAdmin: boolean = true
let nothing: null = null
let notDefined: undefined = undefined
```

### 2.2 타입 추론 (Type Inference)

TypeScript는 대부분의 경우 **타입을 자동으로 추론**합니다. 초기값이 있으면 타입을 명시하지 않아도 됩니다.

```tsx
// 타입 추론 — 자동으로 타입이 결정됨
let name = '김철수'        // string으로 추론
let age = 25              // number로 추론
let isAdmin = true        // boolean으로 추론

name = 42                 // ❌ 에러: 'number'를 'string'에 할당할 수 없습니다
```

> 💡 **실전 규칙**: 초기값으로 타입이 명확한 경우 생략하고, 타입이 모호하거나 초기값이 없는 경우 명시합니다.

### 2.3 프로젝트 실전 예시

```tsx
// src/pages/Products.tsx에서 발췌
const [searchQuery, setSearchQuery] = useState('')               // string 추론
const [selectedCategory, setSelectedCategory] = useState('All')  // string 추론
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid') // 명시 필요! (Chapter 6)

// src/pages/Settings.tsx에서 발췌
const [activeSection, setActiveSection] = useState('profile')  // string 추론
const [darkMode, setDarkMode] = useState(true)                 // boolean 추론
```

`viewMode`는 왜 타입을 명시했을까요? `'grid'`만 넣으면 TypeScript가 `string`으로 추론합니다. 하지만 실제로는 `'grid'` 또는 `'list'`만 허용하고 싶으므로 **유니온 리터럴 타입**을 명시합니다 (Chapter 6에서 상세 설명).

---

## Chapter 3: 함수와 타입

### 3.1 함수 매개변수와 반환 타입

```tsx
// 매개변수 타입 + 반환 타입 명시
function add(a: number, b: number): number {
    return a + b
}

// 화살표 함수
const multiply = (a: number, b: number): number => {
    return a * b
}

// 반환 타입 추론 — return 값으로 자동 추론
const greet = (name: string) => {
    return `안녕하세요, ${name}님!`  // string 반환 추론
}
```

### 3.2 선택적 매개변수 (Optional Parameter)

`?`를 붙이면 매개변수를 생략할 수 있습니다.

```tsx
// changeLabel 파라미터는 선택적 — 전달하지 않으면 undefined
const formatChange = (value: number, label?: string): string => {
    const prefix = value >= 0 ? '+' : ''
    return `${prefix}${value}%${label ? ` ${label}` : ''}`
}

formatChange(12.5)                    // "+12.5%"
formatChange(12.5, 'vs last month')   // "+12.5% vs last month"
```

### 3.3 기본값 매개변수 (Default Parameter)

```tsx
// 기본값이 있으면 타입 + 선택적 처리가 동시에 됨
const formatPrice = (price: number, currency: string = '$'): string => {
    return `${currency}${price.toLocaleString()}`
}

formatPrice(2499)       // "$2,499"
formatPrice(2499, '₩')  // "₩2,499"
```

### 3.4 프로젝트 실전 예시

```tsx
// src/pages/ScrumBoard.tsx에서 발췌

// 매개변수: string 타입, 반환: string 타입 (추론)
const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'bg-hud-accent-danger'
        case 'medium': return 'bg-hud-accent-warning'
        default: return 'bg-hud-accent-success'
    }
}

// Record 타입 활용 (Chapter 10에서 상세 설명)
const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
        'Design': 'bg-hud-accent-secondary/20 text-hud-accent-secondary',
        'Frontend': 'bg-hud-accent-primary/20 text-hud-accent-primary',
        'Backend': 'bg-hud-accent-info/20 text-hud-accent-info',
        'Bug': 'bg-hud-accent-danger/20 text-hud-accent-danger',
    }
    return colors[label] || 'bg-hud-bg-hover text-hud-text-muted'
}
```

### 3.5 void와 never

```tsx
// void — 아무것도 반환하지 않는 함수
const logMessage = (message: string): void => {
    console.log(message)
    // return 문 없음
}

// never — 절대 정상적으로 완료되지 않는 함수
const throwError = (message: string): never => {
    throw new Error(message)
}
```

### 3.6 콜백 함수 타입

```tsx
// 콜백 함수를 받는 매개변수
const executeAfterDelay = (callback: () => void, delay: number): void => {
    setTimeout(callback, delay)
}

// 프로젝트 예시: onToggle 콜백
// src/components/layout/Sidebar.tsx의 SidebarProps
interface SidebarProps {
    collapsed: boolean
    onToggle: () => void    // 매개변수 없고, 반환값 없는 콜백
}
```

---

## Chapter 4: 객체와 Interface

### 4.1 객체 타입 정의

JavaScript에서 객체는 가장 많이 사용되는 데이터 구조입니다. TypeScript에서는 **객체의 구조(shape)**를 정의할 수 있습니다.

```tsx
// 인라인 타입 정의
const user: { name: string; age: number; email: string } = {
    name: '김철수',
    age: 25,
    email: 'kim@example.com'
}
```

하지만 인라인 방식은 **재사용이 불가능**합니다. `interface`를 사용하세요!

### 4.2 Interface 기본

```tsx
// Interface로 객체의 구조를 정의
interface User {
    name: string
    age: number
    email: string
}

const user: User = {
    name: '김철수',
    age: 25,
    email: 'kim@example.com'
}

// 속성이 부족하면 에러
const user2: User = {
    name: '박영희',
    // ❌ 에러: 'age'와 'email' 속성이 없습니다
}
```

### 4.3 선택적 속성 (Optional Properties)

`?`를 붙이면 속성을 생략할 수 있습니다.

```tsx
// src/pages/ScrumBoard.tsx에서 발췌 — 실제 프로젝트 코드!
interface Task {
    id: number
    title: string
    description?: string       // 선택적 — 있어도 되고 없어도 됨
    labels: string[]
    priority: 'low' | 'medium' | 'high'
    dueDate?: string           // 선택적
    comments: number
    attachments: number
    assignee?: string          // 선택적
}

// ✅ description, dueDate, assignee 없이도 유효
const task: Task = {
    id: 1,
    title: 'Design new landing page',
    labels: ['Design'],
    priority: 'high',
    comments: 3,
    attachments: 2,
}

// ✅ 선택적 속성 포함도 가능
const task2: Task = {
    id: 4,
    title: 'Implement API authentication',
    labels: ['Backend'],
    priority: 'high',
    dueDate: 'Jan 18',         // 있어도 OK
    comments: 8,
    attachments: 3,
    assignee: 'JD',            // 있어도 OK
}
```

### 4.4 중첩 Interface (Nested Interface)

```tsx
// src/components/layout/Sidebar.tsx에서 발췌 — 실제 프로젝트 코드!
interface MenuItem {
    title: string
    icon: React.ReactNode
    path?: string
    children?: { title: string; path: string }[]  // 중첩된 객체 배열
}

// 사용 예
const menuItems: MenuItem[] = [
    // path만 있는 단순 메뉴
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    
    // children이 있는 드롭다운 메뉴
    {
        title: 'Email',
        icon: <Mail size={20} />,
        children: [
            { title: 'Inbox', path: '/email/inbox' },
            { title: 'Compose', path: '/email/compose' },
        ],
    },
]
```

> 💡 **실전 인사이트**: `path`와 `children`이 모두 선택적인 이유는? 메뉴 타입이 두 가지이기 때문입니다 — 단순 링크(path만) 또는 드롭다운(children만). 하나의 interface로 두 종류를 표현합니다.

### 4.5 중첩 Interface 분리

중첩된 객체가 복잡해지면, **별도 interface로 분리**하는 것이 좋습니다.

```tsx
// src/pages/ScrumBoard.tsx에서 발췌

// Task와 Column을 각각 별도 interface로 정의
interface Task {
    id: number
    title: string
    description?: string
    labels: string[]
    priority: 'low' | 'medium' | 'high'
    dueDate?: string
    comments: number
    attachments: number
    assignee?: string
}

interface Column {
    id: string
    title: string
    tasks: Task[]    // Task 배열을 참조
}

// 사용
const initialColumns: Column[] = [
    {
        id: 'todo',
        title: 'To Do',
        tasks: [
            { id: 1, title: 'Design landing page', labels: ['Design'], priority: 'high', comments: 3, attachments: 2 },
            { id: 2, title: 'Update docs', labels: ['Docs'], priority: 'medium', comments: 1, attachments: 0 },
        ],
    },
    // ...
]
```

---

## Chapter 5: 배열과 Tuple

### 5.1 배열 타입

```tsx
// 방법 1: 타입[]
const names: string[] = ['김철수', '박영희', '이민수']
const scores: number[] = [95, 87, 92]

// 방법 2: Array<타입> (제네릭 문법)
const names2: Array<string> = ['김철수', '박영희', '이민수']
```

### 5.2 객체 배열

```tsx
// src/pages/Products.tsx에서 발췌 — 실제 프로젝트 코드!
const products = [
    { id: 1, name: 'MacBook Pro 16"', category: 'Electronics', price: 2499, oldPrice: 2799, rating: 4.8, reviews: 256, stock: 45, image: '💻' },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Electronics', price: 1199, oldPrice: null, rating: 4.9, reviews: 512, stock: 120, image: '📱' },
    // ...
]
// TypeScript가 자동으로 추론하는 타입:
// {
//     id: number
//     name: string
//     category: string
//     price: number
//     oldPrice: number | null   ← null이 포함되므로 자동으로 유니온 타입!
//     rating: number
//     reviews: number
//     stock: number
//     image: string
// }[]
```

> 💡 `oldPrice`의 타입이 `number | null`로 추론되는 것에 주목하세요. 배열 내 값에 `2799`와 `null`이 모두 있으므로 TypeScript가 **유니온 타입**으로 추론합니다.

### 5.3 useState에서의 배열 타입

```tsx
// src/pages/forms/FormElements.tsx에서 발췌
const [files, setFiles] = useState<string[]>([])
//                                 ^^^^^^^^ 제네릭으로 타입 명시

// 왜 타입을 명시해야 하는가?
const [files2, setFiles2] = useState([])
// files2의 타입: never[] ← 빈 배열이라 타입 추론 불가!
// files2에 값을 추가하려 하면 에러 발생

// 배열 조작
const handleFileUpload = () => {
    setFiles([...files, `file_${files.length + 1}.pdf`])
}

const handleRemoveFile = (indexToRemove: number) => {
    setFiles(files.filter((_, idx) => idx !== indexToRemove))
}
```

### 5.4 Tuple (튜플)

배열과 비슷하지만, **길이와 각 위치의 타입이 고정**됩니다.

```tsx
// 일반 배열 — 같은 타입의 값만
const numbers: number[] = [1, 2, 3, 4, 5]

// 튜플 — 각 위치마다 다른 타입 가능
const userInfo: [string, number, boolean] = ['김철수', 25, true]
//                                            ↑이름    ↑나이  ↑관리자여부

// React의 useState가 바로 튜플!
const [count, setCount] = useState(0)
// 반환 타입: [number, React.Dispatch<React.SetStateAction<number>>]
// → [현재값, 설정함수] 튜플
```

### 5.5 배열 메서드와 TypeScript

TypeScript는 배열 메서드의 반환 타입도 자동으로 추론합니다.

```tsx
// src/pages/Products.tsx에서 발췌
const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
})
// filteredProducts의 타입: 원본 products와 동일한 타입의 배열

// map: 새로운 타입의 배열 생성
const productNames = products.map(product => product.name)
// productNames: string[]

// find: 단일 요소 또는 undefined
const macbook = products.find(p => p.name.includes('MacBook'))
// macbook: { id: number; name: string; ... } | undefined  ← undefined 가능성!

// 그래서 optional chaining이 필요!
console.log(macbook?.name)  // '?.'로 안전하게 접근
```

---

## Chapter 6: Union 타입과 Literal 타입

### 6.1 Union 타입 — 여러 타입 중 하나

`|` 연산자로 **여러 타입 중 하나**를 허용합니다.

```tsx
// 기본 유니온 타입
let id: string | number
id = 'abc'  // ✅ OK
id = 123    // ✅ OK
id = true   // ❌ 에러: boolean은 허용되지 않음
```

### 6.2 Literal 타입 — 특정 값만 허용

```tsx
// src/components/common/Button.tsx에서 발췌 — 실제 프로젝트 코드!
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    //        ↑ 이 5가지 문자열만 허용! 다른 값은 에러
    size?: 'sm' | 'md' | 'lg'
    //     ↑ 이 3가지만 허용!
    glow?: boolean
    fullWidth?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

// 사용 시
<Button variant="primary" size="lg">확인</Button>   // ✅
<Button variant="success" size="xl">확인</Button>    // ❌ 둘 다 에러!
```

> 💡 **Literal 타입의 위력**: `variant: string`으로 하면 아무 문자열이나 가능합니다. 하지만 `'primary' | 'secondary' | ...`로 제한하면 **자동완성도 되고, 오타도 방지**됩니다.

### 6.3 프로젝트 전체에서 발견되는 Literal Union 패턴

```tsx
// src/components/common/StatCard.tsx
variant?: 'default' | 'primary' | 'secondary' | 'warning' | 'danger'

// src/pages/ScrumBoard.tsx
priority: 'low' | 'medium' | 'high'

// src/pages/Products.tsx — useState에 적용
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
```

### 6.4 객체 타입과 Union

```tsx
// null 허용 패턴 — 매우 자주 사용
interface StatCardProps {
    value: string | number    // 문자열 또는 숫자 모두 OK
    change?: number           // number | undefined (선택적이므로)
}

// 사용
<StatCard value="$54,239" change={12.5} />  // ✅ value: string
<StatCard value={3842} />                    // ✅ value: number, change 생략

// Products.tsx에서의 null 허용
const products = [
    { id: 1, price: 2499, oldPrice: 2799 },   // oldPrice: number
    { id: 2, price: 1199, oldPrice: null },    // oldPrice: null
]
// oldPrice: number | null 으로 추론됨

// 렌더링 시 null 체크 필요
{product.oldPrice && (
    <span className="line-through">${product.oldPrice}</span>
)}
```

### 6.5 as const — 상수 단언

```tsx
// as const 없이
const categories = ['All', 'Electronics', 'Accessories', 'Wearables']
// 타입: string[]

// as const 사용
const categories = ['All', 'Electronics', 'Accessories', 'Wearables'] as const
// 타입: readonly ['All', 'Electronics', 'Accessories', 'Wearables']
// → 각 요소가 리터럴 타입으로 고정됨!

// as const의 실전 활용
const THEMES = ['light', 'dark', 'auto'] as const
type Theme = typeof THEMES[number]  // 'light' | 'dark' | 'auto'
```

---

## Chapter 7: Type Alias vs Interface

### 7.1 Type Alias (타입 별칭)

`type` 키워드로 타입에 이름을 붙입니다.

```tsx
// 기본 타입에 별칭
type UserID = string | number
type Theme = 'light' | 'dark'
type Callback = () => void

// 객체 타입
type User = {
    id: UserID
    name: string
    theme: Theme
}
```

### 7.2 Interface

```tsx
interface User {
    id: string | number
    name: string
    theme: 'light' | 'dark'
}
```

### 7.3 차이점과 선택 기준

| 기능 | type | interface |
|---|---|---|
| **객체 타입 정의** | ✅ | ✅ |
| **Union 타입** | ✅ `type A = B \| C` | ❌ 불가 |
| **Intersection(교차)** | ✅ `type A = B & C` | ✅ `extends` |
| **확장(상속)** | `&`로 교차 | `extends`로 상속 |
| **선언 병합** | ❌ | ✅ 같은 이름 interface가 자동 병합 |
| **주 사용처** | Union, Tuple, 기본 타입 별칭 | 객체, 클래스 타입 |

### 7.4 실전 규칙 (프로젝트 기준)

```tsx
// ✅ Interface — 객체의 구조를 정의할 때
interface ButtonProps {           // React 컴포넌트 Props
    children: ReactNode
    variant?: 'primary' | 'danger'
}

interface Task {                  // 데이터 모델
    id: number
    title: string
}

// ✅ Type — Union, 기본 타입 별칭, 계산된 타입
type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'
type TodoAction =
    | { type: 'ADD'; payload: string }
    | { type: 'DELETE'; payload: number }
```

> 💡 **프로젝트 컨벤션**: 우리 프로젝트에서는 **Props와 데이터 모델에는 `interface`**, **유니온 타입과 별칭에는 `type`**을 사용합니다.

### 7.5 Interface 확장 (extends)

```tsx
// src/components/common/Button.tsx에서 발췌 — 실제 프로젝트 코드!
import { ReactNode, ButtonHTMLAttributes } from 'react'

// HTML <button>의 모든 기본 속성을 상속받으면서 커스텀 속성 추가
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    glow?: boolean
    fullWidth?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}
```

**`extends ButtonHTMLAttributes<HTMLButtonElement>`가 하는 일:**

```tsx
// extends 없이 — 이 모든 것을 직접 정의해야 함
interface ButtonPropsManual {
    children: ReactNode
    variant?: 'primary' | 'danger'
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    className?: string
    id?: string
    // ... HTML 버튼의 속성이 수십 개!
}

// extends 사용 — HTML 속성을 **자동으로** 모두 포함
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'danger'
    // onClick, disabled, type, className 등은 자동 포함!
}
```

---

## Chapter 8: 제네릭(Generics)

### 8.1 제네릭이란?

제네릭은 **타입의 변수**입니다. 함수나 타입을 정의할 때 **특정 타입을 지정하지 않고**, 사용할 때 타입을 결정합니다.

```tsx
// 제네릭 없이 — 타입별로 함수를 만들어야 함
const getFirstString = (arr: string[]): string => arr[0]
const getFirstNumber = (arr: number[]): number => arr[0]

// 제네릭 사용 — 하나의 함수로 모든 타입 처리
const getFirst = <T>(arr: T[]): T => arr[0]
//                ^  타입 변수 T

getFirst<string>(['a', 'b', 'c'])  // 반환: string
getFirst<number>([1, 2, 3])        // 반환: number
getFirst([1, 2, 3])                // 반환: number (타입 추론)
```

### 8.2 React의 useState가 제네릭인 이유

```tsx
// useState<T>의 제네릭 구조 (간소화)
function useState<T>(initialValue: T): [T, (newValue: T) => void]

// 사용하는 우리가 T를 결정!
const [count, setCount] = useState<number>(0)      // T = number
const [name, setName] = useState<string>('')        // T = string
const [files, setFiles] = useState<string[]>([])    // T = string[]

// 초기값으로 타입 추론되는 경우 생략 가능
const [count, setCount] = useState(0)               // T = number (추론)

// 빈 배열은 추론 불가 → 반드시 제네릭 명시
const [files, setFiles] = useState<string[]>([])
// useState([]) 만 쓰면 → never[] 타입 → 값 추가 불가!
```

### 8.3 프로젝트에서의 제네릭 사용

```tsx
// src/pages/Products.tsx
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
// useState<T> 의 T에 Union Literal 타입을 넣으면
// setViewMode('grid')  ✅
// setViewMode('table') ❌ 에러!

// src/components/layout/Sidebar.tsx
const [expandedMenus, setExpandedMenus] = useState<string[]>([])
// string 배열로 명시 — 빈 배열이므로 제네릭 필수

// src/pages/ScrumBoard.tsx
const [columns, setColumns] = useState(initialColumns)
// initialColumns가 Column[] 타입이므로 자동 추론됨 — 제네릭 불필요!
```

### 8.4 제네릭 함수 만들기

```tsx
// 배열에서 랜덤 요소를 꺼내는 유틸리티 함수
function getRandomItem<T>(items: T[]): T {
    const randomIndex = Math.floor(Math.random() * items.length)
    return items[randomIndex]
}

const randomProduct = getRandomItem(products)     // 타입: Product
const randomName = getRandomItem(['김', '이', '박']) // 타입: string

// 두 개의 제네릭 타입
function merge<A, B>(obj1: A, obj2: B): A & B {
    return { ...obj1, ...obj2 }
}

const result = merge(
    { name: '김철수' },
    { age: 25 }
)
// result 타입: { name: string } & { age: number }
// = { name: string; age: number }
```

### 8.5 제네릭 제약 조건 (Constraints)

```tsx
// T가 아무 타입이나 되면 안 되는 경우
// 예: "length" 속성이 있는 타입만 허용
function getLength<T extends { length: number }>(item: T): number {
    return item.length
}

getLength('hello')       // ✅ string에는 length 있음
getLength([1, 2, 3])     // ✅ 배열에는 length 있음
getLength(123)           // ❌ number에는 length 없음!

// id 속성이 있는 객체만 허용
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id)
}
```

---

## Chapter 9: 타입 가드와 타입 좁히기

### 9.1 타입 좁히기(Narrowing)란?

TypeScript가 코드 흐름을 분석하여 **넓은 타입을 좁은 타입으로** 추론하는 것입니다.

```tsx
// value는 string | number — 넓은 타입
function processValue(value: string | number) {
    // 여기서는 string인지 number인지 모름
    // value.toUpperCase()  ❌ 에러: number에는 toUpperCase가 없음

    if (typeof value === 'string') {
        // 이 블록 안에서 value는 string으로 좁혀짐!
        console.log(value.toUpperCase())  // ✅ OK
    } else {
        // 이 블록 안에서 value는 number로 좁혀짐!
        console.log(value.toFixed(2))     // ✅ OK
    }
}
```

### 9.2 typeof 타입 가드

```tsx
const formatValue = (value: string | number | boolean): string => {
    if (typeof value === 'string') {
        return value.toUpperCase()
    }
    if (typeof value === 'number') {
        return value.toLocaleString()
    }
    return value ? '예' : '아니오'
}
```

### 9.3 Truthiness 좁히기 (null/undefined 체크)

프로젝트에서 가장 많이 사용되는 패턴입니다.

```tsx
// src/pages/ScrumBoard.tsx에서 발췌 — 실제 프로젝트 코드!
interface Task {
    dueDate?: string      // string | undefined
    assignee?: string     // string | undefined
}

// JSX에서의 Truthiness 좁히기
{task.dueDate && (
    // 이 블록 안에서 task.dueDate는 string (undefined 제거)
    <div className="flex items-center gap-1">
        <Calendar size={12} />
        <span>{task.dueDate}</span>
    </div>
)}

{task.assignee && (
    // task.assignee가 존재할 때만 렌더링
    <div className="w-6 h-6 rounded-full">
        {task.assignee}
    </div>
)}
```

### 9.4 Optional Chaining (?.)

```tsx
// src/pages/Settings.tsx에서 발췌
{settingsSections.find(s => s.id === activeSection)?.label}
//                                                  ^^ ?. 없으면 에러!

// find()는 undefined를 반환할 수 있으므로
const section = settingsSections.find(s => s.id === 'billing')
// section: { id: string; label: string; icon: ReactNode } | undefined

section.label        // ❌ 에러: section이 undefined일 수 있음
section?.label       // ✅ undefined면 그냥 undefined 반환
section?.label ?? '알 수 없음'  // ✅ undefined면 기본값 사용
```

### 9.5 Non-null Assertion (!)

```tsx
// src/main.tsx에서 발췌
createRoot(document.getElementById('root')!).render(...)
//                                         ^ 이 !는 무엇?

// document.getElementById()의 반환 타입: HTMLElement | null
// "이 값은 절대 null이 아니야!" 라고 TypeScript에게 알려주는 것

// ⚠️ 주의: !를 남용하면 안 됩니다!
// null이 실제로 가능한 경우에 사용하면 런타임 에러 발생
// 확실한 경우에만 사용하세요

// src/components/layout/Sidebar.tsx에서 발췌
<Link to={item.path!} ...>
//               ^ path가 undefined일 수 없는 분기에서 사용
```

### 9.6 in 연산자로 타입 좁히기

```tsx
interface Fish {
    swim: () => void
}

interface Bird {
    fly: () => void
}

function move(animal: Fish | Bird) {
    if ('swim' in animal) {
        // animal은 Fish로 좁혀짐
        animal.swim()
    } else {
        // animal은 Bird로 좁혀짐
        animal.fly()
    }
}
```

---

## Chapter 10: 유틸리티 타입

### 10.1 유틸리티 타입이란?

TypeScript는 기존 타입을 **변환**하는 내장 유틸리티 타입을 제공합니다.

### 10.2 Record<K, V>

**키-값 쌍의 객체 타입**을 정의합니다.

```tsx
// src/pages/ScrumBoard.tsx에서 발췌 — 실제 프로젝트 코드!
const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
        'Design': 'bg-hud-accent-secondary/20 text-hud-accent-secondary',
        'Frontend': 'bg-hud-accent-primary/20 text-hud-accent-primary',
        'Backend': 'bg-hud-accent-info/20 text-hud-accent-info',
        'Bug': 'bg-hud-accent-danger/20 text-hud-accent-danger',
    }
    return colors[label] || 'bg-hud-bg-hover text-hud-text-muted'
}

// Record<string, string> =
// {
//     [key: string]: string
//     어떤 문자열 키든 가능, 값은 string
// }
```

### 10.3 Partial<T>

모든 속성을 **선택적으로** 만듭니다.

```tsx
interface User {
    name: string
    age: number
    email: string
}

// Partial<User> =
// {
//     name?: string
//     age?: number
//     email?: string
// }

// 사용 예: 업데이트 함수
const updateUser = (id: number, updates: Partial<User>) => {
    // 일부 속성만 업데이트 가능
}

updateUser(1, { name: '새이름' })           // ✅ name만 업데이트
updateUser(1, { age: 30, email: 'new@a.com' })  // ✅ 일부만
```

### 10.4 Omit<T, K>

특정 속성을 **제외**합니다.

```tsx
interface User {
    id: number
    name: string
    email: string
    password: string
}

// password를 제외한 타입
type PublicUser = Omit<User, 'password'>
// {
//     id: number
//     name: string
//     email: string
// }

// 여러 속성 제외
type UserPreview = Omit<User, 'password' | 'email'>
// {
//     id: number
//     name: string
// }
```

### 10.5 Pick<T, K>

특정 속성만 **선택**합니다.

```tsx
type UserName = Pick<User, 'name' | 'email'>
// {
//     name: string
//     email: string
// }
```

### 10.6 Required<T>

모든 선택적 속성을 **필수**로 만듭니다.

```tsx
interface Config {
    theme?: 'light' | 'dark'
    language?: string
    fontSize?: number
}

type RequiredConfig = Required<Config>
// {
//     theme: 'light' | 'dark'     // 필수!
//     language: string             // 필수!
//     fontSize: number             // 필수!
// }
```

### 10.7 ReturnType<T>

함수의 **반환 타입**을 추출합니다.

```tsx
const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high': return 'bg-hud-accent-danger'
        default: return 'bg-hud-accent-success'
    }
}

type PriorityColor = ReturnType<typeof getPriorityColor>
// string
```

### 10.8 유틸리티 타입 조합

```tsx
// 실전 패턴: 새 사용자 생성 시 id를 제외
interface User {
    id: number
    name: string
    email: string
    role: 'admin' | 'user'
}

type CreateUserInput = Omit<User, 'id'>
// {
//     name: string
//     email: string
//     role: 'admin' | 'user'
// }

// 수정 시 id 제외 + 나머지 선택적
type UpdateUserInput = Partial<Omit<User, 'id'>>
// {
//     name?: string
//     email?: string
//     role?: 'admin' | 'user'
// }
```

---

## Chapter 11: React에서의 TypeScript 실전

### 11.1 컴포넌트 Props 타입 정의 패턴

프로젝트에서 사용되는 3가지 패턴을 정리합니다.

#### 패턴 1: 기본 Interface

```tsx
// src/components/common/HudCard.tsx — 실제 코드!
interface HudCardProps {
    children: ReactNode      // 모든 렌더링 가능한 요소
    className?: string       // 선택적 CSS 클래스
    title?: string           // 선택적 제목
    subtitle?: string        // 선택적 부제목
    action?: ReactNode       // 선택적 액션 버튼
    noPadding?: boolean      // 선택적 패딩 제거
}

const HudCard = ({
    children,
    className = '',          // 기본값으로 선택적 처리
    title,
    subtitle,
    action,
    noPadding = false
}: HudCardProps) => { ... }
```

#### 패턴 2: HTML 속성 확장 (extends)

```tsx
// src/components/common/Button.tsx — 실제 코드!
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    glow?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    glow = false,
    className = '',
    ...props           // 나머지 HTML 속성 (onClick, disabled 등)
}: ButtonProps) => (
    <button className={...} {...props}>
        {children}
    </button>
)
```

#### 패턴 3: 콜백 Props

```tsx
// src/components/layout/Sidebar.tsx — 실제 코드!
interface SidebarProps {
    collapsed: boolean       // 상태 전달 (읽기)
    onToggle: () => void     // 상태 변경 콜백 (쓰기)
}

// 사용하는 쪽 (MainLayout.tsx)
<Sidebar
    collapsed={sidebarCollapsed}
    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
/>
```

### 11.2 이벤트 핸들러 타입

```tsx
// 클릭 이벤트
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.textContent)
}

// 입력 변경 이벤트
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
}

// 폼 제출 이벤트
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 폼 처리 로직
}

// 키보드 이벤트
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        // 엔터 키 처리
    }
}
```

### 11.3 React 내장 타입 정리

| 타입 | 용도 | 예시 |
|---|---|---|
| `ReactNode` | 모든 렌더링 가능 요소 | children, icon |
| `ReactElement` | JSX 요소만 | `<div/>`, `<Component/>` |
| `FC<Props>` | 함수형 컴포넌트 타입 | ⚠️ 권장하지 않음 (아래 참고) |
| `ChangeEvent<T>` | 입력 변경 이벤트 | `<input>`, `<select>` |
| `MouseEvent<T>` | 마우스 이벤트 | `<button>`, `<div>` |
| `FormEvent<T>` | 폼 이벤트 | `<form>` |
| `CSSProperties` | 인라인 스타일 객체 | `style={{ color: 'red' }}` |
| `ButtonHTMLAttributes<T>` | 버튼 HTML 속성 | extends로 확장 |
| `Dispatch<SetStateAction<T>>` | setState 함수 타입 | Props로 전달 시 |

> ⚠️ **FC<Props>를 권장하지 않는 이유**: `React.FC`는 암묵적으로 `children`을 포함했었고, 반환 타입이 `ReactElement | null`로 제한됩니다. 현대 React에서는 프로젝트처럼 **직접 Props 인터페이스를 작성**하는 방식이 표준입니다.

### 11.4 객체 스타일 맵핑 패턴

프로젝트에서 가장 자주 사용되는 패턴 중 하나입니다.

```tsx
// src/components/common/Button.tsx — 실제 코드!
const Button = ({ variant = 'primary', size = 'md', ... }: ButtonProps) => {

    // variant 값에 따른 스타일 맵핑 객체
    const variants = {
        primary: 'bg-hud-accent-primary text-hud-bg-primary',
        secondary: 'bg-hud-accent-info text-white',
        outline: 'border border-hud-accent-primary text-hud-accent-primary',
        ghost: 'text-hud-text-secondary hover:bg-hud-bg-hover',
        danger: 'bg-hud-accent-danger text-white',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    }

    // variant가 'primary' | 'secondary' | ... 이므로
    // variants[variant]는 항상 유효한 키 접근!
    return (
        <button className={`${variants[variant]} ${sizes[size]}`}>
            {children}
        </button>
    )
}
```

> 💡 **이 패턴의 핵심**: Literal Union 타입 + 객체 맵핑이 **if/else 없이** 조건별 값을 깔끔하게 처리합니다. switch문 대신 이 패턴을 사용하면 코드가 훨씬 간결해집니다.

---

## Chapter 12: tsconfig.json 해부

### 12.1 프로젝트의 tsconfig.json

```jsonc
// tsconfig.json — 프로젝트 실제 설정!
{
    "compilerOptions": {
        "target": "ES2020",              // 변환 대상 JS 버전
        "useDefineForClassFields": true,  // 클래스 필드 표준 구현
        "lib": ["ES2020", "DOM", "DOM.Iterable"],  // 사용할 타입 라이브러리
        "module": "ESNext",              // 모듈 시스템
        "skipLibCheck": true,            // 외부 라이브러리 타입 검사 건너뛰기

        // 모듈 관련
        "moduleResolution": "bundler",   // Vite 번들러에 맞는 모듈 해석
        "allowImportingTsExtensions": true, // .ts 확장자 import 허용
        "resolveJsonModule": true,       // JSON import 허용
        "isolatedModules": true,         // 파일별 독립 컴파일

        // 출력 관련
        "noEmit": true,                  // JS 파일 생성 안 함 (Vite가 담당)
        "jsx": "react-jsx",             // React 17+ JSX 변환

        // 엄격 모드
        "strict": true,                  // ⭐ 모든 엄격 검사 활성화

        "noUnusedLocals": false,         // 미사용 변수 허용
        "noUnusedParameters": false,     // 미사용 매개변수 허용
        "noFallthroughCasesInSwitch": true, // switch fall-through 방지

        // 경로 별칭
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]             // @/components → src/components
        }
    },
    "include": ["src", "vite.config.ts"]  // 컴파일 대상 폴더
}
```

### 12.2 핵심 옵션 설명

#### `"strict": true` — 가장 중요한 옵션

이 하나의 옵션이 다음 7가지를 모두 켭니다:

| 옵션 | 효과 |
|---|---|
| `strictNullChecks` | null/undefined를 명시적으로 처리해야 함 |
| `strictFunctionTypes` | 함수 타입을 엄격하게 검사 |
| `strictBindCallApply` | bind, call, apply의 타입 검사 |
| `strictPropertyInitialization` | 클래스 속성 초기화 필수 |
| `noImplicitAny` | 암묵적 any 타입 금지 |
| `noImplicitThis` | this의 타입을 명시해야 함 |
| `alwaysStrict` | JavaScript의 "use strict" 모드 |

> 💡 **반드시 `strict: true`로 시작하세요.** false로 두면 TypeScript를 사용하는 의미가 절반으로 줄어듭니다.

#### `"paths"` — 경로 별칭

```tsx
// paths 설정 전
import Button from '../../../components/common/Button'

// paths 설정 후 — "@/"가 "src/"를 가리킴
import Button from '@/components/common/Button'
```

---

## 학습 체크리스트

### 기초
- [ ] 기본 타입(string, number, boolean)을 선언할 수 있다
- [ ] 타입 추론과 타입 어노테이션의 차이를 안다
- [ ] 함수의 매개변수와 반환 타입을 정의할 수 있다
- [ ] Interface로 객체 타입을 정의할 수 있다
- [ ] 선택적 속성(?)과 기본값을 사용할 수 있다
- [ ] 배열 타입을 선언하고 조작할 수 있다

### 중급
- [ ] Union 타입과 Literal 타입을 활용할 수 있다
- [ ] type과 interface의 차이를 설명할 수 있다
- [ ] interface extends로 HTML 속성을 확장할 수 있다
- [ ] 제네릭의 개념을 이해하고 useState에서 활용할 수 있다
- [ ] typeof, &&, ?., !로 타입을 좁힐 수 있다
- [ ] Record, Partial, Omit, Pick 유틸리티 타입을 사용할 수 있다
- [ ] React 이벤트 핸들러에 타입을 적용할 수 있다
- [ ] tsconfig.json의 핵심 옵션을 이해한다

---

## TypeScript 핵심 요약 표

| 개념 | 키워드 | 프로젝트 사용 위치 |
|---|---|---|
| **기본 타입** | `string`, `number`, `boolean` | 모든 파일 |
| **선택적 속성** | `?` | `StatCard`, `Task`, `MenuItem` |
| **Union 타입** | `\|` | `ButtonProps`, `StatCardProps` |
| **Literal 타입** | `'a' \| 'b'` | `variant`, `size`, `priority` |
| **Interface** | `interface` | `ButtonProps`, `Task`, `Column` |
| **Extends** | `extends` | `Button.tsx` — HTML 속성 상속 |
| **제네릭** | `<T>` | `useState<string[]>`, `useState<'grid' \| 'list'>` |
| **Record** | `Record<K, V>` | `ScrumBoard.tsx` — getLabelColor |
| **Optional Chaining** | `?.` | `Settings.tsx` — find()?.label |
| **Non-null Assertion** | `!` | `main.tsx`, `Sidebar.tsx` |
| **비구조화 + 타입** | `{ a, b }: Props` | 모든 컴포넌트 |
| **Spread** | `...props` | `Button.tsx` — 나머지 HTML 속성 |

---

> 📖 이 강의 노트는 `imapplepie20 Admin Template` 프로젝트의 실제 코드를 바탕으로 TypeScript의 기초부터 중급까지 다룹니다. 코드 예시의 `// 실제 프로젝트 코드!` 표시가 있는 부분은 `src/` 폴더에서 직접 확인할 수 있습니다.
