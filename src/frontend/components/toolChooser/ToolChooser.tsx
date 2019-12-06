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
        return (
            <div>
                <div className="buttons">
                    <button className="button is-primary is-light">
                        Primary
                    </button>
                    <button className="button is-link is-light">Link</button>
                </div>

                <div className="buttons">
                    <button className="button is-info is-light">Info</button>
                    <button className="button is-success is-light">
                        Success
                    </button>
                    <button className="button is-warning is-light">
                        Warning
                    </button>
                    <button className="button is-danger is-light">
                        Danger
                    </button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.props.dispatch(setSelectedTool(1));
    }
}

function mapStateToProps(_state: RootState) {
    return {};
}

export const ToolChooser = connect(mapStateToProps)(UnconnextedToolChooser);
