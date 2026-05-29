import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import createReservasTabStyles from '../../style/bookings/bookingsTab.styles';
import AvailabilityBar from './AvailabilityBar';
import { CourtAvailability } from '../../types/types';
import { API_PUBLIC_URL } from '../../constants';

const getImageForPista = (pista: CourtAvailability) => {
  const path = pista.image || pista.courtType?.image;
  if (path) {
    return {
      uri: path.startsWith('http')
        ? path
        : API_PUBLIC_URL + '/' + String(path).replace(/^\//, ''),
    };
  }
  return require('../../../assets/RespiLogo.png');
};

type Props = {
  pista: CourtAvailability;
  cardWidth: number;
  onPress: () => void;
  onInfo: () => void;
};

export default function BookingCourtCard({
  pista,
  cardWidth,
  onPress,
  onInfo,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createReservasTabStyles(theme), [theme]);
  const [imageError, setImageError] = useState(false);

  const hasRemoteImage = Boolean(pista.image || pista.courtType?.image);
  const showFallback = imageError || !hasRemoteImage;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.pistaCard,
        { width: cardWidth, flexGrow: 0, flexShrink: 0, alignSelf: 'stretch' },
      ]}
    >
      {showFallback ? (
        <View
          style={[
            styles.pistaImageBg,
            {
              borderRadius: 14,
              backgroundColor: theme.surface,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons name="image-outline" size={48} color={theme.textMuted} />
          <LinearGradient
            colors={[
              theme.reservationsCardOverlayStart,
              theme.reservationsCardOverlayEnd,
            ]}
            style={[styles.pistaOverlay, { borderRadius: 14 }]}
          >
            <View style={styles.pistaHeader}>
              <Text style={styles.pistaName}>{pista.name}</Text>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>
                  {t('bookingTabPricePerHour', {
                    price: pista.price_per_hour ?? '-',
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineTitleRow}>
                <Text style={styles.horariosLabel}>
                  {t('bookingTabAvailabilityToday')}
                </Text>
                <TouchableOpacity style={styles.infoButton} onPress={onInfo}>
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color={theme.onPrimary}
                  />
                </TouchableOpacity>
              </View>
              <AvailabilityBar
                horaApertura={pista.opening_time}
                horaCierre={pista.closing_time}
                reservasActuales={pista.current_reservations || []}
              />
            </View>
          </LinearGradient>
        </View>
      ) : (
      <ImageBackground
        source={getImageForPista(pista)}
        style={styles.pistaImageBg}
        imageStyle={{ borderRadius: 14 }}
        onError={() => setImageError(true)}
      >
        <LinearGradient
          colors={[
            theme.reservationsCardOverlayStart,
            theme.reservationsCardOverlayEnd,
          ]}
          style={styles.pistaOverlay}
        >
          <View style={styles.pistaHeader}>
            <Text style={styles.pistaName}>{pista.name}</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>
                {t('bookingTabPricePerHour', {
                  price: pista.price_per_hour ?? '-',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.timelineContainer}>
            <View style={styles.timelineTitleRow}>
              <Text style={styles.horariosLabel}>
                {t('bookingTabAvailabilityToday')}
              </Text>
              <TouchableOpacity style={styles.infoButton} onPress={onInfo}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={theme.onPrimary}
                />
              </TouchableOpacity>
            </View>

            <AvailabilityBar
              horaApertura={pista.opening_time}
              horaCierre={pista.closing_time}
              reservasActuales={pista.current_reservations || []}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
      )}
    </TouchableOpacity>
  );
}
