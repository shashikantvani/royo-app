import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { runOnJS, useAnimatedReaction, useAnimatedRef, useSharedValue, useWorkletCallback } from 'react-native-reanimated';
import { useResponsiveSize } from '../hooks/useResponsiveSize';
const VELOCITY_THRESHOLD = 7; // FIXME: unknown does not work here :/
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export function useStickyHeaderFlashListScrollProps(props) {
  const {
    responsiveHeight
  } = useResponsiveSize();
  const {
    headerHeight = 100,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    onTopReached,
    parallaxHeight = responsiveHeight(53),
    snapStartThreshold,
    snapStopThreshold,
    snapToEdge = true
  } = props;
  const scrollValue = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();
  const onTopReachedRef = useRef(onTopReached);
  const onTopReachedWasCalled = useRef(false);
  useEffect(() => {
    onTopReachedRef.current = onTopReached;
  }, [onTopReached]);

  function maybeTopReached(value) {
    if (value <= 0) {
      if (!onTopReachedWasCalled.current && onTopReachedRef.current) {
        onTopReachedRef.current();
        onTopReachedWasCalled.current = true;
      }
    } else {
      onTopReachedWasCalled.current = false;
    }
  }

  useAnimatedReaction(() => scrollValue.value, value => {
    runOnJS(maybeTopReached)(value);
  }, [scrollValue]);
  const scrollHeight = Math.max(parallaxHeight, headerHeight * 2);
  const snapToTop = useCallback(() => {
    var _scrollViewRef$curren;

    (_scrollViewRef$curren = scrollViewRef.current) === null || _scrollViewRef$curren === void 0 ? void 0 : _scrollViewRef$curren.scrollToOffset({
      animated: true,
      offset: 0
    });
  }, [scrollViewRef]);
  const snapToBottom = useCallback(() => {
    var _scrollViewRef$curren2;

    (_scrollViewRef$curren2 = scrollViewRef.current) === null || _scrollViewRef$curren2 === void 0 ? void 0 : _scrollViewRef$curren2.scrollToOffset({
      animated: true,
      offset: scrollHeight
    });
  }, [scrollHeight, scrollViewRef]);
  const onSnapToEdge = useWorkletCallback(e => {
    var _e$velocity$y, _e$velocity;

    const scrollToHeight = snapStopThreshold !== null && snapStopThreshold !== void 0 ? snapStopThreshold : scrollHeight;
    const snapToEdgeThreshold = snapStartThreshold !== null && snapStartThreshold !== void 0 ? snapStartThreshold : scrollHeight / 2;
    const currentVal = scrollValue.value;
    const velocity = (_e$velocity$y = (_e$velocity = e.velocity) === null || _e$velocity === void 0 ? void 0 : _e$velocity.y) !== null && _e$velocity$y !== void 0 ? _e$velocity$y : 0;
    const dragsToTop = velocity >= 0;
    const dragsToBottom = !dragsToTop;
    const dragsQuickToBottom = dragsToBottom && velocity <= -VELOCITY_THRESHOLD;
    const dragsQuickToTop = dragsToTop && velocity >= VELOCITY_THRESHOLD;
    const isUnderSnapToEdgeThresholdAndDragIsSlow = currentVal > 0 && currentVal < snapToEdgeThreshold && !dragsQuickToBottom;
    const isUnderSnapToEdgeThresholdAndDragIsQuick = currentVal >= snapToEdgeThreshold / 2 && currentVal < snapToEdgeThreshold && dragsQuickToBottom;
    const isOverSnapToEdgeThresholdAndDragIsSlow = currentVal >= snapToEdgeThreshold && currentVal < scrollToHeight && !dragsQuickToTop;
    const isOverSnapToEdgeThresholdAndDragIsQuick = currentVal >= snapToEdgeThreshold && currentVal < scrollToHeight / 2 && dragsQuickToTop;

    if (snapToEdge) {
      // TODO: when react-native-web will support onMomentumScrollEnd & onScrollEndDrag events
      // handle web snap scroll
      if (isUnderSnapToEdgeThresholdAndDragIsSlow || isOverSnapToEdgeThresholdAndDragIsQuick) {
        runOnJS(snapToTop)();
      } else if (isOverSnapToEdgeThresholdAndDragIsSlow || isUnderSnapToEdgeThresholdAndDragIsQuick) {
        runOnJS(snapToBottom)();
      }
    }
  }, [snapStartThreshold, snapStopThreshold, snapToBottom, snapToTop, snapToEdge, scrollHeight, scrollValue]);
  const onMomentumScrollEndInternal = useWorkletCallback(e => {
    onMomentumScrollEnd === null || onMomentumScrollEnd === void 0 ? void 0 : onMomentumScrollEnd(e);
    onSnapToEdge(e);
  }, [onMomentumScrollEnd, onSnapToEdge]);
  const onScrollEndDragInternal = useWorkletCallback(e => {
    var _e$velocity$y2, _e$velocity2;

    onScrollEndDrag === null || onScrollEndDrag === void 0 ? void 0 : onScrollEndDrag(e);

    if (Platform.OS === 'android' || Math.abs((_e$velocity$y2 = (_e$velocity2 = e.velocity) === null || _e$velocity2 === void 0 ? void 0 : _e$velocity2.y) !== null && _e$velocity$y2 !== void 0 ? _e$velocity$y2 : 0) > 0) {
      return;
    }

    onSnapToEdge(e);
  }, [onScrollEndDrag, onSnapToEdge]);
  const onScrollInternal = useWorkletCallback(e => {
    scrollValue.value = e.contentOffset.y;
    onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);
  }, [onScroll]);
  return {
    onMomentumScrollEnd: onMomentumScrollEndInternal,
    onScroll: onScrollInternal,
    onScrollEndDrag: onScrollEndDragInternal,
    scrollHeight,
    scrollValue,
    scrollViewRef
  };
}
//# sourceMappingURL=useStickyHeaderFlashListScrollProps.js.map