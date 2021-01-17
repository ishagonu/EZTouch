import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'

const width = Dimensions.get('window').width
export default class SearchCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      image: "",
      id: this.props.id
    }
  }

  handleClick() {
    this.props.navigation.navigate('Recipe', {
        id: this.props.id,
        title: this.props.title,
        image: this.props.image
    })
  }

  render() {
    return (
        <TouchableHighlight 
        underlayColor = 'white'
        onPress={()=> this.handleClick()}
        style={styles.container}
        >

            <View>
            <Image
              source={{
                uri: this.props.image,
              }}
              style={[styles.img]}
            />
            <Text style={[styles.text]}>{this.props.title}</Text>
            </View>
        </TouchableHighlight>
  
    )
  }
}

SearchCard.propTypes = {

  title: PropTypes.string,
  id: PropTypes.string,
  image: PropTypes.string,
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: '1%',
    width: '90%',
    alignSelf: 'center',
    borderRadius: width*0.03,
    height: width*0.9,
    justifyContent: 'space-evenly'
  },
  img: {
      alignSelf: 'center',
      height: width*0.6,
      width: width*0.6,
      margin: '1%',
  },
  text: {
    alignSelf: 'center',
    padding: 5,
    fontSize: 15,
    fontWeight: 'bold'

  }
  
})
