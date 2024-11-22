import './App.css';
import AppRouter from './principal/AppRouter';
import { useEffect, useState } from 'react';
import { Client as PusherClient, TokenProvider } from '@pusher/push-notifications-web';

function App() {
  const [clientStarted, setClientStarted] = useState(false);  // Track if the client has started
  const [deviceInterestAdded, setDeviceInterestAdded] = useState(false);  // Track if device interest is added

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user_id = sessionStorage.getItem('externalId');
    if (!token || !user_id) return;  // If no token or user_id, exit early

    const beamsClient = new PusherClient({
      instanceId: "5a652d06-64a5-4114-9617-213505ab80a0",  // Beams Instance ID
    });

    const beamsTokenProvider = new TokenProvider({
      url: '/api/beams',  // URL where you get the token
      headers: {
        Authentication: "Bearer " + token,  // Bearer token for authentication
      },
    });

    // Start the Beams client
    beamsClient.start()
      .then(() => {
        console.log('Beams client started');
        setClientStarted(true);  // Client has started successfully
        
        // Once the client has started, add the device interest
        return beamsClient.addDeviceInterest('global');
      })
      .then(() => {
        console.log('Device interest "global" added successfully.');
        setDeviceInterestAdded(true);  // Device interest added successfully
        // Log the device ID after adding the interest
        return beamsClient.getDeviceId();
      })
      .then(deviceId => {
        console.log("Push id: " + deviceId);
      })
      .catch(err => {
        console.error('Error while adding device interest:', err);
        if (!clientStarted) {
          console.log('Retrying to add device interest after client start...');
          // Optionally, retry after a delay or handle the failure here
        }
      });

    // Clean up when the component is unmounted
    return () => {
      beamsClient.stop().catch(console.error);
    };
  }, []);  // Empty dependency array to ensure this effect runs only once

  return (
    <AppRouter />
  );
}

export default App;
