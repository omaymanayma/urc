import './App.css';
import AppRouter from './principal/AppRouter.tsx';
import Notifications from './principal/Notifications.js'
import { useEffect } from 'react';
import { Client as PusherClient, TokenProvider } from '@pusher/push-notifications-web';

function App() {
  window.Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log("Notifications autorisées");
    } else {
      console.log("Notifications non autorisées");
    }
  });

  return (
    <Notifications>
      <AppRouter /> 
    </Notifications>
  );
}

export default App;
