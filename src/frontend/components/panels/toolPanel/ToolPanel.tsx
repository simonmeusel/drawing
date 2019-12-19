import * as React from 'react';
import { Panel } from '../Panel';
import { ColorPicker } from './colorPicker/ColorPicker';
import { ToolChooser } from './toolChooser/ToolChooser';

export class ToolPanel extends React.Component {
    render() {
        return (
            <Panel title="Tools" position="left" width="220px">
                <ToolChooser />
                <hr />
                <ColorPicker />
            </Panel>
        );
    }
}
