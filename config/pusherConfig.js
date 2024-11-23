const PushNotifications = require('@pusher/push-notifications-server');

const beamsClient = new PushNotifications({
    instanceId: "5a652d06-64a5-4114-9617-213505ab80a0",
    secretKey: "D384CFA4FDFE68D35AF7EC463999A055E29ED31A48F53A4FB418D357A97C722A",
    
});

module.exports = beamsClient;
