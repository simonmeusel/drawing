import * as React from 'react';
import Draggable from 'react-draggable';
import MdArrowDropdown from 'react-ionicons/lib/MdArrowDropdown';
import MdArrowDropup from 'react-ionicons/lib/MdArrowDropup';
import MdHelpCircle from 'react-ionicons/lib/MdHelpCircle';
import './Panel.scss';

export interface PanelProps {
    title: string;
    position: 'left' | 'right';
    width?: string;
    help?: JSX.Element;
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

    getHelp() {
        return (
            <div className="dropdown is-hoverable">
                <div className="dropdown-trigger">
                    <span
                        className="app-panel-icon icon"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu7"
                    >
                        <MdHelpCircle />
                    </span>
                </div>
                <div className="dropdown-menu" id="dropdown-menu7" role="menu">
                    <div className="dropdown-content">
                        <div className="dropdown-item">{this.props.help}</div>
                    </div>
                </div>
            </div>
        );
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
                            <div className="card-header-title">
                                {this.props.title}
                                {this.props.help && this.getHelp()}
                            </div>
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
