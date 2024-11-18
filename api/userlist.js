import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const client = await db.connect();
        
        // Query the database for user information
        const { rowCount, rows } = await client.query('SELECT user_id, username, last_login FROM users');
        
        // Handle case where no users are found
        if (rowCount === 0) {
            const error = { code: "NOT_FOUND", message: "Aucun utilisateur trouvé" };
            return new Response(JSON.stringify(error), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Format the response data
        const userList = rows.map(user => ({
            userId: user.user_id,
            username: user.username,
            last_login: user.last_login
        }));
        
        // Send the user list as a JSON response
        return new Response(JSON.stringify(userList), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Database query error:", error);
        // Return a 500 Internal Server Error response
        return new Response(JSON.stringify({ code: "INTERNAL_SERVER_ERROR", message: "Erreur interne du serveur" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
