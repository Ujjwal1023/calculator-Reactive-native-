
import { View, Text, TextInput, Button, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';

import React, {useState,useRef,useEffect,useMemo,useCallback} from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export default function Calculator({bottomSheetRef, dataBill,setDataBill}) {
   
        const[expression,setExpression]=useState('');
        const[result,setResult]=useState('');
        const totalAmountRef=useRef(null);
        const [totalAmount, setTotalAmount] = useState(0); 
        const[enteredAmount,setEnteredAmount]=useState(0);
        
        const handleContinue = () =>{  
            setDataBill({...dataBill,amount:totalAmount});
          bottomSheetRef?.current.dismiss();
        }
        
        
        useEffect(() => {
        
        if (!isNaN(parseFloat(result))) {
        const totalAmount = parseFloat(result);
        setTotalAmount(totalAmount);
        totalAmountRef.current = totalAmount;
        }
        }, [result]);
        
        const handleButtonPress=(buttonValue)=>{           
          let newExpression = expression;
        if (buttonValue === 'C') {
        newExpression = ''; 
        } else if (buttonValue === '⌫') {
        newExpression = newExpression.slice(0, -1);
        } else if (expression === '' && ['+', '-', '*', '/', '%'].includes(buttonValue)) {
        
        return;
        } else if (
        ['+', '-', '*', '/', '%'].includes(buttonValue) &&
        expression.endsWith(buttonValue)
        ) {
        
        newExpression = newExpression.slice(0, -1) + buttonValue;
        } else if (
        ["+", "-", "*", "/", "%"].includes(buttonValue) &&
        ["+", "-", "*", "/", "%"].includes(expression.slice(-1))
        ) {
      
        return;
        } else if (expression === '' && buttonValue === '0') {
        newExpression = '0';
        } else if (buttonValue === '.') {
        if (expression.includes('.')) {
          return;
        }
        newExpression = newExpression ? newExpression + buttonValue : '0.';
        } else {
        newExpression = newExpression ? newExpression + buttonValue : buttonValue;
        }
        
        try {
        const evalResult = eval(newExpression);
        if (!isNaN(evalResult)) {
          setTotalAmount(evalResult); 
        } else {
          setTotalAmount(0); 
        
        }
        
        setExpression(newExpression); 
       
        } catch (error) {
        setTotalAmount(0); 
        setExpression(newExpression);
        }
        };
        
          const handleBackSpace = () => {
            if (!expression) return; 
            
            let newExpression = expression.slice(0, -1); // Remove the last character
            
            // If the new expression ends with an operator, remove it
            if (['+', '-', '*', '/', '%'].includes(expression.slice(-1))) {
                newExpression = expression.slice(0, -1);
            }
            
            setExpression(newExpression); // Update expression state
            
            // If the new expression is empty, reset the result
            if (!newExpression) {
                setResult('');
                setTotalAmount(0);
            } else {
                // Check if the new expression is a valid arithmetic expression
                const isValidExpression = /^[-+\d. ]+$/.test(newExpression);
                if (isValidExpression) {
                    // Evaluate the new expression and set the result
                    try {
                        const evalResult = eval(newExpression);
                        setResult(isNaN(evalResult) ? 'error' : evalResult.toString());
                    } catch (error) {
                        return
                    }
                } else {
                    return
                }
            }
        };

        const snapPoints  = useMemo(() => ['1%', '85%'], []);
       
      
        
        return (
          <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={BottomSheetBackdrop}
        >
        
        <View
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        >
        <View style={{ display:'flex',justifyContent : 'center',backgroundColor:'white' , paddingHorizontal : 10}}>
        <View style={{display : 'flex' , flexDirection : 'column' , justifyContent : 'center'}}>
        <Text style={{fontSize:40,color:'black'}}>{expression}</Text>
        <Text style={{fontFamily:'Arabic',fontSize:29,marginLeft:3}}>{result}</Text>
        </View>
        
        
        <View> 
        
        <View style={{display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , rowGap : 10 ,width : '100%'}}>
        
        
        <View style={{flexDirection:'row',display:'flex' , justifyContent : 'flex-start' , width : "100%"}}>
        
        <TouchableOpacity style={{width : '18%',marginRight:10}} onPress={()=>handleButtonPress('1')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
        <Text style={{color:'white',fontSize:21}}>1</Text></View>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={{width : '18%',marginRight:10 }} onPress={()=>handleButtonPress('2')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
        <Text style={{color:'white',fontSize:21}}>2</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%' ,marginRight:10}}  onPress={()=>handleButtonPress('3')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
        <Text style={{color:'white',fontSize:21}}>3</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%',marginRight:10 }} onPress={()=>handleButtonPress('-')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text  style={{color:'white',fontSize:21}}>-</Text></View>
        </TouchableOpacity>
        
        </View>
        
        
        <View style={{flexDirection:'row',display:'flex' , justifyContent : 'flex-start' , width : "100%"}}>
        
        <TouchableOpacity style={{width : '18%' ,marginRight:10}} onPress={()=>handleButtonPress('4')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
        <Text style={{color:'white',fontSize:21}}>4</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%' ,marginRight:10}} onPress={()=>handleButtonPress('5')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
        <Text style={{color:'white',fontSize:21}}>5</Text></View></TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%',marginRight:10 }} onPress={()=>handleButtonPress('6')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>6</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%',marginRight:10 }} onPress={()=>handleButtonPress('+')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>+</Text></View>
        </TouchableOpacity>
        
        
        </View>
        
        
        <View style={{flexDirection:'row',display:'flex' , justifyContent : 'space-between' , width : "100%"}}>
        
        <TouchableOpacity style={{width : '18%' }} onPress={()=>handleButtonPress('7')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>7</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%' }} onPress={()=>handleButtonPress('8')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>8</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%' }} onPress={()=>handleButtonPress('9')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>9</Text></View>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={{width : '18%' }} onPress={()=>handleButtonPress('*')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}} >*</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%' }} onPress={()=>handleButtonPress('⌫')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}} >⌫</Text></View>
        </TouchableOpacity>
        
        </View>
        </View>
        
        <View style={{flexDirection:'row',display:'flex' , justifyContent : 'space-between' , width : "100%"}}>
        
        
        <TouchableOpacity style={{width : '18%',paddingTop:10 }} onPress={()=>handleButtonPress('/')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>/</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%',paddingTop:10 }} onPress={()=>handleButtonPress('0')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
        <Text style={{color:'white',fontSize:21}}>0</Text></View>
        
        </TouchableOpacity>
        
        <TouchableOpacity style={{width : '18%',paddingTop:10 }} onPress={()=>handleButtonPress('%')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>%</Text></View>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={{width : '18%',paddingTop:10 }} onPress={()=>handleButtonPress('C')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>C</Text></View>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={{width:'18%',paddingTop:10}} onPress={()=>handleButtonPress('.')}>
        <View style={{alignItems:'center',backgroundColor:'blue' ,borderRadius:20, display : 'flex' , paddingVertical : 25}}>
          <Text style={{color:'white',fontSize:21}}>.</Text></View>
        </TouchableOpacity>
        </View>
        </View>
        
        
        <View style={{flexDirection:'row',backgroundColor:'lightgrey',widthleft:500,marginTop:139,borderRadius:8}}>
        <View style={{paddingLeft:11}}> 
        <Text style={{marginTop:10,color:'black',fontSize:18,fontWeight:'bold'}}>Total Amount</Text>
        <Text style={{color:'green',fontSize:25,fontWeight:'bold'}}>₹{totalAmount.toFixed(2)}</Text>
        
        
        </View>
        <TouchableOpacity onPress={handleContinue}>
        <Text onChange={(e)=>setTotalAmount(e.target.value)} style={{fontWeight:'bold',fontSize:13,color:'white',marginLeft:140,marginTop:15,width:90,backgroundColor:'blue',padding:15,borderRadius:12,marginBottom:10}}>Continue</Text>
        </TouchableOpacity>
        </View>
        
        </View>
        
        </View>
        
         </BottomSheetModal>

        )}
        
          

