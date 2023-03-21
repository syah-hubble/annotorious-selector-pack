 
import { SVG } from '@svgdotjs/svg.js';

const ShapeLabelsFormatter = (config) => (annotation) => {
  const bodies = Array.isArray(annotation.body)
    ? annotation.body
    : [annotation.body];

  const firstTag = bodies.find((b) => b.purpose == 'tagging');

  if (firstTag) {
    const group = SVG().group();

    // var safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // if (safari) {
    //   group.add(SVG().circle(15).attr('class', 'rect').fill('white'));
    // } else {
    //   group.add(SVG().circle(30).attr('class', 'rect').fill('white'));
    // }

    group.add(
      SVG()
        .group()
        .attr('class', 'circle')
        .add(
          SVG()
            .path('M0,30a30,30 0 1,0 60,0a30,30 0 1,0 -60,0')
            .attr('transform-origin', 'center')
            .size(40)
        )
    );
    group.add(
      SVG()
        .group()
        .attr('class', 'a9s-shape-label')
        .add(SVG().text(firstTag.value).attr('text-anchor', 'middle'))
    );

    // const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // svg.appendChild(group.node);
    return {
      element: group.node,
      className: firstTag.value,
    };

    
  
  }
};

export default ShapeLabelsFormatter;
