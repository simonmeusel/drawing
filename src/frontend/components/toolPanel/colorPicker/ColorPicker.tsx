import * as React from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setToolProperties } from '../../../redux/actions/toolProperties';
import { RootAction, RootState } from '../../../redux/reducers';
import './ColorPicker.scss';

export type ColorPickerProps = ReturnType<typeof mapStateToProps> & {
    dispatch: Dispatch<RootAction>;
};

export const tabs: {
    tab: Tab;
    name: string;
}[] = [
    {
        tab: 'stroke',
        name: 'Stroke',
    },
    {
        tab: 'fill',
        name: 'Fill',
    },
];

export type Tab = 'stroke' | 'fill';

export interface ColorPickerState {
    selectedTab: Tab;
}

export class UnconnectedColorPicker extends React.Component<
    ColorPickerProps,
    ColorPickerState
> {
    state = { selectedTab: 'stroke' } as ColorPickerState;

    onColorChange(colorResult: ColorResult) {
        const alpha =
            '00' + Math.round((colorResult.rgb.a || 1) * 255).toString(16);
        const color = colorResult.hex + alpha.substring(alpha.length - 2);
        this.props.dispatch(
            setToolProperties({
                [this.state.selectedTab + 'Color']: color,
            })
        );
    }

    setSelectedTab(tab: Tab) {
        this.setState({
            selectedTab: tab,
        });
    }

    render() {
        const color = this.props[this.state.selectedTab + 'Color'].substring(1);
        const rgba = {
            r: parseInt(color.substring(0, 2), 16),
            g: parseInt(color.substring(2, 4), 16),
            b: parseInt(color.substring(4, 6), 16),
            a: parseInt(color.substring(6, 8), 16) / 256,
        };

        const activeClassName = 'is-active';

        const tabElements = tabs.map(t => (
            <li
                className={
                    this.state.selectedTab == t.tab ? activeClassName : ''
                }
                onClick={() => this.setSelectedTab(t.tab)}
            >
                <a>{t.name}</a>
            </li>
        ));

        return (
            <div className="app-color-picker">
                <div className="tabs is-boxed">
                    <ul>{tabElements}</ul>
                </div>

                <SketchPicker
                    color={rgba}
                    onChangeComplete={this.onColorChange.bind(this)}
                />
            </div>
        );
    }
}

function mapStateToProps(state: RootState) {
    return state.toolProperties;
}

export const ColorPicker = connect(mapStateToProps)(UnconnectedColorPicker);
