const PushNotifications = require('@pusher/push-notifications-server');

const beamsClient = new PushNotifications({
    instanceId: "5a652d06-64a5-4114-9617-213505ab80a0",
    secretKey: "011FE802D12636A89CD615C3B68C0E8C524F592E1420DB909FB8F68E670A4CC2",
    
});

module.exports = beamsClient;
