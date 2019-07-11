import React from 'react';

interface ColorProps {
	color: string;
	selected: boolean;
}

const Color: React.FC<ColorProps> = (props) => {
	return (
		<div 
			className={`circle ${props.selected ? 'selected' : ''} ${props.color === 'rainbow' ? props.color: ''}`}
			style={{ backgroundColor: props.color !== 'rainbow' ? props.color : undefined }}
		/>
	)
}

export default Color;