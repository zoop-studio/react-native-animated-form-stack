import {View, Text, Button} from 'react-native';
import {
  FormStackProvider,
  useFormStackAction,
  useFormStackValue,
} from './FormStackProvider';
import {useRef} from 'react';
import {FormStack, IFormStackRef} from './FormStack';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';

const Sample = ({
  initialStep = 0,
  gap = 0,
  onUpdate,
}: {
  initialStep?: number;
  gap?: number;
  onUpdate?(): void;
}) => {
  const ref = useRef<IFormStackRef>(null);
  const {step} = useFormStackValue();
  const {update} = useFormStackAction();

  const handlePressPrev = () => {
    return ref.current?.prev();
  };
  const handlePressNext = () => {
    return ref.current?.next();
  };
  return (
    <View>
      <FormStack
        ref={ref}
        initialStep={initialStep}
        gap={gap}
        onUpdate={onUpdate}>
        <Text>third-element</Text>
        <Text>second-element</Text>
        <Text>first-element</Text>
      </FormStack>
      <Button title={'Previous'} onPress={handlePressPrev} />
      <Button title={'Next'} onPress={handlePressNext} />
    </View>
  );
};

afterEach(cleanup);
describe('Render tests', function () {
  afterEach(cleanup);
  test('it should show only the last index of child at first render', async function () {
    const snapshot = render(<Sample />, {wrapper: FormStackProvider});

    expect(
      snapshot.getByTestId('FormStack').props.children[0].props.visible,
    ).toBeFalsy();
    expect(
      snapshot.getByTestId('FormStack').props.children[1].props.visible,
    ).toBeFalsy();
    expect(
      snapshot.getByTestId('FormStack').props.children[2].props.visible,
    ).toBeFalsy();

    await waitFor(function () {
      expect(
        snapshot.getByTestId('FormStack').props.children[0].props.visible,
      ).toBeFalsy();
      expect(
        snapshot.getByTestId('FormStack').props.children[1].props.visible,
      ).toBeFalsy();
      expect(
        snapshot.getByTestId('FormStack').props.children[2].props.visible,
      ).toBeTruthy();
    });
  });
  test('it should show the elements whose index is same or over with the given `initialStep` at first render', async function () {
    const snapshot = render(<Sample initialStep={1} />, {
      wrapper: FormStackProvider,
    });

    await waitFor(function () {
      expect(
        snapshot.getByTestId('FormStack').props.children[0].props.visible,
      ).toBeFalsy();
      expect(
        snapshot.getByTestId('FormStack').props.children[1].props.visible,
      ).toBeTruthy();
      expect(
        snapshot.getByTestId('FormStack').props.children[2].props.visible,
      ).toBeTruthy();
    });
  });
  test('it should add space between the elements if `gap` is given', function () {
    const gap = 20;
    const snapshot = render(<Sample gap={gap} />, {
      wrapper: FormStackProvider,
    });

    expect(
      snapshot.getByText('first-element').parent.parent.children[1].props.style
        .height,
    ).toBe(0);
    expect(
      snapshot.getByText('second-element').parent.parent.children[1].props.style
        .height,
    ).toBe(gap);
    expect(
      snapshot.getByText('third-element').parent.parent.children[1].props.style
        .height,
    ).toBe(gap);
  });
});

describe('Interaction tests', function () {
  afterEach(cleanup);

  test('`onUpdate` should be called when its step is updated', async function () {
    const onUpdateMock = jest.fn();
    const snapshot = render(<Sample onUpdate={onUpdateMock} />, {
      wrapper: FormStackProvider,
    });

    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    expect(onUpdateMock).toHaveBeenCalledWith(0);

    const nextButton = snapshot.getByText('Next');

    fireEvent.press(nextButton);

    expect(onUpdateMock).toHaveBeenCalledTimes(2);
    expect(onUpdateMock).toHaveBeenCalledWith(1);
  });
  test('it should started with `initialStep` at first render', async function () {
    const onUpdateMock = jest.fn();
    render(<Sample initialStep={1} onUpdate={onUpdateMock} />, {
      wrapper: FormStackProvider,
    });

    expect(onUpdateMock).toBeCalledWith(1);
  });
  test('it should increase the step when `next()` is called, and cannot update more than the given number of elements', async function () {
    const onUpdateMock = jest.fn();
    const snapshot = render(<Sample onUpdate={onUpdateMock} />, {
      wrapper: FormStackProvider,
    });

    const nextButton = snapshot.getByText('Next');

    fireEvent.press(nextButton);
    expect(onUpdateMock).toHaveBeenCalledTimes(2);

    fireEvent.press(nextButton);
    expect(onUpdateMock).toHaveBeenCalledTimes(3);

    // step should not be updated due to the step cannot exceed the count of elements
    fireEvent.press(nextButton);
    expect(onUpdateMock).toHaveBeenCalledTimes(3);
  });
  test('it should decrease the step when `prev()` is called, and cannot update less than 0', async function () {
    const onUpdateMock = jest.fn();
    const snapshot = render(<Sample onUpdate={onUpdateMock} />, {
      wrapper: FormStackProvider,
    });

    const prevButton = snapshot.getByText('Previous');
    const nextButton = snapshot.getByText('Next');

    fireEvent.press(nextButton);
    expect(onUpdateMock).toBeCalledWith(1);
    expect(onUpdateMock).toHaveBeenCalledTimes(2);

    fireEvent.press(prevButton);
    expect(onUpdateMock).toBeCalledWith(0);
    expect(onUpdateMock).toHaveBeenCalledTimes(3);

    fireEvent.press(prevButton);
    expect(onUpdateMock).toHaveBeenCalledTimes(3);
  });
});
