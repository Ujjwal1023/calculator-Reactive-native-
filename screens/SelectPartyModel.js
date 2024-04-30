import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity,TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { bussinessIdAtom } from './Atoms';
import { http } from '../AxiosInterceptor';
import dayjs from 'dayjs';
import close from './close.png';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

export default function SelectPartyModel({ closeModal,modalVisible, bottom,dataBill,setVisible,setDataBill,initialDataBill,
}) {
  const [party, setParty] = useState([]);
  const [businessId] = useAtom(bussinessIdAtom);
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const snapPoints = useMemo(() => ['40%'], []);
  const handleSheetChanges = useCallback(() => {
    console.log('Sheet changes');
  }, []);

  const handlePresentBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
    closeModal(true);
  }, []);



  const addParty = async () => {
    // closeModal(true);
    try{
    const partyData = {
      party_name: name,
      phoneNumber: phoneNumber,
      
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



  useEffect(() => {
    const fetchPartyList = async () => {
      try {
        const response = await http.post('/api/parties/', { business_id: businessId });
        setParty(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPartyList();
  }, [businessId]);

  const saveUdhaar = async (partyId) => {
    try {
      const bahikhataObj = {
        party_id: partyId,
        payment_type: 'DEBIT',
        payment_date: new Date(),
        payment_mode: 'Online',
        amount: dataBill.amount,
        note: dataBill.description,
      };

      const billObj = { ...dataBill, payment_mode: 'Credit', type: 'Bill' };

      const udhaarData = {
        bahikhataObj,
        billObj,
        business_id: businessId,
      };
      bahikhataObj.payment_date = dayjs(bahikhataObj.payment_date).format('YYYY-MM-DD');

      const response = await http.post('/api/instantBilling/udhaar', udhaarData);

      if (response.status) {
        closeModal();
        setVisible(true);
        setDataBill(initialDataBill);
        console.log("Result of Udhaar:", response.status);
      }
    } catch (error) {
      console.error("Error saving Udhaar:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="scale"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, alignItems: 'center' }}>
            <View style={{ width: 320, height: 580 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: 'black', fontSize: 25 }}>Select Party</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Image source={close} style={{ height: 18, width: 18 }} />
              </TouchableOpacity>
              </View>

              <ScrollView style={{ marginTop: 20 }}>
                {party.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => saveUdhaar(item.id)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                      <Text style={{ color: 'black', fontSize: 19 }}>{item.party_name}</Text>
                      <Text style={{ color: 'green', fontSize: 25 }}>↑₹0</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity onPress={handlePresentBottomSheet}>
                <Text style={{
                  fontSize: 19,
                  backgroundColor: 'blue',
                  borderRadius: 18,
                  color: 'white',
                  textAlign: 'center',
                  padding: 10,
                  marginTop: 20,
                }}>
                  Add New Party
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetView>
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

<TouchableOpacity  style={{ backgroundColor: 'blue', width: '98%', alignSelf: 'center', marginTop: 40, borderRadius: 20, alignItems: 'center', padding: 10 ,marginBottom:20}} onPress={addParty}>
<Text style={{ color: 'white' }}>Save Customer</Text>
</TouchableOpacity>
      </View>
        </BottomSheetView>
      </BottomSheetModal>

  
    </View>
  );
}
