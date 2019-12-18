import * as React from 'react';
import { Canvas } from '../canvas/Canvas';
import { RoomPanel } from '../panels/roomPanel/RoomPanel';
import { ToolPanel } from '../panels/toolPanel/ToolPanel';

export interface AppState {
    drawing: boolean;
}

export class App extends React.Component<{}, AppState> {
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
                    <ToolPanel />
                    <RoomPanel />
                </div>
                <div style={{ position: 'relative' }}>
                    <Canvas onDrawingChange={this.onDrawingChange.bind(this)} />
                </div>
            </div>
        );
    }
}
