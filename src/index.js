import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { Client as PusherPushNotifications } from '@pusher/push-notifications-web'; // Importation correcte

const beamsClient = new PusherPushNotifications({
  instanceId: '5a652d06-64a5-4114-9617-213505ab80a0', // Remplacez par votre instance ID
});

const initPusherBeams = () => {
  beamsClient.start()
    .then(() => beamsClient.addDeviceInterest('global'))
    .then(() => console.log('Successfully registered and subscribed!'))
    .catch(console.error);
};

initPusherBeams();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error);
    });

  navigator.serviceWorker.ready.then(registration => {
    registration.pushManager.getSubscription().then(subscription => {
      if (subscription) {
        return subscription;
      }
      return registration.pushManager.subscribe({ userVisibleOnly: true });
    });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
