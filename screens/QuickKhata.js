
import { useState, useCallback, useRef,useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import MyModal from './MyModal';
import PaymentModal from './PaymentModal';
import { billId, bussinessIdAtom } from './Atoms';
import { useAtom } from 'jotai';
import { http } from '../AxiosInterceptor';
import {useRoute} from '@react-navigation/native';
import SelectPartyModel from './SelectPartyModel';
import Calculator from './Calculator';
import SelectMethodBottomSheet from './SelectMethodBottomSheet';

const initialDataBill = {
party_name : '',
type : 'BILL',
amount : 0,
description : '',
payment_mode : '',
mobile_no : ''
};

export default function QuickKhata() {
  const route=useRoute();
  const[id]=useAtom(billId);
  const[businessId]=useAtom(bussinessIdAtom);
  const [dataBill, setDataBill] = useState(initialDataBill);    /////
    const [modalVisible , setVisible] = useState(false);
    const[modalVisible2,setVisible2]=useState(false);
    const[enteredAmount,setEnteredAmount]=useState("0");
    const[selectPartyModelVisible,setSelectPartyModelVisible]=useState(false);
    
    const handleCloseModal2 = () => {
      setVisible2(false);
    }

    useEffect(()=>{
      if(id){
        getBillData();
      }
    },[])

    useEffect(() => {
      if (route.params?.reset) {
        setDataBill(initialDataBill);
      }
    }, [route.params]);
    

   const handleCloseSelectPartyModel=()=>{
    // setVisible(true);
    setSelectPartyModelVisible(false);
    bottomSheetModalRef1.current?.dismiss();
    
   }

    const handleCloseModal = () => {
      setVisible(false);
      setEnteredAmount(0);
    }
   
    const saveBill = async (type) => {
      if (dataBill.amount === 0) {
        Alert.alert("Please enter Bill Amount!");
        return;
      }
  
      const obj = {
        ...dataBill,
        business_id: businessId,
        payment_mode: type,
      };
  
      try {
         let response = await http.post('/api/instantBilling/store', obj);
        
  
        if (response.status) {
         
          setVisible(true);
          setDataBill(initialDataBill);////////////////
        }
  
      } catch (error) {
        console.error(error);
      }
    };
  
    const getBillData = async () => {////
      try {
        const obj = {
          business_id: businessId,
          id: id,
        };
        let bill_response = await http.post(
          '/api/instantBilling/detail',
          obj,
        );
        if (bill_response.status) {
          setDataBill(bill_response.data);
        }
      } catch (e) {
       console.log("error:",e);
      }
    };

  const bottomSheetModalRef= useRef(null);
  const bottomSheetModalRef1=useRef(null);

  useEffect(()=>{
    bottomSheetModalRef.current?.present();
  },[]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentModalPress1 = useCallback(() => {
    bottomSheetModalRef1.current?.present();
  }, []);

  return (
    
    <KeyboardAvoidingView
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
  >
   
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={{ textAlign: 'center', fontSize: 22, color: 'black' }}>Welcome to Quick Khata</Text>
        <Text style={{ textAlign: 'center', fontSize: 15, color: 'black', paddingVertical: 5 ,marginBottom:20}}>Your Rapid Billing System</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ borderRadius: 8, marginLeft: 10, fontSize: 17, color: 'black' }}>To :</Text>
          <TextInput
            onChangeText={(value) =>{
              setDataBill({
                ...dataBill,
                party_name:value
              })
            }}
            value={dataBill.party_name}
            style={{ flex: 1, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 9, marginLeft: 10 }}
            placeholder="Enter Customer Name/Mobile"
          />
        </View>
        
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'black', fontSize: 19,marginTop:20 }}>Calculate Bill Amount</Text>
        </View>
        
        <TouchableOpacity onPress={handlePresentModalPress}>
  <View style={{ alignItems: 'center',flexDirection:'row'}}>
    <Text style={{ color: 'blue', fontSize: 30 ,marginLeft:150}}>₹</Text>
    <Text style={{ color: 'black', fontSize: 50, marginLeft:4}}>{dataBill.amount}</Text>
  </View>
</TouchableOpacity>
        <TextInput
          onChangeText={(value) => {
            setDataBill({
              ...dataBill,
              description : value
            })
          }}
          value={dataBill.description}
          style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 9,height: 130, marginTop: 50 }}
          placeholder="Enter Bill Description"
        />
      </View>

      <View style={{flexDirection:'row',marginTop:220}}>
      <TouchableOpacity style={{width:'45%',height:45,backgroundColor:'blue',borderRadius:19,marginLeft:14}} onPress={handlePresentModalPress1}>
       <Text style={{color:'white',alignSelf:'center',padding:10}}>Select Mode</Text>
       </TouchableOpacity>

       <TouchableOpacity style={{width:'45%',height:45,backgroundColor:'blue',borderRadius:19,marginLeft:14}} onPress={()=>saveBill('Cash')}>
       <Text style={{color:'white',alignSelf:'center',padding:10}}>Quick Khata</Text>
       </TouchableOpacity>
      </View>




<SelectMethodBottomSheet bottomSheetRef={bottomSheetModalRef1} dataBill={dataBill} setVisible2={setVisible2} setSelectPartyModelVisible={setSelectPartyModelVisible} saveBill={saveBill}/>
<Calculator bottomSheetRef={bottomSheetModalRef} dataBill={dataBill} setDataBill={setDataBill}/>
<MyModal closeModal={handleCloseModal} modalVisible={modalVisible} />
<PaymentModal closeModal={handleCloseModal2} modalVisible={modalVisible2} dataBill={dataBill} bottom={bottomSheetModalRef1} saveBill={saveBill} setVisible2={setVisible2} />
<SelectPartyModel closeModal={handleCloseSelectPartyModel} modalVisible={selectPartyModelVisible} bottom={bottomSheetModalRef1} dataBill={dataBill} setVisible={setVisible} setDataBill={setDataBill} initialDataBill={initialDataBill}/>
    </View>
    </KeyboardAvoidingView>
  );
  }

