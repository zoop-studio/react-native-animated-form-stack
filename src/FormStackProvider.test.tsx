import {fireEvent, render} from '@testing-library/react-native';
import {View, Text, Button} from 'react-native';
import {
  FormStackProvider,
  useFormStackAction,
  useFormStackValue,
} from './FormStackProvider';
import {ReactElement} from 'react';

const Component = ({to = 0}: {to?: number}) => {
  const {step} = useFormStackValue();
  const {update} = useFormStackAction();
  return (
    <View>
      <Text>{`Value is: ${step}`}</Text>
      <Button title={'Update to the given step'} onPress={() => update(to)} />
    </View>
  );
};

describe('FormStackProvider', function () {
  test('Initial context value should be 0', function () {
    const snapshot = render(<Component />, {wrapper: FormStackProvider});

    expect(snapshot.findByText('Value is: 0')).toBeTruthy();
  });
  test('`update` should be called with a number, and this will be able to update the context value by a given number', function () {
    const snapshot = render(<Component to={5} />, {wrapper: FormStackProvider});

    snapshot.getByText('Value is: 0');

    fireEvent.press(snapshot.getByText('Update to the given step'));

    expect(snapshot.findByText('Value is: 5')).toBeTruthy();
  });
});
