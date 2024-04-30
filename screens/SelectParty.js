import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import close from './close.png';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useAtom } from 'jotai';
import { bussinessIdAtom } from './Atoms';
import { http } from '../AxiosInterceptor';
import PaymentDone from './MyModal';

export default function SelectParty() {
  const [party, setParty] = useState([]);
  const [businessId] = useAtom(bussinessIdAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();


  const handleModal = (party_id) => {
    saveUdhaar(party_id);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    navigation.navigate("QuickKhata");
    
  };

 

  const listingOfParty = async () => {
    try {
      const obj = {
        business_id: businessId,
      };
      let list_Of_Party = await http.post('/api/parties/', obj);
      setParty(list_Of_Party.data);
      console.log("list of parties:", list_Of_Party);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    listingOfParty();
  }, []);



  const saveUdhaar = async (party_id) => {
    
    try {
      let bahikhataObj = {
        businessId:businessId,
        party_id:party_id,
        
      };
      console.log("TEST:",bahikhataObj);
      let billObj = dataBill;
      billObj.payment_mode = 'Credit';
      billObj.type = 'Bill';
      let obj = {
        bahikhataObj: bahikhataObj,
        billObj: billObj,
      };
      obj.business_id = businessId;
      obj.bahikhataObj.payment_date = dayjs(obj.payment_date).format(
        'YYYY-MM-DD',
      );
      let udhaar_response = await http.post('/api/instantBilling/udhaar', obj);
      if (udhaar_response.status) {
        // setPartyLoader(false);
        // setSuccessVisible(true);
        // setPartyVisible(false);
        // setFirstNumber('');
        // setSecondNumber([]);
        // setResult(0);
        // resetDataBill();
        // handleOpenPaymentMode(-1);
        // await analytic('bill_created');
      }
    } catch (e) {
    
      console.log("error:",e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: 'lightgrey', padding: 20, alignItems: 'center' }}>
        <Text style={{ color: 'black', fontSize: 25, marginTop: -20}}>Select Party</Text>

        <ScrollView>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {party.map((item, index) => (
              <TouchableOpacity key={index} onPress={()=>handleModal(item.id)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                  <Text style={{ color: 'black', fontSize: 19 }}>{item.party_name}</Text>
                  <Text style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 12, color: 'black', marginLeft: 20 }}><Text style={{ color: 'green', fontSize: 25 }}>↑</Text>₹0</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity style={{ position: 'absolute', bottom: 20, left: 100, right: 100, backgroundColor: 'blue', borderRadius: 18, height: 45, justifyContent: 'center', alignItems: 'center',marginTop:30 }} onPress={handleAddParty}>
        <Text style={{ fontSize: 15, color: 'white'}}>Add new Party</Text>
      </TouchableOpacity>

      <PaymentDone modalVisible={isModalVisible} closeModal={closeModal} />
    </View>
  );
}
