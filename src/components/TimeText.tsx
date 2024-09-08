import React from 'react';
import {Text} from 'react-native';
import styles from '@/styles';

interface TimeTextProps {
  currentTimeInSec: number;
  durationInSec: number;
}

const TimeText = ({currentTimeInSec, durationInSec}: TimeTextProps) => {
  const parseTimeSeconds = (seconds: number) => {
    const cleanSeconds = Math.floor(seconds);
    const minutes = Math.floor(cleanSeconds / 60);
    const remainingSeconds = cleanSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  return (
    <Text style={styles.timeText}>
      {parseTimeSeconds(currentTimeInSec)} / {parseTimeSeconds(durationInSec)}
    </Text>
  );
};

export default TimeText;
