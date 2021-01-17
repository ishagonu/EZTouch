import React, { Component } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'



const width = Dimensions.get('window').width
export default class Home extends Component {
    constructor(props) {
      super(props)
      this.state = {
        pressed: false,
      }
    }

    handleClick()
  {
    this.props.navigation.navigate('Search')

  }

    

    render() {
        return (
            <View 
            style={styles.container}
            >
    
                <View style={styles.bubble}>
                <Text style={[styles.text]}>Let's Get Cooking!</Text>
                
    
                </View>
    
                <TouchableHighlight
                    underlayColor = 'black'
                    style = {styles.medButton}
                    onPress={()=> this.handleClick()}>
                    <Text style = {styles.medButtonText}>Start</Text>
                </TouchableHighlight>
                
            </View>
      
        )
      }

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
    
  Home.propTypes = {
    navigation: PropTypes.object,
  }