import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import createReservationsStyles from '../../../../style/reservations.styles';
import { useAppTheme } from '../../../../context/ThemeContext';
import {
  PistaDisponibilidad,
  useReservasDisponibles,
} from '../../../../hooks/useReservasDisponibles';
import { API_PUBLIC_URL } from '../../../../constants';
import DateModal from '../../../../components/reservas/date.modal';
import DisponibilidadBarra, {
  crearBloquesDisponibilidad,
  crearResumenHuecosLibres,
} from '../../../../components/reservas/DisponibilidadBarra';
import createReservasTabStyles from '../../../../style/reservasTab.styles';

const getNext7Days = () => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const formatDateForAPI = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
};

const formatDateDisplay = (date: Date) =>
  date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

const getImageForPista = (pista: PistaDisponibilidad) => {
  if (pista.tipo_pista?.imagen) {
    const path = pista.tipo_pista.imagen;
    return {
      uri: path.startsWith('http')
        ? path
        : API_PUBLIC_URL + '/' + String(path).replace(/^\//, ''),
    };
  }

  return require('../../../../../assets/RespiLogo.png');
};

export default function ReservasTab() {
  const { theme, isDarkMode } = useAppTheme();
  const router = useRouter();
  const styles = useMemo(() => createReservationsStyles(theme), [theme]);
  const reservasTabStyles = useMemo(
    () => createReservasTabStyles(theme),
    [theme],
  );
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoText, setInfoText] = useState('');

  const formattedDate = formatDateForAPI(selectedDate);
  const { pistas, loading } = useReservasDisponibles(formattedDate);
  const availableDays = useMemo(() => getNext7Days(), []);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setShowDateModal(false);
  };

  const openInfo = (pista: PistaDisponibilidad) => {
    const bloques = crearBloquesDisponibilidad(
      pista.hora_apertura,
      pista.hora_cierre,
      pista.reservas_actuales || [],
    );
    setInfoTitle(pista.nombre);
    setInfoText(crearResumenHuecosLibres(bloques));
    setShowInfoModal(true);
  };

  const openCreateBooking = (pista: PistaDisponibilidad) => {
    router.push({
      pathname: '/(app)/(tabs)/reservas/createBooking',
      params: {
        pistaId: String(pista.pista_id),
        pistaNombre: pista.nombre,
        fecha: formattedDate,
        horaApertura: pista.hora_apertura,
        horaCierre: pista.hora_cierre,
        precioHora: String(pista.precio_hora ?? ''),
        reservasActuales: JSON.stringify(pista.reservas_actuales || []),
      },
    });
  };

  const renderDateSelector = () => (
    <>
      <BlurView
        intensity={50}
        tint={isDarkMode ? 'dark' : 'light'}
        style={[
          StyleSheet.absoluteFill,
          { paddingTop: headerHeight + 10, height: headerHeight + 74 },
        ]}
      />
      <View
        style={[
          reservasTabStyles.dateSelector,
          { paddingTop: headerHeight + 10 },
        ]}
      >
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={availableDays}
          keyExtractor={(item) => item.toISOString()}
          contentContainerStyle={reservasTabStyles.dateScrollContent}
          renderItem={({ item }) => {
            const isSelected =
              item.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                style={[
                  reservasTabStyles.dateButton,
                  isSelected && reservasTabStyles.dateButtonSelected,
                ]}
                onPress={() => setSelectedDate(item)}
              >
                <Text
                  style={[
                    reservasTabStyles.dateButtonText,
                    isSelected && reservasTabStyles.dateButtonTextSelected,
                  ]}
                >
                  {formatDateDisplay(item)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          style={reservasTabStyles.calendarButton}
          onPress={() => setShowDateModal(true)}
        >
          <Ionicons name="calendar" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPistaCard = (pista: PistaDisponibilidad) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => openCreateBooking(pista)}
      key={pista.pista_id}
      style={[
        reservasTabStyles.pistaCard,
        { flexBasis: isWideScreen ? '48%' : '100%', flexGrow: 1 },
      ]}
    >
      <ImageBackground
        source={getImageForPista(pista)}
        style={reservasTabStyles.pistaImageBg}
        imageStyle={{ borderRadius: 14 }}
      >
        <LinearGradient
          colors={[
            theme.reservationsCardOverlayStart,
            theme.reservationsCardOverlayEnd,
          ]}
          style={reservasTabStyles.pistaOverlay}
        >
          <View style={reservasTabStyles.pistaHeader}>
            <Text style={reservasTabStyles.pistaName}>{pista.nombre}</Text>
            <View style={reservasTabStyles.priceBadge}>
              <Text style={reservasTabStyles.priceText}>
                EUR {pista.precio_hora ?? '-'} /h
              </Text>
            </View>
          </View>

          <View style={reservasTabStyles.timelineContainer}>
            <View style={reservasTabStyles.timelineTitleRow}>
              <Text style={reservasTabStyles.horariosLabel}>
                Disponibilidad del dia
              </Text>
              <TouchableOpacity
                style={reservasTabStyles.infoButton}
                onPress={() => openInfo(pista)}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={theme.onPrimary}
                />
              </TouchableOpacity>
            </View>

            <DisponibilidadBarra
              horaApertura={pista.hora_apertura}
              horaCierre={pista.hora_cierre}
              reservasActuales={pista.reservas_actuales || []}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <DateModal
        visible={showDateModal}
        onSave={handleSelectDate}
        onClose={() => setShowDateModal(false)}
      />

      <Modal
        visible={showInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={reservasTabStyles.infoModalBackdrop}>
          <View style={reservasTabStyles.infoModalCard}>
            <Text style={reservasTabStyles.infoModalTitle}>{infoTitle}</Text>
            <Text style={reservasTabStyles.infoModalBody}>{infoText}</Text>
            <TouchableOpacity
              style={reservasTabStyles.infoModalCloseBtn}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={reservasTabStyles.infoModalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {renderDateSelector()}

      {loading ? (
        <View style={reservasTabStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : pistas.length === 0 ? (
        <View style={reservasTabStyles.emptyContainer}>
          <Ionicons
            name="calendar-clear-outline"
            size={48}
            color={theme.textMuted}
          />
          <Text style={reservasTabStyles.emptyTitle}>
            No hay pistas disponibles
          </Text>
          <Text style={reservasTabStyles.emptySubtitle}>
            Selecciona otra fecha para continuar
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 14,
            paddingBottom: Platform.OS === 'web' ? 96 : 140,
            paddingHorizontal: 12,
          }}
        >
          <View style={reservasTabStyles.gridContainer}>
            {pistas.map(renderPistaCard)}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
