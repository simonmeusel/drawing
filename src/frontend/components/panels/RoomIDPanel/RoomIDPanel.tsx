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
        function copyToClipBoard(currentHash: string) {
            // DAS BLEIBT SO WIE ES IST, OB DU WILLST UND NICHT!
            let URLtoBeCopied = new URL(location.href);
            console.log(currentHash);
            URLtoBeCopied.hash = '#' + currentHash;
            let toBeCopied = URLtoBeCopied.toString();
            console.log(toBeCopied);
            var dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = toBeCopied;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
        }

        return (
            <Panel title="Room ID">
                <h1 id="roomID"> {this.props.roomID.substring(0, 8)} </h1>
                <button onClick={() => copyToClipBoard(this.props.roomID)}>
                    {' '}
                    Copy{' '}
                </button>
            </Panel>
        );
    }
}

function mapStateToProps(state: RootState) {
    return { roomID: state.roomID };
}

export const RoomIDPanel = connect(mapStateToProps)(UnconnectedRoomIDPanel);
