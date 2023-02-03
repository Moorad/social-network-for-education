import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { formatNumber } from '../utils/format';

export default function LikeButton(props: {
	likeCount: number;
	liked: boolean;
	handler: () => void;
}) {
	const [liked, setLiked] = useState(props.liked);
	const [likeCount, setLikeCount] = useState(props.likeCount);

	function handleLiking(e: React.MouseEvent) {
		e.stopPropagation();

		if (!liked) {
			setLikeCount(likeCount + 1);
			setLiked(true);
		} else {
			setLikeCount(likeCount - 1);
			setLiked(false);
		}

		props.handler();
	}

	return (
		<button onClick={(e) => handleLiking(e)}>
			<div className='flex gap-2 items-center'>
				{liked ? (
					<FontAwesomeIcon
						icon={faHeart}
						className='cursor-pointer text-red-400'
					/>
				) : (
					<FontAwesomeIcon
						icon={faHeart}
						className='cursor-pointer text-gray-400'
					/>
				)}
				<div className='select-none text-gray-500'>
					{formatNumber(likeCount)}
				</div>
			</div>
		</button>
	);
}
