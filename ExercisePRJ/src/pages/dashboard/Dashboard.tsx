// ═══════════════════════════════════════
// 📊 Dashboard — 메인 대시보드 (완성판)
//    모든 공통 컴포넌트를 한 페이지에서 활용하는 종합 실습
// ═══════════════════════════════════════

import {
    DollarSign, Users, ShoppingCart, TrendingUp,
    Activity, Globe, Clock, ArrowUpRight,
} from 'lucide-react'
import HudCard from '../../components/common/HudCard'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'

// ═══════════════════════════════════════
// 📋 더미 데이터 (컴포넌트 밖에서 정의 → 리렌더링 방지)
// ═══════════════════════════════════════

// 최근 주문 데이터
const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$1,299.00', status: 'Completed', date: '2 min ago' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$899.00', status: 'Processing', date: '15 min ago' },
    { id: '#ORD-003', customer: 'Bob Johnson', amount: '$2,199.00', status: 'Pending', date: '1 hour ago' },
    { id: '#ORD-004', customer: 'Alice Brown', amount: '$599.00', status: 'Completed', date: '2 hours ago' },
    { id: '#ORD-005', customer: 'Charlie Wilson', amount: '$1,499.00', status: 'Shipped', date: '3 hours ago' },
]

// 인기 상품 데이터
const topProducts = [
    { name: 'Wireless Headphones', sales: 1234, revenue: '$123,400', growth: 12 },
    { name: 'Smart Watch Pro', sales: 987, revenue: '$98,700', growth: 8 },
    { name: 'Laptop Stand', sales: 756, revenue: '$37,800', growth: -3 },
    { name: 'USB-C Hub', sales: 654, revenue: '$32,700', growth: 15 },
    { name: 'Mechanical Keyboard', sales: 543, revenue: '$54,300', growth: 5 },
]

// 서버 상태 데이터
const serverStats = [
    { label: 'CPU Usage', value: 67, color: 'hud-accent-primary' },
    { label: 'Memory', value: 45, color: 'hud-accent-info' },
    { label: 'Storage', value: 78, color: 'hud-accent-warning' },
    { label: 'Network', value: 23, color: 'hud-accent-secondary' },
]

// ═══════════════════════════════════════
// 🎨 상태별 색상 맵핑 함수
//    switch 문으로 상태에 따른 색상 반환
// ═══════════════════════════════════════
const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed': return 'text-hud-accent-success bg-hud-accent-success/10'
        case 'Processing': return 'text-hud-accent-info bg-hud-accent-info/10'
        case 'Pending': return 'text-hud-accent-warning bg-hud-accent-warning/10'
        case 'Shipped': return 'text-hud-accent-primary bg-hud-accent-primary/10'
        default: return 'text-hud-text-muted bg-hud-bg-hover'
    }
}

const Dashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* ═══════════════════════════════════════
                페이지 헤더
                ═══════════════════════════════════════ */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Dashboard</h1>
                    <p className="text-hud-text-muted mt-1">Welcome back! Here's what's happening.</p>
                </div>
                <Button variant="primary" glow leftIcon={<Activity size={18} />}>
                    View Reports
                </Button>
            </div>

            {/* ═══════════════════════════════════════
                통계 카드 4개 — CSS Grid로 반응형 레이아웃
                grid-cols-1: 모바일 (1열)
                md:grid-cols-2: 태블릿 (2열)
                lg:grid-cols-4: 데스크톱 (4열)
                ═══════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="$54,239" change={12.5}
                    icon={<DollarSign size={24} />} variant="primary" />
                <StatCard title="Total Users" value="3,842" change={8.2}
                    icon={<Users size={24} />} variant="secondary" />
                <StatCard title="Total Orders" value="1,429" change={-2.4}
                    icon={<ShoppingCart size={24} />} variant="warning" />
                <StatCard title="Conversion Rate" value="3.24%" change={4.1}
                    icon={<TrendingUp size={24} />} variant="default" />
            </div>

            {/* ═══════════════════════════════════════
                차트 + 서버 상태 (2:1 비율)
                ═══════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ═══════════════════════════════════════
                    바 차트 — CSS만으로 구현
                    lg:col-span-2: 데스크톱에서 2칸 차지
                    ═══════════════════════════════════════ */}
                <HudCard
                    title="Revenue Overview"
                    subtitle="Monthly revenue for the year"
                    className="lg:col-span-2"
                    action={
                        <select className="bg-hud-bg-primary border border-hud-border-secondary rounded px-3 py-1.5 text-sm text-hud-text-secondary focus:outline-none focus:border-hud-accent-primary">
                            <option>Last 12 months</option>
                            <option>Last 6 months</option>
                        </select>
                    }
                >
                    {/* 차트 영역: flex + items-end로 하단 정렬 */}
                    <div className="h-64 flex items-end justify-between gap-2">
                        {/* 12개월 데이터 */}
                        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => {
                            const heights = [40,55,45,60,75,65,80,70,85,75,90,95]
                            return (
                                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                                    {/* 바: 동적 높이 (style으로 인라인 스타일 적용) */}
                                    <div
                                        className="w-full bg-gradient-to-t from-hud-accent-primary to-hud-accent-primary/50 rounded-t hover:from-hud-accent-primary hover:to-hud-accent-secondary transition-all duration-300 cursor-pointer"
                                        style={{ height: `${heights[i]}%` }}
                                    />
                                    <span className="text-xs text-hud-text-muted">{month}</span>
                                </div>
                            )
                        })}
                    </div>
                </HudCard>

                {/* ═══════════════════════════════════════
                    서버 상태 — 프로그레스 바
                    ═══════════════════════════════════════ */}
                <HudCard title="Server Status" subtitle="Real-time system metrics">
                    <div className="space-y-4">
                        {serverStats.map((stat) => (
                            <div key={stat.label}>
                                {/* 라벨 + 값 */}
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-hud-text-secondary">{stat.label}</span>
                                    <span className="text-hud-text-primary font-mono">{stat.value}%</span>
                                </div>
                                {/* 프로그레스 바 배경 */}
                                <div className="h-2 bg-hud-bg-primary rounded-full overflow-hidden">
                                    {/* 프로그레스 바 (동적 너비 + 색상) */}
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${stat.value}%`,
                                            background: stat.color === 'hud-accent-primary' ? '#00FFCC' :
                                                stat.color === 'hud-accent-info' ? '#6366F1' :
                                                stat.color === 'hud-accent-warning' ? '#FFA500' : '#FF1493'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-hud-border-secondary">
                        <div className="flex items-center gap-2 text-sm text-hud-text-muted">
                            <Clock size={14} />
                            <span>Last updated: Just now</span>
                        </div>
                    </div>
                </HudCard>
            </div>

            {/* ═══════════════════════════════════════
                테이블 2개 (1:1 비율)
                noPadding prop: 테이블이 카드 경계에 딱 맞음
                ═══════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 최근 주문 테이블 */}
                <HudCard
                    title="Recent Orders"
                    subtitle="Latest customer orders"
                    noPadding
                    action={<Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={14} />}>View All</Button>}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-hud-border-secondary">
                                    {['Order','Customer','Amount','Status'].map(h => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-hud-border-secondary last:border-0 hover:bg-hud-bg-hover transition-hud">
                                        <td className="px-5 py-3">
                                            <span className="text-sm font-mono text-hud-accent-primary">{order.id}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-sm text-hud-text-primary">{order.customer}</span>
                                            <p className="text-xs text-hud-text-muted">{order.date}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-sm font-mono text-hud-text-primary">{order.amount}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {/* 상태 배지 */}
                                            <span className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </HudCard>

                {/* Top Products 테이블 */}
                <HudCard
                    title="Top Products"
                    subtitle="Best selling items"
                    noPadding
                    action={<Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={14} />}>View All</Button>}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-hud-border-secondary">
                                    {['Product','Sales','Revenue','Growth'].map(h => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product) => (
                                    <tr key={product.name} className="border-b border-hud-border-secondary last:border-0 hover:bg-hud-bg-hover transition-hud">
                                        <td className="px-5 py-3">
                                            <span className="text-sm text-hud-text-primary">{product.name}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-sm font-mono text-hud-text-secondary">{product.sales.toLocaleString()}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-sm font-mono text-hud-text-primary">{product.revenue}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {/* 성장률 (양수: 초록, 음수: 빨강) */}
                                            <span className={`text-sm font-medium ${product.growth >= 0 ? 'text-hud-accent-success' : 'text-hud-accent-danger'}`}>
                                                {product.growth >= 0 ? '+' : ''}{product.growth}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </HudCard>
            </div>

            {/* ═══════════════════════════════════════
                활동 피드
                ═══════════════════════════════════════ */}
            <HudCard
                title="Recent Activity"
                subtitle="Latest actions across the platform"
                action={<div className="flex items-center gap-2"><Globe size={16} className="text-hud-accent-primary" /><span className="text-sm text-hud-text-secondary">Live</span></div>}
            >
                <div className="space-y-4">
                    {[
                        { action: 'New order received', detail: 'Order #ORD-006 from Sarah Connor - $2,499.00', time: '2 minutes ago', type: 'order' },
                        { action: 'User registered', detail: 'New user: michael.brown@email.com', time: '5 minutes ago', type: 'user' },
                        { action: 'Payment processed', detail: 'Payment of $1,299.00 received for Order #ORD-001', time: '10 minutes ago', type: 'payment' },
                        { action: 'Product stock low', detail: 'Wireless Headphones - Only 5 units remaining', time: '15 minutes ago', type: 'warning' },
                    ].map((activity, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-hud-bg-hover transition-hud">
                            {/* 타입별 색상 인디케이터 */}
                            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                activity.type === 'order' ? 'bg-hud-accent-primary' :
                                activity.type === 'user' ? 'bg-hud-accent-info' :
                                activity.type === 'payment' ? 'bg-hud-accent-success' : 'bg-hud-accent-warning'
                            }`} />
                            <div className="flex-1">
                                <p className="text-sm text-hud-text-primary">{activity.action}</p>
                                <p className="text-xs text-hud-text-muted mt-0.5">{activity.detail}</p>
                            </div>
                            <span className="text-xs text-hud-text-muted whitespace-nowrap">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </HudCard>
        </div>
    )
}

export default Dashboard
