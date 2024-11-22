import { getConnecterUser, triggerNotConnected } from "../lib/session";
import beamsClient from '../config/pusherConfig'; // Assurez-vous que le chemin d'import est correct

export default async (request, response) => {
    try {
        const headers = new Headers(request.headers);
        const user = await getConnecterUser(request);
        if (user === undefined || user === null) {
            console.log("Not connected");
            triggerNotConnected(response);
            return;
        }

        const message = await request.body;

        // TODO : save message

        // Envoi de la notification push

        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
        });
        
        const targetUser = { externalId: message.receiverId }; // Remplacez ceci par la manière dont vous gérez les utilisateurs
        const publishResponse = await beamsClient.publishToUsers([targetUser.externalId], {
            web: {
                notification: {
                    title: user.username,
                    body: message.content,
                    icon: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
                    deep_link: "" /* lien permettant d'ouvrir directement la conversation concernée */,
                },
                data: {
                    /* additional data */
                }
            },
        });

        console.log("Notification push envoyée : ", publishResponse);

        response.send("OK");
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
