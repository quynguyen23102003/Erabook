export const IMAGE_RATIO = 11 / 17;
export const getImageRatio = (width: number) => {
  return width / IMAGE_RATIO;
};


export const numberHelper = (value: number) => {
  if (value < 10) {
      return "0" + value;
  }
  return value;
}