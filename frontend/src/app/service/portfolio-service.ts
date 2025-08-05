import { ApiErrorResponse, CurrentHolding, News, SellTradeRequest, TradeRecord, TradeRecordBody } from "@/definition";

const envUrl = process.env.NEXT_PUBLIC_BACKEND_HOST

export async function getCurrentHoldings(userId: number): Promise<Array<CurrentHolding>> {
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


export async function sellTrade(sellTradeRequest: SellTradeRequest): Promise<Array<TradeRecord>> {
    // Define the API endpoint URL.
    // In a real Next.js app, you'd typically store this in environment variables (e.g., process.env.NEXT_PUBLIC_API_URL)
    // or use a relative path if your Next.js app is served from the same domain as the Spring Boot backend.
    const url = `${envUrl}/trade-record/sell`; // Adjust this URL to your Spring Boot server

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sellTradeRequest),
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData: ApiErrorResponse = await response.json();
            const errorMessage = errorData.message || errorData.error || 'Unknown API error';
            console.error('API Error Response:', errorData); // Log the full error for debugging
            throw new Error(`Failed to update balance: ${errorMessage} (Status: ${response.status})`);
        }
    } catch (error) {
        // Catch network errors or errors thrown during parsing
        if (error instanceof Error) {
            console.error('Network or unexpected error:', error.message);
            throw new Error(`Network error or API call failed: ${error.message}`);
        } else {
            console.error('An unknown error occurred during API call:', error);
            throw new Error('An unknown error occurred during API call.');
        }
    }
}