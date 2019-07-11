import React, { useState } from 'react';
import Color from './Color';

interface ColorsProps {
	onChangeColor: (color: string) => void;
}

const Colors: React.FC<ColorsProps> = (props) => {
	const colors = ['hsl(0, 0%, 0%)', 'hsl(204, 70%, 53%)', 'hsl(145, 63%, 49%)', 'hsl(48, 89%, 60%)', 'hsl(6, 78%, 57%)', 'hsl(0, 0%, 100%)', 'rainbow']

	const [selected, setSelected] = useState(colors[colors.length - 1])

	const handleColorClick = (e: React.MouseEvent, index: number) => {
		const selectedColor = colors[index];

		props.onChangeColor(selectedColor)
		setSelected(selectedColor)
	}

	return (
		<div className="colors">
			{colors.map((color, index) => (
				<div onClick={(e) => handleColorClick(e, index)} key={color} className="color">
					<Color
						color={color}
						selected={color === selected}
					/>
				</div>
			))}
		</div>
	)
}

export default Colors;