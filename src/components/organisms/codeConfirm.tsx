import React, {FC, useCallback, useState} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';

import {
  Cursor,
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {
  Loader,
  AppText,
  FadeInView,
  VerificationCountdown,
} from '@components/atoms';

import {useMount} from '@hooks';

import {showSnack} from '@utils';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {SIZE_16, SIZE_8} from '@styles/sizes';

const CELL_COUNT = 4;

type LoadingState = {
  isLoading: boolean;
  countdownRunning: boolean;
};

const initialLoadingState = {
  isLoading: false,
  countdownRunning: true,
};

interface CodeConfirmProps {
  phone: string;

  onRequestCodePress: () => Promise<void>;
  onCodeInputComplete: (code: string) => Promise<void>;

  autoFocus?: boolean;
  showSnackbarInternally?: boolean;
}

const CodeConfirm: FC<CodeConfirmProps> = ({
  phone,

  onRequestCodePress,
  onCodeInputComplete,

  autoFocus = true,
  showSnackbarInternally = true,
}) => {
  //#region LOADING
  const [{isLoading, countdownRunning}, setLoadingState] =
    useState<LoadingState>(initialLoadingState);
  //#endregion

  //#region BINDINGS
  const hideControls = () => {
    Keyboard.dismiss();
    // dismissSnackbar();
  };
  //#endregion

  //#region INPUT
  const [inputValue, setInputValue] = useState<string>('');
  const ref = useBlurOnFulfill({value: inputValue, cellCount: CELL_COUNT});

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: inputValue,
    setValue: setInputValue,
  });

  useMount(() => autoFocus && ref.current?.focus());
  //#endregion

  //#region EVENT
  const onBlurHandler = useCallback(async () => {
    if (inputValue.length === CELL_COUNT) {
      try {
        hideControls();
        setLoadingState((current) => ({...current, isLoading: true}));
        await onCodeInputComplete(inputValue);
      } catch (err) {
        setInputValue('');
        showSnackbarInternally &&
          showSnack({
            type: 'danger',
            message: err.message,
          });
      } finally {
        setLoadingState((current) => ({...current, isLoading: false}));
      }
    }
  }, [inputValue, onCodeInputComplete, showSnackbarInternally]);

  const onRequestCodePressHandler = useCallback(async () => {
    try {
      setInputValue('');
      hideControls();
      setLoadingState({isLoading: true, countdownRunning: false});
      await onRequestCodePress();
    } catch (err) {
      showSnack({
        type: 'danger',
        message: err.message,
      });
    } finally {
      setLoadingState({isLoading: false, countdownRunning: true});
    }
  }, [onRequestCodePress]);
  //#endregion

  return (
    <View>
      <AppText type="h1" color={Colors.gray9}>
        {'Введите код из СМС'}
      </AppText>
      <AppText
        type="bodyRegular"
        color={Colors.gray6}
        wrapperStyle={styles.titleTextWrapper}>
        {`Код выслан на ${phone}`}
      </AppText>
      <View>
        <CodeField
          ref={ref}
          {...props}
          cellCount={CELL_COUNT}
          value={inputValue}
          onChangeText={setInputValue}
          onBlur={onBlurHandler}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          rootStyle={styles.codeFieldRoot}
          renderCell={({index, symbol, isFocused}) => (
            <View
              key={index.toString()}
              style={[
                styles.cell,
                !isLoading && (!!symbol || isFocused) && styles.focusCell,
              ]}>
              <AppText
                type="h2"
                color={isLoading ? Colors.gray4 : Colors.gray7}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (!isLoading && isFocused ? <Cursor /> : null)}
              </AppText>
            </View>
          )}
        />
        {isLoading && (
          <FadeInView style={styles.loader}>
            <Loader />
          </FadeInView>
        )}
      </View>
      <VerificationCountdown
        enabled={countdownRunning}
        onActiveActionPress={onRequestCodePressHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    //gutter + 4 * cell width + 4 * cell margin + own margin
    left: scale(16 + 50 * 3 + 16 * 4 + 16),
  },
  codeFieldRoot: {
    justifyContent: 'flex-start',
    marginVertical: SIZE_16,
  },
  cell: {
    width: scale(48),
    height: scale(48),
    marginRight: scale(7),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: Colors.gray1,
  },
  focusCell: {
    borderBottomColor: Colors.black,
  },
  cellText: {
    textAlign: 'center',
  },
  titleTextWrapper: {
    marginTop: SIZE_8,
  },
  buttonContainer: {
    marginTop: SIZE_16,
  },
});

export default CodeConfirm;
