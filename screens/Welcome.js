import { View, Text ,Image} from 'react-native';
import React, { useRef, useState ,useMemo,useCallback} from 'react';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import billbackground from './billbackground.jpeg';

export default function Business() {
    
   const [textField,setTextField]=useState();
    const [selectedBusiness,setSelectedBusiness]=useState(null);
    const loginBottomSheetModalRef = useRef(null);
    const navigation=useNavigation();


    const snapPoints = useMemo(() => [ '50%'], []);
    const handlesheetChanges = useCallback(() => {
        console.log('handleSheetChanges');
      }, []);

      const handlePresentModalPress = useCallback(() => {
        loginBottomSheetModalRef.current?.present();
      }, []);

      const handleNext = ()=>{
        navigation.reset({
          index : 0,
          routes : [{name : 'Home'}]
        })
      }

      const handleSelected = (business) =>{
        setSelectedBusiness(business);
        setTextField(business);

        loginBottomSheetModalRef.current?.dismiss();
      }

    return (
        <View>

            <Image source={billbackground} style={{marginLeft:90,width:210,height:190,marginTop:20}}/>
              <View>
      <Text style={{fontSize:28,marginLeft:58,marginTop:40,color:'black'}}>Welcome to Billclap!</Text>
      <Text style={{fontSize:15,color:'black',marginLeft:20,marginTop:20}}>- Effortlessly manage your business's finances and</Text>
      <Text style={{fontSize:15,color:'black',marginLeft:150}}>transactions.</Text>
      <Text style={{fontSize:15,color:'black',marginLeft:20}}>-Track expenses,generate invoices, and stay organized</Text>
      <Text style={{fontSize:15,color:'black',marginLeft:20}}>-Save time and boost your business's efficiency.</Text>

      <Text style={{color:'black',marginLeft:18,marginTop:80,fontWeight:'bold'}} >Select Your Business Type</Text>

      <TouchableOpacity onPress={ handlePresentModalPress}>
      <View>
        <TextInput style={{marginLeft:18,width:'90%',borderWidth:0.2,padding:14,borderRadius:6,marginTop:10,color:'black'}} 
        placeholder='select business'
        editable={false}
        value={textField}
        />
      </View>
      </TouchableOpacity>
     
    </View>

     
            <BottomSheetModal
                ref={loginBottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handlesheetChanges}
                
            >
                <BottomSheetView>
                
                    <Text style={{borderBottomWidth:0.5,padding:8,fontWeight:'bold',color:'black'}}>  Select Business Type</Text>
                    <ScrollView>
                   <TouchableOpacity onPress={()=>handleSelected('Retail Business')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Retail Business</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={()=>handleSelected('Food and Beverage Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Food and Beverage Businesses </Text>
                    </TouchableOpacity>
                  
                  <TouchableOpacity  onPress={()=>handleSelected(' Service-Based Businesss')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Service-Based Businesss</Text>
                    </TouchableOpacity>

                  <TouchableOpacity  onPress={()=>handleSelected(' Manufacturing Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}}>  Manufacturing Businesses</Text>
                    </TouchableOpacity>


                   <TouchableOpacity  onPress={()=>handleSelected(' E-commerce and Online Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  E-commerce and Online Businesses</Text>
                    </TouchableOpacity>

                  <TouchableOpacity  onPress={()=>handleSelected('Hospitality and Tourism Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Hospitality and Tourism Businesses</Text>
                    </TouchableOpacity>

                  <TouchableOpacity  onPress={()=>handleSelected('Entertainment and Media Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Entertainment and Media Businesses</Text>
                    </TouchableOpacity>

                  <TouchableOpacity  onPress={()=>handleSelected('Automotive Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Automotive Businesses</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Health and Wellness Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Health and Wellness Businesses</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Agricultural Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Agricultural Businesses</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Technology and Startups')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Technology and Startups</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Financial Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Financial Businesses</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Energy and Utilities Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Energy and Utilities Businesses</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Construction and Real Estate')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Construction and Real Estate</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Textile and Apparel')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Textile and Apparel</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('jewelry and Accessories')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  jewelry and Accessories</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Beauty and Personal Care')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Beauty and Personal Care</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Art and Craft Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Art and Craft Businesses</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Environmental Businesses')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Environmental Businesses</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Transportation and Logistics')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Transportation and Logistics</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Others')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Others</Text>
                    </TouchableOpacity>
                  <TouchableOpacity  onPress={()=>handleSelected('Others')}>
                    <Text style={{padding:8,color:'black',fontSize:17}} >  Others</Text>
                    </TouchableOpacity>
                    
                    </ScrollView>
                   
                </BottomSheetView>
            </BottomSheetModal>
            <TouchableOpacity disabled={!textField} onPress={handleNext}>
                      <View>
                        <Text style={{color:'blue',marginLeft:330,fontSize:16,marginTop:140}} >Next</Text>
                      </View>
                    </TouchableOpacity>
        </View>
    );
}

 
 