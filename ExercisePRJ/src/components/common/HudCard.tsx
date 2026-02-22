// ═══════════════════════════════════════
// 📦 HudCard — 만능 카드 컨테이너 컴포넌트
//    모든 페이지에서 사용하는 기본 카드
// ═══════════════════════════════════════

import { ReactNode } from 'react'

// ═══════════════════════════════════════
// 📝 Interface: Props 타입 정의
//    TypeScript로 컴포넌트가 받을 props의 타입을 지정
// ═══════════════════════════════════════
interface HudCardProps {
    children: ReactNode       // 카드 안에 들어갈 내용 (모든 렌더링 가능 요소)
    className?: string        // 추가 CSS 클래스 (선택적)
    title?: string            // 카드 제목 (선택적)
    subtitle?: string         // 카드 부제목 (선택적)
    action?: ReactNode        // 우측 상단 액션 영역 (버튼 등, 선택적)
    noPadding?: boolean       // 패딩 제거 (테이블 사용 시, 기본값: false)
}

// ═══════════════════════════════════════
// 🎯 HudCard 컴포넌트
//    { children }: 구조 분해 할당으로 props 추출
//    = '': 기본값 설정
// ═══════════════════════════════════════
const HudCard = ({
    children,
    className = '',
    title,
    subtitle,
    action,
    noPadding = false
}: HudCardProps) => {
    return (
        // hud-card + hud-card-bottom → CSS에서 4개 모서리 꺾쇠
        <div className={`hud-card hud-card-bottom rounded-lg ${className}`}>
            {/* ═══════════════════════════════════════
                헤더 영역: title 또는 action이 있을 때만 표시
                (title || action) && : 조건부 렌더링
                ═══════════════════════════════════════ */}
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-hud-border-secondary">
                    <div>
                        {/* title이 있을 때만 렌더링 */}
                        {title && (
                            <h3 className="font-semibold text-hud-text-primary">
                                {title}
                            </h3>
                        )}
                        {/* subtitle이 있을 때만 렌더링 */}
                        {subtitle && (
                            <p className="text-sm text-hud-text-muted mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {/* action이 있을 때만 렌더링 */}
                    {action && <div>{action}</div>}
                </div>
            )}

            {/* ═══════════════════════════════════════
                본문 영역
                noPadding이 true면 패딩 없음, false면 p-5 (패딩 있음)
                ═══════════════════════════════════════ */}
            <div className={noPadding ? '' : 'p-5'}>
                {children}
            </div>
        </div>
    )
}

export default HudCard
