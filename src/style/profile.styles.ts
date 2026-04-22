 import { 
  StyleSheet, 
} from 'react-native'; 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    // El paddingBottom se maneja dinámicamente arriba
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#B89B5E',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  membresiaCard: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Líneas de separación restauradas
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#FDF8ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 14,
    color: '#AAA',
    marginRight: 8,
  },
  logoutContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoutButtonCustom: {
    width: '100%',
    height: 55,
    borderRadius: 15,
  },
  RespiText: {
    textAlign: 'center',
    color: '#CCC',
    marginTop: 20,
    fontSize: 12,
  },
  versionText: {
    textAlign: 'center',
    color: '#CCC',
    fontSize: 12,
    marginBottom: -25,
  },
  loadingOverlayList: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  // Añade esto a tu archivo de estilos
reservasCountCard: {
  backgroundColor: '#FAF3E0', // Color crema suave de la foto
  width: '90%',
  borderRadius: 15,
  paddingVertical: 12,
  alignItems: 'center',
  marginTop: 15,
  alignSelf: 'center',
},
reservasNumber: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#000',
},
reservasLabel: {
  fontSize: 12,
  color: '#666',
},
  
});

export default styles;              