import React, {
  Children,
  forwardRef,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewProps,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import {useFormStackAction, useFormStackValue} from './FormStackProvider';

const {height: DEVICE_HEIGHT} = Dimensions.get('screen');

interface IProps {
  initialStep?: number;
  gap?: number;
  duration?: number;
  children: Array<ReactElement<ViewProps> | null>;

  onUpdate?(step: number): void;
}

export interface IFormStackRef {
  prev(): void;

  next(): void;
}

export const FormStack = forwardRef<IFormStackRef, IProps>(
  ({initialStep = 0, gap = 0, duration = 250, children, onUpdate}, ref) => {
    const {step} = useFormStackValue();
    const {update} = useFormStackAction();

    const [loading, setLoading] = useState(true);
    const [stack, setStack] = useState<number[]>([]);
    const [transitionY] = useState(new Animated.Value(-1 * DEVICE_HEIGHT));
    const [opacity] = useState(new Animated.Value(1));

    /**
     * Entire child elements height
     */
    const containerHeight: number = useMemo(() => {
      return stack
        .slice()
        .reverse()
        .reduce((p, c) => {
          return p + c;
        }, 0);
    }, [stack]);

    /**
     * Visible height
     */
    const offset: number = useMemo(() => {
      const reverse = stack.slice().reverse();
      const calStack = reverse.slice(0, step + 1);

      return calStack.reduce((p, c) => p + c, -1 * containerHeight);
    }, [stack, step, containerHeight]);

    const handleSetHeight = useCallback((idx: number, value: number) => {
      setStack(prev => {
        const next = prev.slice();
        next[idx] = value;
        return next;
      });
    }, []);

    const handleSetPrevStep = () => {
      if (step === 0) {
        return;
      }
      update(step - 1);
    };
    const handleSetNextStep = () => {
      if (stack[step + 1] === undefined) {
        return;
      }
      update(step + 1);
    };

    /**
     * Define imperative handles
     */
    useImperativeHandle(ref, () => ({
      prev: handleSetPrevStep,
      next: handleSetNextStep,
    }));

    /**
     * Update an animated value by offset
     */
    useEffect(() => {
      Animated.timing(transitionY, {
        toValue: offset,
        duration: loading ? 0 : duration,
        useNativeDriver: true,
      }).start();
    }, [duration, loading, offset]);

    /**
     * Call `onUpdate` when `cursor` updated
     */
    useEffect(() => {
      onUpdate?.(step);
    }, [step, onUpdate]);

    useEffect(() => {
      if (initialStep) {
        update(initialStep);
      }
    }, [initialStep]);

    useEffect(() => {
      Animated.timing(opacity, {
        toValue: 1,
        delay: 500,
        useNativeDriver: true,
      }).start(() => setLoading(false));
    }, []);

    return (
      <View style={[styles.container, {height: containerHeight + offset}]}>
        <Animated.View
          style={{
            opacity,
            transform: [
              {
                translateY: transitionY,
              },
            ],
          }}>
          {Children.map(children, (item, index) =>
            !item ? null : (
              <FormItemWrapper
                visible={children.length - 1 - step <= index}
                onLayout={e =>
                  handleSetHeight(index, e.nativeEvent.layout.height)
                }>
                {item}
                <View style={{height: index === stack.length - 1 ? 0 : gap}} />
              </FormItemWrapper>
            ),
          )}
        </Animated.View>
      </View>
    );
  },
);

interface IFormItem {
  visible: boolean;
  children: ReactNode;

  onLayout(e: LayoutChangeEvent): void;
}

const FormItemWrapper = ({visible, children, onLayout}: IFormItem) => {
  const [opacity] = useState(new Animated.Value(0));

  /**
   * Opacity updated by given `visible` prop
   */
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 250,
      delay: 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={{
        opacity: opacity,
      }}
      onLayout={onLayout}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
  },
  base: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
