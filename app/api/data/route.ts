import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { startScraper } from '@/lib/scraper';

export async function GET() {
    // Trigger scraper if not running (lazy start on first request or subsequent requests)
    // In a real serverless env, this might need a cron job, but for local "rebuild exact app", this works.
    startScraper();

    const state = store.state;

    // Filter for in-stock for the main list, matching python logic
    const inStockProducts = Object.fromEntries(
        Object.entries(state.current_products).filter(([_, p]) => p.in_stock)
    );

    return NextResponse.json({
        products: inStockProducts,
        monitored_products: state.monitored_products,
        alerts: state.alerts,
        last_updated: state.last_updated,
        is_scraping: state.is_scraping,
        total_count: Object.keys(inStockProducts).length
    });
}
