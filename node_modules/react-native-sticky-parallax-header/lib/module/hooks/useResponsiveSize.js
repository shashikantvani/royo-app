import { useWindowDimensions } from 'react-native';
export function useResponsiveSize() {
  const {
    height,
    width
  } = useWindowDimensions();

  function responsiveHeight(value) {
    return height * (value / 100);
  }

  function responsiveWidth(value) {
    return width * (value / 100);
  }

  return {
    responsiveHeight,
    responsiveWidth
  };
}
//# sourceMappingURL=useResponsiveSize.js.map