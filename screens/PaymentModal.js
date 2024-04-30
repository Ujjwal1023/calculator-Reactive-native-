import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import close from './close.png';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import { http } from '../AxiosInterceptor';

const PaymentModal = ({ modalVisible, closeModal, bottom, customerName ,dataBill,setVisible2}) => {
  const [inputField, setInputField] = useState('');
  const [scanData, setScanData] = useState(null);
  const [qrScannerVisible, setQRScannerVisible] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [showEmptyInputAlert, setShowEmptyInputAlert] = useState(false); // State to control empty input alert
  const navigation = useNavigation();

  // Load previously saved UPI ID from AsyncStorage when component mounts
  useEffect(() => {
    loadUpiId();
  }, []);

  // Function to load UPI ID from AsyncStorage
  const loadUpiId = async () => {
    try {
      const savedUpiId = await AsyncStorage.getItem('upi_id');
      if (savedUpiId) {
        setInputField(savedUpiId);
      }
    } catch (error) {
      console.log('Error loading UPI ID from AsyncStorage:', error);
    }
  };

  // Function to save UPI ID to AsyncStorage
  const saveUpiId = async (upiId) => {
    try {
      await AsyncStorage.setItem('upi_id', upiId);
    } catch (error) {
      console.log('Error saving UPI ID to AsyncStorage:', error);
    }
  };

  const getQrCode = async () => {
    if (!inputField.trim()) {
      setShowEmptyInputAlert(true); 
      return;
    }

    if (dataBill.amount === 0) {
      return;
    }

    let obj = {
      name: dataBill.party_name,
      upi_id: inputField,
      amount: dataBill.amount,
    };

    try {
      let qr_response = await http.post('/api/instantBilling/generateQr', obj);

      if (qr_response.status) {
        setVisible2(false);////
        navigation.navigate('BillQRCode', {inputField: inputField, qrCode: qr_response.data.qr_code, paymentUrl: qr_response.data.payment_url ,dataBill:dataBill});
        
        bottom.current?.dismiss();
      }

      if (qr_response.status) {
        setQrCode(qr_response.data.qr_code);
        setPaymentUrl(qr_response.data.payment_url);
      }

      // Save the entered UPI ID to AsyncStorage
      saveUpiId(inputField);
    } catch (e) {
      console.log("Qr code is not Valid");
    }
  };

  const handleInput = (text) => {
    setInputField(text);
  };

  const handleScanQR = () => {
    setQRScannerVisible(true);
  };

  const handleQRCodeRead = (data) => {
    const upiId = extractUpiId(data.data);
    setInputField(upiId);
    setScanData(data);
    setQRScannerVisible(false);
  };

  const extractUpiId = (qrData) => {
    const upiIdRegex = /upi:\/\/pay\?pa=([^&]+)/;
    const match = qrData.match(upiIdRegex);
    return match ? match[1] : '';
  };

  return (
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            {qrScannerVisible ? (
              <QRCodeScanner
                onRead={handleQRCodeRead}
                flashMode={RNCamera.Constants.FlashMode.torch}
                cameraStyle={{ flex: 1 }}
                reactivate={true}
                reactivateTimeout={500}
                showMarker={true}
                topContent={<Text>{scanData}</Text>}
                bottomContent={
                  <TouchableOpacity onPress={() => setQRScannerVisible(false)} style={{ marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Close Scanner</Text>
                  </TouchableOpacity>
                }
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, alignItems: 'center', width: '80%' }}>
                    <TouchableOpacity onPress={closeModal}>
                      <Image source={close} style={{ height: 18, width: 18, alignSelf: 'flex-end', marginLeft: 250 }} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 25, color: 'black', marginTop: 50 }}>Payment of</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: 30, color: 'blue', marginTop: 25 }}>₹</Text>
                      <Text style={{ fontSize: 60, color: 'black', marginTop: 25 }}>{dataBill.amount}</Text>
                    </View>

                    <TextInput
                      style={{ color: 'black', borderWidth: 0.2, borderColor: 'grey', borderRadius: 4, marginTop: 20, width: '100%' }}
                      onChangeText={handleInput}
                      value={inputField}
                      placeholder='Enter Your UPI ID'
                    />

                    <TouchableOpacity onPress={handleScanQR}>
                      <Text style={{ color: 'orange', marginTop: 20, fontSize: 15 }}>Scan QR</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 15, marginTop: 20, backgroundColor: 'blue', alignSelf: 'center', borderRadius: 18, color: 'white', width: 190, height: 40, textAlign: 'center', paddingTop: 10 }} onPress={getQrCode}>
                      Generate QR
                    </Text>

                   
                    {showEmptyInputAlert && (
                      <Text style={{ color: 'red', marginTop: 10 }}>Please enter your UPI ID</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        </Modal>
  );
};

export default PaymentModal;
