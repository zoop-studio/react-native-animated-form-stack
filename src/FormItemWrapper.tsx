import React, {ReactNode, useEffect, useState} from 'react';
import {Animated, LayoutChangeEvent} from 'react-native';

interface IProps {
  visible: boolean;
  children: ReactNode;

  onLayout(e: LayoutChangeEvent): void;
}

export const FormItemWrapper = ({visible, children, onLayout}: IProps) => {
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
      testID={'FormItemWrapper'}
      style={{
        opacity: opacity,
      }}
      onLayout={onLayout}>
      {children}
    </Animated.View>
  );
};
