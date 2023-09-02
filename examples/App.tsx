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

const Example = () => {
  const ref = useRef<IFormStackRef>(null);
  const [step, setStep] = useState(0);
  const handlePressPrev = () => {
    ref.current?.prev();
  };
  const handlePressNext = () => {
    ref.current?.next();
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Text
          style={{
            marginVertical: 12,
            fontSize: 24,
            textAlign: 'center',
          }}>{`Your current step is ${step}`}</Text>
        <FormStack
          ref={ref}
          onUpdate={setStep} // You can obtain the step without the hook
          gap={20} // Size of gap between the elements. Default 0
          duration={250} // Length of animation (milliseconds). Default 250
          initialStep={0} // Initial exposed step. Default 0
        >
          <View style={{backgroundColor: 'red', height: 500}} />
          <View style={{backgroundColor: 'yellow', height: 200}} />
          <Children5 />
          <View style={{backgroundColor: 'orange', height: 50}} />
          {/* null cannot be included on the step */}
          {null}
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

const App = () => {
  return (
    <FormStackProvider>
      <SafeAreaView style={{flex: 1}}>
        <Example />
      </SafeAreaView>
    </FormStackProvider>
  );
};

export default App;
