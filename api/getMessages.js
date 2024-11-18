import { kv } from "@vercel/kv";

export const config = {
  runtime: 'edge',
};
export default async function handler(request) {

try {

   const {senderId, receiverId} = await request.json();
 

   const conversationKey = `conversations:${senderId}:${receiverId}`;
  

  const messages = await kv.lrange(conversationKey, 0, -1);

  return new Response(JSON.stringify(messages), {
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