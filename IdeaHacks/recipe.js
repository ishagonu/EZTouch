import {
    API_KEY
  } from 'react-native-dotenv'
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
export default class Recipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      image: "",
      id: this.props.navigation.state.params.id,
      ingredients: [],
      steps: []

    }
  }

  async handleClick() {
    const result = await fetch(`https://api.spoonacular.com/recipes/${this.props.navigation.state.params.id}/information?includeNutrition=false&apiKey=${API_KEY}`)
    var data = await result.json()

    var ingredientsData = data.extendedIngredients
    var instructionsData = data.instructions
    var ingredients = [];

    if (Array.isArray(ingredientsData) && ingredientsData.length) {
        for (var i = 0; i < ingredientsData.length; i++) {
            var info = ingredientsData[i].amount + " " + ingredientsData[i].unit + " " + ingredientsData[i].name 
            ingredients.push(
                info
 
              )
        }
    }

    var skip = false;
    var cleanInstructions = "";

    for (var i = 0; i < instructionsData.length; i++)
    {
        if(instructionsData[i] == '<')
        {
            skip = true;    
        }
        else if(instructionsData[i] == '>')
        {
            skip = false;
        }
        else if(!skip)
        {
            cleanInstructions += instructionsData[i]
        }
    }

    var instructions = []
    instructions = cleanInstructions.split(". ")

    for (var i = 0; i < instructions.length; i++)
    {
        instructions[i] = (i+1) + " " + instructions[i];
    }

    
    // this.setState({ ingredients: data.ingredients, steps: data.steps }, () => {
            
    //     console.log(data)
    //     console.log("START")
    //     // console.log(this.state.recipes)
    // }); 

    // console.log(result)
        console.log("START")
        console.log(data)
        console.log(ingredients)
        console.log(instructions)

        this.props.navigation.navigate('Loading', {
            ingredients: ingredients,
            instructions: instructions
        })
      
  }

  render() {
    return (
        <View 
        style={styles.container}
        >

            <View style = {{backgroundColor: '#76C6E4',}}>
            <Text style={[styles.text]}>{this.props.navigation.state.params.title}</Text>
            <View style = {styles.picContainer}>
            <Image
              source={{
                uri: this.props.navigation.state.params.image,
              }}
              style={[styles.img]}
            />
            </View>
            <TouchableHighlight
             underlayColor = 'black'
             style = {styles.medButton}
             onPress={()=> this.handleClick()}>
                <Text style = {styles.medButtonText}>Start Recipe</Text>
            </TouchableHighlight>

            </View>
            
        </View>
  
    )
  }
}

Recipe.propTypes = {
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#76C6E4', 
    
    flex: 1
  },
  picContainer: {
      backgroundColor: 'white', 
      width: 0.7 * width, 
      height: 0.7 * width, 
      alignSelf: 'center', 
      justifyContent: 'center', 
      marginVertical: '5%',
      borderRadius: 0.03 * width
    },
  img: {
      alignSelf: 'center',
      height: width*0.65,
      width: width*0.65,
      margin: '1%',


      backgroundColor: 'white'
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 30,
    marginTop: '3%'

  },
  medButton: {
    borderRadius: 30,
    // borderWidth: 2.5,
    alignSelf: 'center',
    backgroundColor: '#D1EEF9',
    paddingHorizontal: 10
  },
  medButtonText: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 20,
    textAlign: 'center',
    padding: 2,
    
  },
  
})
