/* global _updateProps */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { processColor } from './Colors';
import { makeShareable, isConfigured } from './core';
import { Platform } from 'react-native';
import { _updatePropsJS } from './js-reanimated';

// copied from react-native/Libraries/Components/View/ReactNativeStyleAttributes
export const colorProps = [
  'backgroundColor',
  'borderBottomColor',
  'borderColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'borderStartColor',
  'borderEndColor',
  'color',
  'shadowColor',
  'textDecorationColor',
  'tintColor',
  'textShadowColor',
  'overlayColor',
];

const ColorProperties = !isConfigured() ? [] : makeShareable(colorProps);

let updatePropsByPlatform;
if (Platform.OS === 'web') {
  updatePropsByPlatform = (viewDescriptor, updates, maybeViewRef) => {
    'worklet';
    _updatePropsJS(viewDescriptor.value.tag, null, updates, maybeViewRef);
  };
} else {
  updatePropsByPlatform = (viewDescriptor, updates, _) => {
    'worklet';

    for (const key in updates) {
      if (ColorProperties.indexOf(key) !== -1) {
        updates[key] = processColor(updates[key]);
      }
    }

    _updateProps(
      viewDescriptor.value.tag,
      viewDescriptor.value.name || 'RCTView',
      updates
    );
  };
}

export const updateProps = updatePropsByPlatform;

export const updatePropsJestWrapper = (
  viewDescriptor,
  updates,
  maybeViewRef,
  animatedStyle
) => {
  animatedStyle.current.value = {
    ...animatedStyle.current.value,
    ...updates,
  };

  updateProps(viewDescriptor, updates, maybeViewRef);
};

export default updateProps;
