/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native';
import WebView from 'react-native-webview';
import styles from './styles';
import LinkInput from './components/LinkInput';
import Video from './components/Video';
import SeekBar from './components/SeekBar';
import RepeatPoints from './components/RepeatPoints';
import TimeText from './components/TimeText';
import Controller from './components/Controller';

const App = () => {
  const webViewRef = useRef<WebView | null>(null);
  const [youtubeId, setYoutubeId] = useState('FiCR50TNYKY');
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationInSec, setDurationInSec] = useState(0);
  const [currentTimeInSec, setCurrentTimeInSec] = useState(0);
  const [isActiveRepeat, setIsActiveRepeat] = useState(false);
  const [repeatBlock, setRepeatBlock] = useState<{
    startInSec: number | null;
    endInSec: number | null;
  }>({
    startInSec: null,
    endInSec: null,
  });

  const injectJavaScript = (script: string) => {
    webViewRef.current?.injectJavaScript(`${script}; true;`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinkInput setYoutubeId={setYoutubeId} />

      <Video
        youtubeId={youtubeId}
        webViewRef={webViewRef}
        isPlaying={isPlaying}
        setDurationInSec={setDurationInSec}
        setIsPlaying={setIsPlaying}
        setCurrentTimeInSec={setCurrentTimeInSec}
        injectJavaScript={injectJavaScript}
      />

      <SeekBar
        currentTimeInSec={currentTimeInSec}
        durationInSec={durationInSec}
        injectJavaScript={injectJavaScript}>
        <RepeatPoints
          isActiveRepeat={isActiveRepeat}
          repeatBlock={repeatBlock}
          currentTimeInSec={currentTimeInSec}
          durationInSec={durationInSec}
          injectJavaScript={injectJavaScript}
        />
      </SeekBar>

      <TimeText
        currentTimeInSec={currentTimeInSec}
        durationInSec={durationInSec}
      />

      <Controller
        isActiveRepeat={isActiveRepeat}
        repeatBlock={repeatBlock}
        currentTimeInSec={currentTimeInSec}
        isPlaying={isPlaying}
        setIsActiveRepeat={setIsActiveRepeat}
        setRepeatBlock={setRepeatBlock}
        injectJavaScript={injectJavaScript}
      />
    </SafeAreaView>
  );
};

export default App;
