import {getConnecterUser, triggerNotConnected} from "../lib/session.js";
import PushNotifications from "@pusher/push-notifications-server"


export default async (req, res) => {

   const userIDInQueryParam = req.query["user_id"];
    const user = await getConnecterUser(req);
    console.log("PushToken : " + userIDInQueryParam + " -> " + JSON.stringify(user) + "external user id : " + user.externalId);
    if (user === undefined || user === null || userIDInQueryParam !== user.externalId) {
        console.log("Not connected");
        triggerNotConnected(res);
        return;
    }

    console.log("Using push instance : " + "d5a652d06-64a5-4114-9617-213505ab80a0");
    const beamsClient = new PushNotifications({
        instanceId: "5a652d06-64a5-4114-9617-213505ab80a0",
        secretKey: "011FE802D12636A89CD615C3B68C0E8C524F592E1420DB909FB8F68E670A4CC2",
        
    });

    const beamsToken = beamsClient.generateToken(user.externalId);

    console.log(JSON.stringify(beamsToken));
    res.send(beamsToken);

}






