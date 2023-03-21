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
      'M 4637 -4760.267 C 4127.9 -4704.567 3574.7 -4479.767 3142.4 -4155.167 C 2235.7 -3477.067 1761.2 -2259.167 1982.1 -1177.567 C 2070.5 -747.267 2220.3 -407.267 2794.7 676.233 C 3207.7 1458.133 4250.8 3525.133 4758 4568.233 C 4882.9 4825.633 4992.4 5029.233 5000.1 5019.633 C 5007.8 5011.933 5215.3 4593.133 5461.1 4091.733 C 5997.1 2994.833 6623.3 1767.333 7074.8 931.633 C 7687.6 -203.667 7885.5 -632.067 7985.3 -1037.367 C 8102.5 -1519.567 8100.6 -1961.367 7977.6 -2451.267 C 7599.2 -3955.367 6187.3 -4933.167 4637 -4760.267 Z M 5240.2 -3744.067 C 5722.4 -3684.467 6150.8 -3467.467 6488.9 -3110.167 C 7111.3 -2451.267 7226.6 -1467.667 6773.2 -683.967 C 6300.6 126.733 5328.6 518.633 4431.4 257.433 C 3766.7 65.333 3225 -474.467 3032.9 -1137.267 C 2890.7 -1630.967 2936.9 -2155.367 3167.4 -2622.267 C 3369.1 -3035.267 3755.2 -3404.167 4172.1 -3584.667 C 4523.7 -3736.367 4873.3 -3788.267 5240.2 -3744.067 Z',
    )
    .attr('class', 'a9s-inner')
    .attr('data-type', 'pinpoint')
    .attr('data-position', `xywh=pixel:${x},${y},47,56`)
    .size(47)
    .move(x, y);
    
  innerPin.move(x - innerPin.width() / 4, y - innerPin.height());
  
  flatten(outerPin.node, 100); 
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
