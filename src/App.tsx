import React, { createRef } from 'react';
import Clear from './assets/clear.png';

interface AppState {
  width: number;
  height: number;
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
      height: 0
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
    this.updateHSL();
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
    this.updateHSL();
  }

  draw = (x: number, y: number, movementX?: number | null, movementY?: number | null) => {
    if (!this.canvas.current || !this.ctx) return;
    const offsetX = x - this.canvas.current.offsetLeft
    const offsetY = y - this.canvas.current.offsetTop

    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`
    this.ctx.lineWidth = 30;
    if ((movementX !== null && movementX !== undefined) && (movementY !== null && movementY !== undefined) && this.canvas.current) {
      this.ctx.moveTo(offsetX - movementX, offsetY - movementY)
    } else {
      this.ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`
      this.ctx.beginPath();
      this.ctx.arc(offsetX, offsetY, .1, 0, 2 * Math.PI);
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
        <img src={Clear} className="clear" alt="clear" onClick={this.clearCanvas} />
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
        >
        </canvas>
      </div>
    )
  }
}

export default App;
