// ═══════════════════════════════════════
// 📂 Sidebar — 네비게이션 메뉴 컴포넌트
//    프로젝트에서 가장 복잡한 컴포넌트!
//    중첩 Interface, 배열 상태, 조건부 렌더링 총출동
// ═══════════════════════════════════════

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, BarChart3, Mail, Grid3X3, User, Calendar,
    Settings, Sparkles, UtensilsCrossed, ChevronDown, ChevronRight,
    Layers, FileText, Table, PieChart, Kanban, ShoppingBag,
    DollarSign, Image,
} from 'lucide-react'

// ═══════════════════════════════════════
// 📝 Interface: Sidebar Props
// ═══════════════════════════════════════
interface SidebarProps {
    collapsed: boolean        // 접힌 상태인지
    onToggle: () => void      // 접힘 토글 콜백 함수
}

// ═══════════════════════════════════════
// 📝 Interface: 메뉴 아이템 타입
//    ⭐ 중첩 Interface: children 안에 또 다른 객체 배열
//    path?: string → 선택적 (단순 링크는 path, 드롭다운은 children)
// ═══════════════════════════════════════
interface MenuItem {
    title: string
    icon: React.ReactNode
    path?: string                                  // 단순 링크 메뉴
    children?: { title: string; path: string }[]   // 드롭다운 메뉴
}

// ═══════════════════════════════════════
// 📋 메뉴 데이터 (컴포넌트 밖에서 정의)
//    → 리렌더링마다 재생성 방지 (성능 최적화)
// ═══════════════════════════════════════
const menuItems: MenuItem[] = [
    // 단순 링크 메뉴 (path만 있음)
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },

    // 드롭다운 메뉴 (children만 있음)
    {
        title: 'Email',
        icon: <Mail size={20} />,
        children: [
            { title: 'Inbox', path: '/email/inbox' },
            { title: 'Compose', path: '/email/compose' },
            { title: 'Detail', path: '/email/detail/1' },
        ],
    },

    // 단순 링크
    { title: 'Widgets', icon: <Grid3X3 size={20} />, path: '/widgets' },

    // 드롭다운
    {
        title: 'AI Studio',
        icon: <Sparkles size={20} />,
        children: [
            { title: 'AI Chat', path: '/ai/chat' },
            { title: 'AI Image Generator', path: '/ai/image-generator' },
        ],
    },

    // 드롭다운
    {
        title: 'POS System',
        icon: <UtensilsCrossed size={20} />,
        children: [
            { title: 'Customer Order', path: '/pos/customer-order' },
            { title: 'Kitchen Order', path: '/pos/kitchen-order' },
            { title: 'Counter Checkout', path: '/pos/counter-checkout' },
        ],
    },

    // 드롭다운
    {
        title: 'UI Kits',
        icon: <Layers size={20} />,
        children: [
            { title: 'Bootstrap', path: '/ui/bootstrap' },
            { title: 'Buttons', path: '/ui/buttons' },
            { title: 'Cards', path: '/ui/card' },
        ],
    },

    // 단순 링크들
    { title: 'Scrum Board', icon: <Kanban size={20} />, path: '/scrum-board' },
    { title: 'Products', icon: <ShoppingBag size={20} />, path: '/products' },
    { title: 'Pricing', icon: <DollarSign size={20} />, path: '/pricing' },
    { title: 'Gallery', icon: <Image size={20} />, path: '/gallery' },
    { title: 'Profile', icon: <User size={20} />, path: '/profile' },
    { title: 'Calendar', icon: <Calendar size={20} />, path: '/calendar' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/settings' },
]

// ═══════════════════════════════════════
// 🎯 Sidebar 컴포넌트
// ═══════════════════════════════════════
const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
    // ═══════════════════════════════════════
    // 📍 현재 URL 경로 추적 (React Router Hook)
    // ═══════════════════════════════════════
    const location = useLocation()

    // ═══════════════════════════════════════
    // 🔄 열려있는 서브메뉴 목록을 배열로 관리
    //    string[]: 문자열 배열 (메뉴 title들을 저장)
    // ═══════════════════════════════════════
    const [expandedMenus, setExpandedMenus] = useState<string[]>([])

    // ═══════════════════════════════════════
    // 🔄 서브메뉴 토글 함수
    //    이미 열려있으면 닫고, 닫혀있으면 연다
    // ═══════════════════════════════════════
    const toggleMenu = (title: string) => {
        setExpandedMenus(prev =>
            prev.includes(title)
                ? prev.filter(item => item !== title)   // 닫기 (배열에서 제거)
                : [...prev, title]                       // 열기 (배열에 추가)
        )
    }

    // 현재 경로와 메뉴 경로가 같은지 확인
    const isActive = (path?: string) => {
        if (!path) return false
        return location.pathname === path
    }

    // 자식 메뉴 중 하나라도 활성화되어 있는지 확인
    const isParentActive = (children?: { path: string }[]) => {
        if (!children) return false
        return children.some(child => location.pathname === child.path)
    }

    return (
        <aside className={`fixed top-0 left-0 h-full bg-hud-bg-secondary border-r border-hud-border-secondary z-50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            {/* ═══════════════════════════════════════
                로고 영역
                ═══════════════════════════════════════ */}
            <div className="h-16 flex items-center justify-center border-b border-hud-border-secondary">
                <Link to="/" className="flex items-center gap-3">
                    {/* 로고 아이콘 */}
                    <div className="w-10 h-10 bg-gradient-to-br from-hud-accent-primary to-hud-accent-info rounded-lg flex items-center justify-center font-bold text-hud-bg-primary">
                        H
                    </div>
                    {/* 접히지 않았을 때만 텍스트 표시 */}
                    {!collapsed && (
                        <span className="font-semibold text-lg text-glow">ALPHA TEAM</span>
                    )}
                </Link>
            </div>

            {/* ═══════════════════════════════════════
                네비게이션 메뉴
                ═══════════════════════════════════════ */}
            <nav className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => (
                        <li key={item.title}>
                            {/* ═══════════════════════════════════════
                                드롭다운 메뉴 (children가 있는 경우)
                                ═══════════════════════════════════════ */}
                            {item.children ? (
                                <div>
                                    {/* 메뉴 토글 버튼 */}
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-hud ${
                                            isParentActive(item.children)
                                                ? 'bg-hud-accent-primary/10 text-hud-accent-primary'
                                                : 'text-hud-text-secondary hover:bg-hud-bg-hover hover:text-hud-text-primary'
                                        }`}
                                    >
                                        {item.icon}
                                        {!collapsed && (
                                            <>
                                                <span className="flex-1 text-left text-sm">{item.title}</span>
                                                {/* 열려있으면 ▼, 닫혀있으면 ▶ */}
                                                {expandedMenus.includes(item.title) ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                            </>
                                        )}
                                    </button>

                                    {/* ═══════════════════════════════════════
                                        서브메뉴 (열려있을 때만 표시)
                                        ═══════════════════════════════════════ */}
                                    {!collapsed && expandedMenus.includes(item.title) && (
                                        <ul className="mt-1 ml-8 space-y-1">
                                            {item.children.map((child) => (
                                                <li key={child.path}>
                                                    <Link
                                                        to={child.path}
                                                        className={`block px-3 py-2 rounded-lg text-sm transition-hud ${
                                                            isActive(child.path)
                                                                ? 'text-hud-accent-primary bg-hud-accent-primary/10'
                                                                : 'text-hud-text-secondary hover:text-hud-text-primary hover:bg-hud-bg-hover'
                                                        }`}
                                                    >
                                                        {child.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                /* ═══════════════════════════════════════
                                    단순 링크 메뉴 (path만 있는 경우)
                                    ⭐ item.path! → Non-null Assertion
                                    (이 분기에서는 path가 반드시 존재한다고 단정)
                                    ═══════════════════════════════════════ */
                                <Link
                                    to={item.path!}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-hud ${
                                        isActive(item.path)
                                            ? 'menu-active text-hud-accent-primary'
                                            : 'text-hud-text-secondary hover:bg-hud-bg-hover hover:text-hud-text-primary'
                                    }`}
                                >
                                    {item.icon}
                                    {!collapsed && <span className="text-sm">{item.title}</span>}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
