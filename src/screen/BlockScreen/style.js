import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },

  contentContainer: {
    flex: 4,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
});

export default styles;
