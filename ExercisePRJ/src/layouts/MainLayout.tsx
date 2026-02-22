// ═══════════════════════════════════════
// 📐 MainLayout — 전체 레이아웃 조합
//    Sidebar + Header + 페이지 콘텐츠를 하나로 조합
// ═══════════════════════════════════════

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

// ═══════════════════════════════════════
// 🎯 MainLayout 컴포넌트
// ═══════════════════════════════════════
const MainLayout = () => {
    // ═══════════════════════════════════════
    // 🔄 사이드바 접힘 상태 관리
        //    ⭐ 상태 끌어올리기: 자식 컴포넌트들(Sidebar, Header)이
        //    이 상태를 공유할 수 있도록 여기서 관리
    // ═══════════════════════════════════════
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="min-h-screen bg-hud-bg-primary hud-grid-bg">
            {/* ═══════════════════════════════════════
                Sidebar 컴포넌트
                Props로 상태와 토글 함수 전달
                ═══════════════════════════════════════ */}
            <Sidebar
                collapsed={sidebarCollapsed}           // 접힌 상태 전달
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}  // 토글 함수 전달
            />

            {/* ═══════════════════════════════════════
                메인 콘텐츠 영역
                Sidebar 너비만큼 왼쪽 여백(ml)
                접혔으면 80px(5rem), 펴져있으면 256px(16rem)
                ═══════════════════════════════════════ */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                {/* Header 컴포넌트 */}
                <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

                {/* ═══════════════════════════════════════
                    ⭐ Outlet: React Router의 핵심!
                    현재 URL에 맞는 페이지 컴포넌트가 여기에 렌더링됨

                    예시:
                    "/" → Dashboard 컴포넌트 렌더링
                    "/products" → Products 컴포넌트 렌더링
                    "/settings" → Settings 컴포넌트 렌더링

                    ⭐ 장점: 페이지가 바뀌어도 Sidebar와 Header는
                    다시 렌더링되지 않음! (성능 최적화)
                    ═══════════════════════════════════════ */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout
