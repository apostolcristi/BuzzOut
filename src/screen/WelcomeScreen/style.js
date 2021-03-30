import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 4,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    resizeMode: 'contain',
  },

  textContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    color: '#a9a9a9',
    fontSize: 20,
    fontWeight: '500',
  },

  buttonsContainer: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  blockButton: {
    fontSize: 20,
  },
});

export default styles;
