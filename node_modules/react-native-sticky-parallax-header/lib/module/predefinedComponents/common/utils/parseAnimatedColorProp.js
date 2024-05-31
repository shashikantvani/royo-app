export function parseAnimatedColorProp(animatedColorProp) {
  'worklet';

  return typeof animatedColorProp === 'undefined' || typeof animatedColorProp === 'string' || typeof animatedColorProp === 'number' || typeof animatedColorProp === 'symbol' ? animatedColorProp : animatedColorProp === null || animatedColorProp === void 0 ? void 0 : animatedColorProp.value;
}
//# sourceMappingURL=parseAnimatedColorProp.js.map