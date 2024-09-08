import React, {PropsWithChildren, useEffect, useRef} from 'react';
import {Animated, PanResponder, View} from 'react-native';
import styles from '@/styles';
import {VIDEO_WIDTH} from '@/constants';

interface SeekBarProps {
  currentTimeInSec: number;
  durationInSec: number;
  injectJavaScript: (script: string) => void;
}

const SeekBar = ({
  children,
  currentTimeInSec,
  durationInSec,
  injectJavaScript,
}: PropsWithChildren<SeekBarProps>) => {
  const seekBarAniRef = useRef(new Animated.Value(0));

  const durationInSecRef = useRef(durationInSec);
  durationInSecRef.current = durationInSec; // 리렌더링에 관계없이 항상 최신의 durationInSec 값을 유지

  const panResponder = useRef(
    PanResponder.create({
      // 사용자가 화면을 터치할 때 PanResponder가 활성화되어야 하는지 여부
      onStartShouldSetPanResponder: () => true,

      // 사용자가 화면을 터치한 상태에서 움직일 때 PanResponder가 활성화되어야 하는지 여부
      onMoveShouldSetPanResponder: () => true,

      // PanResponder가 활성화되고 제스처가 시작될 때 호출
      onPanResponderGrant: () => {
        // pause video
        injectJavaScript('player.pauseVideo();');
      },

      // 사용자가 터치한 상태에서 움직일 때 호출
      onPanResponderMove: (event, gestureState) => {
        // update seek bar thumb position
        const newTimeInSec =
          (gestureState.moveX / VIDEO_WIDTH) * durationInSecRef.current;
        seekBarAniRef.current.setValue(newTimeInSec);
      },

      // 사용자가 터치를 해제할 때 호출
      onPanResponderRelease: (event, gestureState) => {
        // seek video and play
        const newTimeInSec =
          (gestureState.moveX / VIDEO_WIDTH) * durationInSecRef.current;
        injectJavaScript(`player.seekTo(${newTimeInSec}, true);`);
        injectJavaScript('player.playVideo();');
      },
    }),
  ).current;

  useEffect(() => {
    Animated.timing(seekBarAniRef.current, {
      toValue: currentTimeInSec,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentTimeInSec]);

  const seekBarAnimation = seekBarAniRef.current.interpolate({
    inputRange: [0, durationInSec],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.seekBarBackground} {...panResponder.panHandlers}>
      <Animated.View
        style={[styles.seekBarProgress, {width: seekBarAnimation}]}
      />
      <Animated.View style={[styles.seekBarThumb, {left: seekBarAnimation}]} />

      {children}
    </View>
  );
};

export default SeekBar;
