import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '@/styles';

interface ControllerProps {
  isActiveRepeat: boolean;
  repeatBlock: {
    startInSec: number | null;
    endInSec: number | null;
  };
  currentTimeInSec: number;
  isPlaying: boolean;
  setIsActiveRepeat: React.Dispatch<React.SetStateAction<boolean>>;
  setRepeatBlock: (repeatBlock: {
    startInSec: number | null;
    endInSec: number | null;
  }) => void;
  injectJavaScript: (script: string) => void;
}

const Controller = ({
  isActiveRepeat,
  repeatBlock,
  currentTimeInSec,
  isPlaying,
  setIsActiveRepeat,
  setRepeatBlock,
  injectJavaScript,
}: ControllerProps) => {
  const handlePlay = () => {
    injectJavaScript('player.playVideo();');
  };

  const handlePause = () => {
    injectJavaScript('player.pauseVideo();');
  };

  const toggleRepeat = () => setIsActiveRepeat(prev => !prev);

  const handleSetRepeatBlock = () => {
    const {startInSec, endInSec} = repeatBlock;
    if (startInSec === null) {
      setRepeatBlock({
        ...repeatBlock,
        startInSec: currentTimeInSec,
      });
    } else if (endInSec === null) {
      setRepeatBlock({
        ...repeatBlock,
        endInSec: currentTimeInSec,
      });
    } else {
      setRepeatBlock({
        startInSec: null,
        endInSec: null,
      });
    }
  };

  return (
    <View style={styles.controller}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSetRepeatBlock()}>
        <Icon name={'data-array'} size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controllerButton}
        activeOpacity={0.7}
        onPress={isPlaying ? handlePause : handlePlay}
        // disabled={!(!!youtubeId && !!webViewRef.current)}
      >
        <Icon
          name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
          size={40}
          color="white"
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7} onPress={() => toggleRepeat()}>
        <Icon
          name={'repeat'}
          size={30}
          color={isActiveRepeat ? '#65E2B2' : 'white'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Controller;
