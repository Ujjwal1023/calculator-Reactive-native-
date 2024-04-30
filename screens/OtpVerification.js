import React, { useState, useRef ,useEffect} from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation} from '@react-navigation/native'; 
import VERIFICATION from './VERIFICATION.jpg';
import { http } from '../AxiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function OtpVerification({route}) {
  const [otp, setOtp] = useState([...Array(4)].map(() => ''));
  const inputRefs = useRef([]);
  const navigate = useNavigation();
  const {user_id} = route.params;
  const [timer,setTimer]=useState(30);
  const [isOtpComplete,setIsOtpSubmit]=useState(false);
  const [businessList, setBusinessList] = useState([]);

 useEffect(()=>{
  const intervalId=setInterval(() =>{
  if(timer>0){
    setTimer(timer-1);
  }
 },1000);

 return ()=>clearInterval(intervalId);

 },[timer])

 const handlefor30sec = () =>{
  if(timer==0){
  setTimer(30);
  }
 }

  const verifyOtp = async (number) => {

    console.log("OTP:", number);
    console.log("User ID:", user_id);
    setIsOtpSubmit(true);

  try {
    const obj = {
      otp: number,
      user_id: user_id, 
    };
    console.log(obj);
    let otp_repsonse = await http.post('/api/user/verify/', obj);
    setIsOtpSubmit(false);
    
    if (otp_repsonse.status) {
      console.log(otp_repsonse);
      await AsyncStorage.setItem('access_token',otp_repsonse.access_token);
      
      
      let business_list_response= await http.get('/api/business');
      console.log("Number of businesses:", business_list_response.data.length);
      
      
      if(business_list_response.data.length>0){

         await AsyncStorage.setItem( 'business_data', JSON.stringify(business_list_response.data)),
         console.log('businessList:', business_list_response.data);

        
          navigate.reset({
            index:0,
            routes:[{name:'Business'}],
          })
        }
        else{
      console.log('createBusiness');
          navigate.reset({
            index:0,
            routes:[{name:'CreateBusiness'}],
          })
        }
      }
        
        else{
          console.log("OTP Response status is false");
           return;
           }
        }
        catch(e){
          setIsOtpSubmit(false);
        }
      };

  const handleInput = (index, value) => {
    // Accept only numeric values and limit length to 1 character
    if (!/^\d*$/.test(value) || value.length > 1) {
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move focus to the next input
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index) => {
    if (index > 0) {
      inputRefs.current[index - 1].focus();
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = '';
    setOtp(updatedOtp);
  };

  return (
    <View>
      <Image source={VERIFICATION} style={{ height: 100, width: 200, marginLeft: 90, marginTop: 110, borderRadius: 8 }} />
      <Text style={{ textAlign: 'center', marginTop: 15, color: 'black', fontSize: 18 }}>Verification</Text>
      <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: 30, marginTop: 40, fontSize: 16 }}>Enter the 4 digit <Text style={{ fontSize: 17 }}>OTP </Text>number that was sent to your </Text>
      <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: 75, fontSize: 16,marginTop: -20 }}>mobile number</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={{
              borderBottomWidth: 2,
              borderBottomColor: '#2563eb',
              width: 40,
              textAlign: 'center',
              fontSize: 20,
              marginHorizontal: 10,
            }}
            ref={ref => (inputRefs.current[index] = ref)}
            onChangeText={value => handleInput(index, value)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(index);
              }
            }}
            value={digit}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>

      <View style={{justifyContent: 'center', marginTop: 20 }}>
        <Text style={{ color: 'blue', fontSize: 17, marginLeft: 165 }}>{timer} sec</Text>
        <TouchableOpacity  onPress={handlefor30sec}>
        <Text style={{ color: 'grey', fontSize: 17, marginLeft: 160,marginTop:40 }}>Resend</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => verifyOtp(otp.join(''))} style={{marginTop:70}}>
          <Text style={{ backgroundColor: 'blue', color: 'white', height: 50, borderRadius: 20, paddingHorizontal: 30, paddingTop: 13, fontSize: 18 ,width:'90%',marginLeft:20,paddingLeft:150}}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
