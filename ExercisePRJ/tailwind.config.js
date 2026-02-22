/** @type {import('tailwindcss').Config} */
export default {
    // ═══════════════════════════════════════
    // 📁 content: Tailwind CSS가 적용될 파일 경로들
    // ═══════════════════════════════════════
    content: [
        "./index.html",           // HTML 파일
        "./src/**/*.{js,ts,jsx,tsx}",  // src 폴더 내 모든 js/ts/jsx/tsx 파일
    ],

    // ═══════════════════════════════════════
    // 🌙 darkMode: class 기반 다크모드 사용
    //    → <html class="dark"> 처럼 클래스로 제어
    // ═══════════════════════════════════════
    darkMode: 'class',

    theme: {
        extend: {
            // ═══════════════════════════════════════
            // 🎨 색상 팔레트 — HUD(Heads-Up Display) 테마
            //    배경, 강조색, 텍스트, 테두리 색상 정의
            // ═══════════════════════════════════════
            colors: {
                hud: {
                    bg: {
                        primary: '#0E1726',                   // 메인 배경 (가장 어두운 남색)
                        secondary: '#141B2D',                 // 사이드바, 카드 배경
                        card: 'rgba(20, 27, 45, 0.8)',        // 카드 (반투명)
                        hover: 'rgba(30, 40, 60, 0.9)',       // 호버 상태
                    },
                    accent: {
                        primary: '#00FFCC',     // ✨ 민트 — 메인 강조색
                        secondary: '#FF1493',   // 💖 핑크 — 보조 강조색
                        warning: '#FFA500',     // 🟠 오렌지 — 경고
                        info: '#6366F1',        // 🟣 인디고 — 정보
                        success: '#10B981',     // 🟢 그린 — 성공
                        danger: '#EF4444',      // 🔴 레드 — 위험/에러
                    },
                    text: {
                        primary: '#FFFFFF',     // 본문 텍스트 (흰색)
                        secondary: '#A0AEC0',   // 보조 텍스트 (회색)
                        muted: '#64748B',       // 비활성 텍스트 (어두운 회색)
                    },
                    border: {
                        primary: 'rgba(0, 255, 204, 0.3)',    // 강조 테두리 (민트색)
                        secondary: 'rgba(255, 255, 255, 0.1)', // 일반 테두리 (흰색)
                    }
                }
            },

            // ═══════════════════════════════════════
            // 🔤 폰트 패밀리
            //    Inter: 본문용, JetBrains Mono: 숫자/코드용
            // ═══════════════════════════════════════
            fontFamily: {
                sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },

            // ═══════════════════════════════════════
            // ✨ 그림자 효과 (글로우 효과)
            //    box-shadow로 빛나는 효과 구현
            // ═══════════════════════════════════════
            boxShadow: {
                'hud': '0 0 20px rgba(0, 255, 204, 0.1)',
                'hud-glow': '0 0 30px rgba(0, 255, 204, 0.3)',
                'hud-pink': '0 0 20px rgba(255, 20, 147, 0.3)',
            },

            // ═══════════════════════════════════════
            // 🎬 애니메이션 정의
            //    keyframes: 애니메이션의 각 프레임 정의
            //    animation: 정의한 keyframes 사용
            // ═══════════════════════════════════════
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 204, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 255, 204, 0.4)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
