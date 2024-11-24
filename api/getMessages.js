import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};
export default async function handler(request) {

try {

  // Exemple pour récupérer et filtrer les messages en fonction de receiverType
const { senderId, receiverId, receiverType } = await request.json(); // Assurez-vous que receiverType est passé dans la requête

const conversationKey = `conversations:${senderId}:${receiverId}`;
const messages = await kv.lrange(conversationKey, 0, -1);

// Filtrage des messages en fonction de receiverType
let filteredMessages = messages;

if (receiverType) {
  filteredMessages = messages.filter((message) => message.receiverType === receiverType);
}

return new Response(JSON.stringify(filteredMessages), {
  status: 200,
  headers: { 'content-type': 'application/json' },
});

} catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), {
        status: 500,
        headers: {'content-type': 'application/json'},
    });
  
}
}