import { Ticker } from "@/definition";

const envUrl = process.env.NEXT_PUBLIC_BACKEND_HOST


export async function getAllTickers(): Promise<Array<Ticker>> {
    const url = `${envUrl}/ticker/all`; // Adjust this URL to your Spring Boot server
    const response = await fetch(url, {
        method: 'GET', // Specify the HTTP method as POST
        headers: {
            'Content-Type': 'application/json', // Crucial header for JSON request bodies
        },
    });
    if (response.ok) {
        return await response.json();
    }
    throw new Error('Cannot retrieve ticker.');
}