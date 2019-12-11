import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Canvas } from './components/canvas/Canvas';
import { RoomIDPanel } from './components/panels/roomIDPanel/RoomIDPanel';
import { ToolPanel } from './components/panels/toolPanel/ToolPanel';
import './index.scss';
import { reducer } from './store';
import { saveState } from './store/localStorage';
import { updateRoomID } from './store/roomID';

if (process.env.NODE_ENV === 'development') {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
} else {
    navigator.serviceWorker.register('' + '/sw.js');
}

const store = createStore(reducer);

window.addEventListener('beforeunload', () => {
    saveState(store, false);
});

window.addEventListener('hashchange', () => {
    updateRoomID(store);
});

ReactDOM.render(
    <Provider store={store}>
        <ToolPanel />
        <RoomIDPanel />
        <div style={{ position: 'relative' }}>
            <Canvas />
        </div>
    </Provider>,
    document.getElementById('root')
);
