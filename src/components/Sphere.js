let React      = require('react');
let THREE      = require('three');
let ReactTHREE = require('react-three');

class Sphere extends React.Component {
  render() {
    var geometry = new THREE.SphereGeometry( 100, 8 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

    return <ReactTHREE.Object3D quaternion={this.props.quaternion} position={this.props.position}>
      <ReactTHREE.Mesh position={new THREE.Vector3(0,0,0)} geometry={geometry} material={material} />
    </ReactTHREE.Object3D>
  }
}

module.exports = Sphere;
