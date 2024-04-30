/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState ,useEffect} from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuickKhata from './screens/QuickKhata';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Card from './screens/Card';
import MyModal from './screens/MyModal';
import Login from './screens/Login';
import OtpVerification from './screens/OtpVerification';
import Business from './screens/Business';
import Welcome from './screens/Welcome';
import AxiosInterceptor from './AxiosInterceptor';
import CreateBusiness from './screens/CreateBusiness';
import Home from './screens/Home';
import { Provider, useAtom } from 'jotai';
import { createStore } from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { bussinessIdAtom } from './screens/Atoms';
import BillQRCode from './screens/BillQRCode';
import SelectParty from './screens/SelectParty';
import AddCustomer from './screens/AddCustomer';
import SelectPartyModel from './screens/SelectPartyModel';



const Stack=createNativeStackNavigator();


const App = ()=>{
  const [businessId, setBusinessId] = useAtom(bussinessIdAtom);
  const[initialRoute,setInitialRoute]=useState(null);
 
   
  useEffect(()=>{

    const checkInitialRoute = async () =>{
      try{
      
        const token= await AsyncStorage.getItem('access_token');
        console.log('token:',token);
         if(token){
          
          const businessid= await AsyncStorage.getItem('business_id');
           console.log('businessId :',businessid);
          if(businessid){
            setInitialRoute('Home'); 
            setBusinessId(businessid);
          }
          else{
            setInitialRoute('Business');
          }
         }
         else{
          setInitialRoute('Login');
         }
      }
    
    catch{
      // console.log('Error checking initial route:', error);
    }
  };
    checkInitialRoute();
  },[]);
  
if(!initialRoute)
{
  return <ActivityIndicator/>
}

 return(
  
  
  <GestureHandlerRootView style={{ flex: 1 }}>
    
    <BottomSheetModalProvider>
  <NavigationContainer>
  <AxiosInterceptor>

  <Stack.Navigator initialRouteName={initialRoute}
   headerShown={{headerShown:false}}
  >   
    <Stack.Screen options={{headerShown:false}} name='Home' component={Home} /> 
    <Stack.Screen name='Card' component={Card}/>
  <Stack.Screen name='SelectPartyModel' component={SelectPartyModel}/>
  <Stack.Screen name='AddCustomer' component={AddCustomer}/>
  <Stack.Screen options={{headerShown:false}} name='SelectParty' component={SelectParty}/>
  <Stack.Screen name='BillQRCode' component={BillQRCode}/>
  <Stack.Screen options={{headerShown:false}}name='Login' component={Login}/>

  <Stack.Screen name='Welcome' component={Welcome}/>
  <Stack.Screen options={{headerShown:false}} name='OtpVerification' component={OtpVerification}/>
  <Stack.Screen name='Business' component={Business}/>
  <Stack.Screen name='QuickKhata' component={QuickKhata}/>
  
  <Stack.Screen name='MyModal' component={MyModal}/>
  <Stack.Screen name='CreateBusiness' component={CreateBusiness}/>
  
  </Stack.Navigator>
  </AxiosInterceptor>
</NavigationContainer>
</BottomSheetModalProvider>
  </GestureHandlerRootView>
 )
}
export default App;

