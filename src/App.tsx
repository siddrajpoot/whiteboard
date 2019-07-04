import React, { createRef } from 'react';

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
    // console.log(this.canvas.current.getContext('2d'))
    if (this.canvas.current) {
      // console.log(this.canvas.current.getContext('2d'));
      this.ctx = this.canvas.current.getContext('2d');
      if (!this.ctx) return;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  updateHSL = () => {
    this.hue++;
    // console.log(this.hue)

    if (this.hue > 360) this.hue = 0;
  }

  handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    this.isPressing = true;
  }

  handleMouseUp = (event: React.MouseEvent | React.TouchEvent) => {
    this.isPressing = false;
  }

  handleMouseMove = (event: React.MouseEvent) => {
    if (!this.isPressing) return
    const { clientX, clientY, movementX, movementY } = event
    this.draw(clientX, clientY, movementX, movementY);
    this.updateHSL();
    // console.log('event :', event);
  }

  handleTouchStart = (event: React.TouchEvent) => {
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
    if (!this.ctx) return
    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`
    this.ctx.lineWidth = 30;
    if ((movementX !== null && movementX !== undefined) && (movementY !== null && movementY !== undefined)) {
      this.ctx.moveTo(x - movementX, y - movementY)
    }
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  render() {
    const { width, height } = this.state;
    return (
      <div className="app">
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
        >
        </canvas>
      </div>
    )
  }
}

export default App;
