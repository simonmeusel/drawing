import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { WebSocketManager } from './api/WebSocketManager';
import { App } from './components/app/App';
import './index.scss';
import { createPersistentStore } from './store';
import { saveState } from './store/localStorage';
import { onRoomIDUpdate } from './store/roomID';

if (process.env.NODE_ENV === 'development') {
    if (navigator.serviceWorker) {
        navigator.serviceWorker
            .getRegistrations()
            .then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
    }
} else {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('' + '/sw.js');
    }
}

export const defaultDebounceDelay = 100;
const webSocketManager = new WebSocketManager(defaultDebounceDelay);
const store = createPersistentStore(webSocketManager);
webSocketManager.dispatch = store.dispatch;
webSocketManager.setRoomID(store.getState().roomID);

window.addEventListener('beforeunload', () => {
    saveState(store, false);
});

window.addEventListener('hashchange', () => {
    onRoomIDUpdate(store);
});

ReactDOM.render(
    <Provider store={store}>
        <App webSocketManager={webSocketManager} />
    </Provider>,
    document.getElementById('root')
);
