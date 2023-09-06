import {render, waitFor} from '@testing-library/react-native';
import {FormItemWrapper} from './FormItemWrapper';
import {View} from 'react-native';

const CHILD_HEIGHT = 20;
const children = <View testID={'children'} style={{height: CHILD_HEIGHT}} />;

describe('Render tests', function () {
  test('it should be shown according to change its `visible` props', async function () {
    const snapshot = render(
      <FormItemWrapper visible={false} onLayout={() => {}}>
        {children}
      </FormItemWrapper>,
    );

    expect(snapshot.getByTestId(FormItemWrapper.name).props.style.opacity).toBe(
      0,
    );

    snapshot.rerender(
      <FormItemWrapper visible={true} onLayout={() => {}}>
        {children}
      </FormItemWrapper>,
    );

    await waitFor(
      () => {
        expect(
          snapshot.getByTestId(FormItemWrapper.name).props.style.opacity,
        ).toBe(1);
      },
      {timeout: 500},
    );
  });
});
describe('handler', function () {
  test('`onLayout` should be called with its height', async function () {
    const onLayoutMock = jest.fn();
    const snapshot = render(
      <FormItemWrapper visible={false} onLayout={onLayoutMock}>
        {children}
      </FormItemWrapper>,
    );

    const event = {
      nativeEvent: {
        layout: {
          height: CHILD_HEIGHT,
        },
      },
    };

    snapshot.getByTestId(FormItemWrapper.name).props.onLayout(event);

    await waitFor(
      function () {
        expect(onLayoutMock).toHaveBeenCalledTimes(1);
        expect(onLayoutMock).toHaveBeenCalledWith(event);
      },
      {timeout: 500},
    );
  });
});
