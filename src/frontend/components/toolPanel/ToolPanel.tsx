import * as React from 'react';
import Draggable from 'react-draggable';
import { ColorPicker } from './colorPicker/ColorPicker';
import { ToolChooser } from './toolChooser/ToolChooser';
import './ToolPanel.scss';

export class ToolPanel extends React.Component {
    render() {
        return (
            <div className="app-tool-panel">
                <Draggable
                    defaultPosition={{ x: 0, y: 0 }}
                    grid={[10, 10]}
                    bounds="parent"
                    position={undefined}
                    scale={1}
                    handle=".app-tool-panel-handle"
                >
                    <div className="card">
                        <header className="app-tool-panel-handle card-header">
                            <p className="card-header-title">Tools</p>
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
                            <ToolChooser />
                            <hr />
                            <ColorPicker />
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
}
