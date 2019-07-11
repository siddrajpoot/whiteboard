import React, { createRef } from 'react';
import '../App.scss';

import Slider from './Slider';
import Colors from './Colors';

interface AppState {
  width: number;
  height: number;
  strokeWidth: number;
  selectedColor: string;
}

class App extends React.Component<{}, AppState> {
  private canvas: React.RefObject<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null;
  private isPressing: boolean;
  private hue: number;
  private saturation: number;
  private lightness: number;
  private touchMovementX: number | null;
  private touchMovementY: number | null;

  constructor(props: any) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      strokeWidth: 15,
      selectedColor: 'rainbow'
    }
    this.canvas = createRef();
    this.ctx = null;
    this.isPressing = false;
    this.hue = 0;
    this.saturation = 0;
    this.lightness = 0;
    this.touchMovementX = null;
    this.touchMovementY = null;
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions)
    if (this.canvas.current) {
      this.ctx = this.canvas.current.getContext('2d');
      if (!this.ctx) return;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth * .8, height: window.innerHeight * .8 })
  }

  clearCanvas = () => {
    if (!this.ctx || !this.canvas.current) return;
    this.ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
  }

  updateHSL = () => {
    this.hue++;
    if (this.hue > 360) this.hue = 0;
  }

  generateColor = () => {
    const { selectedColor } = this.state;

    if (selectedColor === 'rainbow') {
      this.updateHSL();
      return `hsl(${this.hue}, 100%, 50%)`;
    } else {
      return selectedColor;
    }
  }

  handleChangeColor = (color: string) => {
    this.setState({ selectedColor: color });
  }

  handleStrokeWidth = (value: number) => {
    this.setState({ strokeWidth: value })
  }

  handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    this.isPressing = true;
  }

  handleMouseUp = (event: React.MouseEvent | React.TouchEvent) => {
    this.isPressing = false;
  }

  handleMouseMove = (event: React.MouseEvent) => {
    if (!this.isPressing || !this.canvas.current) return

    const { clientX, clientY, movementX, movementY } = event
    this.draw(clientX, clientY, movementX, movementY);
  }

  handleTouchStart = (event: React.TouchEvent) => {
    const { clientX, clientY } = event.touches[0]
    if (!this.ctx) return;
    this.draw(clientX, clientY)
    this.touchMovementX = clientX;
    this.touchMovementY = clientY;
  }

  handleTouchEnd = (event: React.TouchEvent) => {
    this.touchMovementX = null;
    this.touchMovementY = null;
  }

  handleTouchMove = (event: React.TouchEvent) => {
    const { clientX, clientY } = event.touches[0]
    if (this.touchMovementX && this.touchMovementY) {
      this.draw(clientX, clientY, clientX - this.touchMovementX, clientY - this.touchMovementY)
    }
    this.touchMovementX = clientX;
    this.touchMovementY = clientY;
  }

  draw = (x: number, y: number, movementX?: number | null, movementY?: number | null) => {
    if (!this.canvas.current || !this.ctx) return;
    const offsetX = x - this.canvas.current.offsetLeft
    const offsetY = y - this.canvas.current.offsetTop

    const color = this.generateColor();

    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = this.state.strokeWidth;
    if ((movementX !== null && movementX !== undefined) && (movementY !== null && movementY !== undefined) && this.canvas.current) {
      this.ctx.moveTo(offsetX - movementX, offsetY - movementY)
    } else {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(offsetX, offsetY, .001, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.fill();
      return;
    }
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
  }

  render() {
    const { width, height } = this.state;
    return (
      <div className="app">
        <img src={require('../assets/clear.png')} className="clear" alt="clear" onClick={this.clearCanvas} />
        <div className="canvas-container">
          <canvas
            className="canvas"
            width={width}
            height={height}
            ref={this.canvas}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseMove={this.handleMouseMove}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
          />
        </div>
        <div className="tools">
          <Slider min={5} max={30} callback={this.handleStrokeWidth} />
          <Colors onChangeColor={this.handleChangeColor} />
        </div>
      </div>
    )
  }
}

export default App;
