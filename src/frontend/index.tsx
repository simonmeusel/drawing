import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ColorPicker } from './components/colorPicker/ColorPicker';
import { Canvas } from './components/canvas/Canvas';
import 'bulma/css/bulma.min.css';

ReactDOM.render(
    <div style={{ position: 'relative' }}>
        <ColorPicker />
        <div style={{ position: 'relative' }}>
            <Canvas />
        </div>
    </div>,
    document.getElementById('root')
);
