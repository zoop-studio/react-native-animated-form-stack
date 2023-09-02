/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {useRef, useState} from 'react';
import {Button, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {
  FormStack,
  IFormStackRef,
  FormStackProvider,
  useFormStackAction,
  useFormStackValue,
} from 'react-native-animated-form-stack';

const App = () => {
  const ref = useRef<IFormStackRef>(null);
  const [step, setStep] = useState(0);
  const handlePressPrev = () => {
    ref.current?.prev();
  };
  const handlePressNext = () => {
    ref.current?.next();
  };

  return (
    <FormStackProvider>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <Text
              style={{
                marginVertical: 12,
                fontSize: 24,
                textAlign: 'center',
              }}>{`Your current step is ${step}`}</Text>
            <FormStack ref={ref} onUpdate={setStep}>
              <View style={{backgroundColor: 'red', height: 500}} />
              <View style={{backgroundColor: 'yellow', height: 200}} />
              <Children5 />
              <View style={{backgroundColor: 'orange', height: 50}} />
              <View style={{backgroundColor: 'blue', height: 75}} />
              <Children2 />
              <View style={{backgroundColor: 'skyblue', height: 25}} />
              <View style={{backgroundColor: 'black', height: 85}} />
            </FormStack>
          </ScrollView>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Button title={'Previous'} onPress={handlePressPrev} />
            </View>
            <View style={{flex: 1}}>
              <Button title={'Next'} onPress={handlePressNext} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </FormStackProvider>
  );
};

const Children5 = () => {
  const {step} = useFormStackValue();
  return (
    <View
      style={{
        backgroundColor: 'grey',
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 24}}>{`This is step ${step}`}</Text>
    </View>
  );
};

const Children2 = () => {
  const {update} = useFormStackAction();
  const to = 5;
  return (
    <View
      style={{
        backgroundColor: '#ddd',
        height: 250,
        justifyContent: 'center',
      }}>
      <Button title={`Let's go to step ${to}`} onPress={() => update(to)} />
    </View>
  );
};

export default App;
