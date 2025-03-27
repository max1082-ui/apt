import {AppButton, AppText} from '@components/atoms';
import {CommonStyles} from '@styles/common';
import {SIZE_16} from '@styles/sizes';
import React, {FC} from 'react';
import {View} from 'react-native';

type ScenePlaceholderNavAction = {
  action: () => void;
  label: string;
  disabled?: boolean;
};

interface ScenePlaceholderProps {
  name: string;
  navActions?: ScenePlaceholderNavAction[];
}

const ScenePlaceholder: FC<ScenePlaceholderProps> = ({name, navActions}) => {
  return (
    <View
      style={[CommonStyles.fill, CommonStyles.flexCenter, CommonStyles.gutter]}>
      <AppText type="h1">{name}</AppText>
      {navActions &&
        navActions.map((actionData, index) => (
          <AppButton
            disabled={actionData?.disabled || false}
            key={index.toString()}
            label={actionData.label}
            onPress={actionData.action}
            containerStyle={{marginBottom: SIZE_16}}
          />
        ))}
    </View>
  );
};

export default ScenePlaceholder;
