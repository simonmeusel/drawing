import * as React from 'react';
import { ColorPicker } from './colorPicker/ColorPicker';
import { ToolChooser } from './toolChooser/ToolChooser';
import { Panel } from '../Panel';

export class ToolPanel extends React.Component {
    render() {
        return (
            <Panel title="Tools">
                <ToolChooser />
                <hr />
                <ColorPicker />
            </Panel>
        );
    }
}
