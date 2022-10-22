import React from 'react';
import { useParams } from 'react-router-dom';
import User from './User';

export default function UserInParams() {
	const { id } = useParams();

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return <User id={id!} />;
}
