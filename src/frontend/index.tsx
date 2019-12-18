import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { App } from './components/app/App';
import './index.scss';
import { reducer } from './store';
import { saveState } from './store/localStorage';
import { onRoomIDUpdate } from './store/roomID';

if (process.env.NODE_ENV === 'development') {
    if (navigator.serviceWorker) {
        navigator.serviceWorker
            .getRegistrations()
            .then(function(registrations) {
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

const store = createStore(reducer);

window.addEventListener('beforeunload', () => {
    saveState(store, false);
});

window.addEventListener('hashchange', () => {
    onRoomIDUpdate(store);
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
