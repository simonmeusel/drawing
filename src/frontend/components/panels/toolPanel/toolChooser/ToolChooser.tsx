import * as React from 'react';
import { connect } from 'react-redux';
import { DispatchProps, RootState } from '../../../../store';
import { setSelectedTool } from '../../../../store/actions/setSelectedTool';

export class UnconnectedToolChooser extends React.Component<
    ReturnType<typeof mapStateToProps> & DispatchProps,
    {}
> {
    render() {
        const tools = [
            { value: 3, name: 'Pencil' },
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

export const ToolChooser = connect(mapStateToProps)(UnconnectedToolChooser);
