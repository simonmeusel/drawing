import * as React from 'react';
import { connect } from 'react-redux';
import { DispatchProps, RootState } from '../../../../store';
import { setImportedImagePath } from '../../../../store/actions/setImportedImagePath';
import { setSelectedTool } from '../../../../store/actions/setSelectedTool';
import "./PictureHandler.scss"

export class UnconnectedPictureHandler extends React.Component<
    ReturnType<typeof mapStateToProps> & DispatchProps,
    {}
> {
    render() {
        const inputRef = React.createRef<HTMLInputElement>();
        const picture_tools = [
            { value: 5, name: 'Export drawing' },
            { value: 6, name: 'Draw picture' },
        ];

        const uploadImageElement = (
            <>
                <input id="input-file" ref={inputRef} className="file-input" type="file" />
                <button onClick={event => this.clickInputField(event, inputRef)} className="input-button">
                    Import picture here
                </button>
            </>
        );

        const buttonElements = picture_tools.map(picture_tool => (
            <button
                className={
                    'button is-link' +
                    (this.props.selectedPictureTool == picture_tool.value
                        ? ''
                        : ' is-outlined')
                }
                key={picture_tool.value.toString()}
                onClick={() => this.onClick(picture_tool.value)}
            >
                {picture_tool.name}
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

    handleUpload(_event: MouseEvent) {
        this.props.dispatch(setImportedImagePath("imagePath"))
    }

    clickInputField(_event: React.MouseEvent<HTMLButtonElement>, inputRef: React.RefObject<HTMLInputElement>) {
        console.log("clicking element");
        inputRef.current?.click();
    }
}

function mapStateToProps(state: RootState) {
    return { selectedPictureTool: state.selectedTool };
}

export const PictureHandler = connect(mapStateToProps)(UnconnectedPictureHandler);
