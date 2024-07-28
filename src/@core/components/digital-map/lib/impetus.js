import React, { Component } from 'react';

const stopThresholdDefault = 0.3;
const bounceDeceleration = 0.04;
const bounceAcceleration = 0.11;

class Impetus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      targetX: props.initialValues ? props.initialValues[0] : 0,
      targetY: props.initialValues ? props.initialValues[1] : 0,
    };

    this.multiplier = props.multiplier || 1;
    this.friction = props.friction || 0.92;
    this.boundX = props.boundX || [];
    this.boundY = props.boundY || [];
    this.bounce = props.bounce !== undefined ? props.bounce : true;

    this.stopThreshold = stopThresholdDefault * this.multiplier;
    this.ticking = false;
    this.pointerActive = false;
    this.paused = false;
    this.decelerating = false;
    this.trackingPoints = [];

    this.sourceEl = React.createRef();

    this.pointerLastX = 0;
    this.pointerLastY = 0;
    this.pointerCurrentX = 0;
    this.pointerCurrentY = 0;
    this.pointerId = null;
    this.decVelX = 0;
    this.decVelY = 0;

    // Bind event handlers to ensure 'this' context
    this.onDown = this.onDown.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onUp = this.onUp.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
  }

  componentDidMount() {
    const sourceEl = this.sourceEl.current;
    if (sourceEl) {
      sourceEl.addEventListener('touchstart', this.onDown);
      sourceEl.addEventListener('mousedown', this.onDown);
    }
  }

  componentWillUnmount() {
    const sourceEl = this.sourceEl.current;
    if (sourceEl) {
      sourceEl.removeEventListener('touchstart', this.onDown);
      sourceEl.removeEventListener('mousedown', this.onDown);
    }
    this.cleanUpRuntimeEvents();
  }

  cleanUpRuntimeEvents() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('touchmove', this.onMove);
      document.removeEventListener('touchend', this.onUp);
      document.removeEventListener('touchcancel', this.stopTracking);
      document.removeEventListener('mousemove', this.onMove);
      document.removeEventListener('mouseup', this.onUp);
    }
  }

  addRuntimeEvents() {
    this.cleanUpRuntimeEvents();
    if (typeof document !== 'undefined') {
      document.addEventListener('touchmove', this.onMove);
      document.addEventListener('touchend', this.onUp);
      document.addEventListener('touchcancel', this.stopTracking);
      document.addEventListener('mousemove', this.onMove);
      document.addEventListener('mouseup', this.onUp);
    }
  }

  normalizeEvent(ev) {
    if (ev.type === 'touchmove' || ev.type === 'touchstart' || ev.type === 'touchend') {
      const touch = ev.targetTouches[0] || ev.changedTouches[0];

      return { x: touch.clientX, y: touch.clientY, id: touch.identifier };
    }

    return { x: ev.clientX, y: ev.clientY, id: null };
  }

  onDown(ev) {
    const event = this.normalizeEvent(ev);
    if (!this.pointerActive && !this.paused) {
      this.pointerActive = true;
      this.decelerating = false;
      this.pointerId = event.id;

      this.pointerLastX = this.pointerCurrentX = event.x;
      this.pointerLastY = this.pointerCurrentY = event.y;
      this.trackingPoints = [];
      this.addTrackingPoint(this.pointerLastX, this.pointerLastY);

      this.addRuntimeEvents();
    }
  }

  onMove(ev) {
    ev.preventDefault();
    const event = this.normalizeEvent(ev);
    if (this.pointerActive && event.id === this.pointerId) {
      this.pointerCurrentX = event.x;
      this.pointerCurrentY = event.y;
      this.addTrackingPoint(this.pointerLastX, this.pointerLastY);
      this.requestTick();
    }
  }

  onUp(ev) {
    const event = this.normalizeEvent(ev);
    if (this.pointerActive && event.id === this.pointerId) {
      this.stopTracking();
    }
  }

  stopTracking() {
    this.pointerActive = false;
    this.addTrackingPoint(this.pointerLastX, this.pointerLastY);
    this.startDecelAnim();
    this.cleanUpRuntimeEvents();
  }

  addTrackingPoint(x, y) {
    const time = Date.now();
    while (this.trackingPoints.length > 0) {
      if (time - this.trackingPoints[0].time <= 100) {
        break;
      }
      this.trackingPoints.shift();
    }
    this.trackingPoints.push({ x, y, time });
  }

  updateAndRender() {
    const pointerChangeX = this.pointerCurrentX - this.pointerLastX;
    const pointerChangeY = this.pointerCurrentY - this.pointerLastY;

    this.setState(prevState => ({
      targetX: prevState.targetX + pointerChangeX * this.multiplier,
      targetY: prevState.targetY + pointerChangeY * this.multiplier,
    }), () => {
      if (this.bounce) {
        const diff = this.checkBounds();
        if (diff.x !== 0) {
          this.setState(prevState => ({
            targetX: prevState.targetX - pointerChangeX * this.dragOutOfBoundsMultiplier(diff.x) * this.multiplier,
          }));
        }
        if (diff.y !== 0) {
          this.setState(prevState => ({
            targetY: prevState.targetY - pointerChangeY * this.dragOutOfBoundsMultiplier(diff.y) * this.multiplier,
          }));
        }
      } else {
        this.checkBounds(true);
      }
      this.props.update(this.state.targetX, this.state.targetY);
      this.pointerLastX = this.pointerCurrentX;
      this.pointerLastY = this.pointerCurrentY;
      this.ticking = false;
    });
  }

  dragOutOfBoundsMultiplier(val) {
    return 0.000005 * Math.pow(val, 2) + 0.0001 * val + 0.55;
  }

  requestTick() {
    if (!this.ticking) {
      requestAnimFrame(this.updateAndRender.bind(this));
    }
    this.ticking = true;
  }

  checkBounds(restrict) {
    let xDiff = 0;
    let yDiff = 0;
    const { targetX, targetY } = this.state;

    if (this.boundX[0] !== undefined && targetX < this.boundX[0]) {
      xDiff = this.boundX[0] - targetX;
    } else if (this.boundX[1] !== undefined && targetX > this.boundX[1]) {
      xDiff = this.boundX[1] - targetX;
    }

    if (this.boundY[0] !== undefined && targetY < this.boundY[0]) {
      yDiff = this.boundY[0] - targetY;
    } else if (this.boundY[1] !== undefined && targetY > this.boundY[1]) {
      yDiff = this.boundY[1] - targetY;
    }

    if (restrict) {
      if (xDiff !== 0) {
        this.setState({ targetX: xDiff > 0 ? this.boundX[0] : this.boundX[1] });
      }
      if (yDiff !== 0) {
        this.setState({ targetY: yDiff > 0 ? this.boundY[0] : this.boundY[1] });
      }
    }

    return {
      x: xDiff,
      y: yDiff,
      inBounds: xDiff === 0 && yDiff === 0,
    };
  }

  startDecelAnim() {
    const firstPoint = this.trackingPoints[0];
    const lastPoint = this.trackingPoints[this.trackingPoints.length - 1];

    const xOffset = lastPoint.x - firstPoint.x;
    const yOffset = lastPoint.y - firstPoint.y;
    const timeOffset = lastPoint.time - firstPoint.time;

    const D = timeOffset / 15 / this.multiplier;

    this.decVelX = xOffset / D || 0;
    this.decVelY = yOffset / D || 0;

    const diff = this.checkBounds();

    if (Math.abs(this.decVelX) > 1 || Math.abs(this.decVelY) > 1 || !diff.inBounds) {
      this.decelerating = true;
      requestAnimFrame(this.stepDecelAnim.bind(this));
    } else if (this.props.stop) {
      this.props.stop();
    }
  }

  stepDecelAnim() {
    if (!this.decelerating) {
      return;
    }

    this.decVelX *= this.friction;
    this.decVelY *= this.friction;

    this.setState(prevState => ({
      targetX: prevState.targetX + this.decVelX,
      targetY: prevState.targetY + this.decVelY,
    }), () => {
      const diff = this.checkBounds();

      if (
        Math.abs(this.decVelX) > this.stopThreshold
        || Math.abs(this.decVelY) > this.stopThreshold
        || !diff.inBounds
      ) {
        if (this.bounce) {
          const reboundAdjust = 2.5;

          if (diff.x !== 0) {
            if (diff.x * this.decVelX <= 0) {
              this.decVelX += diff.x * bounceDeceleration;
            } else {
              const adjust = diff.x > 0 ? reboundAdjust : -reboundAdjust;
              this.decVelX = (diff.x + adjust) * bounceAcceleration;
            }
          }
          if (diff.y !== 0) {
            if (diff.y * this.decVelY <= 0) {
              this.decVelY += diff.y * bounceDeceleration;
            } else {
              const adjust = diff.y > 0 ? reboundAdjust : -reboundAdjust;
              this.decVelY = (diff.y + adjust) * bounceAcceleration;
            }
          }
        } else {
          if (diff.x !== 0) {
            this.setState({ targetX: diff.x > 0 ? this.boundX[0] : this.boundX[1] });
            this.decVelX = 0;
          }
          if (diff.y !== 0) {
            this.setState({ targetY: diff.y > 0 ? this.boundY[0] : this.boundY[1] });
            this.decVelY = 0;
          }
        }
        this.props.update(this.state.targetX, this.state.targetY);
        requestAnimFrame(this.stepDecelAnim.bind(this));
      } else {
        this.decelerating = false;
        if (this.props.stop) {
          this.props.stop();
        }
      }
    });
  }

  render() {
    return <div ref={this.sourceEl} />;
  }
}

export default Impetus;
