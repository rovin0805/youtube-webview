import React, {Dispatch, SetStateAction, useState} from 'react';
import {Alert, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import queryString from 'query-string';
import styles from '@/styles';

interface LinkInputProps {
  setYoutubeId: Dispatch<SetStateAction<string>>;
}

const LinkInput = ({setYoutubeId}: LinkInputProps) => {
  const [url, setUrl] = useState('');

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

  return (
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
  );
};

export default LinkInput;
