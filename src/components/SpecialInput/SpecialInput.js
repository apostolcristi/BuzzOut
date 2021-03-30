import React from 'react';
import { Text, View, Image, TextInput, ScrollView } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

import styles from './style';

const SpecialInput = props => {
  const {
    title,
    menuOnOpen,
    menuOnSelect,
    menuTriggerImageSrc,
    menuOptionsUpdate,
    menuOptionsEdit,
    menuOptionValue,
    textInputDefaultValue,
    textInputOnChangeText,
    textInputMaxLength,
    textInputPlaceholder,
    textInputValue,
    textInputError,
    textInputKeyBoardType,
  } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{title}</Text>
      <View style={styles.sectionStyle}>
        <Menu onOpen={menuOnOpen} onSelect={menuOnSelect}>
          <MenuTrigger>
            <View style={styles.containerTrigger}>
              <Icon name="angle-down" type="font-awesome" color="#FFd300" size={30} />
              <Image source={menuTriggerImageSrc} style={styles.imageStyle} />
            </View>
          </MenuTrigger>
          <MenuOptions>
            {(menuOptionsEdit || menuOptionsUpdate) && (
              <ScrollView>
                {menuOptionValue.map(option => (
                  <MenuOption
                    disabled={!menuOptionsUpdate}
                    value={option.value}
                    text={option.text}
                    key={option.key}
                  />
                ))}
              </ScrollView>
            )}
          </MenuOptions>
        </Menu>
        <TextInput
          autoCorrect={false}
          defaultValue={textInputDefaultValue}
          editable={menuOptionsEdit || menuOptionsUpdate}
          placeholder={textInputPlaceholder}
          selectionColor="#428AF8"
          placeholderTextColor="#dddddd"
          keyboardType={textInputKeyBoardType}
          error={!textInputError}
          onChangeText={textInputOnChangeText}
          maxLength={textInputMaxLength}
          style={styles.textInputStyle}
          value={textInputValue}
        />
      </View>
    </View>
  );
};

SpecialInput.defaultProps = {
  title: 'No text set',
  menuOnOpen: () => {},
  menuOnSelect: () => {},
  menuTriggerImageSrc: -1,
  menuOptionsUpdate: false,
  menuOptionsEdit: false,
  textInputDefaultValue: '',
  textInputOnChangeText: () => {},
  textInputMaxLength: 10,
  textInputPlaceholder: '',
  textInputError: false,
  textInputKeyBoardType: 'characters',
};

SpecialInput.propTypes = {
  title: PropTypes.string,
  menuOnOpen: PropTypes.func,
  menuOnSelect: PropTypes.func,
  menuTriggerImageSrc: PropTypes.number,
  menuOptionsUpdate: PropTypes.bool,
  menuOptionsEdit: PropTypes.bool,
  textInputDefaultValue: PropTypes.string,
  textInputOnChangeText: PropTypes.func,
  textInputMaxLength: PropTypes.number,
  textInputPlaceholder: PropTypes.string,
  textInputError: PropTypes.bool,
  textInputKeyBoardType: PropTypes.string,

  menuOptionValue: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.shape({})])
    .isRequired,
  textInputValue: PropTypes.string.isRequired,
};

export default SpecialInput;
