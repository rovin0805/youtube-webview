import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {VIDEO_WIDTH} from '@/constants';
import styles from '@/styles';

interface RepeatPointsProps {
  isActiveRepeat: boolean;
  repeatBlock: {
    startInSec: number | null;
    endInSec: number | null;
  };
  currentTimeInSec: number;
  durationInSec: number;
  injectJavaScript: (script: string) => void;
}

const RepeatPoints = ({
  isActiveRepeat,
  repeatBlock,
  currentTimeInSec,
  durationInSec,
  injectJavaScript,
}: RepeatPointsProps) => {
  useEffect(() => {
    if (isActiveRepeat) {
      const {startInSec, endInSec} = repeatBlock;
      if (startInSec !== null && endInSec !== null) {
        if (currentTimeInSec > endInSec) {
          injectJavaScript(`player.seekTo(${startInSec}, true);`);
          injectJavaScript('player.playVideo();');
        }
      }
    }
  }, [
    isActiveRepeat,
    repeatBlock.endInSec,
    repeatBlock.startInSec,
    currentTimeInSec,
  ]);

  return (
    <>
      {!!repeatBlock.startInSec && (
        <View
          style={[
            styles.seekBarThumb,
            styles.repeatThumb,
            {left: (repeatBlock.startInSec / durationInSec) * VIDEO_WIDTH},
          ]}
        />
      )}

      {!!repeatBlock.endInSec && (
        <View
          style={[
            styles.seekBarThumb,
            styles.repeatThumb,
            {left: (repeatBlock.endInSec / durationInSec) * VIDEO_WIDTH},
          ]}
        />
      )}
    </>
  );
};

export default RepeatPoints;
