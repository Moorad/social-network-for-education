import React, { forwardRef, MouseEventHandler, ReactNode } from 'react';

type PropsType = {
	children: ReactNode;
	type?: 'submit' | 'reset' | 'button';
	additionalClasses?: string;
	variant?: 'base' | 'primary' | 'danger';
	size?: 'normal' | 'small';
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
};

type RefType = HTMLButtonElement;

type ClassesType = {
	base: string;
	disabled: string;
	variant: {
		[key in Exclude<PropsType['variant'], null | undefined>]: string;
	};
	size: {
		[key in Exclude<PropsType['size'], null | undefined>]: string;
	};
};

const classes: ClassesType = {
	base: 'rounded transition py-2 px-5',
	disabled: 'opacity-60 cursor-not-allowed',
	variant: {
		base: 'border border-gray-200 text-gray-600 hover:bg-gray-100',
		primary: 'bg-blue-500 text-white hover:bg-blue-600',
		danger: 'bg-red-500 text-white hover:bg-red-600',
	},
	size: {
		normal: 'text-base',
		small: 'text-sm',
	},
};

const Button = forwardRef<RefType, PropsType>(
	(
		{
			children,
			type = 'button',
			additionalClasses,
			variant = 'base',
			size = 'normal',
			disabled = false,
			onClick,
			...props
		},
		ref
	) => (
		<button
			ref={ref}
			disabled={disabled}
			type={type}
			className={`${classes.base} ${classes.variant[variant]} ${
				classes.size[size]
			} ${additionalClasses} ${disabled && classes.disabled}`}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	)
);

Button.displayName = 'Button';

export default Button;
