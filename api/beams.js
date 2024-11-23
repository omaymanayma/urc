import {getConnecterUser, triggerNotConnected} from "../lib/session.js";

import PushNotifications from "@pusher/push-notifications-server";


export default async (req, res) => {

    const userIDInQueryParam = req.query["user_id"];
    const user = await getConnecterUser(req);
    console.log("ha l user", user)
    console.log("check",user)
    console.log("PushToken : " + userIDInQueryParam + " -> " + JSON.stringify(user));
    if (user === undefined || user === null || userIDInQueryParam !== user.externalId) {
        console.log("Not connected");
        triggerNotConnected(res);
        return;
    }

    console.log("Using push instance : " + process.env.PUSHER_INSTANCE_ID);
    const beamsClient = new PushNotifications({
        instanceId: '5a652d06-64a5-4114-9617-213505ab80a0',
        secretKey: 'D384CFA4FDFE68D35AF7EC463999A055E29ED31A48F53A4FB418D357A97C722A',
    });
    const beamsToken = beamsClient.generateToken(user.externalId);
    console.log(JSON.stringify(beamsToken));
    res.send(beamsToken);
};