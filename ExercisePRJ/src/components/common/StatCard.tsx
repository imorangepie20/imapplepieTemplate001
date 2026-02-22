// ═══════════════════════════════════════
// 📊 StatCard — 통계 카드 컴포넌트
//    Dashboard 상단에 표시되는 핵심 수치 카드
// ═══════════════════════════════════════

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

// ═══════════════════════════════════════
// 📝 Interface: Props 타입 정의
// ═══════════════════════════════════════
interface StatCardProps {
    title: string
    value: string | number         // ⭐ Union 타입: 문자와 숫자 모두 허용
    change?: number                // 선택적: 변동률
    changeLabel?: string           // 선택적: 변동률 라벨
    icon?: ReactNode               // 선택적: 아이콘
    variant?: 'default' | 'primary' | 'secondary' | 'warning' | 'danger'
}

// ═══════════════════════════════════════
// 🎯 StatCard 컴포넌트
// ═══════════════════════════════════════
const StatCard = ({
    title,
    value,
    change,
    changeLabel = 'vs last month',   // 기본값 설정
    icon,
    variant = 'default',             // 기본값: default
}: StatCardProps) => {
    // 변동률이 양수인지 음수인지 판단
    const isPositive = change !== undefined && change >= 0

    // ═══════════════════════════════════════
    // 🎨 variant별 그라데이션 스타일
    // ═══════════════════════════════════════
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
                {/* 왼쪽: 제목 + 값 + 변동률 */}
                <div className="flex-1">
                    <p className="text-sm text-hud-text-muted uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-bold text-hud-text-primary mt-2 font-mono">{value}</p>

                    {/* ═══════════════════════════════════════
                        변동률 표시
                        change가 존재할 때만 렌더링 (Truthiness 좁히기)
                        ═══════════════════════════════════════ */}
                    {change !== undefined && (
                        <div className="flex items-center gap-1.5 mt-3">
                            {/* 양수면 TrendingUp, 음수면 TrendingDown */}
                            {isPositive ? (
                                <TrendingUp size={16} className="text-hud-accent-success" />
                            ) : (
                                <TrendingDown size={16} className="text-hud-accent-danger" />
                            )}
                            {/* 변동률 퍼센트 표시 (양수면 + 표시) */}
                            <span className={`text-sm font-medium ${isPositive ? 'text-hud-accent-success' : 'text-hud-accent-danger'}`}>
                                {isPositive ? '+' : ''}{change}%
                            </span>
                            <span className="text-xs text-hud-text-muted">{changeLabel}</span>
                        </div>
                    )}
                </div>

                {/* 오른쪽: 아이콘 (있을 때만) */}
                {icon && (
                    <div className={`p-3 rounded-lg bg-hud-bg-primary/50 ${iconColors[variant]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatCard
