if ('function' === typeof importScripts) {
    importScripts("https://js.pusher.com/beams/service-worker.js");
  }
  
  PusherPushNotifications.onNotificationReceived = ({
    pushEvent,
    payload,
    handleNotification,
  }) => {
    console.log("worker got : " + JSON.stringify(payload));
  
    // Get the client.
    self.clients.matchAll().then((matchedClient) => matchedClient.forEach(client => {
      client.postMessage(payload.data);
    }));
  
    pushEvent.waitUntil(handleNotification(payload));
  };
  