import { View, Text, Image, FlatList } from 'react-native';
import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import businessDiscussion from './businessDiscussion.jpg';
import profile from './profile.jpeg';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bussinessIdAtom } from './Atoms';
import { useAtom } from 'jotai';

export default function Business() {
  const [businessId, setBusinessId] = useAtom(bussinessIdAtom);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState({
    business_name: '',
  });

  useEffect(() => {
    const fetchBusinessFromStorage = async () => {
      try {
        const business_data = await AsyncStorage.getItem('business_data');
        if (business_data !== null) {
          setBusinesses(JSON.parse(business_data));
        }
      } catch (error) {
        console.error('Error fetching businesses from AsyncStorage:', error);
      }
    };

    fetchBusinessFromStorage();
  }, []);

  const handleSelectBusiness = async (item) => {
    setSelectedBusiness(item);
    try {
      await AsyncStorage.setItem('business_id', item.id.toString());
      setBusinessId(item.id);
    } catch (error) {
      console.error('Error storing business_id in AsyncStorage:', error);
    }
    loginBottomSheetModalRef.current?.dismiss();
  };

  const loginBottomSheetModalRef = useRef(null);
  const navigation = useNavigation();

  const snapPoints = useMemo(() => ['30%'], []);
  const handleSheetChanges = useCallback(() => {
    console.log('Sheet changes');
  }, []);

  const handlePresentModalPress = useCallback(() => {
    loginBottomSheetModalRef.current?.present();
  }, []);

  const handleBusiness = () => {
    if (selectedBusiness.business_name) {
      navigation.navigate('Welcome');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectBusiness(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={profile} style={{ width: 50, height: 50, marginLeft: 8 }} />
        <Text style={{ marginLeft: 17, color: 'black' }}>{item.business_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const isButtonEnabled = selectedBusiness.business_name !== '';

  return (
    <View>
      <Image source={businessDiscussion} style={{ width: '100%', height: 200, marginTop: 80 }} />
      <TouchableOpacity
        style={{
          width: '85%',
          borderWidth: 0.5,
          marginLeft: 31,
          marginTop: 120,
          padding: 3,
          borderRadius: 9,
        }}
        onPress={handlePresentModalPress}
      >
        <TextInput
          placeholder="Select a business"
          value={selectedBusiness.business_name}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: isButtonEnabled ? 'blue' : 'gray',
          padding: 10,
          borderRadius: 20,
          alignSelf: 'center',
          marginTop: 60,
          width:'86%'
        }}
        onPress={handleBusiness}
        disabled={!isButtonEnabled}
      >
        <Text style={{ color: 'white', fontSize: 15 ,marginLeft:127}}>Let's Go</Text>
      </TouchableOpacity>

      <BottomSheetModal
        ref={loginBottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView>
          <View style={{ borderBottomWidth: 0.2 }}>
            <Text style={{ color: 'black', fontSize: 16, paddingBottom: 5 }}>
              Select Business
            </Text>
          </View>
          <FlatList
            data={businesses}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
