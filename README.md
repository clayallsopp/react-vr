# react-vr

Write VR web apps with React JS. Super experimental.

```
$ npm i
$ npm start
$ open http://localhost:8080/examples/index.html
# press V to swap between VR and none-VR modes
```

## API

See the [example source](examples/index.js) for the most up-to-date thing.

```
class App extends React.Component {
  render() {
    return <ReactVR.Scene renderVR={true} width={600} height={400} camera='maincamera'>
      <ReactVR.KeyboardCamera width={600} height={400} name='maincamera' />
      <Cupcake { ...cupcakeProps } />
      <Cupcake { ...cupcakeProps } position={ this.state.cupcakePosition } />
    </ReactVR.Scene>;
  }
}
```
