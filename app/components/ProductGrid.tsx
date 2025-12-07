'use client';

import { ProductData } from '@/lib/store';

interface Props {
    products: Record<string, ProductData>;
}

export default function ProductGrid({ products }: Props) {
    return (
        <div className="product-grid">
            {Object.values(products).map((p, i) => (
                <div key={`${p.link}-${i}`} className="product-card">
                    {p.image ? (
                        <img src={p.image} alt={p.name} />
                    ) : (
                        <div style={{
                            height: '200px',
                            background: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '15px',
                            borderRadius: '4px'
                        }}>
                            No Image
                        </div>
                    )}
                    <div className="product-name" title={p.name}>{p.name}</div>
                </div>
            ))}
        </div>
    );
}
