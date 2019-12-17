import * as React from 'react';
import Draggable from 'react-draggable';
import './Panel.scss';

export interface PanelProps {
    title: string;
    position: 'left' | 'right';
}

export interface PanelState {
    collabsed: boolean;
}

export class Panel extends React.Component<PanelProps, PanelState> {
    state = {
        collabsed: false,
    };

    toggle() {
        this.setState({
            collabsed: !this.state.collabsed,
        });
    }

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
                    <div
                        className="card"
                        style={
                            this.props.position == 'right'
                                ? { right: '10px' }
                                : { left: '10px' }
                        }
                    >
                        <header className="app-tool-panel-handle card-header">
                            <p className="card-header-title">
                                {this.props.title}
                            </p>
                            <a
                                className="card-header-icon"
                                aria-label="more options"
                                onClick={this.toggle.bind(this)}
                            >
                                <span className="icon">-</span>
                            </a>
                        </header>
                        <div
                            className={
                                'card-content' +
                                (this.state.collabsed
                                    ? ' app-panel-collapsed-card-content'
                                    : '')
                            }
                        >
                            {this.props.children}
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
}
