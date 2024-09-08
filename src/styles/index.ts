import {VIDEO_HEIGHT, VIDEO_WIDTH} from '@/constants';
import {StyleSheet} from 'react-native';

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
    justifyContent: 'space-evenly',
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
  seekBarBackground: {
    height: 5,
    backgroundColor: '#d4d4d4',
    pointerEvents: 'box-none',
  },
  seekBarProgress: {
    height: 5,
    backgroundColor: 'red',
    width: '0%',
    pointerEvents: 'none',
  },
  seekBarThumb: {
    width: 13,
    height: 13,
    borderRadius: 13 / 2,
    backgroundColor: 'red',
    position: 'absolute',
    top: (5 - 13) / 2,
  },
  repeatThumb: {
    backgroundColor: '#65E2B2',
  },
});

export default styles;
