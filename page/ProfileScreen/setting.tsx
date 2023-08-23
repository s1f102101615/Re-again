import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1DA1F2',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});

export default Setting;