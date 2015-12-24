let assetpath = function(filename) { return 'assets/' + filename; };

let React             = require('react');
let ReactDOM          = require('react-dom');
let ReactTHREEVRScene = require('../src/index');
let THREE             = require('three');

let ReactTHREE = require('react-three');

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

let acceleration = 6500;
let easing       = 20;
let wsAxis       = 'z';
let adAxis       = 'x';
let wsInverted   = false;
let adInverted   = false;
let MAX_DELTA = 0.2;
let direction = new THREE.Vector3(0, 0, 0);
let rotation = new THREE.Euler(0, 0, 0, 'YXZ');

class Camera extends React.Component {
  constructor() {
    super();

    this.loopState = {
      prevTime : window.performance.now(),
      keys     : {},
      velocity : new THREE.Vector3(),
    };

    this.state = {
      cameraPosition  : new THREE.Vector3(0,0,600),
      // cameraRotation  : new THREE.Euler(0,0,0),
      lookat          : new THREE.Vector3(0,0,0),
    };

    [ 'onKeyDown', 'onKeyUp', 'loop', 'getMovementVector' ].forEach((fnName) => {
      this[fnName] = this[fnName].bind(this);
    });
  }

  onKeyDown(event) {
    let keys = this.loopState.keys;
    keys[event.keyCode] = true;
  }

  onKeyUp(event) {
    let keys = this.loopState.keys;
    keys[event.keyCode] = false;
  }

  loop() {
    let time = window.performance.now();
    let delta = (time - this.loopState.prevTime) / 1000;
    this.loopState.prevTime = time;
    let adSign = adInverted ? -1 : 1;
    let wsSign = wsInverted ? -1 : 1;

    let velocity = this.loopState.velocity;
    let keys     = this.loopState.keys;

    if (delta > MAX_DELTA) {
      velocity[adAxis] = 0;
      velocity[wsAxis] = 0;
      return;
    }

    velocity[adAxis] -= velocity[adAxis] * easing * delta;
    velocity[wsAxis] -= velocity[wsAxis] * easing * delta;
    let position = this.state.cameraPosition;

    if (keys[65]) { velocity[adAxis] -= adSign * acceleration * delta; } // Left
    if (keys[68]) { velocity[adAxis] += adSign * acceleration * delta; } // Right
    if (keys[87]) { velocity[wsAxis] -= wsSign * acceleration * delta; } // Up
    if (keys[83]) { velocity[wsAxis] += wsSign * acceleration * delta; } // Down

    let movementVector = this.getMovementVector(delta, velocity, this.state.cameraRotation);
    //console.log(movementVector);
    // console.log(this.state.keys);

    let cameraPosition = this.state.cameraPosition.clone();
    cameraPosition.add(movementVector);
    //console.log(cameraPosition);
    this.setState({
      cameraPosition : cameraPosition
    });
  }

  getMovementVector(delta, velocity, elRotation, fly) {
    direction.copy(velocity);
    direction.multiplyScalar(delta);
    if (!elRotation) { return direction; }
    if (!fly) { elRotation.x = 0; }
    rotation.set(THREE.Math.degToRad(elRotation.x),
                 THREE.Math.degToRad(elRotation.y), 0);
    direction.applyEuler(rotation);
    return direction;
  }

  componentDidMount() {
    window.addEventListener( 'keydown', this.onKeyDown, false );
    window.addEventListener( 'keyup', this.onKeyUp, false );
    this.loopInterval = setInterval(this.loop, 10);
  }

  componentWillUnmount() {
    window.removeEventListener( 'keydown', this.onKeyDown, false );
    window.removeEventListener( 'keyup', this.onKeyUp, false );
    clearInterval(this.loopInterval);
  }

  render() {
    return <ReactTHREE.PerspectiveCamera
      name='maincamera'
      fov='75'
      aspect={w/h}
      near={1}
      far={5000}
      position={this.state.cameraPosition}
      lookat={this.state.lookat}
    />
  }
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      cupcakePosition : new THREE.Vector3(100,10,10),
      renderVR        : true,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(event) {
    if (event.keyCode === KEY_CODES.V) {
      this.setState({ renderVR : !this.state.renderVR });
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ cupcakePosition : this.state.cupcakePosition.clone().setX(this.state.cupcakePosition.x + 10) });
    }, 20);
    window.addEventListener( 'keydown', this.onKeyDown, false );
  }

  componentWillUnmount() {
    window.removeEventListener( 'keydown', this.onKeyDown, false );
  }


  render() {
    let cupcakeProps = {
      position: new THREE.Vector3(0,0,0),
      quaternion: new THREE.Quaternion()
    };
    return <ReactTHREEVRScene renderVR={this.state.renderVR} width={w} height={h} camera='maincamera'>
      <Camera />
      <Cupcake { ...cupcakeProps } />
      <Cupcake { ...cupcakeProps } position={ this.state.cupcakePosition } />
    </ReactTHREEVRScene>;
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('content')
);
