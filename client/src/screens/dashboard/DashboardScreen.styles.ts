import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  languageFilters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  continueCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  movieThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  thumbnailIcon: {
    fontSize: 24,
  },
  movieInfo: {
    flex: 1,
  },
  exploreMovieInfo: {
    flex: 1,
  },
  exploreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  movieMeta: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  languageBadge: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  languageBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  difficultyBadgeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  movieStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
