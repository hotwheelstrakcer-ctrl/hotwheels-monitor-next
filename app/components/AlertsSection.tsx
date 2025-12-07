'use client';

import { Alert } from '@/lib/store';

interface Props {
    alerts: Alert[];
}

export default function AlertsSection({ alerts }: Props) {
    return (
        <div className="alerts-section">
            {alerts.map((alert, i) => (
                <div key={`${alert.time}-${i}`} className={`alert-card ${alert.type === 'NEW' ? 'new' : 'stock'}`}>
                    <span className="alert-time">{alert.time}</span>
                    <strong>{alert.type === 'NEW' ? 'NEW' : 'BACK IN STOCK'}</strong><br />
                    {alert.message} <a href={alert.link} target="_blank" rel="noopener noreferrer" className="alert-link">View</a>
                </div>
            ))}
        </div>
    );
}
