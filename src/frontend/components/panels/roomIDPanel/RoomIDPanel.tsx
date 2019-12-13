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
    private textAreaRef = React.createRef<HTMLTextAreaElement>();

    copy(currentHash: string) {
        const url = new URL(location.href);
        url.hash = '#' + currentHash;
        this.textAreaRef.current!.value = url.toString();
        this.textAreaRef.current!.select();
        document.execCommand('copy');
    }

    render() {
        return (
            <Panel title="Room ID">
                <div style={{ opacity: 0, height: 0, overflow: 'hidden' }}>
                    <textarea ref={this.textAreaRef}></textarea>
                </div>
                <h1> {this.props.roomID.substring(0, 8)} </h1>
                <button
                    className="button"
                    onClick={() => this.copy(this.props.roomID)}
                >
                    Copy
                </button>
            </Panel>
        );
    }
}

function mapStateToProps(state: RootState) {
    return { roomID: state.roomID };
}

export const RoomIDPanel = connect(mapStateToProps)(UnconnectedRoomIDPanel);
