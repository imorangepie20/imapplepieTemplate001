// ═══════════════════════════════════════
// 🚀 App.tsx — 라우팅 설정
//    모든 페이지를 URL 경로와 연결
// ═══════════════════════════════════════

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Analytics from './pages/dashboard/Analytics'
import Products from './pages/Products'

function App() {
    return (
        <Router>
            <Routes>
                {/* ═══════════════════════════════════════
                    MainLayout 안에 렌더링되는 페이지들
                    Outlet 위치에 각 페이지가 나타남
                    ═══════════════════════════════════════ */}
                <Route path="/" element={<MainLayout />}>
                    {/* index: 부모 경로("/")와 동일한 URL */}
                    <Route index element={<Dashboard />} />

                    {/* Analytics 페이지 */}
                    <Route path="analytics" element={<Analytics />} />

                    {/* Products 페이지 */}
                    <Route path="products" element={<Products />} />

                    {/* 다른 페이지들 (나중에 추가) */}
                    {/* <Route path="settings" element={<Settings />} /> */}
                </Route>
            </Routes>
        </Router>
    )
}

export default App
