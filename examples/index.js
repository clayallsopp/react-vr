let assetpath = function(filename) { return 'assets/' + filename; };

let React    = require('react');
let ReactDOM = require('react-dom');
let ReactVR  = require('../src/index');
let THREE    = require('three');

let { ReactTHREE } = ReactVR;

let boxgeometry     = new THREE.BoxGeometry(200,200,200);
let cupcaketexture  = THREE.ImageUtils.loadTexture( assetpath('cupCake.png') );
let cupcakematerial = new THREE.MeshBasicMaterial( { map: cupcaketexture } );

let creamtexture  = THREE.ImageUtils.loadTexture( assetpath('creamPink.png') );
let creammaterial = new THREE.MeshBasicMaterial( { map: creamtexture } );

let w = window.innerWidth;
let h = window.innerHeight;

class Cupcake extends React.Component {
  render() {
    let position = this.props.position || new THREE.Vector3(0,0,0);
    return <ReactTHREE.Object3D quaternion={this.props.quaternion} position={position}>
      <ReactTHREE.Mesh position={new THREE.Vector3(0,-100,0)} geometry={boxgeometry} material={cupcakematerial} />
      <ReactTHREE.Mesh position={new THREE.Vector3(0,100,0)} geometry={boxgeometry} material={creammaterial} />
    </ReactTHREE.Object3D>
  }
}

const KEY_CODES = {
  V : 86
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      cupcakePosition : new THREE.Vector3(100,10,10),
      renderVR        : true,
      direction       : 1,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(event) {
    if (event.keyCode === KEY_CODES.V) {
      this.setState({ renderVR : !this.state.renderVR });
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      let direction = this.state.direction;
      let offset = 10 * direction;
      let position = this.state.cupcakePosition.clone().setZ(this.state.cupcakePosition.z + offset);
      if (this.state.cupcakePosition.z > 500) {
        direction = -1;
      }
      else if (this.state.cupcakePosition.z < 0) {
        direction = 1;
      }
      this.setState({
        cupcakePosition : position,
        direction       : direction,
      });

    }, 20);
    window.addEventListener( 'keydown', this.onKeyDown, false );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener( 'keydown', this.onKeyDown, false );
  }


  render() {
    let cupcakeProps = {
      position: new THREE.Vector3(0,0,0),
      quaternion: new THREE.Quaternion()
    };
    return <ReactVR.Scene renderVR={this.state.renderVR} width={w} height={h} camera='maincamera'>
      <ReactVR.KeyboardCamera width={w} height={h} name='maincamera' />
      <ReactTHREE.AmbientLight color={0xffffff} />
      <ReactTHREE.PointLight />
      <ReactVR.Sphere { ...cupcakeProps } />
      <ReactVR.Sphere { ...cupcakeProps } position={ this.state.cupcakePosition } />
    </ReactVR.Scene>;
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('content')
);
