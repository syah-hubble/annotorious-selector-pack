import {SVG_NAMESPACE} from '@recogito/annotorious/src/util/SVG';
import {SVG} from '@svgdotjs/svg.js';

/**
 * Draws an SVG circle, either from an annotation, or an
 * (cx, cy, r)-tuple.
 */

export const drawPin = (x, y) => {
  const g = document.createElementNS(SVG_NAMESPACE, 'g');

  const outerPin = SVG()
    .path(
      'M356.36,202.77c-3.45,201.59-303.3,201.56-306.72,0C53.09,1.19,352.94,1.22,356.36,202.77Z',
    )
    .attr('class', 'a9s-outer')
    .stroke({color: 'white', width: 1.5})
    .size(47)
    .move(x, y);
  outerPin.move(x - outerPin.width() / 4, y - outerPin.height());

  const innerPin = SVG()
    .path(
      'M182.14,530.41C28.52,307.7,0,284.85,0,203,0,90.89,90.89,0,203,0S406,90.89,406,203c0,81.85-28.52,104.7-182.14,327.41A25.38,25.38,0,0,1,182.14,530.41Z',
    )
    .attr('class', 'a9s-inner')
    .attr('data-type', 'pinpoint')
    .attr('data-position', `xywh=pixel:${x},${y},47,56`)
    .size(47)
    .move(x, y);

  innerPin.move(x - innerPin.width() / 4, y - innerPin.height());

  flatten(outerPin.node, 100);
  flatten(innerPin.node, 100);
  g.appendChild(outerPin.node);
  g.appendChild(innerPin.node);

  return g;
};

export const setPinSize = (g, cx, cy, r) => {
  const innerPath = g.querySelector('.a9s-inner');
  const outerPath = g.querySelector('.a9s-outer');

  const innerPathData = SVG(innerPath).move(cx, cy);
  const outerPathData = SVG(outerPath).move(cx, cy);

  innerPath.setAttribute('d', innerPathData.node.getAttribute('d'));

  outerPath.setAttribute('d', outerPathData.node.getAttribute('d'));
};

/**
 * Flattens paths that contain curves into points
 * @param {*} path
 * @param {*} num total number of points to create.
 * higher results is smoother shapes but increases the size
 */
export const flatten = (path, num) => {
  var l = path.getTotalLength();
  var p = path.getPointAtLength(0);
  var d = `M${p.x} ${p.y}`;
  for (var i = l / num; i <= l; i += l / num) {
    p = path.getPointAtLength(i);
    d += `L${p.x} ${p.y}`;
  }
  path.setAttribute('d', d + 'z');
};
