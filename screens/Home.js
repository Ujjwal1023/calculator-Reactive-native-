import { View, Text, Image, TouchableOpacity,BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import billclap from './billclap.png';
import newproduct from './newproduct.png';
import createbills from './createbills.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAtom } from 'jotai';
import { billId, bussinessIdAtom } from './Atoms';

export default function Home() {
  const [billData, setBillData] = useState();
  const [businessId] = useAtom(bussinessIdAtom);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const navigation = useNavigation();
  const[id , setBillId]=useAtom(billId);


  const handleMyKhataBook = () => {
    navigation.navigate('Card');
  }

  // useEffect(() => {
  //   fetchCurrentBusinessId();
  
  //   const backHandler= BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     handleBackButtonPress
  //   );

  //   return () => backHandler.remove();
  //   }, [businessId]);

  const fetchCurrentBusinessId = async () => {
    try {
      const businessId = await AsyncStorage.getItem('business_id')
      if (businessId) {
        setCurrentBusiness(businessId);
      } else {
        console.log('No business found');
      }
    } catch (error) {
      console.log('Error fetching business:', error);
    }
  };

  // const handleBackButtonPress = () =>{
  //   if(Home){
  // BackHandler.exitApp();
  // return true;
  //   }
  // };

  const handleAddKhataEntry = () => {
    setBillId(null)
    navigation.navigate('QuickKhata');
  }

  return (
    
    <View>
      <View style={{ width: '100%', height: '17%', backgroundColor: 'blue' }}>
        <Text style={{ alignSelf: 'center', fontSize: 31, color: 'white', marginTop: 19 }}>Welcome</Text>
        <Text style={{ alignSelf: 'center', fontSize: 31, color: 'white' }}>BBC ltd</Text>
      </View>

      <View>
        <Text style={{ color: 'blue', fontSize: 28, alignSelf: 'center', width: '99%', alignItems: 'center', backgroundColor: 'white', padding: 25, paddingLeft: 135, marginTop: 2, borderRadius: 5, fontWeight: 'bold' }}>Day Book</Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={handleAddKhataEntry}>
          <View style={{ marginLeft: 25, marginTop: 119, width: '68%', backgroundColor: 'white', marginRight: 80, borderRadius: 8, padding: 17 }}>
            <Image source={newproduct} style={{ width: '39%', height: 58, marginLeft: 40 }} />
            <Text style={{ color: 'black', marginLeft: 25 }}>Add khata</Text>
            <Text style={{ color: 'black', marginLeft: 42 }}>Entry</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMyKhataBook}>
          <View style={{ width: '125%', height: 130, backgroundColor: 'white', padding: 10, paddingLeft: 20, borderRadius: 8 ,marginTop:120,marginLeft:-14}}>
            <Image source={createbills} style={{ width: '50%', height: 65, marginLeft: 27 }} />
            <Text style={{ color: 'black', marginLeft: 12 }}>My KhataBook</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 140, width: '100%', backgroundColor: 'white', paddingBottom: 30, height: 190, marginBottom: 100 }}>
        <Image source={billclap} style={{ width: '55%', height: 60, alignSelf: 'center', marginTop: 55 }} />
      </View>
    </View>
  );
}
