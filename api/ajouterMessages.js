import { kv } from "@vercel/kv";
import PushNotifications from '@pusher/push-notifications-server';  // Add this import

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    // Parse request data
    const { senderId, receiverId, senderName, messageContent } = await request.json();

    // Store the message in the KV database
    const conversationKey = `conversations:${senderId}:${receiverId}`;
    const timestamp = new Date().toISOString();
    const newMessage = {
      senderId,
      receiverId,
      senderName,
      messageContent,
      timestamp,
    };

    await kv.lpush(conversationKey, newMessage);

    // Set up Pusher Beams Client
    const beamsClient = new PushNotifications({
      instanceId: process.env.PUSHER_INSTANCE_ID,  // Ensure these environment variables are configured
      secretKey: process.env.PUSHER_SECRET_KEY,
    });

    // Fetch the receiver's external ID (you might need to adapt this part based on your user management)
    const receiverExternalId = `user-${receiverId}`;  // Assuming this matches the external ID format in Beams

    // Send push notification
    const publishResponse = await beamsClient.publishToUsers([receiverExternalId], {
      web: {
        notification: {
          title: `${senderName} sent you a message`,
          body: messageContent,
          icon: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",  // Replace with your icon
          deep_link: `https://your-app.com/chat/${senderId}/${receiverId}`, // Link to the conversation
        },
        data: {
          senderId,
          receiverId,
        }
      },
    });

    console.log("Notification sent: ", publishResponse);

    // Send success response
    return new Response(JSON.stringify({ success: true, notification: publishResponse }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });

  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
