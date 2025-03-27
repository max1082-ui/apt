import React, {FC, useMemo, useState} from 'react';
import {View, ScrollView, Image, StyleSheet, Linking} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import type {Image as IImage} from 'react-native-image-crop-picker';

import {Icon, PressableOpacity} from '@components/atoms';

import {
  DEFAULT_UNEXPECTED_ERROR_TEXT,
  PHOTO_LIBRARY_PERMISSION_ERROR_TEXT,
} from '@services/error';

import {showSnack} from '@utils';

import {scale} from '@styles/mixins';
import {SIZE_8} from '@styles/sizes';
import {Colors} from '@styles/colors';

import type {ImageSource} from '@types';

interface PhotoUploadProps {
  images: ImageSource[];
  countOfImages: number;
  onUpload: (images: ImageSource[]) => void;
  onDelete?: (name: string) => void;
}

export const PhotoUpload: FC<PhotoUploadProps> = ({
  images,
  onUpload,
  onDelete,
  countOfImages,
}) => {
  const [uploadImageCount, setUploadImageCount] = useState<number>(0);

  //#region EMPTY ITEMS
  const listItems = useMemo<number[]>(() => {
    let i = 0;
    const list = [];
    while (i < countOfImages - 1 - uploadImageCount) {
      list.push(i + 1);
      i++;
    }
    return list;
  }, [countOfImages, uploadImageCount]);
  //#endregion

  // #region HANDLERS
  const handleSelectImage = () => {
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 5 - images.length,
      includeBase64: true,
      forceJpg: true,
      compressImageMaxWidth: 600,
      compressImageQuality: 0.7,
    })
      .then((img) => {
        onSelect(img);
      })
      .catch((err) => {
        switch (err.message) {
          case 'User cancelled image selection':
            return;
          case 'User did not grant library permission.': {
            showSnack({
              type: 'warning',
              duration: 'long',
              message: PHOTO_LIBRARY_PERMISSION_ERROR_TEXT,
              onPress: () => Linking.openSettings(),
            });
            break;
          }
          default: {
            showSnack({
              type: 'danger',
              message: DEFAULT_UNEXPECTED_ERROR_TEXT,
            });
          }
        }
      });
  };

  const onSelect = (imgs: IImage[]) => {
    const uploadImages = images.concat(
      imgs.map<ImageSource>(({path, mime}, index) => ({
        uri: path ? `file://${path}` : '',
        name: `photo_${images.length + index}`,
        type: mime,
      })),
    );

    setUploadImageCount(uploadImageCount + imgs.length);
    onUpload(uploadImages);
  };

  const handleDeletePress = (name: string) => {
    if (onDelete) {
      onDelete(name);
      setUploadImageCount(uploadImageCount - 1);
    }
  };
  //#endregion

  return (
    <ScrollView horizontal>
      {images.map((image, index) => (
        <View
          key={index.toString()}
          style={[styles.container, styles.imageContainer]}>
          <PressableOpacity
            onPress={() => onDelete && handleDeletePress(image.name)}
            style={styles.deleteIcon}
            hitSlop={20}>
            <Icon name={'close-line'} size={12} color={Colors.error.default} />
          </PressableOpacity>
          <Image
            source={{uri: image.uri}}
            style={[styles.container, styles.image]}
          />
        </View>
      ))}
      {images.length < countOfImages ? (
        <>
          <PressableOpacity onPress={handleSelectImage}>
            <View style={[styles.container, styles.imagePickerButton]}>
              <Icon
                name={'add-circle-line'}
                size={scale(20)}
                color={Colors.accent.default}
              />
            </View>
          </PressableOpacity>
          {listItems.map((item) => (
            <View
              key={item.toString()}
              style={[styles.container, styles.imageContainer]}
            />
          ))}
        </>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(56),
    height: scale(80),
    marginRight: SIZE_8,
    borderRadius: 3,
  },
  imagePickerButton: {
    backgroundColor: Colors.gray3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  imageContainer: {
    borderColor: Colors.gray4,
    borderWidth: 1,
  },
  deleteIcon: {
    zIndex: 2,
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default PhotoUpload;
