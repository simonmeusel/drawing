import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../store';
import { getURLWithRoomID } from '../../../store/roomID';
import { CopyContainer } from '../../panels/roomPanel/CopyContainer';

export interface WelcomeModalState {
    isModalOpen: boolean;
}

export class UnconnectedWelcomeModal extends React.Component<
    ReturnType<typeof mapStateToProps>,
    WelcomeModalState
> {
    state = {
        isModalOpen:
            window.localStorage.getItem(
                '7e7f72d4-901f-11eb-855b-f30580bd6740'
            ) != 'true',
    };

    handleClick(doNotShowAgain: boolean) {
        if (doNotShowAgain) {
            window.localStorage.setItem(
                '7e7f72d4-901f-11eb-855b-f30580bd6740',
                'true'
            );
        }
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    render() {
        const active = this.state.isModalOpen ? 'modal is-active' : 'modal';
        return (
            <div className={active}>
                <div
                    className="modal-background"
                    onClick={() => this.handleClick(false)}
                />
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Welcome</p>
                        <button
                            onClick={() => this.handleClick(false)}
                            className="delete"
                            aria-label="close"
                        />
                    </header>
                    <section className="modal-card-body">
                        <div className="tile is-ancestor">
                            <div
                                className="tile is-parent"
                                onClick={() => this.handleClick(false)}
                            >
                                <div className="tile is-child box">
                                    <p className="title">Start drawing.</p>
                                    <hr />
                                    <p>
                                        In our application you can choose
                                        between different tools. You do not have
                                        to use the "Move" tool. If you are
                                        sitting at a computer you can just hold
                                        right click and move with it. If you
                                        want to change the color. The world
                                        would obviously be very sad and boring
                                        without colors, so you can choose the
                                        color of the figures. There are two
                                        possible options. The stroke color and
                                        the fill color. You can also minimize
                                        the toolbar if you want more space.
                                    </p>
                                </div>
                            </div>
                            <div
                                className="tile is-parent"
                                onClick={() => this.handleClick(false)}
                            >
                                <div className="tile is-child box">
                                    <p className="title">Draw together!</p>
                                    <hr />
                                    <CopyContainer
                                        copyText={getURLWithRoomID(
                                            this.props.roomID
                                        )}
                                    >
                                        <button className="button is-info is-fullwidth">
                                            Copy invite link
                                        </button>
                                    </CopyContainer>
                                    <hr />
                                    <p>
                                        We have different rooms, so you do not
                                        have to look at other peoples drawings.
                                        If you want to share your room with
                                        someone just click on "Copy" and send it
                                        to the other person. If you want to
                                        create a new room just go to the
                                        dropdown and you will automatically get
                                        a new room. All the rooms you ever used
                                        will be saved in your history.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button
                            onClick={() => this.handleClick(false)}
                            className="button is-info"
                        >
                            Got it!
                        </button>
                        <button
                            onClick={() => this.handleClick(true)}
                            className="button"
                        >
                            Do not show again
                        </button>
                    </footer>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        roomID: state.roomID,
    };
}

export const WelcomeModal = connect(mapStateToProps)(UnconnectedWelcomeModal);
