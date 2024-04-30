import { View, Text ,Image,Alert} from 'react-native';
import React, { useRef, useState ,useMemo,useCallback} from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import billclap from './billclap.png';
import { http } from '../AxiosInterceptor';


export default function Login() {

    const [loading, setLoading] = useState(false);

    const getOtp = async number => {
      if(inputField.length!=10){
        Alert.alert('Invalid number', 'Please enter a 10-digit mobile number.');
        return;
        
      }
        setLoading(true);
        try {
          const obj = {

            mobile: inputField,
            
          };
          console.log(obj);
          let login_response = await http.post('/api/user/login', obj);
          console.log(login_response);
          if (login_response.status) {
            loginBottomSheetModalRef.current?.dismiss();
            navigation.navigate('OtpVerification', {user_id: login_response.data.id});   
            console.log({user_id : login_response.data.id});    
          }
        } catch (error) {
            console.log(error);
        
          setLoading(false);
        }
      };

    const [inputField,setInputField]=useState('');
    const navigation=useNavigation();


    const handleInputField = (text)=>{
      
            setInputField(text);
      
    }
    const loginBottomSheetModalRef = useRef(null);

    const snapPoints = useMemo(() => [ '35%'], []);
    const handlesheetChanges = useCallback(() => {
        console.log('handleSheetChanges');
      }, []);

      const handlePresentModalPress = useCallback(() => {
        loginBottomSheetModalRef.current?.present();
      }, []);

    return (
        
        <View>
            <Image source={billclap} style={{height:60,width:220,marginLeft:90,marginTop:60}}/>
            <View style={{ marginTop: 70 }}>
                <Text style={{ fontSize: 18 ,marginLeft:10}}>  ➨Invoices</Text>
                <Text style={{ paddingTop: 11, fontSize: 18,marginLeft:10 }}>  ➨Payments</Text>
                <Text style={{ paddingTop: 11, fontSize: 18 ,marginLeft:10}}>  ➨Purchases</Text>
                <Text style={{ paddingTop: 11, fontSize: 18 ,marginLeft:10}}>  ➨Reports</Text>
                <Text style={{ paddingTop: 11, fontSize: 18 ,marginLeft:10}}>  ➨Bahikhata</Text>
                <Text style={{ paddingTop: 11, fontSize: 18 ,marginLeft:10}}>  ➨Inventory</Text>
                <Text style={{ paddingTop: 11, fontSize: 18,marginLeft:10 }}>  ➨GST</Text>
                <Text style={{ paddingTop: 11, fontSize: 18 ,marginLeft:10}}>  ➨Online Store,etc..</Text>
            </View>

            <Text style={{ marginTop: 50, fontSize: 18, marginLeft: 6 }}>There's everything for your business in<Text style={{ fontSize: 19 }}> Billclap</Text></Text>

            <TouchableOpacity onPress={ handlePresentModalPress }>
                <View style={{ paddingTop: 50 }}>
                    <Text style={{ color: 'blue', fontSize: 15, width: '90%', backgroundColor: 'white', alignSelf: 'center', height: 45, borderRadius: 20, paddingLeft: 115, paddingTop: 13 }} >GET STARTED  ➞</Text>
                </View>
            </TouchableOpacity>

            <BottomSheetModal
                ref={loginBottomSheetModalRef}
                snapPoints={snapPoints}
                onChange={handlesheetChanges}
                
            >
                <BottomSheetView>
                   <BottomSheetTextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth:1,marginLeft:12,marginRight:12,marginTop:30 }}
                   onChangeText={handleInputField}
                    placeholder='Enter your number'
                   value={inputField}
                   keyboardType='numeric'
                   />
                 <TouchableOpacity  onPress={getOtp} >
                   <Text style={{alignSelf:'center',marginTop:45,backgroundColor:'lightgrey',width:350,height:50,borderRadius:22,paddingLeft:155,paddingTop:15,fontSize:15}}>Login</Text>
                   </TouchableOpacity>
                   <Text style={{color:'grey',marginLeft:50,marginTop:8}}>By continuing you agree to our <Text style={{color:'blue'}}>Terms</Text> & <Text style={{color:'blue'}}>Policy</Text></Text>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
       
    );
}
