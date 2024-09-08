import React, {useEffect, useMemo} from 'react';
import {VIDEO_HEIGHT, VIDEO_WIDTH} from '@/constants';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {View} from 'react-native';
import styles from '@/styles';

enum MessageEnum {
  DURATION = 'duration',
  PLAYER_STATE = 'player-state',
  CURRENT_TIME = 'current-time',
}

interface WebViewMessage {
  type: MessageEnum;
  data: string | number;
}

interface VideoProps {
  youtubeId: string;
  webViewRef: React.RefObject<WebView>;
  isPlaying: boolean;
  setDurationInSec: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTimeInSec: React.Dispatch<React.SetStateAction<number>>;
  injectJavaScript: (script: string) => void;
}

const Video = ({
  youtubeId,
  webViewRef,
  isPlaying,
  setDurationInSec,
  setIsPlaying,
  setCurrentTimeInSec,
  injectJavaScript,
}: VideoProps) => {
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

  return (
    <View style={styles.videoContainer}>
      {!!youtubeId && (
        <WebView
          ref={webViewRef}
          source={source}
          scrollEnabled={false}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false} // auto play for android
          onMessage={handleOnMessage}
          webviewDebuggingEnabled
        />
      )}
    </View>
  );
};

export default Video;
