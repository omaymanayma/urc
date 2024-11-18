import { db } from '@vercel/postgres';
import { kv } from "@vercel/kv";
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { username, email, password } = await request.json();

    console.log("Received data:", { username, email, password });

    // Verify all fields are filled
    if (!username || !email || !password) {
      const error = { code: "BAD_REQUEST", message: "Tous les champs doivent être renseignés" };
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Check if user already exists
    const client = await db.connect();
    const userExistsQuery = await client.sql`SELECT * FROM users WHERE username = ${username} OR email = ${email}`;
    console.log("User exists query result:", userExistsQuery.rows);

    if (userExistsQuery.rowCount > 0) {
      const error = { code: "DUPLICATE_USER", message: "Un utilisateur avec le même nom d'utilisateur ou la même adresse e-mail existe déjà" };
      return new Response(JSON.stringify(error), {
        status: 409,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Hash the password
    const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
    const hashed64 = arrayBufferToBase64(hash);

    // Generate an external_id
    const externalId = crypto.randomUUID().toString();

    // Insert new user into the database
    const newUserQuery = await client.sql`INSERT INTO users (username, email, password, created_on, external_id) VALUES (${username}, ${email}, ${hashed64}, now(), ${externalId}) RETURNING *`;
    console.log("New user inserted:", newUserQuery.rows);

    const newUser = newUserQuery.rows[0];

    return new Response(JSON.stringify(newUser), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new Response(JSON.stringify({ code: "INTERNAL_SERVER_ERROR", message: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
