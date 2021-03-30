import EStyleSheet from 'react-native-extended-stylesheet';
import { Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const styles = EStyleSheet.create({
  container: {
    marginTop: Platform.OS !== 'ios' ? 30 : null,
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
  talkBubble: {
    marginLeft: 20,
    backgroundColor: 'transparent',
  },
  talkBubbleSquare: {
    alignSelf: 'flex-start',
    backgroundColor: 'red',
    borderRadius: 10,
  },
  talkBubbleTriangle: {
    alignSelf: 'flex-start',
    left: -26,
    top: 26,
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 13,
    borderRightWidth: 26,
    borderRightColor: 'red',
    borderBottomWidth: 13,
    borderBottomColor: 'transparent',
  },

  speechbubble: {
    position: 'relative',
    backgroundColor: '#00aabb',
    borderRadius: 0.4,
  },

  speechbubbleafter: {
    justifyContent: 'flex-end',
    position: 'relative',
    alignItems: 'flex-start',
    left: 0,
    top: '50%',
    width: 0,
    height: 0,
    borderWidth: 56,
    borderStyle: 'solid',
    borderRightColor: '#00aabb',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    marginTop: -28,
    marginLeft: -56,
  },
  item: {
    marginVertical: moderateScale(7, 2),
    flexDirection: 'row',
  },
  itemIn: {
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 6,
    borderWidth: 0.1,
    borderColor: 'grey',
    borderStyle: 'dashed',
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  arrowRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
  Keycontainer: {
    flex: 1,

    justifyContent: 'center',
    paddingBottom: 10,
  },
  emptyList: {
    alignContent: 'flex-end',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'rgb(255, 152, 0)',
    fontSize: 30,
    fontWeight: '700',
    // transform: [{ rotate: '-180deg' }],
  },
});

export default styles;
