import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Canvas } from './components/canvas/Canvas';
import { ToolPanel } from './components/panels/toolPanel/ToolPanel';
import './index.scss';
import { reducer } from './redux';
import { saveState } from './redux/localStorage';

navigator.serviceWorker.register('' + '/sw.js');
if (process.env.NODE_ENV === 'development') {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

const store = createStore(reducer);

window.addEventListener('beforeunload', () => {
    saveState(store, false);
});

ReactDOM.render(
    <Provider store={store}>
        <ToolPanel />
        <div style={{ position: 'relative' }}>
            <Canvas />
        </div>
    </Provider>,
    document.getElementById('root')
);
