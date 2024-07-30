class MagicScroll {
  constructor(target, speed = 80, smooth = 12, current = 0, passive = false) {
    if (typeof document !== 'undefined' && target === document) {
      target = document.scrollingElement
        || document.documentElement
        || document.body.parentNode
        || document.body;
    } // cross-browser support for document scrolling

    this.speed = speed;
    this.smooth = smooth;
    this.moving = false;
    this.scrollTop = current * 3000;
    this.pos = this.scrollTop;
    this.frame = typeof document !== 'undefined' && target === document.body && document.documentElement
      ? document.documentElement
      : target; // Safari is the new IE

    if (typeof target !== 'undefined') {
      target.addEventListener('wheel', this.scrolled.bind(this), { passive });
      target.addEventListener('DOMMouseScroll', this.scrolled.bind(this), { passive });
    }
  }

  scrolled(e) {
    e.preventDefault(); // disable default scrolling

    const delta = this.normalizeWheelDelta(e);

    this.pos += -delta * this.speed;

    // this.pos = Math.max(0, Math.min(this.pos, 3000)); // limit scrolling

    if (!this.moving) this.update(e);
  }

  normalizeWheelDelta(e) {
    if (e.detail) {

      if (e.wheelDelta) return (e.wheelDelta / e.detail / 40) * (e.detail > 0 ? 1 : -1);

      // Opera

      return -e.detail / 3; // Firefox
    }

    return e.wheelDelta / 120; // IE, Safari, Chrome
  }

  update(e) {
    this.moving = true;

    const delta = (this.pos - this.scrollTop) / this.smooth;

    this.scrollTop += delta;

    // this.scrollTop = Math.round(this.scrollTop);

    if (this.onUpdate) {
      this.onUpdate(delta, e);
    }

    if (Math.abs(delta) > 1) {
      requestFrame(() => {
        this.update();
      });
    } else {
      this.moving = false;
    }
  }
}

export default MagicScroll;

const requestFrame = (function () {
  // requestAnimationFrame cross browser
  if (typeof window !== 'undefined') {
    return (
      window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.oRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function (func) {
        window.setTimeout(func, 1000 / 60);
      }
    );
  }

  return function (func) {
    setTimeout(func, 1000 / 60);
  };
}());
