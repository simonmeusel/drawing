import * as React from 'react';
import { connect } from 'react-redux';
import { DispatchProps, RootState } from '../../../../store';
import { setSelectedTool } from '../../../../store/actions/setSelectedTool';
import { setToolProperties } from '../../../../store/actions/setToolProperties';
import './PictureHandler.scss';

export class UnconnectedPictureHandler extends React.Component<
    ReturnType<typeof mapStateToProps> & DispatchProps,
    {}
> {
    state = {imageUrl: this.props.imageUrl};

    render() {
        const picture_tools = [
            { value: 4, name: 'Export drawing' },
            { value: 5, name: 'Draw picture' },
        ];

        const uploadImageElement = (
            <>
                <input value={this.state.imageUrl} className="text-input" type="text" onChange={event => this.changeInput(event)} />
            </>
        );

        const buttonElements = picture_tools.map(pictureTools => (
            <button
                className={
                    'button is-link' +
                    (this.props.selectedTool == pictureTools.value
                        ? ''
                        : ' is-outlined')
                }
                key={pictureTools.value.toString()}
                onClick={() => this.onClick(pictureTools.value)}
            >
                {pictureTools.name}
            </button>
        ));
        return (
            <div>
                <div className="buttons">{buttonElements}</div>
                <div className="input-div">{uploadImageElement}</div>
            </div>
        );
    }

    onClick(toolNumber: number) {
        this.props.dispatch(setSelectedTool(toolNumber));
    }

    changeInput(event: React.ChangeEvent<HTMLInputElement>) {
        const inputFieldValue: string = event.target.value;
        this.setState({
            imageUrl: inputFieldValue,
        })
        this.props.dispatch(
            setToolProperties({
                ['imageUrl']: inputFieldValue,
            }),
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        selectedTool: state.selectedTool,
        imageUrl: state.toolProperties.imageUrl
    };
}

export const PictureHandler = connect(mapStateToProps)(UnconnectedPictureHandler);
