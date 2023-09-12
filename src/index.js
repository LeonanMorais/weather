//import Geolocation from 'react-native-geolocation-service';
import {View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator,
         ScrollView, RefreshControl, Image, Dimensions, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react' 
import * as location from 'expo-location'
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';

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
                        uri: 'http://openwathermap.org/img/wn/${current.icon}@4x.png',
                    }}
                    />
                    <text style={styles.currentTemp}>
                        {Math.round(forecast.current.temp)}°C
                    </text>
                </view>

                <text style={styles.currentDescription}>
                    {current.currentDescription}
                </text>

                <View style={styles.extraInfo}>
                    <view style={styles.info}>
                        <image
                            source={require('../assets/humidity.png')}
                            style={{width:40,height:40, borderRadius:40/2, marginLeft:50}}
                        />
                        <text style={styles.text}>
                            {forecast.current.humidity}%
                        </text>
                        <text style={styles.text}>
                            Humidity
                        </text>
                    </view>
                </View>

                <view style={styles.subtitle}>
                    <text style={styles.subtitle}>Hourly forecast</text>
                </view>

                <FlatList
                    horizontal
                    data={forecast.hourly.slice(0,24)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(hour) => {
                        const weather = hour.item.weather[0];
                        var dt = new Date(hour.item.dt * 1000);
                        return(
                            <view style={styles.hour}>
                                <text style={{fontWeight: 'bold', color:'#346751'}}>
                                    {dt.toLocaleDateString().replace(/:\d+/,'')}
                                </text>
                                <text style={{fontWeight: 'bold', color:'#346751'}}>
                                    {Math.round(forecast.current.temp)}°C
                                </text>
                                <image
                                    style={styles.samllIcon}
                                    source={{
                                        uri: 'http://openwathermap.org/img/wn/${weather.icon}@4x.png'
                                    }}
                                />
                                <text style={{fontWeight:'bold', color:'#346751'}}>
                                    {weather.description}
                                </text>
                            </view>
                        )
                    }}
                />
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
    },
    current:{
        flexDirection:'row',
        alignItems:'center',
        alignContent:'center',
    },
    largeIcon:{
        width:300,
        height:250
    },
    currentTemp:{
        fontSize:32,
        fontWeight:'bold',
        textAlign:'center',
    },
    currentDescription:{
        width:'100%',
        textAlign:'center',
        fontWeight:'200',
        fontSize:24,
        marginBottom:5
    },
    info:{
        width: Dimensions.get('screen').width/2.5,
        backgroundColor:'rgba(0,0,0,0.5)',
        padding:10,
        borderRadius:15,
        justifyContent:'center'
    },
    extraInfo:{
        flexDirection:'row',
        marginTop:20,
        justifyContent:'space-between',
        padding:10
    },
    text:{
        fontSize:20,
        color:'#fff',
        textAlign:'center'
    },
    subtitle:{
        fontSize:24,
        maringVertical:12,
        merginLeft:7,
        color:'#C84B31',
        fontWeight:'bold'
    },
    hour:{
        padding:6,
        alignItems:'center',
    },
    samllIcon:{
        width:100,
        height:100
    }
})