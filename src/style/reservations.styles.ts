import { StyleSheet, Dimensions, Platform } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF8F2',
        paddingHorizontal: 20,
    },
    innerContainer: {
        flex: 1,
        width: '100%',
        maxWidth: Platform.OS === 'web' ? 700 : undefined,
        alignSelf: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: '800',
        marginTop: 20,
        marginBottom: 10,
        color: '#1A2F4B', // Azul marino premium para los títulos
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 25,
        marginBottom: 15,
        color: '#333',
    },

    // --- ACTION TILES ---
    premiumActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
    },
    actionTile: {
        flex: 1,
        height: 80,
        borderRadius: 14,
        overflow: 'hidden',
    },
    actionTileBg: {
        flex: 1,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 12,
    },
    actionTileText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    pillButtonPrimary: {
        flex: 1,
        overflow: 'hidden',
    }, 
    pillButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    pillButtonOutline: {
        flex: 1,
        //height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: '#CA8E0E',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    pillButtonTextOutline: {
        color: '#CA8E0E',
        fontSize: 15,
        fontWeight: '700',
    },

    // --- CARD DE RESERVA (Mantenido y pulido) ---
    card: {
        width: '100%',
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    cardBg: { 
        width: '100%', 
        height: 160, 
    },
    cardOverlay: { 
        flex: 1, 
        justifyContent: 'space-between', 
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.2)' // Oscurece un poco la imagen para leer mejor
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        backgroundColor: '#CA8E0E', // Dorado sólido o semi-transparente
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20, // Badge más redondeado
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    cardTitle: { 
        flex: 1,
        fontWeight: '800', 
        fontSize: 19, 
        color: '#fff',
        marginRight: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6
    },
    cardBottom: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end' 
    },
    cardMeta: { 
        color: '#fff', 
        fontSize: 13, 
        fontWeight: '600',
        marginBottom: 2,
    },

    // --- OTROS ---
    emptyContainer: {
        padding: 60,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        position: 'static',
        bottom: 20, 
        right: 15,
        backgroundColor: 'rgba(173, 25, 25, 0.38)', // Azul muy tenue
        borderRadius: 25,
        width: 150,

    },
});

export default styles;