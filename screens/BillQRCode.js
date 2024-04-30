import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import billclap from './billclap.png';
import whatsapp from './whatsapp.png';
import { useNavigation } from '@react-navigation/native';
import PaymentDone from './MyModal';
import Share from 'react-native-share';
import { bussinessIdAtom } from './Atoms';
import { useAtom } from 'jotai';
import { http } from '../AxiosInterceptor';


const BillQRCode = ({ route }) => {
  const navigation = useNavigation();
  const { inputField,qrCode, paymentUrl,dataBill} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const[businessId]=useAtom(bussinessIdAtom);


 

  const handleCancel = () => {
    navigation.pop();
  };

  const shareOnWhatsApp = async () => {
    const message = `Kindly make a bill payment of Rs ${dataBill.amount} on your purchase from Your Business. Click for payment: ${paymentUrl}. For more, visit: https://billclap.com`;
  
    const shareOptions = {
      title: 'Share QR Code for Payment',
      message,
      url: qrCode,
      social: Share.Social.WHATSAPP,
    };
  
    try {
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
    }
    
  };
  
  const saveBill = async (type) => {  
    if(dataBill.amount == 0){
      Alert.alert("Please enter Bill Amount!!!");
      return;
    }
   try{
     var obj =dataBill;
     obj.business_id = businessId;
     obj.payment_mode = type;
  console.log("OBJECT",obj);
      let addBill_response = await http.post('/api/instantBilling/store', obj);
      console.log('BILL',addBill_response);
      if (addBill_response.status) {
        setIsModalVisible(true);
        console.log(addBill_response.status);
       }
      }catch (e) {
        console.log(e);
    }
  };

 
  const closeModal = () => {
  setIsModalVisible(false);
  navigation.navigate("QuickKhata",{reset:true});
  };

  return (
    <View style={{ backgroundColor: 'blue', width: '100%', height: '35%', color: 'white' }}>
      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22, marginTop: 18 }}>Share QR to collect Payment of</Text>
      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22, marginTop: 16 }}> ₹ <Text style={{ fontSize: 50 }}>{dataBill.amount}</Text></Text>
      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 17, marginTop: 12, fontWeight: 'bold' }}>{inputField}</Text>

      <Image source={{ uri: qrCode }} style={{ width: '70%', height: '100%', alignSelf: 'center', marginTop: 20, borderRadius: 10 }} />

      <TouchableOpacity style={{ alignSelf: 'center', marginTop: 33, width: '90%', height: 40, backgroundColor: 'green', borderRadius: 18 }} onPress={shareOnWhatsApp}>
        <Text style={{ color: 'white', alignSelf: 'center', marginTop: 10, marginLeft: 29 }}>Share on WhatsApp</Text>
        <Image source={whatsapp} style={{ width: 30, height: 30, marginLeft: 90, marginTop: -24 }} />
      </TouchableOpacity>

      <Text style={{ marginLeft: 300, color: 'black', marginTop: 28 }}>Powered By</Text>
      <Image source={billclap} style={{ width: 88, height: 24, marginLeft: 293 }} />

      <View style={{ backgroundColor: 'white', marginTop: 60, width: '100%', height: 130 }}>
        <View style={{ marginTop: -19 }}>
          <TouchableOpacity style={{ width: '40%', height: 45, backgroundColor: 'white', borderRadius: 18, borderColor: 'black', borderWidth: 0.5, marginTop: 45, marginLeft: 25 }} onPress={handleCancel}>
            <Text style={{ alignSelf: 'center', marginTop: 12, color: 'red', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: '40%', height: 45, backgroundColor: 'blue', borderRadius: 18, marginLeft: 215, marginTop: -45 }} onPress={() => saveBill('UPI')}>
            <Text style={{ color: 'white', alignSelf: 'center', marginTop: 12, fontSize: 17, fontWeight: 'bold' }}>Paid</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PaymentDone modalVisible={isModalVisible} closeModal={closeModal} />
    </View>
  );
}

export default BillQRCode;
   