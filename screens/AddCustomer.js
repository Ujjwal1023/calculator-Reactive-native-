import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { http } from '../AxiosInterceptor';
import { bussinessIdAtom } from './Atoms';
import {useAtom} from 'jotai';
import { useNavigation } from '@react-navigation/native';

export default function Name({route}) {

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [payeeType, setPayeeType] = useState(''); 
  const [isGSTNumberVisible, setIsGSTNumberVisible] = useState(false); 
  const [gstNumber, setGSTNumber] = useState('');
  const[creditLimit,setCreditLimit]=useState('');
  const[isCreditLimitVisible,setIsCreditLimitVisible]=useState(false);
  const[creditPeriod,setCreditPeriod]=useState('');
  const[isCreditPeriodVisible,setIsCreditPeriodVisible]=useState();
  const[openingBalance,setOpeningBalance]=useState('');
  const[isOpeningBalanceVisible,setIsOpeningBalanceVisible]=useState(false);
  const[isAddressVisible,setAddressVisible]=useState(false);
  const[address,setAddress]=useState();
  const[pinCode,setPincode]=useState();
  const[city,setCity]=useState();
  const[state,setState]=useState();
  const[country,setCountry]=useState();

  const{initialData,setDataBill}=route.params;

  const navigation = useNavigation();


  const [businessId,setBusinessId]=useAtom(bussinessIdAtom);
 

  const toggleGSTNumber = () => {
    setIsGSTNumberVisible(!isGSTNumberVisible);
  };

  const toggleCreditLimit =()=>{
   setIsCreditLimitVisible(!isCreditLimitVisible);
  }

  const toggleCreditPeriod = ()=>{
    setIsCreditPeriodVisible(!isCreditPeriodVisible);
  }

  const toggleOpeningBalance = ()=>{
    setIsOpeningBalanceVisible(!isOpeningBalanceVisible);
  }
  const toggleBillingAddress = () =>{
    setAddressVisible(!isAddressVisible);
  }
   
  const addParty = async () => {
    try{
    const partyData = {
      party_name: name,
      phoneNumber: phoneNumber,
      email: email,
      payeeType: payeeType,
      gstNumber: isGSTNumberVisible ? gstNumber : '',
      creditLimit: isCreditLimitVisible ? creditLimit : '',
      creditPeriod: isCreditPeriodVisible ? creditPeriod : '',
      openingBalance: isOpeningBalanceVisible ? openingBalance : '',
      address: isAddressVisible ? {
        address: address,
        pinCode: pinCode,
        city: city,
        state: state,
        country: country
      } : null
    };
    
    
      var obj = partyData;
      if (obj.party_name === '') {
    
        console.log("please enter your name");
       
        return;
      }
      obj.business_id = businessId;
      console.log(obj);
      
   
      let addParty_response = await http.post('/api/parties/store', obj);
      if (addParty_response.status) {
        
        console.log(addParty_response.data);
        navigation.pop();
        setDataBill(initialData); 
      }else {
        console.log('No data found');
      }
    } catch (e) {
      console.log('Something went wrong');
    }
  };


  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View>
      <Text style={{color:'black',marginTop:8,fontSize:18,fontWeight:'bold',marginBottom:5,marginLeft:5}}>Basic details</Text>
      </View>
    <View style={{ backgroundColor: 'white',width:'98%',height:'64%',borderRadius:8,marginLeft:3}}>
      <Text style={{ marginLeft: 8, marginTop: 10, color: 'black', fontWeight: 'bold' }}>Name</Text>
      <TextInput
        style={{ width: '97%', borderWidth: 0.4, height: 50, marginLeft: 8, borderRadius: 6 }}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />
      <Text style={{ marginLeft: 8, marginTop: 15, color: 'black', fontWeight: 'bold' }}>Phone Number</Text>
      <TextInput
        style={{ width: '97%', borderWidth: 0.4, height: 50, marginLeft: 8, borderRadius: 6 }}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
      />
      <Text style={{ marginLeft: 8, marginTop: 15, color: 'black', fontWeight: 'bold' }}>Email</Text>
      <TextInput
        style={{ width: '97%', borderWidth: 0.4, height: 50, marginLeft: 8, borderRadius: 6 }}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter Email"
        keyboardType="email-address"
      />
      <Text style={{ marginLeft: 8, marginTop: 15, color: 'black', fontWeight: 'bold' }}>Payee Type</Text>
      <View style={{ flexDirection: 'row', marginLeft: 8, marginTop: 10 }}>
        <TouchableOpacity onPress={() => setPayeeType('To Collect')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: payeeType === 'To Collect' ? 'blue' : 'transparent', borderWidth: 1, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
            {payeeType === 'To Collect' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'white' }} />}
          </View>
          <Text style={{color:'black'}}>To Collect</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPayeeType('To Pay')} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: payeeType === 'To Pay' ? 'blue' : 'transparent', borderWidth: 1, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
            {payeeType === 'To Pay' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'white' }} />}
          </View>
          <Text style={{color:'black'}}>To Pay</Text>
        </TouchableOpacity>
      </View>

      <View>

        <Text style={{color:'black',marginTop:20,fontSize:18,fontWeight:'bold'}}>Optional Fields</Text>

        
        <View style={{ backgroundColor: 'white', width: '98%', height: '95%', marginTop: 5 }}>
  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <Text style={{ marginTop: 12 ,fontSize:15,color:'black' ,marginLeft:10 }} onPress={toggleGSTNumber}>+ Add GST Number</Text>
    <Icon name="angle-right" size={20} color="blue" style={{marginRight:10}}/>
  </TouchableOpacity>
  {isGSTNumberVisible && (
            <TextInput
              value={gstNumber}
              onChangeText={setGSTNumber}
              placeholder="Enter GST Number"
              style={{ borderWidth: 0.4, height: 50, marginLeft: 8, borderRadius: 6 }}
            />
          )}

  <View style={{borderWidth:0.5, width:'95%',marginLeft:9,borderColor:'lightgrey',marginTop:15}}/>

  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <Text style={{ marginTop: 10 ,fontSize:15,color:'black',marginLeft:10  }}  onPress={toggleCreditLimit}>+ Add Credit Limit</Text>
    <Icon name="angle-right" size={20} color="blue" style={{marginRight:10}}/>
  </TouchableOpacity>
  {isCreditLimitVisible && (
            <TextInput
              value={creditLimit}
              onChangeText={setCreditLimit}
              placeholder="Enter the Credit limit"
              style={{ borderWidth: 0.4, height: 50, marginLeft: 8, borderRadius: 6 }}
            />
          )}

  <View style={{borderWidth:0.5, width:'95%',marginLeft:9,borderColor:'lightgrey',marginTop:15}}/>

  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <Text style={{ marginTop:10,fontSize:15,color:'black' ,marginLeft:10   }} onPress={toggleCreditPeriod}>+ Add Credit Period</Text>
    <Icon name="angle-right" size={20} color="blue" style={{marginRight:10}} />
  </TouchableOpacity>

  {isCreditPeriodVisible && (
    <TextInput
    value={creditPeriod}
    onChangeText={setCreditPeriod}
    placeholder="Enter the Credit Period"
    style={{ borderWidth: 0.4, height: 50, marginLeft: 8, borderRadius: 6 }}
    />
     
  )}

  <View style={{borderWidth:0.5, width:'95%',marginLeft:9,borderColor:'lightgrey',marginTop:15}}/>


  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <Text style={{ marginTop: 10 ,fontSize:15,color:'black' ,marginLeft:10 }} onPress={toggleOpeningBalance}>+ Add Opening Balance</Text>
    <Icon name="angle-right" size={20} color="blue"style={{marginRight:10}} />
  </TouchableOpacity>
  {isOpeningBalanceVisible && (
  <TextInput
   value={openingBalance}
   onChangeText={setOpeningBalance}
   placeholder="Enter opening Balance"
   style={{ borderWidth: 0.4, height: 50, marginLeft: 8, borderRadius: 6 }}

  />
  )}

  <View style={{borderWidth:0.5, width:'95%',marginLeft:9,borderColor:'lightgrey',marginTop:15}}/>


  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <Text style={{ marginTop: 10 ,fontSize:15,color:'black' ,marginLeft:10 }} onPress={toggleBillingAddress}>+ Add Billing Address</Text>
    <Icon name="angle-right" size={20} color="blue" style={{marginRight:10}}/>
  </TouchableOpacity>

 
  {isAddressVisible && (
    <View>
     <Text style={{fontWeight:'bold',color:'black',marginLeft:10,marginTop:5}}>Address</Text>
    <TextInput
    value={address}
    onChangeText={setAddress}
    placeholder='Enter address'
    style={{borderWidth:0.4,height:50,marginLeft:8,borderRadius:6}}
    
    />

    <Text style={{fontWeight:'bold',color:'black',marginLeft:10,marginTop:5}}>Pincode</Text>
    <TextInput
    value={pinCode}
    onChangeText={setPincode}
    placeholder='Enter pincode'
    keyboardType="phone-pad"
    style={{borderWidth:0.4,height:50,marginLeft:8,borderRadius:6}}
    
    />

    <Text style={{fontWeight:'bold',color:'black',marginLeft:10,marginTop:5}}>City</Text>
    <TextInput
    value={city}
    onChangeText={setCity}
    placeholder='Enter city'
    style={{borderWidth:0.4,height:50,marginLeft:8,borderRadius:6}}
    
    />

   <Text style={{fontWeight:'bold',color:'black',marginLeft:10,marginTop:5}}>state</Text>
   <TextInput
    value={state}
    onChangeText={setState}
    placeholder='Enter State'
    style={{borderWidth:0.4,height:50,marginLeft:8,borderRadius:6}}
    />

    <Text style={{fontWeight:'bold',color:'black',marginLeft:10,marginTop:5}}>Country</Text>
    <TextInput
    value={country}
    onChangeText={setCountry}
    placeholder='Enter country'
    style={{borderWidth:0.4,height:50,marginLeft:8,borderRadius:6}}
    />

    </View>

  )}


  <View style={{borderWidth:0.5, width:'95%',marginLeft:9,borderColor:'lightgrey',marginTop:15}}/>

</View>
      </View>
      
      </View>
      </ScrollView>

<TouchableOpacity  style={{ backgroundColor: 'blue', width: '98%', alignSelf: 'center', marginTop: 9, borderRadius: 20, alignItems: 'center', padding: 10 ,marginBottom:20}} onPress={addParty}>
<Text style={{ color: 'white' }}>Save Customer</Text>
</TouchableOpacity>
</KeyboardAvoidingView>
   
   
  );
}
