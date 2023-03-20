import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import {
  drawEmbeddedSVG,
  svgFragmentToShape,
  toSVGTarget,
} from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import {SVG_NAMESPACE} from '@recogito/annotorious/src/util/SVG';
import {
  format,
  setFormatterElSize,
} from '@recogito/annotorious/src/util/Formatting';
import {parseRectFragment} from '@recogito/annotorious/src/selectors/RectFragment';

import {drawPin} from './Pin';
// TODO optional: mask to dim the outside area
//import Mask from './FreehandMask';

const getPoints = (shape) => {
  const pointList = shape.getAttribute('d').split('L');
  const points = [];
  if (pointList.length > 0) {
    var point = pointList[0].substring(1).trim().split(' ');
    points.push({x: parseFloat(point[0]), y: parseFloat(point[1])});

    for (let i = 1; i < pointList.length; i++) {
      var point = pointList[i].trim().split(' ');
      points.push({x: parseFloat(point[0]), y: parseFloat(point[1])});
    }
  }

  return points;
};

const getBBox = (shape) => {
  return shape.querySelector('.a9s-inner').getBBox();
};

/**
 * An editable freehand drawing.
 */
export default class EditablePinpoint extends EditableShape {
  constructor(annotation, g, config, env) {
    super(annotation, g, config, env);

    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseup', this.onMouseUp);

    // 'g' for the editable free drawing compound shape
    this.containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');
    const position = null; // this.getAnnotationPosition(annotation);

    if (position) {
      this.shape = drawPin(position.x, position.y);
    } else {
      this.shape = drawEmbeddedSVG(annotation);
    }

    // TODO optional: mask to dim the outside area
    // this.mask = new Mask(env.image, this.shape.querySelector('.a9s-inner'));

    // this.containerGroup.appendChild(this.mask.element);

    this.elementGroup = document.createElementNS(SVG_NAMESPACE, 'g');
    this.elementGroup.setAttribute('class', 'a9s-annotation editable selected');
    this.elementGroup.appendChild(this.shape);

    this.containerGroup.appendChild(this.elementGroup);
    g.appendChild(this.containerGroup);

    format(this.shape, annotation, config.formatter);

    this.shape
      .querySelector('.a9s-inner')
      .addEventListener('mousedown', this.onGrab(this.shape));

    // The grabbed element (handle or entire shape), if any
    this.grabbedElem = null;

    // Mouse grab point
    this.grabbedAt = null;
  }

  setPoints = (points) => {
    // Not using .toFixed(1) because that will ALWAYS
    // return one decimal, e.g. "15.0" (when we want "15")
    const round = (num) => Math.round(10 * num) / 10;

    var str = points.map((pt) => `L${round(pt.x)} ${round(pt.y)}`).join(' ');
    str = 'M' + str.substring(1);

    const inner = this.shape.querySelector('.a9s-inner');
    inner.setAttribute('d', str);

    const outer = this.shape.querySelector('.a9s-outer');
    outer.setAttribute('d', str);

    const {x, y, width, height} = outer.getBBox();

    setFormatterElSize(this.elementGroup, x, y, width, height);
  };

  // TODO optional: handles to stretch the shape
  /*  stretchCorners = (draggedHandleIdx, anchorHandle, mousePos) => {
    const anchor = this.getHandleXY(anchorHandle);
  }*/

  onGrab = (grabbedElem) => (evt) => {
    this.grabbedElem = grabbedElem;
    const pos = this.getSVGPoint(evt);
    this.grabbedAt = {x: pos.x, y: pos.y};
  };

  onMouseMove = (evt) => {
    const constrain = (coord, delta, max) =>
      coord + delta < 0 ? -coord : coord + delta > max ? max - coord : delta;

    if (this.grabbedElem) {
      const pos = this.getSVGPoint(evt);

      const {x, y, width, height} = getBBox(this.shape);

      if (this.grabbedElem === this.shape) {
        const {naturalWidth, naturalHeight} = this.env.image;

        const dx = constrain(x, pos.x - this.grabbedAt.x, naturalWidth - width);
        const dy = constrain(
          y,
          pos.y - this.grabbedAt.y,
          naturalHeight - height,
        );

        const inner = this.shape.querySelector('.a9s-inner');
        const updatedPoints = getPoints(inner).map((pt) => ({
          x: pt.x + dx,
          y: pt.y + dy,
        }));

        this.grabbedAt = pos;

        this.setPoints(updatedPoints);

        this.emit('update', toSVGTarget(this.shape, this.env.image));
      }
    }
  };

  onMouseUp = (evt) => {
    this.grabbedElem = null;
    this.grabbedAt = null;
    // this.emit('update', toSVGTarget(this.shape, this.env.image));
  };

  get element() {
    return this.elementGroup;
  }

  updateState = (annotation) => {
    const points = getPoints(svgFragmentToShape(annotation));
    this.setPoints(points);
  };

  destroy = () => {
    this.containerGroup.parentNode.removeChild(this.containerGroup);
    super.destroy();
  };

  getAnnotationPosition = (annotation) => {
    const position = annotation.targets
      ?.find((t) => t.renderedVia?.name === 'pinpoint')
      ?.body?.find((b) => b.purpose === 'position');

    if (position) {
      const {value} = position;
      const format = value.includes(':')
        ? value.substring(value.indexOf('=') + 1, value.indexOf(':'))
        : 'pixel';
      const coords = value.includes(':')
        ? value.substring(value.indexOf(':') + 1)
        : value.substring(value.indexOf('=') + 1);

      let [x, y, w, h] = coords.split(',').map(parseFloat);

      if (format.toLowerCase() === 'percent') {
        x = (x * this.env.image.naturalWidth) / 100;
        y = (y * this.env.image.naturalHeight) / 100;
        w = (w * this.env.image.naturalWidth) / 100;
        h = (h * this.env.image.naturalHeight) / 100;
      }

      return {x, y, w, h};
    }
    return null;
  };
}