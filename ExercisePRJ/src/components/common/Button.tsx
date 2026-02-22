// ═══════════════════════════════════════
// 🔘 Button — 다양한 변형을 가진 버튼 컴포넌트
//    5가지 variant × 3가지 size = 15가지 조합
// ═══════════════════════════════════════

import { ReactNode, ButtonHTMLAttributes } from 'react'

// ═══════════════════════════════════════
// 📝 Interface: Button Props
//    extends: HTML <button>의 모든 속성을 상속
//    → onClick, disabled, type 등 기본 속성들 자동 사용 가능
// ═══════════════════════════════════════
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    glow?: boolean
    fullWidth?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

// ═══════════════════════════════════════
// 🎯 Button 컴포넌트
//    ...props: 나머지 HTML 속성들을 받아서 button에 전달 (spread)
// ═══════════════════════════════════════
const Button = ({
    children,
    variant = 'primary',    // 기본값: primary
    size = 'md',            // 기본값: md
    glow = false,           // 기본값: false
    fullWidth = false,      // 기본값: false
    leftIcon,
    rightIcon,
    className = '',
    ...props                // onClick, disabled, type 등 남은 속성들
}: ButtonProps) => {
    // 기본 스타일 (모든 버튼 공통)
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-hud disabled:opacity-50 disabled:cursor-not-allowed'

    // ═══════════════════════════════════════
    // 🎨 Variant별 스타일
        //    객체 맵핑 패턴: variants[variant]로 해당 스타일 가져오기
    //    if/else 문 없이 깔끔하게 스타일 선택
    // ═══════════════════════════════════════
    const variants = {
        primary: 'bg-hud-accent-primary text-hud-bg-primary hover:bg-hud-accent-primary/90',
        secondary: 'bg-hud-accent-info text-white hover:bg-hud-accent-info/90',
        outline: 'border border-hud-accent-primary text-hud-accent-primary hover:bg-hud-accent-primary/10',
        ghost: 'text-hud-text-secondary hover:bg-hud-bg-hover hover:text-hud-text-primary',
        danger: 'bg-hud-accent-danger text-white hover:bg-hud-accent-danger/90',
    }

    // ═══════════════════════════════════════
    // 📏 Size별 스타일
    // ═══════════════════════════════════════
    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2',
    }

    return (
        <button
            className={`
                ${baseStyles}
                ${variants[variant]}    /* variants 객체에서 variant에 맞는 스타일 선택 */
                ${sizes[size]}          /* sizes 객체에서 size에 맞는 스타일 선택 */
                ${glow ? 'btn-glow' : ''}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}    // spread로 HTML 속성 전달 (onClick, disabled 등)
        >
            {/* leftIcon이 있으면 렌더링 */}
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {/* rightIcon이 있으면 렌더링 */}
            {rightIcon && <span>{rightIcon}</span>}
        </button>
    )
}

export default Button
