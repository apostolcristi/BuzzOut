import { NavigationActions } from 'react-navigation';

let navigator;

const setTopLevelNavigator = navigatorRef => {
  navigator = navigatorRef;
};

const navigate = (routeName, params) => {
  if (navigator)
    // TODO:
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      })
    );
};

export default {
  navigate,
  setTopLevelNavigator,
};