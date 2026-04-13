import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    logoutButton: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        backgroundColor:"#979797",
        elevation: 5,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 18,
        backgroundColor: '#f9fafb',
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16,
        color: '#111827',
    },
    quickRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    quickButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    primary: {
        backgroundColor: '#CA8E0E',
    },
    secondary: {
        backgroundColor: 'rgba(10,10,10,0.06)',
    },
    quickText: {
        color: '#fff',
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#374151',
    },
    card: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
    
    // 1. FUNDAMENTAL: Esto corta la imagen para que respete el borderRadius
    overflow: 'hidden', 
    
    // 2. Quita o suaviza el borde
    borderWidth: 0, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
},
cardBg: { 
    width: '100%', 
    height: 160, 
    justifyContent: 'flex-end',
    // Asegúrate de que no haya padding aquí para que la imagen pegue al borde
},
    cardOverlay: { 
        flex: 1, 
        justifyContent: 'space-between', // Separa el header del bottom
        padding: 14 
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Empuja el título a la izq y badge a la dcha
        alignItems: 'center', // Los centra verticalmente entre ellos
    },
    statusBadge: {
        backgroundColor: 'rgba(202, 142, 14, 0.8)', // Naranja con transparencia
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    cardTitle: { 
        flex: 1, // Para que si el título es muy largo no pise al badge
        fontWeight: '900', 
        fontSize: 17, 
        color: '#fff',
        marginRight: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4
    },
    cardBottom: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end' 
    },
    cardMeta: { 
        color: '#fff', 
        fontSize: 13, 
        fontWeight: '500',
        opacity: 0.9
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6b7280',
        fontSize: 16,
    }
});

export default styles;  