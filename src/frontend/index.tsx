import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ColorPicker } from './components/colorPicker/ColorPicker';
import { Canvas } from './components/canvas/Canvas';
import './index.scss';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
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
