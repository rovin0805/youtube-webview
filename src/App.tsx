/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo, useState} from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import queryString from 'query-string';
import WebView from 'react-native-webview';

const VIDEO_WIDTH = Dimensions.get('window').width;
const VIDEO_HEIGHT = (VIDEO_WIDTH * 9) / 16;

const App = () => {
  const [url, setUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');

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

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
    </script>
  </body>
</html>    
    `;
    return {html};
  }, [youtubeId]);

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
            source={source}
            scrollEnabled={false}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false} // auto play for android
          />
        )}
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
});
