import React from 'react';

type propTypes = {
	data: { _id: string; content: string };
};

export default function Comment(props: propTypes) {
	return <div>{props.data.content}</div>;
}
