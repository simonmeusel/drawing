import { MdSearch } from '@simonmeusel/react-ionicons/MdSearch';
import * as React from 'react';
import { connect } from 'react-redux';
import { DispatchProps, RootState } from '../../../store';
import { clearRoomHistory } from '../../../store/actions/rooms/clearRoomHistory';
import { setRoomID } from '../../../store/actions/rooms/setRoomID';
import { setScreen } from '../../../store/actions/screen/setScreen';
import { generateRoomID, getURLWithRoomID } from '../../../store/roomID';
import { Panel } from '../Panel';
import { CopyContainer } from './CopyContainer';

export class UnconnectedRoomPanel extends React.Component<
    ReturnType<typeof mapStateToProps> & DispatchProps,
    {}
> {
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

    setPosition(x: number | undefined, y: number | undefined) {
        if (x === undefined) {
            x = this.props.screen.centerPoint.x;
        }
        if (y === undefined) {
            y = this.props.screen.centerPoint.y;
        }
        this.props.dispatch(
            setScreen({
                width: this.props.screen.width,
                centerPoint: {
                    x,
                    y,
                },
            })
        );
    }

    setWidth(width: number) {
        this.props.dispatch(
            setScreen({
                width,
                centerPoint: this.props.screen.centerPoint,
            })
        );
    }

    render() {
        return (
            <Panel
                title="Room"
                position="right"
                width="320px"
                help={
                    <p>
                        Each room has it's own canvas. To live-collaborate with
                        others, you can send them the room invitation link. Only
                        users with access to that link can visit and use the
                        room. The room ID is also saved inside the browser
                        history.
                    </p>
                }
            >
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <div className="select is-fullwidth">
                            <select
                                name="country"
                                value="currentRoom"
                                onChange={(event) =>
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
                                            .map((id) => (
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
                        <CopyContainer
                            copyText={getURLWithRoomID(this.props.roomID)}
                        >
                            <button type="button" className="button is-info">
                                Copy
                            </button>
                        </CopyContainer>
                    </div>
                </div>
                <hr />
                <div className="field has-addons has-addons-right">
                    <p className="control">
                        <a className="button is-static">x</a>
                    </p>
                    <p className="control">
                        <input
                            onChange={(event) =>
                                this.setPosition(
                                    parseFloat(event.target.value),
                                    undefined
                                )
                            }
                            value={this.props.screen.centerPoint.x}
                            className="input"
                            type="number"
                            placeholder="x"
                        />
                    </p>
                    <p className="control">
                        <a className="button is-static">y</a>
                    </p>
                    <p className="control">
                        <input
                            onChange={(event) =>
                                this.setPosition(
                                    undefined,
                                    parseFloat(event.target.value)
                                )
                            }
                            value={this.props.screen.centerPoint.y}
                            className="input"
                            type="number"
                            placeholder="y"
                        />
                    </p>
                    <div className="control">
                        <a
                            onClick={() => this.setPosition(0, 0)}
                            className="button is-info"
                        >
                            0/0
                        </a>
                    </div>
                </div>
                <div className="field has-addons has-addons-right">
                    <p className="control">
                        <a className="button is-static">
                            {this.props.shapeAmount} shapes
                        </a>
                    </p>
                    <p className="control">
                        <a className="button is-static">
                            <span className="icon" style={{ fill: '#7a7a7a' }}>
                                <MdSearch />
                            </span>
                        </a>
                    </p>
                    <p className="control">
                        <input
                            onChange={(event) =>
                                this.setWidth(parseFloat(event.target.value))
                            }
                            value={this.props.screen.width}
                            className="input"
                            type="number"
                            placeholder="x"
                        />
                    </p>
                    <div className="control">
                        <a
                            onClick={() => this.setWidth(1)}
                            className="button is-info"
                        >
                            1
                        </a>
                    </div>
                </div>
            </Panel>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        shapeAmount: Object.keys(state.document.shapes).length,
        screen: state.screen,
        roomID: state.roomID,
        roomIDHistory: state.roomIDHistory,
    };
}

export const RoomPanel = connect(mapStateToProps)(UnconnectedRoomPanel);
