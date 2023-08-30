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
} from 'react-native';

export interface IFormStackProps {
  children: Array<ReactElement<ViewProps> | null>;
}

export interface IFormStackRef {
  prev(): void;

  next(): void;
}

export const FormStack = forwardRef<IFormStackRef, IFormStackProps>(
  ({children}, ref) => {
    const [stack, setStack] = useState<number[]>([]);
    const [cursor, setCursor] = useState(0);
    const [transitionY] = useState(new Animated.Value(0));

    /**
     * Entire child elements height
     */
    const containerHeight: number = useMemo(() => {
      return stack
        .slice()
        .reverse()
        .reduce((p, c, currentIndex) => {
          return p + c;
        }, 0);
    }, [stack]);

    /**
     * Visible height
     */
    const offset: number = useMemo(() => {
      const reverse = stack.slice().reverse();
      const calStack = reverse.slice(0, cursor + 1);

      return calStack.reduce((p, c) => p + c, -1 * containerHeight);
    }, [stack, cursor, containerHeight]);

    const handleSetHeight = useCallback((idx: number, value: number) => {
      setStack(prev => {
        const next = prev.slice();
        next[idx] = value;
        return next;
      });
    }, []);

    const handleSetPrevStep = () => {
      if (cursor === 0) {
        return;
      }
      setCursor(prev => prev - 1);
    };
    const handleSetNextStep = () => {
      if (stack[cursor + 1] === undefined) {
        return;
      }
      setCursor(prev => prev + 1);
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
        duration: cursor > 0 ? 250 : 0,
        useNativeDriver: true,
      }).start();
    }, [offset]);

    return (
      <View style={[styles.container, {height: containerHeight + offset}]}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: transitionY,
              },
            ],
          }}>
          {Children.map(children, (item, index) => (
            <FormItemWrapper
              index={index}
              visible={children.length - 1 - cursor <= index}
              onLayout={e =>
                handleSetHeight(index, e.nativeEvent.layout.height)
              }>
              {item}
            </FormItemWrapper>
          ))}
        </Animated.View>
      </View>
    );
  },
);

interface IFormItem {
  index: number;
  visible: boolean;
  children: ReactNode;

  onLayout(e: LayoutChangeEvent): void;
}

const FormItemWrapper = ({index, visible, children, onLayout}: IFormItem) => {
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
