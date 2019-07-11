import React, { useState } from 'react';

interface SliderProps {
	min: number;
	max: number;
	callback: (value: number) => void;
}

const Slider: React.FC<SliderProps> = (props) => {
	const { min, max, callback } = props
	const [value, setValue] = useState(max / 2)

	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const sliderValue = e.target.value;
		const parsedSliderValue = parseInt(sliderValue);
		callback(parsedSliderValue);
		setValue(parsedSliderValue);
	}

	return (
		<div className="slider">
			<input type="range" min={min} max={max} value={value} onChange={handleSliderChange} />
		</div>
	)
}

export default Slider;