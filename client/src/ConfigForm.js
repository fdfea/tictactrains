import React from "react";

import "./App.css";

export class Select extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    handleChange = (event) => {
        this.props.updateParent(this.props.name, event.target.value);
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <label>{this.props.label}
                <select value={this.state.value} name={this.props.name} 
                    onChange={(e) => this.handleChange(e)}>
                    {this.props.options.map(
                        ({value, label}) => <option key={value} value={value}>{label}</option>
                    )}
                </select>
            </label>
        );
    }

}

export class ConfigForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props.defaultState, 
            [props.updateKeysLabel]: props.updateKeysValue,
        };
    }

    handleSubmit = (event) => {
        this.props.loadConfig(this.state);
        event.preventDefault();
    }

    updateParent = (name, value) => {
        if (this.props.updateKeysLabel 
            && name === this.props.updateKeysLabel 
            && this.props.updateConfigKeys) {
                this.props.updateConfigKeys(value);
        } else {
            this.setState({[name]: parseInt(value)});
        }
    }

    render() {
        return (
            <div className="configForm">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input name="submit" type="submit" value={this.props.submitLabel}/>
                    {this.props.configOpts.map(obj => 
                        <Select 
                            key={obj.name}
                            name={obj.name} 
                            value={this.state[obj.name]} 
                            label={obj.label}
                            options={obj.options} 
                            updateParent={this.updateParent}
                        />
                    )}
                </form>
            </div>
        );
    }

}
