import * as React from 'react';
import Draggable from 'react-draggable';
import MdArrowDropdown from 'react-ionicons/lib/MdArrowDropdown';
import MdArrowDropup from 'react-ionicons/lib/MdArrowDropup';
import './Panel.scss';

export interface PanelProps {
    title: string;
    position: 'left' | 'right';
    width?: string;
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
        const cardStyle: React.CSSProperties = {
            width: this.props.width,
            maxWidth: this.props.width,
            minWidth: this.props.width,
            ...(this.props.position == 'right'
                ? { right: '10px' }
                : { left: '10px' }),
        };
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
                    <div className="card" style={cardStyle}>
                        <header className="app-tool-panel-handle card-header">
                            <p className="card-header-title">
                                {this.props.title}
                            </p>
                            <a
                                className="card-header-icon"
                                aria-label="more options"
                                onClick={this.toggle.bind(this)}
                            >
                                <span className="icon">
                                    {this.state.collabsed ? (
                                        <MdArrowDropdown />
                                    ) : (
                                        <MdArrowDropup />
                                    )}
                                </span>
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
