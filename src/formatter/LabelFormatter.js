 
import { SVG } from '@svgdotjs/svg.js';

const ShapeLabelsFormatter = (config) => (annotation) => {
  const bodies = Array.isArray(annotation.body)
    ? annotation.body
    : [annotation.body];

  const firstTag = bodies.find((b) => b.purpose === 'tagging');

  if (firstTag) {
    // Return an HTML label, wrapped in an SVG foreignObject

    const foreignObject = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject'
    );
    foreignObject.innerHTML = ` <label xmlns="http://www.w3.org/1999/xhtml" >${firstTag.value}</label>`;

    return {
      element: foreignObject,
    };
  }
  
 
};

export default ShapeLabelsFormatter;
