import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import styles from './css/setting';

function Setting() {
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const filteredSettings = [
    { title: 'アカウント' },
    { title: 'プライバシーとセキュリティ' },
    { title: '通知' },
    { title: 'データ使用量' },
    { title: 'ヘルプセンター' },
    { title: 'ログアウト' },
  ].filter((setting) => setting.title.includes(searchText));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>設定</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="検索"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>
      {filteredSettings.map((setting, index) => (
        <TouchableOpacity key={index} style={styles.settingItem}>
          <Text style={styles.settingTitle}>{setting.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Setting;