import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootAction, RootState } from '../../../store';
import { clearRoomHistory } from '../../../store/actions/rooms/clearRoomHistory';
import { setRoomID } from '../../../store/actions/rooms/setRoomID';
import { generateRoomID } from '../../../store/roomID';
import { Panel } from '../Panel';

export class UnconnectedRoomPanel extends React.Component<
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

    trimRoomID(roomID: string) {
        return roomID.substring(0, 8);
    }

    onSelectRoom(
        room: 'currentRoom' | 'newRoom' | 'clearRoomHistory' | string
    ) {
        switch (room) {
            case 'currentRoom':
                break;
            case 'newRoom':
                this.props.dispatch(setRoomID(generateRoomID()));
                break;
            case 'clearRoomHistory':
                this.props.dispatch(clearRoomHistory());
                break;
            default:
                this.props.dispatch(setRoomID(room));
                break;
        }
    }

    render() {
        return (
            <Panel title="Room" position="right" width="320px">
                <div style={{ opacity: 0, height: 0, overflow: 'hidden' }}>
                    <textarea ref={this.textAreaRef}></textarea>
                </div>

                <div className="field has-addons">
                    <div className="control is-expanded">
                        <div className="select is-fullwidth">
                            <select
                                name="country"
                                value="currentRoom"
                                onChange={event =>
                                    this.onSelectRoom(event.target.value)
                                }
                            >
                                <option value="currentRoom">
                                    {this.trimRoomID(this.props.roomID)}
                                    ••••••••••••••••••••••••••••
                                </option>
                                <option value="newRoom">Create new room</option>
                                {this.props.roomIDHistory.length > 0 && (
                                    <optgroup label="History">
                                        {this.props.roomIDHistory
                                            .slice()
                                            .reverse()
                                            .map(id => (
                                                <option value={id} key={id}>
                                                    {this.trimRoomID(id)}
                                                </option>
                                            ))}
                                        ,
                                        <option value="clearRoomHistory">
                                            Delete all history
                                        </option>
                                    </optgroup>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="control">
                        <button
                            type="button"
                            className="button is-primary"
                            onClick={() => this.copy(this.props.roomID)}
                        >
                            Copy
                        </button>
                    </div>
                </div>
            </Panel>
        );
    }
}

function mapStateToProps(state: RootState) {
    return { roomID: state.roomID, roomIDHistory: state.roomIDHistory };
}

export const RoomPanel = connect(mapStateToProps)(UnconnectedRoomPanel);
