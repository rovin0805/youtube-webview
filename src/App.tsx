/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import queryString from 'query-string';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

const VIDEO_WIDTH = Dimensions.get('window').width;
const VIDEO_HEIGHT = (VIDEO_WIDTH * 9) / 16;

enum MessageEnum {
  DURATION = 'duration',
  PLAYER_STATE = 'player-state',
  CURRENT_TIME = 'current-time',
}

interface WebViewMessage {
  type: MessageEnum;
  data: string | number;
}

const App = () => {
  const webViewRef = useRef<WebView | null>(null);
  const [url, setUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('FiCR50TNYKY');
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationInSec, setDurationInSec] = useState(0);
  const [currentTimeInSec, setCurrentTimeInSec] = useState(0);

  const onPressOpenLink = () => {
    const {
      query: {v: id},
    } = queryString.parseUrl(url);
    if (typeof id === 'string') {
      setYoutubeId(id);
    } else {
      Alert.alert('유효하지 않은 유튜브 링크입니다.');
    }
  };

  const source = useMemo(() => {
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0; padding:0">
    <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    <div id="player"></div>

    <script>
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '${VIDEO_HEIGHT}',
          width: '${VIDEO_WIDTH}',
          videoId: '${youtubeId}',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      function sendPostMessageToReactNative({type, data}) {
        const message = JSON.stringify({type, data});
        window.ReactNativeWebView.postMessage(message);
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {    
        sendPostMessageToReactNative({type: '${MessageEnum.DURATION}', data: player.getDuration()});    
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        sendPostMessageToReactNative({type: '${MessageEnum.PLAYER_STATE}', data: event.data});
      }
    </script>
  </body>
</html>    
    `;
    return {html};
  }, [youtubeId]);

  const injectJavaScript = (script: string) => {
    webViewRef.current?.injectJavaScript(`${script}; true;`);
  };

  const handlePlay = () => {
    injectJavaScript('player.playVideo();');
  };

  const handlePause = () => {
    injectJavaScript('player.pauseVideo();');
  };

  const handleGetCurrentTime = () => {
    const type = MessageEnum.CURRENT_TIME;
    const data = 'player.getCurrentTime()';
    injectJavaScript(
      `sendPostMessageToReactNative({type: '${type}', data: ${data}});`,
    );
  };

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => {
        if (webViewRef.current) {
          handleGetCurrentTime();
        }
      }, 500);
      return () => {
        clearInterval(id);
      };
    }
  }, [isPlaying]);

  const parseTimeSeconds = (seconds: number) => {
    const cleanSeconds = Math.floor(seconds);
    const minutes = Math.floor(cleanSeconds / 60);
    const remainingSeconds = cleanSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  const handleOnMessage = ({nativeEvent: {data}}: WebViewMessageEvent) => {
    const {type, data: eventData}: WebViewMessage = JSON.parse(data);
    switch (type) {
      case MessageEnum.DURATION:
        setDurationInSec(+eventData);
        break;
      case MessageEnum.PLAYER_STATE:
        setIsPlaying(+eventData === 1);
        break;
      case MessageEnum.CURRENT_TIME:
        setCurrentTimeInSec(+eventData);
        break;
      default:
        console.warn('Unhandled message', type);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="클릭하여 링크를 삽입하세요."
            placeholderTextColor={'#666'}
            inputMode="url"
            value={url}
            onChangeText={setUrl}
          />
          <TouchableOpacity
            onPress={onPressOpenLink}
            style={styles.inputButton}
            hitSlop={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}>
            <Icon name="add-link" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.videoContainer}>
        {!!youtubeId && (
          <WebView
            ref={webViewRef}
            source={source}
            scrollEnabled={false}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false} // auto play for android
            onMessage={handleOnMessage}
          />
        )}
      </View>

      <Text style={styles.timeText}>
        {parseTimeSeconds(currentTimeInSec)} / {parseTimeSeconds(durationInSec)}
      </Text>

      <View style={styles.controller}>
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
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
  },
  inputContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  inputWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    borderRadius: 10,
    width: '100%',
  },
  input: {
    color: 'white',
    fontSize: 15,
    flex: 1,
  },
  inputButton: {
    marginLeft: 15,
  },
  videoContainer: {
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: '#333',
  },
  controller: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
  },
  controllerButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    margin: 20,
  },
});
