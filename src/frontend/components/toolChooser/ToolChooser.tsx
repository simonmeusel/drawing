import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootAction, RootState } from '../../redux/reducers';
import { setSelectedTool } from '../../redux/actions/selectedTool';
import 'bulma/css/bulma.css';

let toolNumber = 1;

export class UnconnextedToolChooser extends React.Component<
    ReturnType<typeof mapStateToProps> & {
        dispatch: Dispatch<RootAction>;
    },
    {}
> {
    render() {
        /**
         * See more possible button options:
         * https://bulma.io/documentation/elements/button/
         */

        return (
            <div>
                <div className="buttons">
                    <button
                        className="button is-primary is-outlined"
                        onClick={() => (toolNumber = 3)}
                    >
                        Line
                    </button>
                    <button
                        className="button is-primary is-outlined"
                        onClick={() => (toolNumber = 1)}
                    >
                        Rectangle
                    </button>
                    <button
                        className="button is-link is-outlined"
                        onClick={() => (toolNumber = 2)}
                    >
                        Elipse
                    </button>
                    <button
                        className="button is-link is-outlined"
                        onClick={this.componentDidMount}
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log('mounted');
        this.props.dispatch(setSelectedTool(toolNumber));
    }
}

/*
function toolChangeHandler(this: any, toolNumber: number) {
    toolNumber = toolNumber;
}
*/

function mapStateToProps(state: RootState) {
    return {};
}

export const ToolChooser = connect(mapStateToProps)(UnconnextedToolChooser);
