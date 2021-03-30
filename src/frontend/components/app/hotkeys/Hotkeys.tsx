import * as React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import { connect } from 'react-redux';
import { DispatchProps, RootState } from '../../../store';
import { redo } from '../../../store/actions/history/redo';
import { undo } from '../../../store/actions/history/undo';



export class UnconnectedHotkeys extends React.Component<
    ReturnType<typeof mapStateToProps> & DispatchProps,
    {}
    > {

    render() {
        const keyMap = {
            UNDO: "ctrl+z",
            REDO: ["ctrl+shift+z","ctrl+y"],
        }
        const handlers = {
            UNDO: () => this.props.dispatch(undo()),
            REDO: () => this.props.dispatch(redo()),
        }
        return (
            <GlobalHotKeys keyMap = {keyMap} handlers={handlers} />
        );
    }
}

function mapStateToProps(_state: RootState) {
    return {
    };
}

export const Hotkeys = connect(mapStateToProps)(UnconnectedHotkeys);
