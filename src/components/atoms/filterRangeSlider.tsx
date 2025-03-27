import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import MultiSlider, {
  MultiSliderProps,
} from '@ptomasroos/react-native-multi-slider';

import AppText from './appText';

import {
  SIZE_8,
  SIZE_16,
  SIZE_32,
  SIZE_24,
  SIZE_48,
  WINDOW_WIDTH,
  WINDOW_GUTTER,
  DEFAULT_BORDER_RADIUS,
} from '@styles/sizes';
import {Colors} from '@styles/colors';

const MARKER_SIZE = SIZE_32;

interface FilterRangeSliderProps extends MultiSliderProps {
  label?: string;
}

const FilterRangeSlider: FC<FilterRangeSliderProps> = ({
  label,
  values,
  min,
  max,
  ...passThroughProps
}) => {
  //#region LABEL VALUES
  const [internalValues, setInternalValues] =
    useState<MultiSliderProps['values']>(values);
  useEffect(() => setInternalValues(values), [values]);
  //#endregion
  return (
    <View style={styles.container}>
      {label && (
        <AppText type="control" color={Colors.gray6}>
          {label}
        </AppText>
      )}
      <View style={styles.labelsContainer}>
        {internalValues && internalValues.length === 2 && (
          <>
            <View style={styles.trackLabelContainer}>
              <AppText
                color={Colors.gray7}>{`от ${internalValues[0]} ₽`}</AppText>
            </View>
            <View style={styles.trackLabelContainer}>
              <AppText
                color={Colors.gray7}>{`до ${internalValues[1]} ₽`}</AppText>
            </View>
          </>
        )}
      </View>
      <View style={styles.sliderContainer}>
        <MultiSlider
          values={values}
          min={min}
          max={max}
          allowOverlap={false}
          onValuesChange={(v) => setInternalValues(v)}
          containerStyle={styles.trackContainer}
          customMarker={({pressed}) => (
            <View style={[styles.marker, pressed && styles.markerPressed]} />
          )}
          sliderLength={WINDOW_WIDTH - WINDOW_GUTTER * 2 - MARKER_SIZE}
          selectedStyle={styles.trackSelected}
          unselectedStyle={styles.trackUnselected}
          {...passThroughProps}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SIZE_8,
    paddingBottom: SIZE_32,
  },
  sliderContainer: {
    paddingHorizontal: MARKER_SIZE / 2,
  },
  marker: {
    width: MARKER_SIZE,
    aspectRatio: 1,

    borderWidth: 3,
    borderRadius: Math.ceil(MARKER_SIZE / 2),

    borderColor: Colors.accent.default,
    backgroundColor: Colors.white,
  },
  markerPressed: {
    borderColor: Colors.accent.pressed,
  },
  trackContainer: {
    height: MARKER_SIZE,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: SIZE_8,
    marginBottom: SIZE_16,
  },
  trackSelected: {
    height: 3,
    backgroundColor: Colors.accent.default,
  },
  trackUnselected: {
    height: 3,
    backgroundColor: Colors.gray4,
  },
  trackLabelContainer: {
    justifyContent: 'center',

    width: WINDOW_WIDTH / 2 - WINDOW_GUTTER - SIZE_24 / 2,
    height: SIZE_48,
    paddingHorizontal: SIZE_16,

    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: DEFAULT_BORDER_RADIUS,

    backgroundColor: Colors.gray1,
  },
});

export default FilterRangeSlider;
