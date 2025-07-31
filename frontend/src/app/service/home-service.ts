import { ApiErrorResponse, ModifyBalanceUser, User } from "@/definition";


/**
 * Calls the Spring Boot API to modify a user's balance.
 *
 * @param {ModifyBalanceUser} data - The object containing the user ID and the amount to modify.
 * @returns {Promise<number>} A promise that resolves with the updated balance on success.
 * @throws {Error} Throws an error if the API call fails or returns an error status.
 */
const envUrl = process.env.NEXT_PUBLIC_BACKEND_HOST

export async function getUserDetails(userId: number): Promise<User> {
    const url = `${envUrl}/users/${userId}`; // Adjust this URL to your Spring Boot server
    const response = await fetch(url, {
        method: 'GET', // Specify the HTTP method as POST
        headers: {
            'Content-Type': 'application/json', // Crucial header for JSON request bodies
        },
    });
    if (response.ok) {
        return await response.json();
    }
    throw new Error('Cannot retrieve user.');
}

export async function callModifyBalanceApi(data: ModifyBalanceUser): Promise<number> {
    // Define the API endpoint URL.
    // In a real Next.js app, you'd typically store this in environment variables (e.g., process.env.NEXT_PUBLIC_API_URL)
    // or use a relative path if your Next.js app is served from the same domain as the Spring Boot backend.
    const url = `${envUrl}/modify-balance`; // Adjust this URL to your Spring Boot server

    try {
        const response = await fetch(url, {
            method: 'POST', // Specify the HTTP method as POST
            headers: {
                'Content-Type': 'application/json', // Crucial header for JSON request bodies
            },
            // body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
            body: JSON.stringify({
                'id': 2,
                'amount': 3,
            }), // Convert the JavaScript object to a JSON string
        });

        // Check if the response was successful (status code 2xx)
        if (response.ok) {
            // Parse the JSON response body.
            // Assuming the API returns a raw Long (number in JS) as the updated balance,
            // you might need to adjust this if it's wrapped in an object.
            // Based on your Spring code `return new ResponseEntity<>(updatedBalance, HttpStatus.OK);`,
            // it should return the raw number.
            return await response.json();
        } else {
            // If the response was not OK (e.g., 400 Bad Request, 500 Internal Server Error)
            // Attempt to parse the error response body for more details.
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
