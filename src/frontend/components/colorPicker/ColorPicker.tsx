import * as React from 'react';
import { SketchPicker } from 'react-color';
import Draggable from 'react-draggable';
import './ColorPicker.scss';

export class ColorPicker extends React.Component {
    render() {
        return (
            <div className="app-color-picker">
                <Draggable
                    defaultPosition={{ x: 0, y: 0 }}
                    grid={[10, 10]}
                    bounds="parent"
                    position={undefined}
                    scale={1}
                    handle=".app-color-picker-handle"
                >
                    <div className="card">
                        <header className="app-color-picker-handle card-header">
                            <p className="card-header-title">Color</p>
                            <a
                                href="#"
                                className="card-header-icon"
                                aria-label="more options"
                            >
                                <span className="icon">
                                    <i
                                        className="fas fa-angle-down"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            </a>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <SketchPicker />
                            </div>
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
}
