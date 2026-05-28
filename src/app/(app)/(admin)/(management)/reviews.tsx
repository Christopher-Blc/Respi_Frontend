import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../../context/ThemeContext';
import { SessionExpiredModal } from '../../../../components/alert.modal';
import { reviewsStyles as styles } from '../../../../style/admin/reviews.styles';
import { ReviewCard } from '../../../../components/admin/reviews/ReviewCard';
import { ReviewFormModal } from '../../../../components/admin/reviews/ReviewFormModal';
import { ReviewsFiltersModal } from '../../../../components/admin/reviews/ReviewsFiltersModal';
import {
  AdminReview,
  useAdminReviews,
} from '../../../../hooks/admin/useAdminReviews';
import { usePullToRefresh } from '../../../../hooks/usePullToRefresh';

export default function AdminReviewsScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tableMinWidth = 920;
  const useHorizontalTableScroll = width < tableMinWidth + 32;
  const cardsColumns = width >= 1280 ? 3 : width >= 780 ? 2 : 1;
  const [cardsContainerWidth, setCardsContainerWidth] = useState(0);
  const gridHorizontalPadding = 32;
  const gridGap = 12;
  const availableGridWidth = cardsContainerWidth || width;
  const computedCardWidth =
    cardsColumns === 1
      ? availableGridWidth - gridHorizontalPadding
      : (availableGridWidth -
          gridHorizontalPadding -
          gridGap * (cardsColumns - 1)) /
        cardsColumns;
  const [searchReadOnly, setSearchReadOnly] = useState(true);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const {
    courts,
    courtFilterOptions,
    filteredReviews,
    loading,
    refresh,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    filterRating,
    setFilterRating,
    filterCourtName,
    setFilterCourtName,
    replyFilter,
    setReplyFilter,
    answerModalVisible,
    reviewToAnswer,
    adminAnswerText,
    setAdminAnswerText,
    openAnswerModal,
    closeAnswerModal,
    handleSaveAnswer,
    clearFilters,
    errorModal,
    setErrorModal,
  } = useAdminReviews();
  const { refreshing, onRefresh } = usePullToRefresh(refresh);

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRating, filterCourtName, replyFilter]);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(filteredReviews.length / PAGE_SIZE) || 1;
  const pagedReviews = filteredReviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasActiveFilters =
    filterRating !== 'all' ||
    filterCourtName !== 'all' ||
    replyFilter !== 'all';

  const renderCard = ({ item }: { item: AdminReview }) => {
    const normalizedCardWidth = Math.max(280, Math.floor(computedCardWidth));
    const cardWidthStyle = {
      width: normalizedCardWidth,
      maxWidth: normalizedCardWidth,
    };

    return (
      <View style={[styles.cardColumn, cardWidthStyle]}>
        <ReviewCard item={item} theme={theme} onAnswer={openAnswerModal} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundMain }]}>
      <View style={[styles.headerActions, { paddingTop: headerHeight + 10 }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.backgroundCard,
              borderColor: theme.primarySoft,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={theme.textBody} />
          <TextInput
            placeholder="Buscar reseña..."
            placeholderTextColor={theme.textBody + '80'}
            style={[styles.searchInput, { color: theme.textTitle }]}
            value={searchQuery}
            readOnly={searchReadOnly}
            onFocus={() => setSearchReadOnly(false)}
            onBlur={() => setSearchReadOnly(true)}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textBody} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.squareBtn,
            {
              backgroundColor: theme.primary + '18',
              borderWidth: 1,
              borderColor: theme.primarySoft,
            },
          ]}
          onPress={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
        >
          <Ionicons
            name={viewMode === 'cards' ? 'list-outline' : 'grid-outline'}
            size={22}
            color={theme.textBody}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.squareBtn,
            {
              backgroundColor: hasActiveFilters
                ? theme.primary + '24'
                : theme.primary + '18',
              borderWidth: 1,
              borderColor: hasActiveFilters ? theme.primary : theme.primarySoft,
            },
          ]}
          onPress={() => setShowFiltersModal(true)}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={hasActiveFilters ? theme.primary : theme.textBody}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.squareBtn,
            {
              backgroundColor: theme.primary + '18',
              borderWidth: 1,
              borderColor: theme.primarySoft,
            },
          ]}
          onPress={clearFilters}
        >
          <Ionicons
            name="refresh"
            size={22}
            color={hasActiveFilters ? theme.primary : theme.textBody}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: 50 }}
        />
      ) : viewMode === 'cards' ? (
        <View
          style={{ flex: 1 }}
          onLayout={(event) => {
            const nextWidth = Math.floor(event.nativeEvent.layout.width);
            if (nextWidth > 0 && nextWidth !== cardsContainerWidth) {
              setCardsContainerWidth(nextWidth);
            }
          }}
        >
          <FlatList
            key={`reviews-cards-${cardsColumns}`}
            data={pagedReviews}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primary}
              />
            }
            renderItem={renderCard}
            numColumns={cardsColumns}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={cardsColumns > 1 ? styles.gridRow : undefined}
            contentContainerStyle={[
              styles.gridContent,
              { paddingBottom: insets.bottom + 100 },
            ]}
            ListEmptyComponent={
              <Text style={{ color: theme.textBody, paddingHorizontal: 16 }}>
                No hay reseñas para mostrar.
              </Text>
            }
          />
        </View>
      ) : (
        <ScrollView
          horizontal={useHorizontalTableScroll}
          showsHorizontalScrollIndicator={useHorizontalTableScroll}
          bounces={false}
          contentContainerStyle={
            useHorizontalTableScroll ? { paddingHorizontal: 16 } : undefined
          }
        >
          <View
            style={[
              styles.tableWrap,
              {
                borderColor: theme.primarySoft,
                backgroundColor: theme.backgroundCard,
              },
              useHorizontalTableScroll
                ? { minWidth: tableMinWidth, marginHorizontal: 0 }
                : undefined,
            ]}
          >
            <View
              style={[
                styles.tableHeader,
                { borderBottomColor: theme.primarySoft },
              ]}
            >
              <Text
                style={[
                  styles.colCourt,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Pista
              </Text>
              <Text
                style={[
                  styles.colUser,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Usuario
              </Text>
              <Text
                style={[
                  styles.colTitle,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Titulo
              </Text>
              <Text
                style={[
                  styles.colRating,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Rating
              </Text>
              <Text
                style={[
                  styles.colVisibility,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Estado
              </Text>
              <Text
                style={[
                  styles.colActions,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Acciones
              </Text>
            </View>

            <FlatList
              data={pagedReviews}
              keyExtractor={(item) => item.id.toString()}
              nestedScrollEnabled
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.primary}
                />
              }
              contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
              renderItem={({ item: review, index }) => (
                <View
                  style={[
                    styles.tableRow,
                    {
                      borderBottomColor:
                        index === pagedReviews.length - 1
                          ? 'transparent'
                          : theme.primarySoft,
                    },
                  ]}
                >
                  <Text
                    style={[styles.colCourt, { color: theme.textBody }]}
                    numberOfLines={2}
                  >
                    {review.court?.name || `#${review.court_id}`}
                  </Text>
                  <Text
                    style={[styles.colUser, { color: theme.textBody }]}
                    numberOfLines={2}
                  >
                    {review.user?.username || `#${review.user_id}`}
                  </Text>
                  <Text
                    style={[styles.colTitle, { color: theme.textBody }]}
                    numberOfLines={2}
                  >
                    {review.title}
                  </Text>
                  <Text style={[styles.colRating, { color: theme.textBody }]}>
                    {review.rating}/5
                  </Text>
                  <Text
                    style={[styles.colVisibility, { color: theme.textBody }]}
                  >
                    {review.admin_answer?.trim() ? 'Contestada' : 'Pendiente'}
                  </Text>
                  <View
                    style={[
                      styles.colActions,
                      { flexDirection: 'row', gap: 8 },
                    ]}
                  >
                    <TouchableOpacity onPress={() => openAnswerModal(review)}>
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color={theme.textBody}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
      )}

      <ReviewFormModal
        visible={answerModalVisible}
        review={reviewToAnswer}
        adminAnswerText={adminAnswerText}
        setAdminAnswerText={setAdminAnswerText}
        onClose={closeAnswerModal}
        onSave={handleSaveAnswer}
      />

      {!loading && totalPages > 1 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
            gap: 16,
            backgroundColor: theme.backgroundCard,
            borderTopWidth: 1,
            borderTopColor: theme.primarySoft,
          }}
        >
          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={currentPage === 1 ? theme.textBody + '40' : theme.primary}
            />
          </TouchableOpacity>
          <Text
            style={{ color: theme.textTitle, fontWeight: '700', fontSize: 14 }}
          >
            {currentPage} / {totalPages}
          </Text>
          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                currentPage === totalPages
                  ? theme.textBody + '40'
                  : theme.primary
              }
            />
          </TouchableOpacity>
        </View>
      )}

      <ReviewsFiltersModal
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        courtNames={courtFilterOptions}
        filterRating={filterRating}
        setFilterRating={setFilterRating}
        replyFilter={replyFilter}
        setReplyFilter={setReplyFilter}
        filterCourtName={filterCourtName}
        setFilterCourtName={setFilterCourtName}
        onClear={clearFilters}
      />

      <SessionExpiredModal
        visible={errorModal.visible}
        title={errorModal.title || t('adminReviews')}
        message={errorModal.message}
        confirmText="Entendido"
        onConfirm={() =>
          setErrorModal({ visible: false, title: '', message: '' })
        }
      />
    </View>
  );
}
