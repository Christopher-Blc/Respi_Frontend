import React, { memo } from 'react';
import { Image } from 'expo-image'; // <--- Cambia el import
import { useAppTheme } from '../../context/ThemeContext';
import createLoginStyles from '../../style/login.styles';

const RespiLogo = () => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createLoginStyles(theme), [theme]);

  return (
    <Image
      source={require('../../../assets/RespiLogo.png')}
      style={styles.logo}
      contentFit="contain" // En expo-image se usa contentFit
      transition={0} // 0 para que no haya fundido, que salga de golpe
      priority="high" // Prioridad máxima de carga
      cachePolicy="memory" // Forzamos a que no salga de la RAM
    />
  );
};

export default memo(RespiLogo);
