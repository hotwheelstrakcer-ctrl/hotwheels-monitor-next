import { Product } from './scraper';

export type AlertType = 'NEW' | 'STOCK';

export interface Alert {
    type: AlertType;
    message: string;
    link: string;
    time: string;
}

export interface ProductData {
    name: string;
    in_stock: boolean;
    link: string;
    image: string;
    alert_type?: AlertType;
    alert_time?: string;
}

export interface StoreState {
    current_products: Record<string, ProductData>;
    alerts: Alert[];
    monitored_products: ProductData[];
    last_updated: string;
    is_scraping: boolean;
}

// Initial state
const initialState: StoreState = {
    current_products: {},
    alerts: [],
    monitored_products: [],
    last_updated: "Never",
    is_scraping: false,
};

// Singleton store class
class Store {
    private static instance: Store;
    public state: StoreState;

    private constructor() {
        this.state = { ...initialState };
    }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    public update(newState: Partial<StoreState>) {
        this.state = { ...this.state, ...newState };
    }
}

export const store = Store.getInstance();
