import React from 'react'
import {
    Platform,
    PermissionsAndroid,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ToastAndroid,
  View,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
// import BluetoothSerial from 'react-native-bluetooth-serial'
import { BleManager } from 'react-native-ble-plx';
// import BluetoothSerial from 'react-native-bluetooth-serial'

const width = Dimensions.get('window').width
export default class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.manager = new BleManager()
    this.state = {
      ingredients: this.props.navigation.state.params.ingredients,
      steps: this.props.navigation.state.params.instructions,
      info: "", 
      values: {},
      connected: false,
      bleConnect: false

    }
  }

  handleClick()
  {
    this.props.navigation.navigate('Home')

  }

  info(message) {
    this.setState({info: message})
  }

  error(message) {
    this.setState({info: "ERROR: " + message})
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}})
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
    //   this.info("Scanning...")
    console.log("Scanning")
      console.log(device)
      
      if (error) {
        this.error(error.message)
        return
      }

      if (device.name === 'Long name works now') {
        // this.info("Connecting to TI Sensor")
        this.manager.stopDeviceScan()
        device.connect()
          .then((device) => {
            console.log("Discovering services and characteristics")
            this.setState({
                bleConnect: true
            })
            return device.discoverAllServicesAndCharacteristics()
          })
          .then(() => {
            console.log("Listening...")
          }, (error) => {
            this.error(error.message)
            console.log("Error...")
          })
      }
    });
  }

async requestLocationPermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Example App',
        'message': 'Example App access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the location")
      alert("You can use the location");
    } else {
      console.log("location permission denied")
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
}

connect = device => {
    console.log(device);
    BluetoothSerial.connect(device)
      .then((res) => {
        console.log(res)
        console.log(`Connected to device ${device}`);

        ToastAndroid.show(`Connected to device`, ToastAndroid.SHORT);

        this.setState({ connected: true })
      })
      .catch((err) => console.log((err.message)))
  }

  async UNSAFE_componentWillMount() {
    await this.requestLocationPermission()
    if (Platform.OS === 'ios') {
        this.manager.onStateChange((state) => {
          if (state === 'PoweredOn') this.scanAndConnect()
        })
      } else {
        this.scanAndConnect()
      }

    // BluetoothSerial.enable()
    // .then((res) => this.setState({ isEnabled: true }))
    // .catch((err) => Toast.showShortBottom(err.message))
    // console.log("connecting...")
    // this.connect("F0:08:D1:D1:99:96")

  }

  

  
      

  render() {
    return (
        <View 
        style={styles.container}
        >

            <View style={styles.bubble}>
            <Text style={[styles.text]}>Starting Recipe!</Text>
            

            </View>

            <TouchableHighlight
                underlayColor = 'black'
                style = {styles.medButton}
                onPress={()=> this.handleClick()}>
                <Text style = {styles.medButtonText}>Cancel</Text>
            </TouchableHighlight>
            {!this.state.bleConnect && (<Text style={[styles.text, {color: 'white'}]}>Scanning...</Text>)}

            {this.state.bleConnect && (<Text style={[styles.text, {color: 'white'}]}>Connected!</Text>)}
            
        </View>
  
    )
  }
}

Loading.propTypes = {
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({

container: {
    backgroundColor: '#76C6E4',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
},
  
bubble: {
    backgroundColor: 'white',
    margin: '1%',
    width: '80%',
    height: width*0.8,
    alignSelf: 'center',
    borderRadius: width*0.40,
    alignContent: 'center',
    justifyContent: 'center'
  },
  
  text: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#76C6E4',

  },
  medButton: {
    borderRadius: 40,
    // borderWidth: 2.5,
    alignSelf: 'center',
    margin: '10%',
    backgroundColor: '#D1EEF9',
  },
  medButtonText: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  
})
