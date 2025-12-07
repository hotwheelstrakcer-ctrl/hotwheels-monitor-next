'use client';

import { useState, useEffect } from 'react';
import StatsBar from './components/StatsBar';
import MonitorSection from './components/MonitorSection';
import AlertsSection from './components/AlertsSection';
import ProductGrid from './components/ProductGrid';
import { ProductData, Alert } from '@/lib/store';

export default function Home() {
  const [data, setData] = useState<{
    products: Record<string, ProductData>;
    alerts: Alert[];
    monitored_products: ProductData[];
    last_updated: string;
    is_scraping: boolean;
    total_count: number;
  }>({
    products: {},
    alerts: [],
    monitored_products: [],
    last_updated: 'Waiting...',
    is_scraping: false,
    total_count: 0
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioCtx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        setAudioCtx(new AC());
      }
    }
  }, [audioCtx]);

  // Sound Logic
  const playBell = () => {
    if (!soundEnabled || !audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const fundamental = 523.25;
    const ratios = [1, 2, 3, 4.2, 5.4];
    const gains = [0.1, 0.05, 0.03, 0.02, 0.01];
    const durations = [1.5, 1.2, 1.0, 0.8, 0.6];

    ratios.forEach((ratio, i) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = fundamental * ratio;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gains[i], now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durations[i]);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(now);
      oscillator.stop(now + durations[i]);
    });
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled && audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
      // Test beep
      setTimeout(() => playBell(), 100);
    }
  };

  // Polling Logic
  useEffect(() => {
    let seenAlerts = new Set<string>();
    let firstLoad = true;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();

        setData(json);

        // Check for new alerts to play sound
        let hasNewAlert = false;
        json.alerts.forEach((alert: Alert) => {
          const alertId = alert.time + alert.message;
          if (!seenAlerts.has(alertId)) {
            seenAlerts.add(alertId);
            if (!firstLoad) {
              hasNewAlert = true;
            }
          }
        });

        if (hasNewAlert) {
          playBell();
        }

        firstLoad = false;
      } catch (e) {
        console.error("Error fetching data", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [soundEnabled, audioCtx]); // Depend on soundEnabled to capture latest in closure if needed, though simple logic works

  return (
    <div className="container">
      <h1>In-Stock Monitor <span id="loading" className="loading-indicator" style={{ display: data.is_scraping ? 'inline-block' : 'none' }}></span></h1>

      <StatsBar
        totalCount={data.total_count}
        lastUpdated={data.last_updated}
        isScraping={data.is_scraping}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {data.monitored_products && data.monitored_products.length > 0 && (
        <MonitorSection products={data.monitored_products} />
      )}

      <AlertsSection alerts={data.alerts} />

      <ProductGrid products={data.products} />
    </div>
  );
}
