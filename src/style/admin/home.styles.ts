import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
  },
  heroTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
    borderWidth: 1,
  },
  heroTagText: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 0.5,
    minHeight: 200,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 999,
    opacity: 0.8,
  },
  cardInfo: {
    marginTop: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },
  cardFooter: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCta: {
    fontSize: 13,
    fontWeight: '800',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default styles;