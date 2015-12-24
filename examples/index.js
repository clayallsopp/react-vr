let assetpath = function(filename) { return 'assets/' + filename; };

let React             = require('react');
let ReactDOM          = require('react-dom');
let ReactTHREEVRScene = require('../src/index');
let THREE             = require('three');
require('./orbitcontrols');

let ReactTHREE = require('react-three');

let boxgeometry     = new THREE.BoxGeometry(200,200,200);
let cupcaketexture  = THREE.ImageUtils.loadTexture( assetpath('cupCake.png') );
let cupcakematerial = new THREE.MeshBasicMaterial( { map: cupcaketexture } );

let creamtexture  = THREE.ImageUtils.loadTexture( assetpath('creamPink.png') );
let creammaterial = new THREE.MeshBasicMaterial( { map: creamtexture } );

let w = window.innerWidth-6;
let h = window.innerHeight-6;

class Cupcake extends React.Component {
  render() {
    let position = this.props.position || new THREE.Vector3(0,0,0);
    return <ReactTHREE.Object3D quaternion={this.props.quaternion} position={position}>
      <ReactTHREE.Mesh position={new THREE.Vector3(0,-100,0)} geometry={boxgeometry} material={cupcakematerial} />
      <ReactTHREE.Mesh position={new THREE.Vector3(0,100,0)} geometry={boxgeometry} material={creammaterial} />
    </ReactTHREE.Object3D>
  }
}

class App extends React.Component {
  render() {
    let camera = <ReactTHREE.PerspectiveCamera
      name='maincamera'
      fov='75'
      aspect={w/h}
      near={1}
      far={5000}
      position={new THREE.Vector3(0,0,600)}
      lookat={new THREE.Vector3(0,0,0)}
    />;
    let cupcakeProps = {
      position: new THREE.Vector3(0,0,0),
      quaternion: new THREE.Quaternion()
    };
    return <ReactTHREEVRScene width={w} height={h} camera='maincamera' orbitControls={THREE.OrbitControls}>
      { camera }
      <Cupcake { ...cupcakeProps } />
    </ReactTHREEVRScene>;
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('content')
);
