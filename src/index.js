let React      = require('react');
let ReactTHREE = require('react-three');
let THREE      = require('three');

let VREffect = require('./VREffect');

let Scene = ReactTHREE.Scene;

class ReactTHREEVRScene extends React.Component {
  constructor() {
    super();

    this.renderVRScene = this.renderVRScene.bind(this);
  }

  scene() {
    return this.refs.scene;
  }

  componentDidMount() {
    // change how scene is rendered
    this._originalRenderScene = this.scene().renderScene;
    this.scene().renderScene = this.renderVRScene;
  }

  renderVRScene() {
    if (!this._vrRenderer) {
      this._vrRenderer = VREffect([ this.scene()._THREErenderer ]);
    }
    let renderVr = this.props.renderVR;
    if (renderVr) {
      // jumping into the internals of ReactTHREE.Scene
      this._vrRenderer.render(this.scene()._THREEObject3D, this.scene()._THREEcamera);
    }
    else {
      this._originalRenderScene();
    }
  }

  render() {
    return <Scene ref='scene' { ...this.props } />;
  }
}

module.exports = ReactTHREEVRScene;
