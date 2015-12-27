
let React    = require('react');

let THREE    = require('three');
let ReactTHREE = require ('react-three');

let acceleration = 6500;
let easing       = 4;
let wsAxis       = 'z';
let adAxis       = 'x';
let wsInverted   = false;
let adInverted   = false;
let MAX_DELTA    = 0.2;
let direction    = new THREE.Vector3(0, 0, 0);
let rotation     = new THREE.Euler(0, 0, 0, 'YXZ');


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

    let cameraPosition = this.state.cameraPosition.clone();
    cameraPosition.add(movementVector);
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
      name={this.props.name}
      fov='75'
      aspect={this.props.width/this.props.height}
      near={1}
      far={5000}
      position={this.state.cameraPosition}
    />
  }
}

module.exports = Camera;
