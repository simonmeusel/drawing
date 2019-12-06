import 'bulma/css/bulma.css';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setSelectedTool } from '../../redux/actions/selectedTool';
import { RootAction, RootState } from '../../redux/reducers';

export class UnconnextedToolChooser extends React.Component<
    ReturnType<typeof mapStateToProps> & {
        dispatch: Dispatch<RootAction>;
    },
    {}
> {
    render() {
        /*
         * See more possible button options:
         * https://bulma.io/documentation/elements/button/
         */
        const tools = [
            { value: 3, name: 'Line' },
            { value: 1, name: 'Rectangle' },
            { value: 2, name: 'Elipse' },
            { value: 0, name: 'Move' },
        ];

        const buttonElements = tools.map(tool => (
            <button
                className={
                    'button is-link' +
                    (this.props.selectedTool == tool.value
                        ? ''
                        : ' is-outlined')
                }
                key={tool.value.toString()}
                onClick={() => this.onClick(tool.value)}
            >
                {tool.name}
            </button>
        ));
        return (
            <div>
                <div className="buttons">{buttonElements}</div>
            </div>
        );
    }

    onClick(toolNumber: number) {
        this.props.dispatch(setSelectedTool(toolNumber));
    }
}

function mapStateToProps(state: RootState) {
    return { selectedTool: state.selectedTool };
}

export const ToolChooser = connect(mapStateToProps)(UnconnextedToolChooser);
