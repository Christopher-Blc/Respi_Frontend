import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const createRespiPoliMapaStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.backgroundMain },
    header: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: theme.backgroundCard,
    },
    title: {
      color: theme.textTitle,
      fontSize: 18,
      fontWeight: 'bold',
    },
    mapa: { flex: 1 },
  });

export default createRespiPoliMapaStyles;
