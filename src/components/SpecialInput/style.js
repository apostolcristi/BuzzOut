import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    paddingTop: 10,
    width: '100%',
  },

  textStyle: {
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 10,
    fontWeight: '500',
  },

  textInputStyle: {
    borderStyle: 'solid',
    height: 40,
    fontSize: 20,
    borderRadius: 4,
    borderWidth: 0.25,
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
    paddingRight: 4,
    paddingLeft: 20,
    flex: 1,
  },

  sectionStyle: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5,
  },

  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  containerTrigger: {
    flexDirection: 'row-reverse',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
