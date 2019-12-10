import * as React from 'react';
import Draggable from 'react-draggable';
import './Panel.scss';

export interface PanelProps {
    title: string;
}

export class Panel extends React.Component<PanelProps> {
    render() {
        return (
            <div className="app-panel">
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
                            <p className="card-header-title">
                                {this.props.title}
                            </p>
                        </header>
                        <div className="card-content">
                            {this.props.children}
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
}
