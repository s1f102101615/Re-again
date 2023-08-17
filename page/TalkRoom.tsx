import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';

const TalkRoom = ({ route }) => {
  const { talkroomId } = route.params; // talkroomIdプロパティをroute.paramsから取得する
  return (
    <View>
      <Text>{talkroomId}</Text>
    </View>
  );
};

export default TalkRoom;
