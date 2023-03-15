import Tool from '@recogito/annotorious/src/tools/Tool';
import Pinpoint from './Pinpoint';
import EditablePinpoint from './EditablePinpoint';

/**
 * A rubberband selector for circle selections.
 */
export default class PinpointTool extends Tool {
  constructor(g, config, env) {
    super(g, config, env);

    this.pinpoint = null;
  }

  startDrawing = (x, y) => {
    this.pinpoint = new Pinpoint(x, y, this.g, this.env);
    // Emit the SVG shape with selection attached
    const {element} = this.pinpoint;
    element.annotation = this.pinpoint.toSelection();

    // Emit the completed shape...
    this.emit('complete', element);
    this.stop();
  };

  stop = () => {
    if (this.pinpoint) {
      this.pinpoint.destroy();
      this.pinpoint = null;
    }
  };

  onMouseMove = (x, y) => {
    this.pinpoint.dragTo(x, y);
  };

  get isDrawing() {
    return this.pinpoint != null;
  }

  createEditableShape = (annotation) => {
    return new EditablePinpoint(annotation, this.g, this.config, this.env);
  };
}

PinpointTool.identifier = 'pinpoint';

PinpointTool.supports = (annotation) => {
  const selector = annotation.selector('SvgSelector');
  if (selector) {
    return (
      selector.value?.match(/^<svg.*(<path)/g) &&
      annotation.renderedVia === 'pinpoint'
    );
  }
};
