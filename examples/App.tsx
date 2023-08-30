/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {useRef} from 'react';
import {Button, SafeAreaView, ScrollView, View} from 'react-native';
import {FormStack, IFormStackRef} from 'react-native-animated-form-stack';

const App = () => {
  const ref = useRef<IFormStackRef>(null);
  const handlePressPrev = () => {
    ref.current?.prev();
  };
  const handlePressNext = () => {
    ref.current?.next();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <FormStack ref={ref}>
            <View style={{backgroundColor: 'red', height: 500}} />
            <View style={{backgroundColor: 'yellow', height: 200}} />
            <View style={{backgroundColor: 'green', height: 150}} />
            <View style={{backgroundColor: 'orange', height: 50}} />
            <View style={{backgroundColor: 'blue', height: 75}} />
            <View style={{backgroundColor: 'grey', height: 250}} />
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
  );
};

export default App;
