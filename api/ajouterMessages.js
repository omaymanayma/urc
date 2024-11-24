import { kv } from "@vercel/kv";
import { db } from "@vercel/postgres";
import beamsClient from "../config/pusherConfig.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { senderId, receiverId, senderName, messageContent,receiverType } = req.body;

    // Vérification de la présence de toutes les informations nécessaires
    if (!senderId || !receiverId || !senderName || !messageContent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const conversationKey = `conversations:${senderId}:${receiverId}`;
    const timestamp = new Date().toISOString();

    const newMessage = {
      senderId: senderId,
      receiverId: receiverId,
      senderName: senderName,
      messageContent: messageContent,
      timestamp: timestamp,
      receiverType:receiverType,
    };

    // Ajouter le nouveau message à la conversation dans Vercel KV
    await kv.lpush(conversationKey, newMessage);

    // Récupérer l'external_id du destinataire dans la base de données
    const client = await db.connect();
    const query = `SELECT external_id FROM users WHERE user_id=$1`;
    const { rows } = await client.query(query, [receiverId]);
    client.release();

    if (!rows.length) {
      console.error("Receiver not found for receiverId:", receiverId);
      return res.status(404).json({ error: "Receiver not found" });
    }

    const { external_id: externalId } = rows[0];
    console.log("External ID of receiver:", externalId);

    // Vérification si l'ID externe est valide
    if (!externalId) {
      console.error("Invalid externalId for receiverId:", receiverId);
      return res.status(400).json({ error: "Invalid externalId" });
    }

    // Envoyer une notification au destinataire
    await sendNotification(
      [externalId],
      `You got a new message from ${senderName}`,
      messageContent
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function sendNotification(userIds, title, message) {
  try {
    if (!userIds || userIds.length === 0) {
      console.error("Invalid userIds:", userIds);
      return;
    }

    // Envoi de la notification via Pusher Beams
    const response = await beamsClient.publishToUsers(userIds, {
      web: {
        notification: {
          title: title,
          body: message,
          deep_link: 'http://localhost:3001/messages', // Lien vers les messages
        },
      },
    });

 

    console.log("Notification envoyée avec succès:", response);
    return response;
  } catch (error) {
    console.error("Erreur d'envoi de notification:", error);
    return { error: error.message };  // Retourner l'erreur dans la réponse
  }
}
