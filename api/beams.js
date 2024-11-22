import './App.css';
import AppRouter from './principal/AppRouter';
import { useEffect, useState } from 'react';
import { Client as PusherClient, TokenProvider } from '@pusher/push-notifications-web';

function App() {
  const [clientStarted, setClientStarted] = useState(false);
  const [deviceInterestAdded, setDeviceInterestAdded] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user_id = sessionStorage.getItem('externalId');
    if (!token || !user_id) return;

    const beamsClient = new PusherClient({
      instanceId: "5a652d06-64a5-4114-9617-213505ab80a0",
    });

    const beamsTokenProvider = new TokenProvider({
      url: '/api/beams',
      headers: {
        Authentication: "Bearer " + token,
      },
    });

    beamsClient.start()
      .then(() => {
        console.log('Beams client started');
        setClientStarted(true);
        return beamsClient.addDeviceInterest('global');
      })
      .then(() => {
        console.log('Device interest "global" added successfully.');
        setDeviceInterestAdded(true);
        return beamsClient.getDeviceId();
      })
      .then(deviceId => {
        console.log("Push id: " + deviceId);
      })
      .catch(err => {
        console.error('Error while adding device interest:', err);
        if (!clientStarted) {
          setTimeout(() => {
            beamsClient.start()
              .then(() => beamsClient.addDeviceInterest('global'))
              .catch(console.error);
          }, 1000);  // Retry after 1 second
        }
      });

    return () => {
      beamsClient.stop().catch(console.error);
    };
  }, []);

  return <AppRouter />;
}

export default App;
