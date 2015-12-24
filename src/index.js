let React      = require('react');
let ReactTHREE = require('react-three');
let THREE      = require('three');

let VREffect = require('./VREffect');

let Scene = ReactTHREE.Scene;

let renderVRScene = function() {
  // jumping into the internals of ReactTHREE.Scene
  VREffect([ this._THREErenderer ]).render(this._THREEObject3D, this._THREEcamera);
};

class ReactTHREEVRScene extends React.Component {
  componentDidMount() {
    // change how scene is rendered
    this.refs.scene.renderScene = renderVRScene.bind(this.refs.scene);
  }

  render() {
    return <Scene ref='scene' { ...this.props } />;
  }
}

module.exports = ReactTHREEVRScene;
