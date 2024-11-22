import React, { useEffect } from 'react';
// Importing Client and TokenProvider explicitly, as they are named exports
import { Client, TokenProvider } from "@pusher/push-notifications-web";


console.log("Notifications component loaded");

const beamsClient = new Client({
    instanceId: '5a652d06-64a5-4114-9617-213505ab80a0',
});



const Notifications = ({ children }) => {
    useEffect(() => {
        const initializePushNotifications = async () => {
            const token = sessionStorage.getItem('token');
            const userExternalId = sessionStorage.getItem('externalId');
            console.log("ha external dyalo",userExternalId)
            if (!token || !userExternalId) {
                console.error('Token or External ID is missing!');
                return; // Sortir de la fonction si les données sont manquantes
            }

            const beamsTokenProvider = new TokenProvider({
                url: "/api/beams",
                headers: {
                    Authentication: "Bearer " + token,
                },
            });
            try {
                await beamsClient.start();
                console.log("hhhh")

                await beamsClient.addDeviceInterest('global'); 
                console.log("hhhha")

                console.log("ha lbeam token",beamsTokenProvider)
                console.log("hhhho")

                await beamsClient.setUserId(userExternalId, beamsTokenProvider);
                console.log("nihao")

                const deviceId = await beamsClient.getDeviceId();
            } catch (error) {
                console.error("Erreur d'initialisation des notifications push:", error);
            }
        };

        initializePushNotifications();
    }, []);

    return (
        <>
            {children}
        </>
    );
    
};

export default Notifications;