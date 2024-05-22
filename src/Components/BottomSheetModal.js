import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import {StyleSheet} from 'react-native';

const BottomSheetModal = ({
  children,
  sheetRef,
  minSnapPoint = 0,
  maxSnapPoint = 0,
  index = 0,
  enableContentPanningGesture = false,
}) => {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[minSnapPoint, maxSnapPoint]}
      index={index}
      enablePanDownToClose
      enableContentPanningGesture={enableContentPanningGesture}>
      {children}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({});
export default React.memo(BottomSheetModal);
