import 'bulma/css/bulma.css';
import * as React from 'react';

export interface AppState {
    isModalOpen: boolean;
}

export class WelcomeModal extends React.Component<{}, AppState> {
    state = {
        isModalOpen: true,
    };

    handleClick = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    };

    render() {
        const active = this.state.isModalOpen ? 'modal is-active' : 'modal';
        return (
            <div className={active}>
                <div className="modal-background" />
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Tutorial</p>
                        <button
                            onClick={this.handleClick}
                            className="delete"
                            aria-label="close"
                        />
                    </header>
                    <section className="modal-card-body">
                        <div className="field">
                            <label className="label">Tools</label>
                            <div className="content">
                                In our application you can choose between
                                different tools. You do not have to use the
                                "Move" tool. If you are sitting at a computer
                                you can just hold right click and move with it.
                                If you want to change the color. The world would
                                obviously be very sad and boring without colors,
                                so you can choose the color of the figures.
                                There are two possible options. The stroke color
                                and the fill color. You can also minimize the
                                toolbar if you want more space.
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Rooms</label>
                            <div className="content">
                                We have different rooms, so you do not have to
                                look at other peoples drawings. If you want to
                                share your room with someone just click on
                                "Copy" and send it to the other person. If you
                                want to create a new room just go to the
                                dropdown and you will automatically get a new
                                room. All the rooms the ever used will be saved
                                in the history, you can of course delete them.
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button
                            className="button is-success"
                            onClick={this.handleClick}
                        >
                            Got it!
                        </button>
                        <button onClick={this.handleClick} className="button">
                            Something smart.
                        </button>
                    </footer>
                </div>
            </div>
        );
    }
}
