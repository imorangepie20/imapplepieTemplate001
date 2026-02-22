// ═══════════════════════════════════════
// 📌 Header — 상단 바 컴포넌트
//    검색, 알림 드롭다운, 프로필 드롭다운 포함
// ═══════════════════════════════════════

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Search, Bell, Menu, Mail, Calendar, Settings,
    LogOut, User, ChevronDown,
} from 'lucide-react'

// ═══════════════════════════════════════
// 📝 Interface: Header Props
// ═══════════════════════════════════════
interface HeaderProps {
    onMenuToggle: () => void     // 사이드바 토글 콜백 함수
}

// ═══════════════════════════════════════
// 📋 알림 더미 데이터
// ═══════════════════════════════════════
const notifications = [
    { id: 1, title: 'New order received ($1,299)', time: 'Just now', isNew: true },
    { id: 2, title: '3 new accounts created', time: '2 minutes ago', isNew: true },
    { id: 3, title: 'Setup completed', time: '3 minutes ago', isNew: false },
    { id: 4, title: 'Widget installation done', time: '5 minutes ago', isNew: false },
    { id: 5, title: 'Payment method enabled', time: '10 minutes ago', isNew: false },
]

// ═══════════════════════════════════════
// 🎯 Header 컴포넌트
// ═══════════════════════════════════════
const Header = ({ onMenuToggle }: HeaderProps) => {
    // ═══════════════════════════════════════
    // 🔄 두 개의 독립적인 드롭다운 상태
    //    각각 따로 제어 (상호 배타적)
    // ═══════════════════════════════════════
    const [showNotifications, setShowNotifications] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    return (
        <header className="h-16 bg-hud-bg-secondary/80 backdrop-blur-md border-b border-hud-border-secondary px-6 flex items-center justify-between sticky top-0 z-40">
            {/* ═══════════════════════════════════════
                좌측: 햄버거 메뉴 + 검색
                ═══════════════════════════════════════ */}
            <div className="flex items-center gap-4">
                {/* 햄버거 메뉴 버튼 (클릭하면 onMenuToggle 호출) */}
                <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary hover:text-hud-text-primary">
                    <Menu size={20} />
                </button>

                {/* 검색 입력框 (모바일에서는 숨김) */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-hud-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 pl-10 pr-4 py-2 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-sm text-hud-text-primary placeholder-hud-text-muted focus:outline-none focus:border-hud-accent-primary transition-hud"
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════
                우측: 퀵링크 + 알림 + 프로필
                ═══════════════════════════════════════ */}
            <div className="flex items-center gap-2">
                {/* 퀵 링크 아이콘들 (화면이 넓을 때만 표시) */}
                <div className="hidden lg:flex items-center gap-1">
                    <Link to="/email/inbox" className="p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary hover:text-hud-accent-primary" title="Inbox">
                        <Mail size={20} />
                    </Link>
                    <Link to="/calendar" className="p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary hover:text-hud-accent-primary" title="Calendar">
                        <Calendar size={20} />
                    </Link>
                    <Link to="/settings" className="p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary hover:text-hud-accent-primary" title="Settings">
                        <Settings size={20} />
                    </Link>
                </div>

                {/* 구분선 */}
                <div className="w-px h-8 bg-hud-border-secondary mx-2 hidden lg:block" />

                {/* ═══════════════════════════════════════
                    알림 드롭다운
                    토글 시 프로필은 닫기 (상호 배타적)
                    ═══════════════════════════════════════ */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications)
                            setShowProfile(false)  // 알림 열 때 프로필 닫기
                        }}
                        className="relative p-2 rounded-lg hover:bg-hud-bg-hover transition-hud text-hud-text-secondary hover:text-hud-accent-primary"
                    >
                        <Bell size={20} />
                        {/* 알림 배지 (빨간 점) */}
                        <span className="absolute top-1 right-1 w-2 h-2 bg-hud-accent-danger rounded-full animate-pulse" />
                    </button>

                    {/* 알림 드롭다운 내용 (열려있을 때만 표시) */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-hud-bg-secondary border border-hud-border-secondary rounded-lg shadow-hud-glow animate-fade-in overflow-hidden">
                            {/* 드롭다운 헤더 */}
                            <div className="px-4 py-3 border-b border-hud-border-secondary">
                                <h3 className="font-semibold text-hud-text-primary">Notifications</h3>
                            </div>

                            {/* 알림 리스트 */}
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="px-4 py-3 hover:bg-hud-bg-hover transition-hud cursor-pointer border-b border-hud-border-secondary last:border-0">
                                        <div className="flex items-start gap-3">
                                            {/* 새 알림 표시 (파란 점) */}
                                            {notif.isNew && <span className="w-2 h-2 mt-2 bg-hud-accent-primary rounded-full flex-shrink-0" />}
                                            <div className={notif.isNew ? '' : 'ml-5'}>
                                                <p className="text-sm text-hud-text-primary">{notif.title}</p>
                                                <p className="text-xs text-hud-text-muted mt-1">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 푸터: 모두 보기 링크 */}
                            <div className="px-4 py-3 border-t border-hud-border-secondary">
                                <button className="w-full text-sm text-hud-accent-primary hover:underline">See All Notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ═══════════════════════════════════════
                    프로필 드롭다운
                    토글 시 알림은 닫기 (상호 배타적)
                    ═══════════════════════════════════════ */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowProfile(!showProfile)
                            setShowNotifications(false)  // 프로필 열 때 알림 닫기
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-hud-bg-hover transition-hud"
                    >
                        {/* 아바타 */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-hud-accent-primary to-hud-accent-secondary flex items-center justify-center">
                            <User size={16} className="text-hud-bg-primary" />
                        </div>
                        {/* 사용자 이름 (모바일에서는 숨김) */}
                        <span className="hidden md:block text-sm text-hud-text-primary">Admin</span>
                        {/* 드롭다운 화살표 */}
                        <ChevronDown size={16} className="hidden md:block text-hud-text-muted" />
                    </button>

                    {/* 프로필 드롭다운 내용 */}
                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-48 bg-hud-bg-secondary border border-hud-border-secondary rounded-lg shadow-hud-glow animate-fade-in overflow-hidden">
                            {/* 사용자 정보 */}
                            <div className="px-4 py-3 border-b border-hud-border-secondary">
                                <p className="font-semibold text-hud-text-primary">Admin User</p>
                                <p className="text-xs text-hud-text-muted">admin@hudadmin.com</p>
                            </div>

                            {/* 메뉴 링크들 */}
                            <div className="py-1">
                                {[
                                    { icon: <User size={16} />, label: 'Profile', to: '/profile' },
                                    { icon: <Mail size={16} />, label: 'Inbox', to: '/email/inbox' },
                                    { icon: <Calendar size={16} />, label: 'Calendar', to: '/calendar' },
                                    { icon: <Settings size={16} />, label: 'Settings', to: '/settings' },
                                ].map(item => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-hud-text-secondary hover:bg-hud-bg-hover hover:text-hud-text-primary transition-hud"
                                    >
                                        {item.icon} {item.label}
                                    </Link>
                                ))}
                            </div>

                            {/* 로그아웃 (구분선으로 분리) */}
                            <div className="border-t border-hud-border-secondary py-1">
                                <Link to="/login" className="flex items-center gap-3 px-4 py-2 text-sm text-hud-accent-danger hover:bg-hud-bg-hover transition-hud">
                                    <LogOut size={16} /> Logout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
