import React, { Component } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  View,
  AsyncStorage,
  Keyboard,
} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { uuid } from 'uuidv4';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { MenuProvider } from 'react-native-popup-menu';
import { Button } from 'react-native-elements';
import styles from '../style';
import GraphQLOperations from '../../../graphql/index';
import NavigationService from '../../../NavigationService';
import RegexExpressions from '../../../utils/RegexExpressions';
import { ActivityIndicatorBuzz } from '../../../components/ActivityIndicatorBuzz';
import { SpecialInput } from '../../../components/SpecialInput';

const { height, width } = Dimensions.get('window');
const ro = require('../../../assets/images/ro.png');
const ron = require('../../../assets/images/ron.png');
const world = require('../../../assets/images/world.png');

class BlockScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxInputPlate: 9,
      shadowPlateNumber: '',
      shadowPhoneNumber: '',
      plateNumberInputTextValue: '',
      phoneNumberInputTextValue: '',
      verifiedPlate: false,
      verifiedPhone: false,
      countryFlagSelection: 'Romania',
      phoneFlagSelection: 'Romania',
      placeholder: 'JJ-NN-XYZ',
      placeholderPhone: 'XXX-XXXXXXXXXX',
      src: ron,
      srcPhone: ron,
      edit: true,
      update: false,
      once: false,
    };
    this.menuOptionArrayPlate = [
      {
        value: 'Romania',
        text: 'Romania',
        key: 'a1',
      },
      {
        value: 'Romania numere rosii',
        text: 'Romania numere rosii',
        key: 'a2',
      },
      {
        value: 'Altele',
        text: 'Altele',
        key: 'a3',
      },
    ];

    this.menuOptionArrayPhone = [
      {
        value: 'Romania',
        text: 'Romania',
        key: 'a1',
      },
      {
        value: 'Altele',
        text: 'Altele',
        key: 'a3',
      },
    ];
  }

  componentDidMount() {
    const { userId, me } = this.props;
    let edit = true;
    let phoneNumberInputTextValue = '';
    let plateNumberInputTextValue = '';
    if (userId !== '#') {
      edit = false;
    }

    if (me && me.me) {
      plateNumberInputTextValue = me.me.content_search;
      phoneNumberInputTextValue = me.me.phoneNumber.slice(3, 13);
    }
    this.setState({
      edit,
      plateNumberInputTextValue,
      phoneNumberInputTextValue,
    });
  }

  componentDidUpdate() {
    const { plateNumberInputTextValue, phoneNumberInputTextValue, once } = this.state;
    const { me } = this.props;
    // console.log(plateNumberInputTextValue, phoneNumberInputTextValue, me);
    if (
      me &&
      me.me &&
      !once &&
      (plateNumberInputTextValue !== me.me.content_search ||
        phoneNumberInputTextValue !== me.me.phoneNumber.slice(3, 13))
    ) {
      // TODO: set state not wanted here even if there is a strong condition
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        once: true,
        plateNumberInputTextValue: me.me.content_search,
        phoneNumberInputTextValue: me.me.phoneNumber.slice(3, 13),
      });
    }
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value,
    });
  }

  onDel(pk) {
    const { onDelete } = this.props;
    onDelete({
      pk,
    });
    this.setState({ edit: true });
    try {
      AsyncStorage.removeItem('userId');
      global.userId = undefined;
    } catch (error) {
      console.log('BlockScreen: onDel unable to delete AsyncStorage');
    }
    NavigationService.navigate('GetOutScreen');
  }

  checkPhoneNumber = (phoneNumberFlag, phoneNumber) => {
    let isPhoneNumberCorrect = true;

    switch (phoneNumberFlag) {
      case 'Romania':
        if (!RegexExpressions.RomanianPhoneRegExpression.test(phoneNumber))
          isPhoneNumberCorrect = false;
        break;
      default:
        break;
    }

    return isPhoneNumberCorrect;
  };

  checkPlateNumber = (plateNumberFlag, plateNumber) => {
    let isPlateNumberCorrect = true;
    switch (plateNumberFlag) {
      case 'Romania':
        if (!RegexExpressions.RomanianPlateNumberRegExpression.test(plateNumber))
          isPlateNumberCorrect = false;
        break;
      case 'Romania numere rosii':
        if (!RegexExpressions.RomanianRedPlateNumberRegExpression.test(plateNumber))
          isPlateNumberCorrect = false;
        break;
      default:
        break;
    }
    return isPlateNumberCorrect;
  };

  formatPlateNumber = (plateNumberFlag, plateNumber) => {
    let finalPlateNumber = plateNumber;
    let county = '';

    switch (plateNumberFlag) {
      case 'Romania':
        county = this.getCounty(plateNumber);

        if (county === 'B') {
          const { returnNumber, firstDelimiter } = this.getNumberBucharest(plateNumber);
          const { returnChars } = this.getCharsBucharest(plateNumber, firstDelimiter);
          finalPlateNumber = `${county}-${returnNumber}-${returnChars}`;
        } else {
          const { returnNumber, firstDelimiter } = this.getNumberCounty(plateNumber);
          const { returnChars } = this.getCharsCounty(plateNumber, firstDelimiter);
          finalPlateNumber = `${county}-${returnNumber}-${returnChars}`;
        }
        break;
      case 'Romania numere rosii':
        county = this.getCounty(plateNumber);

        if (county === 'B') {
          const { returnNumber } = this.getRedNumberBucharest(plateNumber);
          finalPlateNumber = `${county}-${returnNumber}`;
        } else {
          const { returnNumber } = this.getRedNumberCounty(plateNumber);
          finalPlateNumber = `${county}-${returnNumber}`;
        }
        break;
      default:
        break;
    }
    return finalPlateNumber;
  };

  formatPhoneNumber = (phoneNumberFlag, phoneNumber) => {
    let finalPhoneNumber = phoneNumber;
    const prefix = '+04';

    switch (phoneNumberFlag) {
      case 'Romania':
        finalPhoneNumber = prefix.concat(phoneNumber);
        break;
      default:
        break;
    }
    return finalPhoneNumber;
  };

  checkAndDisplayError = inputObject => {
    const title = 'Eroare';
    let subtitle = '';
    switch (inputObject.countryFlagSelection) {
      case 'Romania':
        if (inputObject.plateNumberUpperCase !== '' && !inputObject.isPlateNumberCorrect) {
          subtitle = 'Nu ati introdus nici un numar de inmatriculare din Romania';
        }
        break;
      case 'Romania numere rosii':
        if (inputObject.plateNumberUpperCase !== '' && !inputObject.isPlateNumberCorrect) {
          subtitle = 'Nu ati introdus nici un numar de inmatriculare rosu din Romania';
        }
        break;
      default:
        break;
    }

    if (inputObject.plateNumberUpperCase === '') {
      subtitle = 'Nu a-ti introdus nici un numar de inmatriculare';
    }

    if (subtitle === '') {
      switch (inputObject.phoneFlagSelection) {
        case 'Romania':
          if (inputObject.phoneNumberInputTextValue !== '' && !inputObject.isPhoneNumberCorrect) {
            subtitle = 'Numarul de telefon introdus nu este corect';
          }
          break;
        default:
          break;
      }
    }
    if (subtitle !== '')
      Alert.alert(title, subtitle, [{ text: 'Inapoi', onPress: () => null }], {
        cancelable: false,
      });

    return subtitle !== '';
  };

  addOrUpdateBlock = async (apolloFunction, addOrUpdate) => {
    const { expoToken, userId } = this.props;
    const {
      countryFlagSelection,
      phoneFlagSelection,
      plateNumberInputTextValue,
      phoneNumberInputTextValue,
    } = this.state;

    let errorFormat = false;
    let finalPlateNumber = '';
    let finalPhoneNumber = '';
    let isPlateNumberCorrect = false;
    let isPhoneNumberCorrect = false;
    const plateNumberUpperCase = plateNumberInputTextValue.toUpperCase();

    isPhoneNumberCorrect = this.checkPhoneNumber(phoneFlagSelection, phoneNumberInputTextValue);
    isPlateNumberCorrect = this.checkPlateNumber(countryFlagSelection, plateNumberUpperCase);

    if (isPlateNumberCorrect)
      finalPlateNumber = this.formatPlateNumber(countryFlagSelection, plateNumberUpperCase);
    if (isPhoneNumberCorrect)
      finalPhoneNumber = this.formatPhoneNumber(countryFlagSelection, phoneNumberInputTextValue);

    errorFormat = this.checkAndDisplayError({
      countryFlagSelection,
      phoneFlagSelection,
      isPhoneNumberCorrect,
      isPlateNumberCorrect,
      phoneNumberInputTextValue,
      plateNumberUpperCase,
    });

    if (!errorFormat) {
      const pk = uuid();
      const bDate = this.blockingDate();
      if (addOrUpdate) {
        apolloFunction({
          pk,
          plateNumber: finalPlateNumber,
          phoneNumber: finalPhoneNumber,
          lastModified: bDate,
          expoToken,
        });
      } else {
        apolloFunction({
          pk: userId,
          plateNumber: finalPlateNumber,
          phoneNumber: finalPhoneNumber,
        });
      }
      this.setState({
        shadowPlateNumber: finalPlateNumber,
        shadowPhoneNumber: phoneNumberInputTextValue,
        edit: false,
        plateNumberInputTextValue: '',
        phoneNumberInputTextValue: '',
        maxInputPlate: 9,
      });

      try {
        if (addOrUpdate) {
          await AsyncStorage.setItem('userId', JSON.stringify(pk));
          global.userId = pk;
        }
      } catch (error) {
        console.log('BlockScreen: error setting up ID in AsyncStorage');
      }

      NavigationService.navigate('GetOutScreen');
      Keyboard.dismiss();
    }
  };

  validateLicensePlate = value => {
    return value && RegexExpressions.ValidRomanianPlateNumberRegExpression.test(value);
  };

  getCountrySelectionForValidation = countryValue => {
    return countryValue === 'Romania' || countryValue === 'Romania numere rosii';
  };

  getCounty = inputValue => {
    const inputValueUpperCase = inputValue.toUpperCase();
    const firstTwoChars = inputValueUpperCase.slice(0, 2);
    const firstChar = inputValueUpperCase.slice(0, 1);
    const secondChar = inputValueUpperCase.slice(1, 2);
    if (firstChar === 'B' && RegexExpressions.CountyRegExpression.test(secondChar)) {
      return firstChar;
    }
    return firstTwoChars;
  };

  getNumberCounty = inputValue => {
    const firstDelimiter = inputValue.slice(2, 3);
    let returnNumber;
    let indexFlag1 = 0;
    switch (firstDelimiter) {
      case ' ':
      case '_':
      case '-': {
        returnNumber = inputValue.slice(3, 5);
        indexFlag1 = 1;
        break;
      }
      default:
        returnNumber = inputValue.slice(2, 4);

        break;
    }
    return { returnNumber, firstDelimiter, indexFlag1 };
  };

  getCharsCounty = (inputValue, firstDelimiter) => {
    const inputValueUpperCase = inputValue.toUpperCase();
    let returnChars;
    let indexFlag2 = 0;

    const position =
      firstDelimiter === ' ' || firstDelimiter === '-'
        ? inputValueUpperCase.slice(5)
        : inputValueUpperCase.slice(4);
    switch (position.slice(0, 1)) {
      case ' ':
      case '_':
      case '-':
        returnChars = position.slice(1, 4);
        indexFlag2 = 1;

        break;
      default:
        returnChars = position.slice(0, 3);

        break;
    }
    return { returnChars, indexFlag2 };
  };

  getNumberBucharest = inputValue => {
    const firstDelimiter = inputValue.slice(1, 2);
    let returnNumber;
    let indexFlag1 = 0;
    switch (firstDelimiter) {
      case ' ':
      case '_':
      case '-':
        if (
          inputValue.slice(4, 5) <= 9 &&
          inputValue.slice(4, 5) >= 0 &&
          inputValue.slice(4, 5) !== '' &&
          inputValue.slice(4, 5) !== ' '
        ) {
          returnNumber = inputValue.slice(2, 5);
          indexFlag1 = 2;
        } else {
          returnNumber = inputValue.slice(2, 4);
          indexFlag1 = 1;
        }

        break;
      default:
        if (Number.isNaN(inputValue.slice(3, 4))) {
          returnNumber = inputValue.slice(1, 3);
        } else {
          returnNumber = inputValue.slice(1, 4);
        }
        break;
    }
    return { returnNumber, firstDelimiter, indexFlag1 };
  };

  getCharsBucharest = (inputValue, firstDelimiter) => {
    const inputValueUpperCase = inputValue.toUpperCase();
    let returnChars;
    let indexFlag2 = 0;
    let position;
    if (Number.isNaN(inputValue.slice(4, 5))) {
      position =
        firstDelimiter === ' ' || firstDelimiter === '-'
          ? inputValueUpperCase.slice(4)
          : inputValueUpperCase.slice(3);
      if (!Number.isNaN(position.slice(0, 1))) position = position.slice(1);
    } else
      position =
        firstDelimiter === ' ' || firstDelimiter === '-'
          ? inputValueUpperCase.slice(5)
          : inputValueUpperCase.slice(3);
    switch (position.slice(0, 1)) {
      case ' ':
      case '_':
      case '-':
        returnChars = position.slice(1, 4);
        indexFlag2 = 1;

        break;
      default:
        if (inputValue.slice(4, 5)) returnChars = position;
        if (!Number.isNaN(inputValue.slice(3, 4))) indexFlag2 = 1;

        break;
    }
    return { returnChars, indexFlag2 };
  };

  getRedNumberBucharest = inputValue => {
    const inputValueUpperCase = inputValue.toUpperCase();
    const firstDelimiter = inputValue.slice(1, 2);
    let returnNumber;
    let indexFlag = 0;
    switch (firstDelimiter) {
      case ' ':
      case '_':
      case '-':
        returnNumber = inputValueUpperCase.slice(2);
        indexFlag = 1;
        break;

      default:
        returnNumber = inputValueUpperCase.slice(1);
    }
    return { returnNumber, indexFlag };
  };

  getRedNumberCounty = inputValue => {
    const inputValueUpperCase = inputValue.toUpperCase();
    const firstDelimiter = inputValue.slice(2, 3);
    let returnNumber;
    let indexFlag = 0;
    switch (firstDelimiter) {
      case ' ':
      case '_':
      case '-':
        returnNumber = inputValueUpperCase.slice(3);
        indexFlag = 1;
        break;

      default:
        returnNumber = inputValueUpperCase.slice(2);
    }
    return { returnNumber, indexFlag };
  };

  validateField = (key, valKey, value, validatingFunction) => {
    let final;
    let i = 0;
    const { countryFlagSelection } = this.state;
    if (valKey === 'verifiedPlate') {
      if (this.getCountrySelectionForValidation(countryFlagSelection)) {
        if (countryFlagSelection === 'Romania') {
          const county = this.getCounty(value);
          if (county === 'B') {
            const { returnNumber, firstDelimiter, indexFlag1 } = this.getNumberBucharest(value);
            const { returnChars, indexFlag2 } = this.getCharsBucharest(value, firstDelimiter);
            final = `${county}-${returnNumber}-${returnChars}`;
            // console.log('finalul :', final);
            // this.setState({ plateNumberInputTextValue: final });
            i += 6 + indexFlag1 + indexFlag2;
          } else {
            const { returnNumber, firstDelimiter, indexFlag1 } = this.getNumberCounty(value);
            const { returnChars, indexFlag2 } = this.getCharsCounty(value, firstDelimiter);
            final = `${county}-${returnNumber}-${returnChars}`;
            // console.log('non bucale :', final);
            // this.setState({ plateNumberInputTextValue: final });
            i += 7 + indexFlag1 + indexFlag2;
          }
          // this.setState({ maxInputPlate: i });
        } else if (countryFlagSelection === 'Romania numere rosii') {
          const county = this.getCounty(value);

          if (county === 'B') {
            const { returnNumber, indexFlag } = this.getRedNumberBucharest(value);
            final = `${county}-${returnNumber}`;
            i += 7 + indexFlag;
          } else {
            const { returnNumber, indexFlag } = this.getRedNumberCounty(value);
            final = `${county}-${returnNumber}`;
            i += 8 + indexFlag;
          }
          // this.setState({ maxInputPlate: i });
        }
        this.setState({ plateNumberInputTextValue: final, maxInputPlate: i });
      } else if (countryFlagSelection === 'Altele') this.setState({ maxInputPlate: 13 });
    }

    const v = validatingFunction(value);
    this.setState({ [valKey]: v });
    if (v) {
      this.onChangeText([key], value);
    }
  };

  blockingDate = () => {
    const today = new Date();
    const event1 = new Date();
    event1.setHours(today.getHours() + 3);
    const blockingDate = event1.toJSON();
    return blockingDate;
  };

  showPlateNumber = countryFlagSelection => {
    let placeholder;
    let src;
    switch (countryFlagSelection) {
      case 'Romania':
        placeholder = 'JJ-20-XYZ';
        src = ron;
        break;
      case 'Romania numere rosii':
        placeholder = 'JJ-NNNNNN';
        src = ro;
        break;
      default:
        placeholder = 'XX_XXX_XX';
        src = world;
        break;
    }
    this.setState({
      countryFlagSelection,
      placeholder,
      src,
    });
  };

  showPhone = phoneFlagSelection => {
    let placeholderPhone;
    let srcPhone;

    if (phoneFlagSelection === 'Romania') {
      placeholderPhone = 'XXX-XXXXXXXXXX';
      srcPhone = ron;
    } else if (phoneFlagSelection === 'Altele') {
      placeholderPhone = 'XX_XXX_XX';
      srcPhone = world;
    }

    this.setState({
      phoneFlagSelection,
      placeholderPhone,
      srcPhone,
    });
  };

  delete = async () => {
    const { me } = this.props;
    Alert.alert(
      me.me.content_search,
      'Doriti sa stergeti intrarea?',
      [
        {
          text: 'Da',
          onPress: () => {
            this.onDel(me.me.pk);
            // NavigationService.navigate('BlockScreen', { settings: false });
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
            this.setState({ disable: false });
          },
        },
      ],
      { cancelable: false }
    );
  };

  NoEdit() {
    const { update, edit } = this.state;

    if (!(update || edit))
      this.dropDownAlertRef.alertWithType('warn', 'Atentie!', 'Apasati Edit pentru a modifica');
  }

  render() {
    const {
      verifiedPhone,
      verifiedPlate,
      placeholder,
      placeholderPhone,
      src,
      edit,
      disable,
      plateNumberInputTextValue,
      phoneNumberInputTextValue,
      srcPhone,
      maxInputPlate,
      update,
      shadowPhoneNumber,
      shadowPlateNumber,
    } = this.state;
    const { me, navigation, onAdd, onUpdate } = this.props;

    // console.log('Render BS:', this.props);

    let notSet = false;
    if (!me.me && !me.error && me.loading !== false) {
      // AsyncStorage.clear();
      return <ActivityIndicatorBuzz />;
    }

    if (me.error) {
      // this.dropDownAlertRef.alertWithType('warn', 'Warn', 'No connection');
    }

    if (!me.me) {
      notSet = true;
    }

    return (
      <KeyboardAvoidingView style={[styles.container]} behavior="padding" scrollEnabled={false}>
        <MenuProvider style={[styles.container, { width, height }]}>
          <View style={styles.contentContainer}>
            <SpecialInput
              title="License Plate"
              menuOnOpen={() => this.NoEdit()}
              menuOnSelect={value => this.showPlateNumber(value)}
              menuTriggerImageSrc={src}
              menuOptionsEdit={edit}
              menuOptionsUpdate={update}
              menuOptionValue={this.menuOptionArrayPlate}
              textInputDefaultValue={notSet ? '' : plateNumberInputTextValue}
              textInputValue={plateNumberInputTextValue}
              textInputError={!verifiedPlate}
              textInputPlaceholder={placeholder}
              textInputMaxLength={maxInputPlate}
              textInputOnChangeText={value => {
                // this.validateField(
                //   'otherPlate',
                //   'verifiedPlate',
                //   value.toUpperCase(),
                //   this.validateLicensePlate
                // );
                this.setState({ plateNumberInputTextValue: value });
              }}
              textInputKeyBoardType="default"
            />

            <SpecialInput
              title="PhoneNumber(optional)"
              menuOnOpen={() => this.NoEdit()}
              menuOnSelect={value => this.showPhone(value)}
              menuTriggerImageSrc={srcPhone}
              menuOptionsEdit={edit}
              menuOptionsUpdate={update}
              menuOptionValue={this.menuOptionArrayPhone}
              textInputDefaultValue={notSet ? '' : phoneNumberInputTextValue}
              textInputValue={phoneNumberInputTextValue}
              textInputError={!verifiedPhone}
              textInputPlaceholder={placeholderPhone}
              textInputMaxLength={10}
              textInputOnChangeText={value => this.setState({ phoneNumberInputTextValue: value })}
              textInputKeyBoardType="phone-pad"
            />
          </View>
          <View style={styles.buttonsContainer}>
            {edit && <Button title="Block" onPress={() => this.addOrUpdateBlock(onAdd, true)} />}
            {!edit && update && (
              <Button
                containerStyle={{ marginBottom: 10 }}
                title="Update"
                onPress={() => this.addOrUpdateBlock(onUpdate, false)}
              />
            )}
            {!edit && update && (
              <Button
                containerStyle={{ marginBottom: 10 }}
                title="Cancel"
                onPress={() => {
                  this.setState({
                    update: false,
                    phoneNumberInputTextValue: shadowPhoneNumber,
                    plateNumberInputTextValue: shadowPlateNumber,
                  });
                  // console.log('aici', LicensePlate, Phone);
                }}
              />
            )}
            {!update && !edit && (
              <Button
                containerStyle={{ marginBottom: 10 }}
                title="Edit"
                onPress={() =>
                  this.setState({
                    update: true,
                    shadowPhoneNumber: phoneNumberInputTextValue,
                    shadowPlateNumber: plateNumberInputTextValue,
                  })
                }
              />
            )}
            {navigation && !edit ? (
              <Button
                containerStyle={{ marginBottom: 10 }}
                title="Delete"
                disabled={disable}
                onPress={() => {
                  this.delete();
                  this.setState({ disable: true });
                }}
              />
            ) : null}
          </View>
          <DropdownAlert
            warnColor="#2089dc"
            imageStyle={{ marginLeft: 20, alignSelf: 'center' }}
            messageStyle={{ fontSize: 18, color: 'white', alignSelf: 'center', marginRight: 10 }}
            titleStyle={{
              fontSize: 20,
              color: 'white',
              alignSelf: 'center',
              marginRight: 60,
              marginBottom: 10,
            }}
            defaultContainer={{
              alignItem: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              height: 76,
              alignSelf: 'center',
              width: '90%',
            }}
            endDelta={10}
            activeStatusBarBackgroundColor="#2089dc"
            closeInterval={1000}
            ref={ref => {
              this.dropDownAlertRef = ref;
            }}
          />
        </MenuProvider>
      </KeyboardAvoidingView>
    );
  }
}

BlockScreenContainer.defaultProps = {
  userId: '#',
  expoToken: 'Notifications are disabled',
};

BlockScreenContainer.propTypes = {
  expoToken: PropTypes.string,
  userId: PropTypes.string,
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  me: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.shape({})]).isRequired,
  navigation: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default compose(
  GraphQLOperations.CreatePlateNumber,
  GraphQLOperations.DeletePlateNumber,
  GraphQLOperations.UpdatePlateNumber,
  GraphQLOperations.me
)(BlockScreenContainer);
