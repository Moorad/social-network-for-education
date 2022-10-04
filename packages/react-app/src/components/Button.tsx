import React, { Component } from 'react';

interface propsType {
	value: string,
	className?: string
}

export default class Button extends Component<propsType> {
	constructor(props: propsType) {
		super(props);
	}
	render() {
		return (
			<button className={'bg-gray-500 text-white py-2 px-4 rounded ' + this.props.className}>
				{this.props.value}
			</button>
		)
	}
}