import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootAction, RootState } from '../../../store';
import { Panel } from '../Panel';

export class UnconnectedRoomIDPanel extends React.Component<
    ReturnType<typeof mapStateToProps> & {
        dispatch: Dispatch<RootAction>;
    },
    {}
> {
    render() {
        return (
            <Panel title="Room ID">
                <h1> {this.props.roomID} </h1>
            </Panel>
        );
    }
}

function mapStateToProps(state: RootState) {
    return { roomID: state.roomID };
}

export const RoomIDPanel = connect(mapStateToProps)(UnconnectedRoomIDPanel);
