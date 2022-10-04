import React, { Component } from 'react';

interface propsType {
	value?: string,
	overrideClassName?: string
}

export default class Button extends Component<propsType> {
	constructor(props: propsType) {
		super(props);
	}
	render() {
		return (
			<button className={this.props.overrideClassName || 'bg-blue-500 text-white py-2 px-4 rounded'}>
				{this.props.value}
			</button>
		)
	}
}