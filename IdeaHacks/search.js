
import {
    API_KEY
  } from 'react-native-dotenv'
import React, { Component } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Icon, SearchBar } from 'react-native-elements'
import SearchCard from './searchCard'
import PropTypes from 'prop-types'

export default class Search extends Component {
    constructor(props) {
      super(props)
      this.state = {
        pressed: false,
        value: "",
        recipes: []
      }
    }

    searchFilterFunction = (text) => {
        this.setState({
          value: text,
        })
    }

    submit = async () => {
    
       var lower = this.state.value.toLowerCase();
       console.log(lower)
       var data = []
        const result = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${lower}&number=10&instructionsRequired=true&apiKey=${API_KEY}`)
        data = await result.json()
        

        this.setState({ recipes: data.results, }, () => {
            
            console.log(data)
            console.log("SUBMIT")
            console.log(this.state.recipes)
        }); 
        
    }

    render() {
        
        var recipeList = this.state.recipes
        var recipeCards = []

        if (Array.isArray(recipeList) && recipeList.length) {
            for (var i = 0; i < recipeList.length; i++) {
                recipeCards.push(
                <SearchCard
                    id = {recipeList[i].id}
                    title = {recipeList[i].title} 
                    image = {recipeList[i].image}
                    navigation ={this.props.navigation}
                />,
                  )
            }
        }
       
       

    //    const exampleReq = `https://api.edamam.com/search?q=chicken&app_id=${APP_ID}&app_key=${APP_KEY}`;

        return (
          <View style={{ backgroundColor: '#76C6E4', flex: 1 }}>
            <View>
              <Text style={[styles.title]}>
                Search
              </Text>
              <SearchBar
              containerStyle={styles.container}
            //   inputContainerStyle={styles.inputContainer}
            //   inputStyle={styles.input}
              placeholder="Search for Recipes"
              lightTheme={true}
              round={true}
              onChangeText={(text) => this.searchFilterFunction(text)}
              onSubmitEditing={()=> this.submit()}
              autoCorrect={false}
              value={this.state.value}
      />
        <ScrollView style={{ flexDirection: 'column', marginTop: '5%' }}>{recipeCards}</ScrollView>
    
            </View>
            
          </View>
        )
      }

}

const styles = StyleSheet.create({
    title: {
      marginTop: '10%',
      textAlign: 'center',
      fontSize: 30,
      

    },
    container: {
      backgroundColor: '#76C6E4',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      width: '95%',
      height: Dimensions.get('window').height * 0.08,
      alignSelf: 'center',
    },
    inputContainer: {
      height: Dimensions.get('window').height * 0.05,
      width: '90%',
      alignSelf: 'center',
      backgroundColor: '#e7e7e7',
    },
    input: {
      textAlignVertical: 'center',
    //   fontFamily: screenStyles.medium.fontFamily,
      fontSize: 18,
    },
  })

  Search.propTypes = {
    navigation: PropTypes.object,
  }