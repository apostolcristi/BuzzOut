import EStyleSheet from 'react-native-extended-stylesheet';
import { Platform } from 'react-native';

// const { height, width } = Dimensions.get('window');
const styles = EStyleSheet.create({
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    // marginTop: Platform.OS !== 'ios' ? 30 : null,
  },

  headerContainer: {
    // flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#2089dc',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    marginBottom: 10,
  },
  searchBar: {
    flex: 5,
    marginTop: Platform.OS !== 'ios' ? 30 : null,
    width: 120,
    borderTopColor: 'rgba(0, 0, 0, 0)',
    borderBottomColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: '#2089dc',
    borderRadius: 6,
  },
  settingsButton: {
    marginLeft: 4,
    marginTop: Platform.OS !== 'ios' ? 30 : null,
    flex: 2,
  },

  listItemContainer: {
    width: '96%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 10,
    backgroundColor: '#FFFFFFFF',
    borderRadius: 10,
    borderWidth: 0.2,
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
  },
  emptyList: {
    alignContent: 'flex-end',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'rgb(255, 152, 0)',
    fontSize: 30,
    fontWeight: '700',
  },

  listItemTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginHorizontal: 8,
    color: '#5c5c5c',
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  buzzButton: {
    paddingRight: 16,
  },

  separator: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },

  footerContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
});

export default styles;
