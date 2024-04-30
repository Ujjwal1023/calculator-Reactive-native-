import { View, Text ,Image} from 'react-native'
import React from 'react'
import { TextInput,TouchableOpacity } from 'react-native-gesture-handler'
import  createBusiness from './createBusiness.jpeg'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { http } from '../AxiosInterceptor';
import { atom } from 'jotai';


export default function CreateBusiness() {

  const updateBusinessDetail = async () => {

    if (businessName.trim() === '') {          //
      console.log('Business name cannot be empty.');//
      return;//
    }

    try {
      let obj = {business_Name : business_Name};
      let update_response = await http.post('/api/business/create/', obj);
      
      if (update_response.status) {
        
        await AsyncStorage.setItem("business_id", String(update_response.data.id));
				setBusinessId(String(update_response.data.id));
				navigate.reset({
					index: 0,
					routes: [{ name: "Welcome" }]
				});
      }
    } catch (e) {
    
      console.log(e);
    }
  };

  return (
    <View>
        <Image source={createBusiness} style={{width:'70%',height:'40%',marginLeft:56,marginTop:20}}/>
      <TextInput  style={{width:'85%',borderWidth:0.2,borderRadius:4,marginLeft:28,marginTop:135}}
       placeholder='Enter business name'
      />
         <TouchableOpacity onPress={updateBusinessDetail}>
                <View style={{ paddingTop: 50 }}>
                    <Text style={{ color: 'white', fontSize: 15, width: '90%', backgroundColor: 'blue', alignSelf: 'center', height: 45, borderRadius: 20, paddingLeft: 115, paddingTop: 13 }} >GET STARTED  ➞</Text>
                </View>
            </TouchableOpacity>
    </View>
  )
}