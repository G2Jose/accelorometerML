import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements'
import { Accelerometer } from 'expo';
import Btn from './Btn';
// import  Btn  from 'Btn';

const DbApiUrl = 'http://50ae346a.ngrok.io'

const saveToDB = (body) => {
  fetch(DbApiUrl , {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',                                                              
      body: JSON.stringify( body )                                        
    }).then(x => console.log('successful db save'))
      .catch(y=>console.log('no good db call', y))
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.accelerationHist =  []

    this.state = {
      accelData:{},
      hist:[],
      count : 0,
    }
  }


  patchHist(data) {
    this.accelerationHist.push(data)
    this.setState({
      count: this.state.count+1,
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    /* @info Request updates every 1000ms */
    Accelerometer.setUpdateInterval(1000); 
    /* @end */

  }

  _fast = () => {
    /* @info Request updates every 16ms, which is approximately equal to every frame at 60 frames per second */
    Accelerometer.setUpdateInterval(16);/* @end */

  }

  _subscribe = () => {
    console.log('subscribed')
    /* @info Subscribe to events and update the component state with the new data from the Accelerometer. We save the subscription object away so that we can remove it when the component is unmounted*/
    // this._subscription = Accelerometer.addListener(accelerometerData => {
    //   this.setState({ accelerometerData });
    // });/* @end */

    this.accelerationHist = []
    this.setState({count:0})

    this._subscription = Accelerometer.addListener( (accelerometerData) => {
      this.setState({ accelData: accelerometerData } );
      this.patchHist(accelerometerData)

    });/* @end */

  }

  _unsubscribe = () => {
    /* @info Be sure to unsubscribe from events when the component is unmounted */
    this._subscription && this._subscription.remove();
    /* @end */
    this._subscription = null;
  }

  btnPress = (btn) => {
    const recording = this._subscription ? true : false;
    this._toggle();
    if (recording) {
      data = {}
      dateKey = String(Date.now())
      data[dateKey] = {}
      data[dateKey].x = this.accelerationHist
      data[dateKey].y = btn
      saveToDB(data)

    }
  }

  render() {

    let { x, y, z } = this.state.accelData;

    return (
      <View style={styles.container}>
      <Text>Accelerometer:</Text>
      <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>
      <Text>Count : {this.state.count}</Text>
      <Btn title='Record One' onPress={() => this.btnPress(1)} />
      <Btn title='Record Two' onPress={() => this.btnPress(2)} />
      <Btn title='Record Three' onPress={() => this.btnPress(3)} />

      </View>

    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    margin:10,
    width: 500,
  }
});