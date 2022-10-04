import React, { Component } from 'react';

interface propsType {
	overrideClassName?: string,
	placeholder?: string,
	type?: string
}

export default class Input extends Component<propsType> {
	render() {
		return (
			<input type={this.props.type} placeholder={this.props.placeholder} className={this.props.overrideClassName || 'border border-gray-300 rounded'}/>
		)
	}
}