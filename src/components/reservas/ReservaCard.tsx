import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Reserva } from '../../hooks/useReservas';
import { lightModeSemanticTokens } from '../../theme';

type Props = {
  reserva: Reserva;
  onCancel?: (id: string) => void;
  onEdit?: (id: string) => void;
};

export default function ReservaCard({ reserva, onCancel, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.code}>{reserva.codigo_reserva ?? reserva.id}</Text>
        <Text style={styles.status}>{reserva.estado}</Text>
      </View>

      <Text style={styles.meta}>
        Inicio: {new Date(reserva.fecha_inicio).toLocaleString()}
      </Text>
      <Text style={styles.meta}>
        Fin: {new Date(reserva.fecha_fin).toLocaleString()}
      </Text>

      {reserva.nota ? (
        <Text style={styles.note}>Nota: {reserva.nota}</Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onEdit?.(reserva.id)}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.cancel]}
          onPress={() => onCancel?.(reserva.id)}
        >
          <Text
            style={[
              styles.btnText,
              { color: lightModeSemanticTokens.onPrimary },
            ]}
          >
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightModeSemanticTokens.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightModeSemanticTokens.borderSoft,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  code: { fontWeight: '700' },
  status: { color: '#374151' },
  meta: { color: '#6b7280', marginTop: 4 },
  note: { marginTop: 8, color: '#374151' },
  actions: { flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  cancel: {
    backgroundColor: lightModeSemanticTokens.danger,
    borderColor: lightModeSemanticTokens.danger,
  },
  btnText: { color: '#06b6d4', fontWeight: '600' },
});
