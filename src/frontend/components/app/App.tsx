import * as React from 'react';
import { WebSocketManager } from '../../api/WebSocketManager';
import { Canvas } from '../canvas/Canvas';
import { RoomPanel } from '../panels/roomPanel/RoomPanel';
import { ToolPanel } from '../panels/toolPanel/ToolPanel';
import { WelcomeModal } from './welcomeModal/WelcomeModal';

export interface AppProps {
    webSocketManager: WebSocketManager;
}

export interface AppState {
    drawing: boolean;
}

export class App extends React.Component<AppProps, AppState> {
    state = {
        drawing: false,
    };


    onDrawingChange(drawing: boolean) {
        this.setState({ drawing });
    }

    render() {
        return (
            <div>
                <div
                    style={
                        this.state.drawing
                            ? {
                                  pointerEvents: 'none',
                                  transition: 'opacity 0.3s',
                                  opacity: 0.5,
                              }
                            : {
                                  transition: 'opacity 0.3s',
                                  opacity: 1,
                              }
                    }
                >
                    <WelcomeModal/>
                    <ToolPanel />
                    <RoomPanel />
                </div>
                <div style={{ position: 'relative' }}>
                    <Canvas
                        webSocketManager={this.props.webSocketManager}
                        onDrawingChange={this.onDrawingChange.bind(this)}
                    />
                </div>
            </div>
        );
    }
}
