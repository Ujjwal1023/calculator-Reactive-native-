import { View, Text,TextInput,BackHandler} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState ,useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { billId, bussinessIdAtom } from './Atoms';
import { http } from '../AxiosInterceptor';
import dayjs from 'dayjs'; 
import { useAtom } from 'jotai';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';


export default function Card() {
  const [billdata, setBillData] = useState([]);
  const [businessId] = useAtom(bussinessIdAtom);
  const [textField,setTextField]=useState();
  const [year,setYear]=useState();
  const todayBottomSheetModalRef = useRef(null);
  const SummaryBottomSheetModalRef =useRef(null);
  const[selectedperiod,setSelectedPeriod]=useState('Today');
  const[id,setId]=useAtom(billId);
  


  const snapPoints =useMemo(()=>['45%'],[]);//
  const snapPoints2 =useMemo(()=>['45%'],[]);

  const handleSheetChanges = useCallback(()=>{
    console.log('handleSheetChanges');
  },[]);

  const handletodaybuttomSheetOpening = useCallback (()=>{
   todayBottomSheetModalRef.current?.present();
  },[]);

  const handleSheetChanges1= useCallback(()=>{
    console.log('handleSheetChanges1');
  },[]);

  const handleSummaryBottomSheetModal =useCallback(()=>{
    SummaryBottomSheetModalRef.current?.present();
  })
   
  const handleSelected = (period)=>{
    setYear(period);
    setTextField(period);
    setSelectedPeriod(period);
    todayBottomSheetModalRef.current?.dismiss();
  }

  const navigation = useNavigation();

  const handleEdit = (item)=>{
   setId(item.id);
    navigation.navigate('QuickKhata');
  }


  const deleteCard = (date, itemToDelete) => {
    const updatedBillData = billdata.map(dataItem => {
      if (dataItem.date === date) {  

        if(dataItem.data.length===1 && dataItem.data[0]===itemToDelete){
          return null;
        }
        
        const newData = dataItem.data.filter(item => item !== itemToDelete);
        return { ...dataItem, data: newData };
      }
      return dataItem;
    });
    const filteredData = updatedBillData.filter(Boolean);

    setBillData(filteredData);
  };


  const getBillData = async () => {
    try {
      const obj = {
        business_id: businessId,
      };
      let bill_response = await http.post('/api/instantBilling/', obj);
      if (bill_response.status) {

        let obj = bill_response.data;
        console.log('test',obj);
        let newObj = obj.reduce((newObj, item) => {
          var date = dayjs(item.createdAt).format('DD-MM-YYYY');
          if (!newObj[date]) {
            newObj[date] = [];
          }
          newObj[date].push(item);
          return newObj;
        }, {});
        const finalObj = Object.keys(newObj).map(date => {
          return {
            date,
            data: newObj[date],
          };
        });
        setBillData(finalObj);
        console.log('hiiiiii' , finalObj);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getBillData();
  }, []);

  
  const CalculatetotalSales = (period) => {
    let totalSales = 0;
    let totalUdhaar = 0;
    
  
    billdata.forEach(dataItem => {
      switch (period) {
        case 'This Year':
          const thisYearStart = dayjs().startOf('year').format('DD-MM-YYYY');
          const thisYearEnd =  dayjs().endOf('year').format('DD-MM-YYYY');
          if (dayjs(dataItem.date, 'DD-MM-YYYY').valueOf()>=dayjs(thisYearStart,'DD-MM-YYYY').valueOf() && 
              dayjs(dataItem.date ,'DD-MM-YYYY').valueOf()<= dayjs(thisYearEnd,'DD-MM-YYYY').valueOf()) {
            dataItem.data.forEach(item => {
              totalSales += item.amount;
             
            });
          }
         
          break;
          case 'Today':
            const currentDate = dayjs().format('DD-MM-YYYY');
            if (dataItem.date === currentDate) {
              dataItem.data.forEach(item => {
                totalSales += item.amount;
    
              
                if (item.payment_mode === 'Udhaar') {
                  totalUdhaar += item.amount;
                }

                if(item.payment_mode==='Wallets'){
                  totalUdhaar +=item.amount;
                }
              });
            }
            break;
        case 'Yesterday':
          const yesterday = dayjs().subtract(1, 'day').format('DD-MM-YYYY');
          if (dataItem.date === yesterday) {
            dataItem.data.forEach(item => {
              totalSales += item.amount;
            });
          }
          break;
        case 'This Week':
          const thisWeek = dayjs().startOf('week').format('DD-MM-YYYY');
          const lastWeek =dayjs().endOf('week').format('DD-MM-YYYY');

          if (dayjs(dataItem.date,'DD-MM-YYYY').valueOf() >= dayjs(thisWeek,'DD-MM-YYYY').valueOf() && 
              dayjs(dataItem.date,'DD-MM-YYYY').valueOf()<=dayjs(lastWeek,'DD-MM-YYYY').valueOf()) {
            dataItem.data.forEach(item => {
              totalSales += item.amount;
            });
          }
          break;
        case 'Last Week':
          const lastWeekStart = dayjs().subtract(1, 'week').startOf('week').format('DD-MM-YYYY');
          const lastWeekEnd = dayjs().subtract(1, 'week').endOf('week').format('DD-MM-YYYY');
          if (dayjs(dataItem.date, 'DD-MM-YYYY').valueOf() >= dayjs(lastWeekStart, 'DD-MM-YYYY').valueOf()  &&
            dayjs(dataItem.date , 'DD-MM-YYYY').valueOf() <=dayjs(lastWeekEnd, 'DD-MM-YYYY').valueOf()){
            dataItem.data.forEach(item => {
              totalSales += item.amount;
            });
          }
          break;
        case 'This Month':
          const thisMonthStart = dayjs().startOf('month').format('DD-MM-YYYY');
          const thisMonthEnd = dayjs().endOf('month').format('DD-MM-YYYY');
          if (dayjs(dataItem.date, 'DD-MM-YYYY').valueOf()>=dayjs(thisMonthStart,'DD-MM-YYYY').valueOf() && 
              dayjs(dataItem.date,'DD-MM-YYYY').valueOf()<=dayjs(thisMonthEnd,'DD-MM-YYYY').valueOf()) {
            dataItem.data.forEach(item => {
              totalSales += item.amount;
            });
          }
          break;
        case 'Last Month':
          const lastMonthStart = dayjs().subtract(1, 'month').startOf('month').format('DD-MM-YYYY');
          const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month').format('DD-MM-YYYY');
          if (dayjs(dataItem.date, 'DD-MM-YYYY').valueOf()>= dayjs(lastMonthStart,'DD-MM-YYYY').valueOf  && 
              dayjs(dataItem.date,'DD-MM-YYYY').valueOf()<=  dayjs(lastMonthEnd,'DD-MM-YYYY').valueOf()) {
            dataItem.data.forEach(item => {
              totalSales += item.amount;
            });
          }
          break;
        default:
          break;
      }
    });
  
    return { totalSales: totalSales.toFixed(2), totalUdhaar: totalUdhaar.toFixed(2),totalWallets:totalUdhaar.toFixed(2)};

  }
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {billdata.map((data, index) => (
          <View key={index}>
            <Text style={{ textAlign: 'center', marginTop: 20, backgroundColor: 'grey', marginLeft: 150, marginRight: 150, borderRadius: 8, color: 'white' }}>
              {data.date}
            </Text>
            {data.data.map((item, idx) => (
              <View key={idx}>
               <Text style={{ backgroundColor: 'lightgrey', width: 180, borderTopRightRadius: 8, borderTopLeftRadius: 8, padding: 12, marginTop: 25, marginLeft: 20 }}>
              {item.payment_mode}
           <TouchableOpacity   onPress={() => handleEdit(item)}>
           <Icon name="edit" size={17} color='grey' style={{ marginLeft: 100}} />
           </TouchableOpacity>
            </Text>

                <View style={{ flexDirection: 'row', width: 180, backgroundColor: 'white', marginLeft: 20, borderBottomRightRadius: 8 }}>
                <Text style={{ color: item.payment_mode === 'Credit' ? 'orange' : item.payment_mode === 'Cash' ? 'green' : 'red', marginLeft: 10, height: 40, marginTop: 20 }}>↑</Text>
                <Text style={{ color: item.payment_mode === 'Credit' ? 'orange' : item.payment_mode === 'Cash' ? 'green' : 'red', marginLeft: 4, height: 40, marginTop: 20 }}>₹{item.amount}</Text>
                  <Text style={{ color: 'black', marginLeft: 60, height: 40, marginTop: 20 }}>{dayjs(item.createdAt).format('hh:mm A')}</Text>
                 
                  {item.party_name && item.description ? (
                  <View style={{flexDirection:'column',marginBottom:2,marginTop: 50}}>
                  <Text style={{color:'gray' ,marginLeft: -155, height: 20, }}>To:{item.party_name}</Text>
                  <Text style={{color:'gray' ,marginLeft: -155, height: 20}}>Description:{item.description}</Text>
                  </View>
                  ):null}
                  <Text style={{ marginLeft: 40 }}><Icon name="trash" size={20} color="red" style={{ marginRight: 10 }} onPress={()=> deleteCard(data.date,item)} /></Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      
            <TouchableOpacity onPress={handletodaybuttomSheetOpening}  >
              <View>
              <TextInput style={{ marginLeft: 20, color: 'blue',marginBottom:-28,width:'20%',backgroundColor:'lightgrey',borderRadius:9,height:34,alignItems:'center',padding:4}}
               placeholder='Today'
               editable={false}
               value={textField}
               />
              </View>
            </TouchableOpacity>
 
           <TouchableOpacity>
            <Text style={{ marginLeft: 270, color: 'blue' ,marginBottom:-12}} onPress={handleSummaryBottomSheetModal} >View Summary</Text>
            </TouchableOpacity>

      <View style={{ marginTop: 20, marginBottom: 12 }}>
        <BottomSheetModal
         ref={todayBottomSheetModalRef}
         index={0}
         snapPoints={snapPoints}
         onChange={handleSheetChanges}
        >

          <BottomSheetView>
           <View>
            <Text style={{fontSize:18,marginLeft:9,color:'black'}}>Select Year Filter</Text>
            <Text style={{borderBottomWidth:0.2,marginTop:-12}}></Text>

          <TouchableOpacity onPress={() => handleSelected('This Year')}>
         <Text style={{marginLeft:9,color:'black',fontSize:17,marginTop:18}}>This Year</Text>
         </TouchableOpacity>

           
           <TouchableOpacity onPress={() => handleSelected('Today')}>
            <Text style={{marginLeft:9,color:'black',fontSize:17,marginTop:18}}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSelected('Yesterday')}>
            <Text style={{marginLeft:9,color:'black',fontSize:17,marginTop:18}}>Yesterday</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSelected('This Week')}>
            <Text style={{marginLeft:9,color:'black',fontSize:17,marginTop:18}}>This Week</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSelected('Last Week')}>
            <Text style={{marginLeft:9,color:'black',fontSize:17,marginTop:18}}>Last Week</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSelected('This Month')} >
            <Text style={{marginLeft:9,color:'black',fontSize:17,marginTop:18}}>This Month</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSelected('Last Month')}>
            <Text style={{marginLeft:9,color:'black',fontSize:17,marginTop:18}}>Last Month</Text>
            </TouchableOpacity>

           </View>
            
          </BottomSheetView>
        </BottomSheetModal>


        <BottomSheetModal
        ref={SummaryBottomSheetModalRef}
        index={0}
        snapPoints={snapPoints2}
        onChange={handleSheetChanges1}
        >
          <BottomSheetView>
           <View>
            <Text style={{fontWeight:'bold',color:'black',fontSize:22,marginLeft:11}}>Today Summary</Text>
            <Text style={{borderBottomWidth:0.2,marginTop:-8}}></Text>
            <View style={{flexDirection:'row'}}>
            <View>
              <Text style={{marginLeft:18,marginTop:32,fontSize:17}}>Total Cash Sales</Text>
              <Text style={{marginLeft:18,color:'black',fontSize:18}}>₹ {CalculatetotalSales(selectedperiod).totalSales}</Text>
            </View>

            <View>
            <Text style={{marginLeft:90,marginTop:32,fontSize:17}}>Total Udhar Sales</Text>
            <Text style={{marginLeft:90,marginTop:3,color:'black',fontSize:18}}>{CalculatetotalSales(selectedperiod).totalUdhaar}</Text>
            </View>
            </View>
            <View style={{flexDirection:'row'}}>
            <View>
              <Text style={{marginLeft:18,marginTop:32,fontSize:17}}>Total Expenses</Text>
              <Text style={{marginLeft:18,color:'black',fontSize:18}}>₹{CalculatetotalSales(selectedperiod).totalSales - CalculatetotalSales(selectedperiod).totalUdhaar}</Text>
            </View>

            <View>
            <Text style={{marginLeft:100,marginTop:32,fontSize:17}}>Total UPI Sales</Text>
            <Text style={{marginLeft:100,marginTop:3,color:'black',fontSize:18}}>₹ 0.00</Text>
            </View>
            </View>
            <View style={{flexDirection:'row'}}>
            <View>
              <Text style={{marginLeft:18,marginTop:32,fontSize:17}}>Total Card Sales</Text>
              <Text style={{marginLeft:18,color:'black',fontSize:18}}>₹ 0.00</Text>
            </View>

            <View>
            <Text style={{marginLeft:90,marginTop:32,fontSize:17}}>Total Wallet Sales</Text>
            <Text style={{marginLeft:90,marginTop:3,color:'black',fontSize:18}}>{CalculatetotalSales(selectedperiod).totalWallets}</Text>
            </View>
            </View>
           </View>
          </BottomSheetView>
        </BottomSheetModal>



        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: 'black', marginLeft: 20 }}>Total Sales</Text>
          <Text style={{ color: 'black', marginLeft: 40 }}>Total Udhaar</Text>
          <Text style={{ color: 'black', marginLeft: 60 }}>Total Expenses</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: 'green', marginLeft: 21 }}>₹ {CalculatetotalSales(selectedperiod).totalSales}</Text>
          
          <Text style={{ color: 'orange', marginLeft: 72 }}>₹ {CalculatetotalSales(selectedperiod).totalUdhaar}</Text>
          <Text style={{ color: 'red', marginLeft: 101 }}>₹{CalculatetotalSales(selectedperiod).totalSales - CalculatetotalSales(selectedperiod).totalUdhaar}</Text>
        </View>
      </View>
    </View>
  );
}
