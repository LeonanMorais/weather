import {View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator,
         ScrollView, RefreshControl, Image } from 'react-native'
import React, {useEffect, useState} from 'react' 
import * as location from 'expo-location'

const openWhaterKey = 'f975e54e09d653cbaa734f1ef8fae551'
let url = 'https://home.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}';

const Weather = () => {
    const [forecast, setForecast] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const loadForecast = async () => {
        setRefreshing(true);
        // ask for permission to access location 
        const { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied'); // if permission is denied, show an alert
        }

        // get the current location
        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

        // fetches the weather data from the openwathermap api
        const response = await fetch('${url}&lat=${location.coords.latitude}&lon${location.coords.longitude}');
        const data = await response.json(); // convert the response to json 

        if(!response.ok){
            Alert.alert('Error','Something went wrong'); // if the response is not ok, show alert
        }else{
            setForecast(data); // set the data to the state 
        }
        setRefreshing(false);
    }   

    //useEffect is a hook that runs after the component is redered

    useEffect(() => {
        loadForecast();
    },[]);
    if(!forecast){ // if the forecast is not loaded, show a loading indicator
        return(
            <SafeAreaView style={StyleSheet.loading}>
                <ActivityIndicator size='large'/>
            </SafeAreaView>
        );
    }

    const current = forecast.current.weather[0];

    return (
        <SafeAreaView style={StyleSheet.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl 
                    refreshing={refreshing} onRefresh={() => loadForecast()} />
                }
                style={{marginTop:50}}
             >
                <Text style={StyleSheet.title}>
                    Current Weather
                </Text>
                <text style={{alignItems: 'center', textAlign: 'center'}}>
                    Your Location
                </text>
                <view style={style.current}>
                    <image
                    style={styles.largeIcon}
                    source={{
                        uri: 'http://openwathermap.org/img/wn/${}'
                    }}
                    />

                </view>
            </ScrollView>
        </SafeAreaView>
    )
}


export default Weather

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECDBBA'
    },
    title: {
        textAlign: 'center',
        fontSize:36,
        fontWeight:'bold',
        color:'#c84B31'
    }
})