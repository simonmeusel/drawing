import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Canvas } from './components/canvas/Canvas';
import './index.scss';
import { reducer } from './redux/reducers';
import { ToolPanel } from './components/toolPanel/ToolPanel';

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <ToolPanel />
        <div style={{ position: 'relative' }}>
            <Canvas />
        </div>
    </Provider>,
    document.getElementById('root')
);
