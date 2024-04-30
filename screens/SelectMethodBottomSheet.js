import { View, Text,Button ,Alert} from 'react-native'
import React ,{useMemo} from 'react'
import { BottomSheetView,BottomSheetModal } from '@gorhom/bottom-sheet'
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import PaymentModal from './PaymentModal';

export default function SelectMethodBottomSheet({bottomSheetRef,dataBill,setVisible2,setSelectPartyModelVisible,saveBill}) {

  const snapPoints1 = useMemo(()=>['1%','39%'],[]);

    const openUdhharModel =() =>{
        setSelectPartyModelVisible(true);
       }
       const handlePaymentMethods = (type) => {
        saveBill(type);
        dataBill.amount=0;
        bottomSheetRef.current?.dismiss();
       }

    const handleOpenModal2 = () => {
        if(parseFloat(dataBill.amount) <= 0){
          Alert.alert("Please enter Bill Amount;");
          bottomSheetRef.current?.dismiss();
          return;
        }
    else{
        setVisible2(true);
    } 
    }
  return (
    <View>
       <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints1}
        backdropComponent={BottomSheetBackdrop}
      >

    <BottomSheetView >
   <Text style={{marginLeft:20,color:'black',fontSize:18,fontWeight:'bold'}}>Select Payment Method </Text>

  <View style={{flexDirection:'row',marginRight:28,}}>

  <View style={{padding:20,width:'37%',marginLeft:-2}}>
    <Button 
    title='Scan QR' 
    onPress={handleOpenModal2}>
    </Button>
  </View>
  <View style={{padding:20,width:'37%',marginLeft:-2}}>
    <Button
     title='UDHAAR'
     onPress={openUdhharModel}
     />
  </View>
  <View style={{padding:20,width:'37%',marginLeft:-2}}>
    <Button
     title='Debit/Credit' 
     onPress={() => {
      handlePaymentMethods('Credit')}} 
     />
  </View>
   </View>

<View style={{flexDirection:'row',marginRight:28}}>

  <View style={{padding:20,width:'37%',marginLeft:-2}}>
    <Button
     title='Wallets' 
     onPress={() => {
      handlePaymentMethods('Wallets')}}
     />
  </View>
  <View style={{padding:20,width:'37%',marginLeft:-2}}>
    <Button 
    title='Expenses'
    onPress={() => {
      handlePaymentMethods('Expenses')}}
     />
  </View> 
   </View>
</BottomSheetView>
</BottomSheetModal>
{/* <PaymentModal setVisible2={setVisible2}/> /////////////// */}
    </View>
  )
}