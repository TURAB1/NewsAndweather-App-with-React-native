
import * as React from 'react';


import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ToastAndroid,Platform,Alert
} from 'react-native';
import axios from 'axios';


export const WeatherInfoScreen=()=>{
  const [city, setCity] = React.useState("seoul");
  const [data, setData] = React.useState(null);
  const [country,setCountry]=React.useState("korea");
  const [weatherIcon,setWeatherIcon]=React.useState(null);
  const [temperature,setTemperature]=React.useState("")
  const [weatherDetails,setWeatherDetails]=React.useState("")
  const [currentTime,setCurrentTime]=React.useState("20000-01-00 0:0");
  const [error,setError]=React.useState(false);
  

  let baseUrl="https://api.weatherapi.com/v1/forecast.json?q="+city+"&days=7&key=b2c2ffd9786543caada62933242802";
  const handleSearch=()=>{
    console.log(baseUrl);
    fetchingData(baseUrl);
  };

  React.useEffect( ()=>{
    fetchingData(baseUrl);
  },[]);
  
  // async function fetchingData(baseUrl:string){
  // fetch(baseUrl)
  //    .then((Response)=>{
  //     console.log(Response.status);
  //     if(Response.status==200){
  //     return Response.json()
  //     }else {
  //       throw new Error('HTTP response status not code 200 as expected.'); 
  //     }
  //   })
  //    .then((data)=>{
  //     setData(data);
  //     console.log(data.location.localtime);
  //     setCountry(data.location.country);
  //     setWeatherIcon(data.current.condition.icon);
  //     setTemperature(data.current.temp_c);
  //     setWeatherDetails(data.current.condition.text);
  //     setCurrentTime(data.location.localtime);
  //    })
  //     .catch(error=>{
  //       Alert.alert(error); 
  //       console.log("check city spelling");
  //     //  if (Platform.OS === 'android') {
  //     //   ToastAndroid.show("check city spelling", ToastAndroid.SHORT)
  //     // } else {
  //     //   Alert.alert("check city spelling");
  //     //   }
  //       return error;
  
  //     })   
  // }


  async function fetchingData(baseUrl:string) {
    axios.get(baseUrl)
  .then((response:any) => {
    console.log("axiosData:"+response.data);
    setData(response.data);
    console.log(response.data.location.localtime);
    setCountry(response.data.location.country);
    setWeatherIcon(response.data.current.condition.icon);
    setTemperature(response.data.current.temp_c);
    setWeatherDetails(response.data.current.condition.text);
    setCurrentTime(response.data.location.localtime);
  }, (error:any) => {
    Alert.alert("error occured"); 
  });
  }
  function getTime():number{
     let currentHourMin=currentTime.split(" ")[1];
     let currentHour=parseInt(currentHourMin.split(":")[0]);
     return currentHour;

  }

  interface Props{
    hour:any 
    icon:any 
    temperature:any 
    details:any 
  }

const ForecastToday:React.FC<Props>=({hour,icon,temperature,details})=>{
  return(
        <View  style={styles.weatherStyle}>
          {hour>9?<Text>  {hour}:00</Text>:<Text>  0{hour}:00</Text> }    
          <Image 
          style={styles.weatherIcon}
          source={{uri:"https:"+icon}}/>
          <Text> {temperature}°C</Text>  
          <Text>{details}</Text>
        </View>


    );
}

 
  const getTodayForecast=()=>{

     if (data !==null){
      return  data.forecast.forecastday.map((item:any, index:any) => {
        if(index==0){ 
         let days=item;
         return  days.hour.map((item:any, index:any) => {
          
          if(index >= getTime()){
            return (
             <ForecastToday key={index} hour={index} icon={item.condition.icon} temperature={item.temp_c} details={item.condition.text}/>
             );
           }
         });
      }
     
    });

   }
  }

  interface Props2{
    day:any
    icon:any
    maxTemp:any
    minTemp:any 
    details:any
  }

const ForecastComingDays:React.FC<Props2>=({day,icon,maxTemp,minTemp,details})=>{
  return(
        <View  style={styles.weatherStyle}>
          <Text>{new Date(day).toLocaleDateString("en-EN", { weekday: 'long' })}</Text> 
          <Text>{new Date(day).getMonth()+1}/{new Date(day).getDate()}</Text>    
          <Image 
            style={styles.weatherIcon}
            source={{uri:"https:"+icon}}/>
          <Text>Max Temp:{maxTemp}°C</Text> 
          <Text>Min Temp:{minTemp}°C</Text>  
          <Text>{details}</Text>
        </View>
    );
}

  const getComingDaysForecast=()=>{

    if (data !==null){
     return  data.forecast.forecastday.map((item:any, index:any) => {
       if(index!==0){ 
        
        return (
        <ForecastComingDays key={index} day={item.date} icon={item.day.condition.icon} maxTemp={item.day.maxtemp_c} minTemp={item.day.mintemp_c} details={item.day.condition.text}/>
            );

          }
    
      });
    }
  }

  return (
    <SafeAreaView
      style={{backgroundColor: "#007fff",width:"100%",height:"100%"}}>
        <View>
          <View 
            style={styles.searchSection}>
              <TextInput
                style={styles.searchInput}
                onChangeText={setCity}
                // value={city}
                placeholder='Enter city'
                keyboardType="ascii-capable" />
              <Pressable style={styles.searchButton} onPress={handleSearch}>
                <Image
                style={styles.searchIcon}
                source={require("../images/search_icon.png")}/>
              </Pressable>
          </View>
        </View>
      <View style={styles.weatherSection}>
        <Text style={styles.locationSection}>{city}, {country}</Text> 
        <Image 
          style={styles.weatherIcon}
          source={{uri:"https:"+weatherIcon}}/>
        <Text> {temperature}°C</Text>  
        <Text>{weatherDetails}</Text>
        <Text>{currentTime.split(" ")[1]}</Text>
        <Text>{new Date(currentTime).toLocaleDateString("en-EN", { weekday: 'short' })},{currentTime.split(" ")[0]} </Text>
      </View>
      <View style={styles.lineSection}></View>
      <View style={styles.scrollViewContainer}>
        <ScrollView style={styles.scrollViewSection} horizontal={true}>
          {
            !error?getTodayForecast():<Text>Error occured</Text>
          }
        </ScrollView>
      </View>
      <View style={styles.lineSection}></View>
      <View style={styles.scrollViewContainer}>
        <ScrollView style={styles.scrollViewSection} horizontal={true}>
          {
            getComingDaysForecast()
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  searchSection:{
    marginTop: 32,
    display:"flex",
    flexDirection:"row",
    alignContent:"center",
    justifyContent:"center"
  },
  searchInput:{
    backgroundColor:"white",
    width:150,
    height:35
  },
  searchButton:{
    backgroundColor:"white",
    height:35,
    borderRadius:10,
  },
  weatherSection:{
    marginTop:20,
    justifyContent:"space-evenly",
    flex:0,
    alignItems:"center"

  },
  
  weatherIcon:{
    width:50,
    height:50

  },
  searchIcon:{
    height:30,
    width:30

  },
  scrollViewSection:{
    display:"flex",
    flexDirection:"row"
  },
  scrollViewContainer:{
    height:150,
    marginTop:20
  },
  todayWeather:{
    display:"flex",
    flexDirection:"column"
  },

  weatherStyle:{
    marginLeft:20
  },

  lineSection:{
    backgroundColor:"black",
    height:1,
    marginTop:20
  },
  locationSection: {
    fontSize: 24,
    fontWeight: '800',
  }
});
