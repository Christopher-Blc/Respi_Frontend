import { StyleSheet } from 'react-native';

const DOT_SIZE = 26;
const LINE_HEIGHT = 2;

export const LINE_MARGIN_TOP = DOT_SIZE / 2 - LINE_HEIGHT / 2;

export const bookingStepBarStyles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCol: {
    alignItems: 'center',
    width: 80,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  innerDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  line: {
    flex: 1,
    height: LINE_HEIGHT,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
