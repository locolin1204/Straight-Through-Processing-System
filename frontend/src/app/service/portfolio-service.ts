import { News, TradeRecord } from "@/definition";

const envUrl = process.env.NEXT_PUBLIC_BACKEND_HOST

export async function getCurrentHoldings(userId: number): Promise<Array<TradeRecord>> {
    const url = `${envUrl}/trade-record/holdings/${userId}`;
    const response = await fetch(url, {
        method: 'GET', // Specify the HTTP method as POST
        headers: {
            'Content-Type': 'application/json', // Crucial header for JSON request bodies
        },
    });
    if (response.ok) {
        return await response.json();
    }
    throw new Error('Cannot retrieve news data.');
}

export async function getTradeHistory(userId: number): Promise<Array<TradeRecord>> {
    const url = `${envUrl}/trade-record/all/${userId}`;
    const response = await fetch(url, {
        method: 'GET', // Specify the HTTP method as POST
        headers: {
            'Content-Type': 'application/json', // Crucial header for JSON request bodies
        },
    });
    if (response.ok) {
        return await response.json();
    }
    throw new Error('Cannot retrieve news data.');
}