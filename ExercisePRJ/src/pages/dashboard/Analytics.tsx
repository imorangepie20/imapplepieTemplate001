// ═══════════════════════════════════════
// 📈 Analytics — 분석 대시보드 페이지
//    트래픽 소스, 기기 사용량, 인기 페이지 등을 표시
// ═══════════════════════════════════════

import { Eye, Users, Clock, ArrowUpRight, TrendingUp } from 'lucide-react'
import HudCard from '../../components/common/HudCard'
import StatCard from '../../components/common/StatCard'

// ═══════════════════════════════════════
// 📋 더미 데이터
// ═══════════════════════════════════════

// 트래픽 소스 데이터
const trafficSources = [
    { source: 'Direct', visitors: 12453, percentage: 42, color: 'hud-accent-primary' },
    { source: 'Google', visitors: 8734, percentage: 29, color: 'hud-accent-info' },
    { source: 'Social Media', visitors: 5321, percentage: 18, color: 'hud-accent-secondary' },
    { source: 'Referral', visitors: 3521, percentage: 11, color: 'hud-accent-warning' },
]

// 기기 사용량 데이터
const deviceUsage = [
    { device: 'Desktop', users: 15432, percentage: 58, icon: '🖥️' },
    { device: 'Mobile', users: 9876, percentage: 37, icon: '📱' },
    { device: 'Tablet', users: 1321, percentage: 5, icon: '📟' },
]

// 인기 페이지 데이터
const topPages = [
    { page: '/dashboard', views: 12453, bounce: '32%', avgTime: '4:32' },
    { page: '/products', views: 8734, bounce: '45%', avgTime: '3:21' },
    { page: '/pricing', views: 6521, bounce: '28%', avgTime: '5:12' },
    { page: '/about', views: 4321, bounce: '52%', avgTime: '2:45' },
    { page: '/contact', views: 3210, bounce: '38%', avgTime: '1:58' },
]

// 방문자 추이 데이터 (7일)
const visitorTrend = [
    { day: 'Mon', visitors: 2341 },
    { day: 'Tue', visitors: 2890 },
    { day: 'Wed', visitors: 3156 },
    { day: 'Thu', visitors: 2789 },
    { day: 'Fri', visitors: 3421 },
    { day: 'Sat', visitors: 4123 },
    { day: 'Sun', visitors: 3876 },
]

const Analytics = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* ═══════════════════════════════════════
                페이지 헤더
                ═══════════════════════════════════════ */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Analytics</h1>
                    <p className="text-hud-text-muted mt-1">Track your website performance and user behavior.</p>
                </div>
            </div>

            {/* ═══════════════════════════════════════
                통계 카드 3개
                ═══════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Page Views"
                    value="45,231"
                    change={12.3}
                    icon={<Eye size={24} />}
                    variant="primary"
                />
                <StatCard
                    title="Unique Visitors"
                    value="12,847"
                    change={8.7}
                    icon={<Users size={24} />}
                    variant="secondary"
                />
                <StatCard
                    title="Avg. Session Duration"
                    value="4m 32s"
                    change={-2.1}
                    icon={<Clock size={24} />}
                    variant="warning"
                />
            </div>

            {/* ═══════════════════════════════════════
                방문자 추이 차트 (7일)
                ═══════════════════════════════════════ */}
            <HudCard title="Visitor Trend" subtitle="Last 7 days">
                <div className="h-64 flex items-end justify-between gap-4">
                    {visitorTrend.map((day) => {
                        const maxVisitors = Math.max(...visitorTrend.map(d => d.visitors))
                        const height = (day.visitors / maxVisitors) * 100
                        return (
                            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                {/* 방문자 수 툴팁 */}
                                <div className="text-xs text-hud-text-muted mb-1">
                                    {day.visitors.toLocaleString()}
                                </div>
                                {/* 바 */}
                                <div
                                    className="w-full bg-gradient-to-t from-hud-accent-info/20 to-hud-accent-info rounded-t hover:from-hud-accent-info hover:to-hud-accent-primary transition-all duration-300 cursor-pointer"
                                    style={{ height: `${height * 0.8}%` }}
                                />
                                <span className="text-xs text-hud-text-muted">{day.day}</span>
                            </div>
                        )
                    })}
                </div>
            </HudCard>

            {/* ═══════════════════════════════════════
                트래픽 소스 + 기기 사용량 (2개 카드)
                ═══════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 트래픽 소스 */}
                <HudCard title="Traffic Sources" subtitle="Where your visitors come from">
                    <div className="space-y-4">
                        {trafficSources.map((source) => (
                            <div key={source.source}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${
                                            source.color === 'hud-accent-primary' ? 'bg-hud-accent-primary' :
                                            source.color === 'hud-accent-info' ? 'bg-hud-accent-info' :
                                            source.color === 'hud-accent-secondary' ? 'bg-hud-accent-secondary' :
                                            'bg-hud-accent-warning'
                                        }`} />
                                        <span className="text-sm text-hud-text-primary">{source.source}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono text-hud-text-primary">{source.visitors.toLocaleString()}</span>
                                        <span className="text-xs text-hud-text-muted">{source.percentage}%</span>
                                    </div>
                                </div>
                                {/* 프로그레스 바 */}
                                <div className="h-2 bg-hud-bg-primary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${
                                            source.color === 'hud-accent-primary' ? 'bg-hud-accent-primary' :
                                            source.color === 'hud-accent-info' ? 'bg-hud-accent-info' :
                                            source.color === 'hud-accent-secondary' ? 'bg-hud-accent-secondary' :
                                            'bg-hud-accent-warning'
                                        }`}
                                        style={{ width: `${source.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </HudCard>

                {/* 기기 사용량 */}
                <HudCard title="Device Usage" subtitle="Visitors by device type">
                    <div className="space-y-4">
                        {deviceUsage.map((device) => (
                            <div key={device.device} className="flex items-center justify-between p-4 rounded-lg bg-hud-bg-primary">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{device.icon}</span>
                                    <div>
                                        <p className="text-sm font-medium text-hud-text-primary">{device.device}</p>
                                        <p className="text-xs text-hud-text-muted">{device.users.toLocaleString()} users</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-hud-accent-primary">{device.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </HudCard>
            </div>

            {/* ═══════════════════════════════════════
                인기 페이지 테이블
                ═══════════════════════════════════════ */}
            <HudCard
                title="Top Pages"
                subtitle="Most visited pages"
                action={<button className="text-hud-accent-primary text-sm hover:underline flex items-center gap-1">
                    View All <ArrowUpRight size={14} />
                </button>}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-hud-border-secondary">
                                {['Page', 'Views', 'Bounce Rate', 'Avg. Time'].map(h => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {topPages.map((page, i) => (
                                <tr key={page.page} className="border-b border-hud-border-secondary last:border-0 hover:bg-hud-bg-hover transition-hud">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                i === 0 ? 'bg-hud-accent-primary text-hud-bg-primary' :
                                                i === 1 ? 'bg-hud-accent-secondary text-hud-bg-primary' :
                                                i === 2 ? 'bg-hud-accent-info text-hud-bg-primary' :
                                                'bg-hud-bg-hover text-hud-text-muted'
                                            }`}>
                                                {i + 1}
                                            </span>
                                            <span className="text-sm text-hud-text-primary font-mono">{page.page}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="text-sm font-mono text-hud-text-primary">{page.views.toLocaleString()}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-sm font-medium ${
                                            parseFloat(page.bounce) < 35 ? 'text-hud-accent-success' :
                                            parseFloat(page.bounce) < 45 ? 'text-hud-accent-warning' :
                                            'text-hud-accent-danger'
                                        }`}>
                                            {page.bounce}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="text-sm text-hud-text-muted">{page.avgTime}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </HudCard>
        </div>
    )
}

export default Analytics
