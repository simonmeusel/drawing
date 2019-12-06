import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Canvas } from './components/canvas/Canvas';
import { ColorPicker } from './components/colorPicker/ColorPicker';
import './index.scss';
import { reducer } from './redux/reducers';

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <ColorPicker />
        <div style={{ position: 'relative' }}>
            <Canvas />
        </div>
    </Provider>,
    document.getElementById('root')
);
