import * as React from 'react';

export interface CopyContainerProps {
    copyText: string;
}

export class CopyContainer extends React.Component<CopyContainerProps, {}> {
    private textAreaRef = React.createRef<HTMLTextAreaElement>();

    copy() {
        this.textAreaRef.current!.value = this.props.copyText;
        this.textAreaRef.current!.select();
        document.execCommand('copy');
    }

    render() {
        return (
            <React.Fragment>
                <span onClick={() => this.copy()}>{this.props.children}</span>
                <span
                    style={{
                        opacity: 0,
                        height: 0,
                        overflow: 'hidden',
                        position: 'fixed',
                    }}
                >
                    <div>
                        <textarea ref={this.textAreaRef}></textarea>
                    </div>
                </span>
            </React.Fragment>
        );
    }
}
