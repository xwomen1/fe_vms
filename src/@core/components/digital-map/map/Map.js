import panzoom from '../lib/panzoom';
import { clamp } from '../lib/mumath/index';

import Base from '../core/Base';
import { MAP, Modes } from '../core/Constants';
import Grid from '../grid/Grid';
import { Point } from '../geometry/Point';
import ModesMixin from './ModesMixin';
import Measurement from '../measurement/Measurement';
import { mix } from '../lib/mix';

export class Map extends mix(Base).with(ModesMixin) {
  constructor(container, options) {
    super(options);
    this.isRightClick = false; // Flag to check if it's a right-click action
    this.defaults = Object.assign({}, MAP);

    // set defaults
    Object.assign(this, this.defaults);

    // overwrite options
    Object.assign(this, this._options);

    this.center = new Point(this.center);

    this.container = container || document.body;

    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);
    canvas.setAttribute('id', 'indoors-map-canvas');

    canvas.width = this.width || this.container.clientWidth;
    canvas.height = this.height || this.container.clientHeight;

    this.canvas = new fabric.Canvas(canvas, {
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      fireRightClick: true,  // <-- enable firing of right click events
    });
    this.context = this.canvas.getContext('2d');

    this.on('render', () => {
      if (this.autostart) this.clear();
    });

    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;

    this.canvas.absolutePan({
      x: this.originX,
      y: this.originY
    });

    // this.center = {
    //   x: this.canvas.width / 2.0,
    //   y: this.canvas.height / 2.0
    // };

    this.x = this.center.x;
    this.y = this.center.y;
    this.dx = 0;
    this.dy = 0;

    try {
      this.addFloorPlan();
    } catch (e) {
      console.error(e);
    }

    if (this.showGrid) {
      this.addGrid();
    }

    this.setMode(this.mode || Modes.GRAB);

    const vm = this;
    panzoom(this.container, e => {
      vm.panzoom(e);
    });

    this.registerListeners();

    setTimeout(() => {
      this.emit('ready', this);
    }, 300);

    this.measurement = new Measurement(this);
  }

  addFloorPlan() {
    if (!this.floorplan) return;
    const vm = this;
    this.floorplan.on('load', img => {
      vm.addLayer(img);
    });
  }

  addLayer(layer) {
    // this.canvas.renderOnAddRemove = false;
    if (!layer.shape) {
      // console.error('shape is undefined');

      return;
    }
    this.canvas.add(layer.shape);
    this.canvas._objects.sort((o1, o2) => o1.zIndex - o2.zIndex);

    if (layer.shape.keepOnZoom) {
      const scale = 1.0 / this.zoom;
      layer.shape.set('scaleX', scale);
      layer.shape.set('scaleY', scale);
      layer.shape.setCoords();
      this.emit(`${layer.class}scaling`, layer);
    }
    if (layer.class) {
      this.emit(`${layer.class}:added`, layer);
    }

    // this.canvas.renderOnAddRemove = true;

    // this.update();
    this.canvas.requestRenderAll();
  }

  removeLayer(layer) {
    if (!layer || !layer.shape) return;
    if (layer.class) {
      this.emit(`${layer.class}:removed`, layer);
    }
    this.canvas.remove(layer.shape);
  }

  addGrid() {
    this.gridCanvas = this.cloneCanvas();
    this.gridCanvas.setAttribute('id', 'indoors-grid-canvas');
    this.grid = new Grid(this.gridCanvas, this);
    this.grid.draw();
  }

  moveTo(obj, index) {
    if (index !== undefined) {
      obj.zIndex = index;
    }
    this.canvas.moveTo(obj.shape, obj.zIndex);
  }

  cloneCanvas(canvas) {
    canvas = canvas || this.canvas;
    const clone = document.createElement('canvas');
    clone.width = canvas.width;
    clone.height = canvas.height;
    canvas.wrapperEl.appendChild(clone);

    return clone;
  }

  setZoom(zoom) {
    const { width, height } = this.canvas;
    this.zoom = clamp(zoom, this.minZoom, this.maxZoom);
    this.dx = 0;
    this.dy = 0;
    this.x = width / 2.0;
    this.y = height / 2.0;
    this.update();
    process.nextTick(() => {
      this.update();
    });
  }

  getBounds() {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    this.canvas.forEachObject(obj => {
      const coords = obj.getBounds();

      coords.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });

    return [new Point(minX, minY), new Point(maxX, maxY)];
  }

  fitBounds(padding = 100) {
    this.onResize();

    const { width, height } = this.canvas;

    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;

    const bounds = this.getBounds();

    this.center.x = (bounds[0].x + bounds[1].x) / 2.0;
    this.center.y = -(bounds[0].y + bounds[1].y) / 2.0;

    const boundWidth = Math.abs(bounds[0].x - bounds[1].x) + padding;
    const boundHeight = Math.abs(bounds[0].y - bounds[1].y) + padding;
    const scaleX = width / boundWidth;
    const scaleY = height / boundHeight;

    this.zoom = Math.min(scaleX, scaleY);

    this.canvas.setZoom(this.zoom);

    this.canvas.absolutePan({
      x: this.originX + this.center.x * this.zoom,
      y: this.originY - this.center.y * this.zoom
    });

    this.update();
    process.nextTick(() => {
      this.update();
    });
  }

  setCursor(cursor) {
    this.container.style.cursor = cursor;
  }

  reset() {
    const { width, height } = this.canvas;
    this.zoom = this._options.zoom || 1;
    this.center = new Point();
    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;
    this.canvas.absolutePan({
      x: this.originX,
      y: this.originY
    });
    this.x = width / 2.0;
    this.y = height / 2.0;
    this.update();
    process.nextTick(() => {
      this.update();
    });
  }

  onResize(width, height) {
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;

    width = width || this.container.clientWidth;
    height = height || this.container.clientHeight;

    this.canvas.setWidth(width);
    this.canvas.setHeight(height);

    if (this.grid) {
      this.grid.setSize(width, height);
    }

    const dx = width / 2.0 - oldWidth / 2.0;
    const dy = height / 2.0 - oldHeight / 2.0;

    this.canvas.relativePan({
      x: dx,
      y: dy
    });

    this.update();
  }

  update() {
    const canvas = this.canvas;

    if (this.grid) {
      this.grid.update2({
        x: this.center.x,
        y: this.center.y,
        zoom: this.zoom
      });
    }
    this.emit('update', this);
    if (this.grid) {
      this.grid.render();
    }

    canvas.zoomToPoint(new Point(this.x, this.y), this.zoom);

    if (this.isGrabMode() || this.isRight) {
      canvas.relativePan(new Point(this.dx, this.dy));
      this.emit('panning');
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }

    const now = Date.now();
    if (!this.lastUpdatedTime && Math.abs(this.lastUpdatedTime - now) < 100) {
      return;
    }
    this.lastUpdatedTime = now;

    const objects = canvas.getObjects();
    let hasKeepZoom = false;
    for (let i = 0; i < objects.length; i += 1) {
      const object = objects[i];
      if (object.keepOnZoom) {
        object.set('scaleX', 1.0 / this.zoom);
        object.set('scaleY', 1.0 / this.zoom);
        object.setCoords();
        hasKeepZoom = true;
        this.emit(`${object.class}scaling`, object);
      }
    }
    if (hasKeepZoom) canvas.requestRenderAll();
  }

  panzoom(e) {
    // enable interactions
    const { width, height } = this.canvas;

    // shift start
    const zoom = clamp(-e.dz, -height * 0.75, height * 0.75) / height;

    const prevZoom = 1 / this.zoom;
    let curZoom = prevZoom * (1 - zoom);
    curZoom = clamp(curZoom, this.minZoom, this.maxZoom);

    let { x, y } = this.center;

    // pan
    const oX = 0.5;
    const oY = 0.5;
    if (this.isGrabMode() || e.isRight) {
      x -= prevZoom * e.dx;
      y += prevZoom * e.dy;
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }

    if (this.zoomEnabled) {
      const tx = e.x / width - oX;
      x -= width * (curZoom - prevZoom) * tx;
      const ty = oY - e.y / height;
      y -= height * (curZoom - prevZoom) * ty;
    }
    this.center.setX(x);
    this.center.setY(y);
    this.zoom = 1 / curZoom;
    this.dx = e.dx;
    this.dy = e.dy;
    this.x = e.x0;
    this.y = e.y0;
    this.isRight = e.isRight;
    this.isRight = e.isRight;
    this.update();
  }

  setView(view) {
    this.dx = 0;
    this.dy = 0;
    this.x = 0;
    this.y = 0;
    view.y *= -1;

    const dx = this.center.x - view.x;
    const dy = -this.center.y + view.y;

    this.center.copy(view);

    this.canvas.relativePan(new Point(dx * this.zoom, dy * this.zoom));

    this.canvas.renderAll();

    this.update();

    process.nextTick(() => {
      this.update();
    });
  }

  registerListeners() {
    const vm = this;

    // Prevent the default context menu from appearing on right-click
    this.canvas.on('contextmenu', e => {
      console.log("Context here")
      e.e.preventDefault();
    });
    this.canvas.on('object:scaling', e => {
      if (e.target.class) {
        vm.emit(`${e.target.class}:scaling`, e.target.parent);
        e.target.parent.emit('scaling', e.target.parent);

        return;
      }
      const group = e.target;
      if (!group.getObjects) return;

      const objects = group.getObjects();
      group.removeWithUpdate();
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        object.orgYaw = object.parent.yaw || 0;
        object.fire('moving', object.parent);
        vm.emit(`${object.class}:moving`, object.parent);
      }
      vm.update();
      vm.canvas.requestRenderAll();
    });

    this.canvas.on('object:rotating', e => {
      if (e.target.class) {
        vm.emit(`${e.target.class}:rotating`, e.target.parent, e.target.angle);
        e.target.parent.emit('rotating', e.target.parent, e.target.angle);

        return;
      }
      const group = e.target;
      if (!group.getObjects) return;
      const objects = group.getObjects();
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class === 'marker') {
          object._set('angle', -group.angle);
          object.parent.yaw = -group.angle + (object.orgYaw || 0);

          // object.orgYaw = object.parent.yaw;
          object.fire('moving', object.parent);
          vm.emit(`${object.class}:moving`, object.parent);
          object.fire('rotating', object.parent);
          vm.emit(`${object.class}:rotating`, object.parent);
        }
      }
      this.update();
    });

    this.canvas.on('object:moving', e => {
      if (e.target.class) {
        vm.emit(`${e.target.class}:moving`, e.target.parent);
        e.target.parent.emit('moving', e.target.parent);

        return;
      }
      const group = e.target;
      if (!group.getObjects) return;
      const objects = group.getObjects();
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class) {
          object.fire('moving', object.parent);
          vm.emit(`${object.class}:moving`, object.parent);
        }
      }
      this.update();
    });

    this.canvas.on('object:moved', e => {
      if (e.target.class) {
        vm.emit(`${e.target.class}dragend`, e);
        vm.emit(`${e.target.class}:moved`, e.target.parent);
        e.target.parent.emit('moved', e.target.parent);
        this.update();

        return;
      }
      const group = e.target;
      if (!group.getObjects) return;
      const objects = group.getObjects();
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class) {
          object.fire('moved', object.parent);
          vm.emit(`${object.class}:moved`, object.parent);
        }
      }
      this.update();
    });

    this.canvas.on('selection:cleared', e => {
      const objects = e.deselected;
      if (!objects || !objects.length) return;
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class === 'marker') {
          object._set('angle', 0);
          object._set('scaleX', 1 / vm.zoom);
          object._set('scaleY', 1 / vm.zoom);
          if (object.parent) {
            object.parent.inGroup = false;
          }
          object.fire('moving', object.parent);
        }
      }
    });
    this.canvas.on('selection:created', e => {
      const objects = e.selected;
      if (!objects || objects.length < 2) return;
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class && object.parent) {
          object.parent.inGroup = true;
          object.orgYaw = object.parent.yaw || 0;
        }
      }
    });
    this.canvas.on('selection:updated', e => {
      const objects = e.selected;
      if (!objects || objects.length < 2) return;
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class && object.parent) {
          object.parent.inGroup = true;
          object.orgYaw = object.parent.yaw || 0;
        }
      }
    });

    this.canvas.on('mouse:down', e => {
      if (e.e.button === 2) { // Right mouse button
        this.isDragging = true;
        this.isRightClick = true; // Set flag for right-click action
        this.lastX = e.e.clientX;
        this.lastY = e.e.clientY;
        vm.dragObject = e.target
        e.e.preventDefault(); // Prevent context menu

      } else {
        vm.dragObject = e.target;
      }
    });

    this.canvas.on('mouse:move', e => {
      if (this.isDragging) {
        const dx = e.e.clientX - this.lastX;
        const dy = e.e.clientY - this.lastY;
        this.moveMap(dx, dy); // Assuming moveMap is defined to handle movement
        this.lastX = e.e.clientX;
        this.lastY = e.e.clientY;
      } else {
        if (this.isMeasureMode()) {
          this.measurement.onMouseMove(e);
        }
        if (vm.dragObject && vm.dragObject.clickable) {
          if (vm.dragObject === e.target) {
            vm.dragObject.dragging = true;
          } else {
            vm.dragObject.dragging = false;
          }
        }
        this.isRight = false;
        if ('which' in e.e) {
          // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
          this.isRight = e.e.which === 3;
          this.isRightClick = true
        } else if ('button' in e.e) {
          // IE, Opera
          this.isRight = e.e.button === 2;
          this.isRightClick = true
        }

        vm.emit('mouse:move', e);
      }

    });

    this.canvas.on('mouse:up', e => {
      e.e.preventDefault(); // Prevent context menu
      console.log("Event mouse up ", e, this.isRightClick, vm.dragObject)
      if (e.e.button === 2) { // Right mouse button
        if (this.isRightClick) {

          if (vm.dragObject && vm.dragObject.clickable) {
            if (vm.dragObject !== e.target) return;
            if (!vm.dragObject.dragging && !vm.modeToggleByKey) {
              vm.emit(`${vm.dragObject.class}:rightclick`, vm.dragObject.parent);
            }
            vm.dragObject.dragging = false;
          }
          vm.dragObject = null;
        }
        this.isDragging = false;
        this.isRightClick = false;
      } else {
        if (this.isMeasureMode()) {
          this.measurement.onClick(e);
        }

        this.dx = 0;
        this.dy = 0;

        if (!vm.dragObject || !e.target || !e.target.selectable) {
          e.target = null;
          vm.emit('mouse:click', e);
        }
        if (vm.dragObject && vm.dragObject.clickable) {
          if (vm.dragObject !== e.target) return;
          if (!vm.dragObject.dragging && !vm.modeToggleByKey) {
            vm.emit(`${vm.dragObject.class}:click`, vm.dragObject.parent);
          }
          vm.dragObject.dragging = false;
        }
        vm.dragObject = null;
      }
    });
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        vm.onResize();
      });
    }


    // document.addEventListener('keyup', () => {
    //   if (this.modeToggleByKey && this.isGrabMode()) {
    //     this.setModeAsSelect();
    //     this.modeToggleByKey = false;
    //   }
    // });

    // document.addEventListener('keydown', event => {
    //   if (event.ctrlKey || event.metaKey) {
    //     if (this.isSelectMode()) {
    //       this.setModeAsGrab();
    //     }
    //     this.modeToggleByKey = true;
    //   }
    // });
  }
  moveMap(dx, dy) {
    // // Calculate new position based on deltas
    this.center.x -= dx;
    this.center.y -= dy;

    // Update canvas pan position
    this.canvas.relativePan({
      x: dx,
      y: -dy,
    });


    // Re-render the map
    this.update();
  }

  unregisterListeners() {
    this.canvas.off('object:moving');
    this.canvas.off('object:moved');
  }

  getMarkerById(id) {
    const objects = this.canvas.getObjects();
    for (let i = 0; i < objects.length; i += 1) {
      const obj = objects[i];
      if (obj.class === 'marker' && obj.id === id) {
        return obj.parent;
      }
    }

    return null;
  }

  getMarkers() {
    const list = [];
    const objects = this.canvas.getObjects();
    for (let i = 0; i < objects.length; i += 1) {
      const obj = objects[i];
      if (obj.class === 'marker') {
        list.push(obj.parent);
      }
    }

    return list;
  }
}

export const map = (container, options) => new Map(container, options);
