import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet,Image } from 'react-native';
import success from './success.png'

const MyModal = ({modalVisible , closeModal}) => {
  return (
    <View style={ {flex: 1,justifyContent: 'center', alignItems: 'center'}}>
     
      <Modal
        animationType="scale"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{flex:1,justifyContent:'center',alignItems:'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <View style={{backgroundColor:'white',padding:20,borderRadius:20,alignItems:'center'}}>
            <Image source={success} style={{height:100,width:100,padding:80}}/>
            <View style={{width:290,height:150}}>
            <Text style={{color:'black',marginLeft:45,marginTop:45,fontSize:17}}>Bill Recorded Successfully</Text>
            <Text style={{ fontSize: 15,marginBottom: 10,marginLeft:100,marginTop:30,backgroundColor:'green',marginRight:100,alignSelf:'center',borderRadius:18,color:'white',width:190,alignContent:'center',paddingLeft:80,height:40,paddingTop:10}} onPress={closeModal}> OK</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyModal;
