'use client';

import { ProductData } from '@/lib/store';

interface Props {
    products: ProductData[];
}

export default function MonitorSection({ products }: Props) {
    if (products.length === 0) return null;

    return (
        <div className="monitor-section">
            <div className="monitor-header">
                <div className="monitor-title">Live Monitor (New & Back in Stock)</div>
            </div>
            <div className="monitor-grid">
                {products.map((p, i) => (
                    <div key={`${p.link}-${i}`} className="monitor-card">
                        <span className={`monitor-badge ${p.alert_type === 'NEW' ? 'new' : 'stock'}`}>
                            {p.alert_type === 'NEW' ? 'NEW' : 'BACK'}
                        </span>
                        {p.image ? (
                            <img src={p.image} alt={p.name} />
                        ) : (
                            <div style={{
                                height: '150px',
                                background: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '10px',
                                borderRadius: '4px'
                            }}>
                                No Image
                            </div>
                        )}
                        <div className="product-name" style={{ fontSize: '0.85em', marginBottom: '10px' }} title={p.name}>
                            {p.name}
                        </div>
                        <div style={{ fontSize: '0.75em', color: '#757575', marginBottom: '8px' }}>
                            {p.alert_time}
                        </div>
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="product-link">
                            BUY NOW
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
