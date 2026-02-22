// ═══════════════════════════════════════
// 🛍️ Products — 상품 관리 페이지
//    검색, 카테고리 필터, Grid/List 뷰 전환
// ═══════════════════════════════════════

import { useState } from 'react'
import { Search, Grid, List, Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import Button from '../components/common/Button'

// ═══════════════════════════════════════
// 📋 더미 상품 데이터
//    ⭐ oldPrice가 null인 상품 주의!
// ═══════════════════════════════════════
const products = [
    { id: 1, name: 'MacBook Pro 16"', category: 'Electronics', price: 2499, oldPrice: 2799, rating: 4.8, reviews: 256, stock: 45, image: '💻' },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Electronics', price: 1199, oldPrice: null, rating: 4.9, reviews: 512, stock: 120, image: '📱' },
    { id: 3, name: 'AirPods Pro 2', category: 'Accessories', price: 249, oldPrice: 279, rating: 4.7, reviews: 1024, stock: 200, image: '🎧' },
    { id: 4, name: 'Apple Watch Ultra', category: 'Wearables', price: 799, oldPrice: null, rating: 4.6, reviews: 89, stock: 30, image: '⌚' },
    { id: 5, name: 'iPad Pro 12.9"', category: 'Electronics', price: 1099, oldPrice: 1199, rating: 4.8, reviews: 342, stock: 60, image: '📱' },
    { id: 6, name: 'Magic Keyboard', category: 'Accessories', price: 299, oldPrice: null, rating: 4.5, reviews: 178, stock: 75, image: '⌨️' },
    { id: 7, name: 'Studio Display', category: 'Electronics', price: 1599, oldPrice: 1799, rating: 4.4, reviews: 67, stock: 15, image: '🖥️' },
    { id: 8, name: 'AirTag 4-Pack', category: 'Accessories', price: 99, oldPrice: null, rating: 4.3, reviews: 890, stock: 500, image: '📍' },
]

const categories = ['All', 'Electronics', 'Accessories', 'Wearables']

const Products = () => {
    // ═══════════════════════════════════════
    // 🔄 상태 관리 (3개)
    // ═══════════════════════════════════════
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    // ⭐ Literal Union 제네릭 — 'grid' 또는 'list'만 허용
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // ═══════════════════════════════════════
    // 🔍 다중 조건 필터링
    //    검색어 AND 카테고리 조건 모두 만족
    // ═══════════════════════════════════════
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ═══════════════════════════════════════
                페이지 헤더
                ═══════════════════════════════════════ */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Products</h1>
                    <p className="text-hud-text-muted mt-1">Manage your product catalog.</p>
                </div>
                <Button variant="primary" glow>Add Product</Button>
            </div>

            {/* ═══════════════════════════════════════
                필터 바: 카테고리 탭 + 검색 + 뷰 전환
                ═══════════════════════════════════════ */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* 카테고리 필터 탭 */}
                <div className="flex items-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm transition-hud ${
                                selectedCategory === cat
                                    ? 'bg-hud-accent-primary text-hud-bg-primary'
                                    : 'bg-hud-bg-secondary text-hud-text-secondary hover:text-hud-text-primary'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {/* 검색 입력框 */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-hud-text-muted" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-64 pl-9 pr-4 py-2 bg-hud-bg-secondary border border-hud-border-secondary rounded-lg text-sm text-hud-text-primary placeholder-hud-text-muted focus:outline-none focus:border-hud-accent-primary transition-hud"
                        />
                    </div>

                    {/* ⭐ Grid/List 뷰 전환 토글 */}
                    <div className="flex items-center border border-hud-border-secondary rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-hud-accent-primary text-hud-bg-primary' : 'text-hud-text-muted hover:text-hud-text-primary'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-hud-accent-primary text-hud-bg-primary' : 'text-hud-text-muted hover:text-hud-text-primary'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════
                ⭐ 뷰 모드에 따라 완전히 다른 레이아웃 렌더링
                ═══════════════════════════════════════ */}
            {viewMode === 'grid' ? (
                // ═══════════════════════════════════════
                // GRID 뷰 — 카드 형태
                // ═══════════════════════════════════════
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="hud-card hud-card-bottom rounded-lg overflow-hidden group">
                            {/* 이미지 영역 */}
                            <div className="relative h-48 bg-gradient-to-br from-hud-accent-primary/10 to-hud-accent-info/10 flex items-center justify-center">
                                <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>

                                {/* ⭐ oldPrice가 존재할 때만 Sale 뱃지 표시 */}
                                {product.oldPrice && (
                                    <span className="absolute top-3 left-3 px-2 py-1 bg-hud-accent-danger text-white text-xs rounded">
                                        Sale
                                    </span>
                                )}

                                {/* 호버 시 나타나는 액션 버튼 */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-hud-bg-secondary/80 backdrop-blur rounded-lg text-hud-text-muted hover:text-hud-accent-danger transition-hud">
                                        <Heart size={16} />
                                    </button>
                                    <button className="p-2 bg-hud-bg-secondary/80 backdrop-blur rounded-lg text-hud-text-muted hover:text-hud-accent-primary transition-hud">
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* 상품 정보 */}
                            <div className="p-4">
                                <p className="text-xs text-hud-accent-primary mb-1">{product.category}</p>
                                <h3 className="font-medium text-hud-text-primary">{product.name}</h3>

                                {/* 평점 */}
                                <div className="flex items-center gap-2 mt-2">
                                    <Star size={14} className="text-hud-accent-warning fill-current" />
                                    <span className="text-sm text-hud-text-primary">{product.rating}</span>
                                    <span className="text-xs text-hud-text-muted">({product.reviews} reviews)</span>
                                </div>

                                {/* 가격 */}
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-lg font-bold text-hud-accent-primary font-mono">${product.price}</span>
                                    {/* oldPrice가 있을 때만 취소선 가격 표시 */}
                                    {product.oldPrice && (
                                        <span className="text-sm text-hud-text-muted line-through">${product.oldPrice}</span>
                                    )}
                                </div>

                                {/* 장바구니 버튼 */}
                                <div className="flex items-center gap-2 mt-4">
                                    <Button variant="primary" size="sm" fullWidth leftIcon={<ShoppingCart size={14} />}>
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // ═══════════════════════════════════════
                // LIST 뷰 — 리스트 형태
                //    같은 데이터 → 다른 레이아웃
                // ═══════════════════════════════════════
                <div className="space-y-4">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="hud-card hud-card-bottom rounded-lg p-4 flex items-center gap-4">
                            {/* 이미지 */}
                            <div className="w-20 h-20 bg-gradient-to-br from-hud-accent-primary/10 to-hud-accent-info/10 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-3xl">{product.image}</span>
                            </div>

                            {/* 상품 정보 */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-hud-accent-primary">{product.category}</p>
                                <h3 className="font-medium text-hud-text-primary">{product.name}</h3>

                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="text-hud-accent-warning fill-current" />
                                        <span className="text-xs text-hud-text-primary">{product.rating}</span>
                                    </div>
                                    {/* 재고량에 따른 색상 */}
                                    <span className={`text-xs ${product.stock > 50 ? 'text-hud-accent-success' : 'text-hud-accent-warning'}`}>
                                        {product.stock} in stock
                                    </span>
                                </div>
                            </div>

                            {/* 가격 */}
                            <div className="text-right">
                                <span className="text-lg font-bold text-hud-accent-primary font-mono">${product.price}</span>
                                {product.oldPrice && (
                                    <span className="text-sm text-hud-text-muted line-through ml-2">${product.oldPrice}</span>
                                )}
                            </div>

                            {/* 버튼 */}
                            <Button variant="primary" size="sm" leftIcon={<ShoppingCart size={14} />}>
                                Add
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Products
