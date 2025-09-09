// MatchList.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
// import { useAuth } from '../contexts/AuthContext'; // ← ДОБАВЬТЕ ИМПОРТ
import SplashScreen from './SplashScreen';
import {
  cellStyle,
  cellStyle_2,
  verticalHeaderStyle,
  fixedWidthColumnStyle,
  cardContainerStyle,
  cardStyle,
  cardCountStyle,
  cardTitleStyle,
  cardRoiStyle,
  topBlockStyle,
  searchResultsStyle,
  searchResultItemStyle,
  tableStyle,
  filtersContainerStyle,
  filtersRowStyle,
  filterItemStyle,
  labelStyle,
  checkboxLabelStyle,
  inputStyle,
  resetButtonStyle,
  stickyHeaderRowStyle,
  tableContainerStyle,
  checkboxDropdownStyle,
  checkboxItemStyle,
  customCheckboxStyle,
  customCheckboxCheckedStyle,
  selectWithDropdownStyle,
  checkboxDropdownWideStyle,
  leagueHeaderStyle
} from './MatchList.styles';

interface League {
  id: string;
  name: string;
}

interface Match {
  id: number;
  date: string;
  home: string;
  away: string;
  league: string;
  league_id: string;
  one_o: number;
  one_e: number;
  x_o: number;
  x_e: number;
  two_o: number;
  two_e: number;
  bts_o: number;
  bts_e: number;
  bts_no_o: number;
  bts_no_e: number;
  over_o: number;
  over_e: number;
  under_o: number;
  under_e: number;
  first_half: string | null;
  match: string | null;
  goals: string | null;
  link: string | null;
  notes: string | null;
}

interface Statistics {
  total_matches: number;
  home_wins_count: number;
  draws_count: number;
  away_wins_count: number;
  bts_yes_count: number;
  bts_no_count: number;
  over_count: number;
  under_count: number;
  roi_home: number;
  roi_draw: number;
  roi_away: number;
  roi_bts_yes: number;
  roi_bts_no: number;
  roi_over: number;
  roi_under: number;
}

const MatchList: React.FC = () => {
  // 1. СНАЧАЛА СОСТОЯНИЯ ДЛЯ SPLASH - САМЫЕ ПЕРВЫЕ!
  const [showSplash, setShowSplash] = useState(true);
  // const [initialLoading, setInitialLoading] = useState(true);
  // Основные состояния
  // const [matches, setMatches] = useState<Match[]>([]);
  // const { user, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>(() => {
    const cached = localStorage.getItem('matchesCache');
    return cached ? JSON.parse(cached) : [];
  });
  const [, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(() => {
    const cached = localStorage.getItem('statisticsCache');
    return cached ? JSON.parse(cached) : null;
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [allMatchesCache, setAllMatchesCache] = useState<Match[]>([]);
  const [allStatisticsCache, setAllStatisticsCache] = useState<Statistics | null>(null);

  // Состояния фильтров выбора
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [showHome, setShowHome] = useState<boolean>(false);
  const [showAway, setShowAway] = useState<boolean>(false);
  const [selectedBtsResult, setSelectedBtsResult] = useState<string[]>([]);
  const [selectedTotalGoals, setSelectedTotalGoals] = useState<string[]>([]);

  // Состояния фильтров коэффициентов
  const [selectedOneOs, setSelectedOneOs] = useState<string[]>([]);
  const [selectedOneEs, setSelectedOneEs] = useState<string[]>([]);
  const [selectedXOs, setSelectedXOs] = useState<string[]>([]);
  const [selectedXEs, setSelectedXEs] = useState<string[]>([]);
  const [selectedTwoOs, setSelectedTwoOs] = useState<string[]>([]);
  const [selectedTwoEs, setSelectedTwoEs] = useState<string[]>([]);
  const [selectedBtsOs, setSelectedBtsOs] = useState<string[]>([]);
  const [selectedBtsEs, setSelectedBtsEs] = useState<string[]>([]);
  const [selectedBtsNoOs, setSelectedBtsNoOs] = useState<string[]>([]);
  const [selectedBtsNoEs, setSelectedBtsNoEs] = useState<string[]>([]);
  const [selectedOverOs, setSelectedOverOs] = useState<string[]>([]);
  const [selectedOverEs, setSelectedOverEs] = useState<string[]>([]);
  const [selectedUnderOs, setSelectedUnderOs] = useState<string[]>([]);
  const [selectedUnderEs, setSelectedUnderEs] = useState<string[]>([]);
  const [selectedFirstHalfs, setSelectedFirstHalfs] = useState<string[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);

  // Состояния отображения чекбоксов
  const [showOneOCheckboxes, setShowOneOCheckboxes] = useState<boolean>(false);
  const [showOneEsCheckboxes, setShowOneEsCheckboxes] = useState<boolean>(false);
  const [showXOCheckboxes, setShowXOCheckboxes] = useState<boolean>(false);
  const [showXEsCheckboxes, setShowXEsCheckboxes] = useState<boolean>(false);
  const [showTwoOCheckboxes, setShowTwoOCheckboxes] = useState<boolean>(false);
  const [showTwoEsCheckboxes, setShowTwoEsCheckboxes] = useState<boolean>(false);
  const [showBtsOCheckboxes, setShowBtsOCheckboxes] = useState<boolean>(false);
  const [showBtsEsCheckboxes, setShowBtsEsCheckboxes] = useState<boolean>(false);
  const [showBtsNoOCheckboxes, setShowBtsNoOCheckboxes] = useState<boolean>(false);
  const [showBtsNoEsCheckboxes, setShowBtsNoEsCheckboxes] = useState<boolean>(false);
  const [showOverOCheckboxes, setShowOverOCheckboxes] = useState<boolean>(false);
  const [showOverEsCheckboxes, setShowOverEsCheckboxes] = useState<boolean>(false);
  const [showUnderOCheckboxes, setShowUnderOCheckboxes] = useState<boolean>(false);
  const [showUnderEsCheckboxes, setShowUnderEsCheckboxes] = useState<boolean>(false);
  const [showFirstHalfsCheckboxes, setShowFirstHalfsCheckboxes] = useState<boolean>(false);
  const [showMatchesCheckboxes, setShowMatchesCheckboxes] = useState<boolean>(false);
  const [showBtsResultCheckboxes, setShowBtsResultCheckboxes] = useState<boolean>(false);
  const [showTotalGoalsCheckboxes, setShowTotalGoalsCheckboxes] = useState<boolean>(false);
  const [showLeaguesCheckboxes, setShowLeaguesCheckboxes] = useState<boolean>(false);

  // Уникальные значения
  const [uniqueLeagues, setUniqueLeagues] = useState<League[]>([]);
  const [uniqueTeams, setUniqueTeams] = useState<string[]>([]);
  const [uniqueOneOs, setUniqueOneOs] = useState<string[]>([]);
  const [uniqueOneEs, setUniqueOneEs] = useState<string[]>([]);
  const [uniqueXOs, setUniqueXOs] = useState<string[]>([]);
  const [uniqueXEs, setUniqueXEs] = useState<string[]>([]);
  const [uniqueTwoOs, setUniqueTwoOs] = useState<string[]>([]);
  const [uniqueTwoEs, setUniqueTwoEs] = useState<string[]>([]);
  const [uniqueBtsOs, setUniqueBtsOs] = useState<string[]>([]);
  const [uniqueBtsEs, setUniqueBtsEs] = useState<string[]>([]);
  const [uniqueBtsNoOs, setUniqueBtsNoOs] = useState<string[]>([]);
  const [uniqueBtsNoEs, setUniqueBtsNoEs] = useState<string[]>([]);
  const [uniqueOverOs, setUniqueOverOs] = useState<string[]>([]);
  const [uniqueOverEs, setUniqueOverEs] = useState<string[]>([]);
  const [uniqueUnderOs, setUniqueUnderOs] = useState<string[]>([]);
  const [uniqueUnderEs, setUniqueUnderEs] = useState<string[]>([]);
  const [uniqueFirstHalfs, setUniqueFirstHalfs] = useState<string[]>([]);
  const [uniqueMatches, setUniqueMatches] = useState<string[]>([]);

  // ДОБАВЬТЕ ЗДЕСЬ - после useState, перед функциями
  const isCacheFresh = () => {
    const timestamp = localStorage.getItem('cacheTimestamp');
    return timestamp && Date.now() - parseInt(timestamp) < 5 * 60 * 1000;
  };

  const filters = {
    one_o: selectedOneOs,
    one_e: selectedOneEs,
    x_o: selectedXOs,
    x_e: selectedXEs,
    two_o: selectedTwoOs,
    two_e: selectedTwoEs,
    bts_o: selectedBtsOs,
    bts_e: selectedBtsEs,
    bts_no_o: selectedBtsNoOs,
    bts_no_e: selectedBtsNoEs,
    over_o: selectedOverOs,
    over_e: selectedOverEs,
    under_o: selectedUnderOs,
    under_e: selectedUnderEs,
    first_half: selectedFirstHalfs,
    match: selectedMatches,
    bts_result: selectedBtsResult, 
    total_goals: selectedTotalGoals, 
    leagues: selectedLeagues,
    team: selectedTeam
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const topBlockRef = useRef<HTMLDivElement>(null);

  const getBaseLeagueName = (fullLeagueName: string): string => {
    if (!fullLeagueName) return '';
    return fullLeagueName.split(' - ')[0].trim();
  };

  const handleCheckboxChange = (filterType: keyof typeof filters, value: string) => {
    const setters: { [key in keyof typeof filters]: React.Dispatch<React.SetStateAction<string[]>> } = {
      one_o: setSelectedOneOs,
      one_e: setSelectedOneEs,
      x_o: setSelectedXOs,
      x_e: setSelectedXEs,
      two_o: setSelectedTwoOs,
      two_e: setSelectedTwoEs,
      bts_o: setSelectedBtsOs,
      bts_e: setSelectedBtsEs,
      bts_no_o: setSelectedBtsNoOs,
      bts_no_e: setSelectedBtsNoEs,
      over_o: setSelectedOverOs,
      over_e: setSelectedOverEs,
      under_o: setSelectedUnderOs,
      under_e: setSelectedUnderEs,
      first_half: setSelectedFirstHalfs,
      match: setSelectedMatches,
      bts_result: setSelectedBtsResult, 
      total_goals: setSelectedTotalGoals, 
      leagues: setSelectedLeagues,
      team: setSelectedTeam
    } as any;

    const setter = setters[filterType];
    if (setter) {
      setter(prev => 
        prev.includes(value) 
          ? prev.filter(val => val !== value) 
          : [...prev, value]
      );
    }

    // ПЕРЕОТКРЫВАЕМ ВЫПАДАЮЩИЙ СПИСОК ДЛЯ КОЭФФИЦИЕНТОВ
    setTimeout(() => {
      switch (filterType) {
        case 'one_o': setShowOneOCheckboxes(true); break;
        case 'one_e': setShowOneEsCheckboxes(true); break;
        case 'x_o': setShowXOCheckboxes(true); break;
        case 'x_e': setShowXEsCheckboxes(true); break;
        case 'two_o': setShowTwoOCheckboxes(true); break;
        case 'two_e': setShowTwoEsCheckboxes(true); break;
        case 'bts_o': setShowBtsOCheckboxes(true); break;
        case 'bts_e': setShowBtsEsCheckboxes(true); break;
        case 'bts_no_o': setShowBtsNoOCheckboxes(true); break;
        case 'bts_no_e': setShowBtsNoEsCheckboxes(true); break;
        case 'over_o': setShowOverOCheckboxes(true); break;
        case 'over_e': setShowOverEsCheckboxes(true); break;
        case 'under_o': setShowUnderOCheckboxes(true); break;
        case 'under_e': setShowUnderEsCheckboxes(true); break;
        default: break;
      }
    }, 100);
  };



  const fetchMatches = async (useCache: boolean = false) => {
    
    try {
      setLoading(true);
      setError(null);

      if (useCache && allMatchesCache.length > 0 && allStatisticsCache) {
        setMatches(allMatchesCache);
        setStatistics(allStatisticsCache);
        setLoading(false);
        setShowSplash(false); // ← Скрываем сплеш-скрин
        
        return;
      }

      const params = new URLSearchParams();
      let allMatchesData: Match[] = [];

      // ДОБАВЛЯЕМ ВСЕ ФИЛЬТРЫ КРОМЕ ЛИГ
      if (selectedTeam.length > 0) {
        params.append('team', selectedTeam[0]);
        const locations = [];
        if (showHome) locations.push('home');
        if (showAway) locations.push('away');
        if (locations.length > 0) params.append('location', locations.join(','));
      }
      if (selectedOneOs.length > 0) params.append('one_os', selectedOneOs.join(','));
      if (selectedOneEs.length > 0) params.append('one_es', selectedOneEs.join(','));
      if (selectedXOs.length > 0) params.append('x_os', selectedXOs.join(','));
      if (selectedXEs.length > 0) params.append('x_es', selectedXEs.join(','));
      if (selectedTwoOs.length > 0) params.append('two_os', selectedTwoOs.join(','));
      if (selectedTwoEs.length > 0) params.append('two_es', selectedTwoEs.join(','));
      if (selectedBtsOs.length > 0) params.append('bts_os', selectedBtsOs.join(','));
      if (selectedBtsEs.length > 0) params.append('bts_es', selectedBtsEs.join(','));
      if (selectedBtsNoOs.length > 0) params.append('bts_no_os', selectedBtsNoOs.join(','));
      if (selectedBtsNoEs.length > 0) params.append('bts_no_es', selectedBtsNoEs.join(','));
      if (selectedOverOs.length > 0) params.append('over_os', selectedOverOs.join(','));
      if (selectedOverEs.length > 0) params.append('over_es', selectedOverEs.join(','));
      if (selectedUnderOs.length > 0) params.append('under_os', selectedUnderOs.join(','));
      if (selectedUnderEs.length > 0) params.append('under_es', selectedUnderEs.join(','));
      if (selectedFirstHalfs.length > 0) params.append('first_halfs', selectedFirstHalfs.join(','));
      if (selectedMatches.length > 0) params.append('matches', selectedMatches.join(','));
      if (selectedBtsResult.length > 0) params.append('bts_result', selectedBtsResult.join(','));
      if (selectedTotalGoals.length > 0) params.append('total_goals', selectedTotalGoals.join(','));

      if (selectedLeagues.length > 0) {
        // МНОЖЕСТВЕННЫЙ ВЫБОР ЛИГ + ДРУГИЕ ФИЛЬТРЫ
        const matchesPromises = selectedLeagues.map(leagueId => 
          axios.get<Match[]>(`${API_BASE_URL}/api/matches/?league_id=${leagueId}&${params.toString()}`)
        );
        const matchesResponses = await Promise.all(matchesPromises);
        const allMatches = matchesResponses.flatMap(response => response.data);
        setMatches(allMatches);

        const statsPromises = selectedLeagues.map(leagueId =>
          axios.get<Statistics>(`${API_BASE_URL}/api/matches/statistics/?league_id=${leagueId}&${params.toString()}`)
        );
        const statsResponses = await Promise.all(statsPromises);
        
        const combinedStats = statsResponses.reduce((acc, response) => {
          const stats = response.data;
          return {
            total_matches: acc.total_matches + stats.total_matches,
            home_wins_count: acc.home_wins_count + stats.home_wins_count,
            draws_count: acc.draws_count + stats.draws_count,
            away_wins_count: acc.away_wins_count + stats.away_wins_count,
            bts_yes_count: acc.bts_yes_count + stats.bts_yes_count,
            bts_no_count: acc.bts_no_count + stats.bts_no_count,
            over_count: acc.over_count + stats.over_count,
            under_count: acc.under_count + stats.under_count,
            roi_home: (acc.roi_home + stats.roi_home) / (acc.total_matches > 0 ? 2 : 1),
            roi_draw: (acc.roi_draw + stats.roi_draw) / (acc.total_matches > 0 ? 2 : 1),
            roi_away: (acc.roi_away + stats.roi_away) / (acc.total_matches > 0 ? 2 : 1),
            roi_bts_yes: (acc.roi_bts_yes + stats.roi_bts_yes) / (acc.total_matches > 0 ? 2 : 1),
            roi_bts_no: (acc.roi_bts_no + stats.roi_bts_no) / (acc.total_matches > 0 ? 2 : 1),
            roi_over: (acc.roi_over + stats.roi_over) / (acc.total_matches > 0 ? 2 : 1),
            roi_under: (acc.roi_under + stats.roi_under) / (acc.total_matches > 0 ? 2 : 1),
          };
        }, {
          total_matches: 0,
          home_wins_count: 0,
          draws_count: 0,
          away_wins_count: 0,
          bts_yes_count: 0,
          bts_no_count: 0,
          over_count: 0,
          under_count: 0,
          roi_home: 0,
          roi_draw: 0,
          roi_away: 0,
          roi_bts_yes: 0,
          roi_bts_no: 0,
          roi_over: 0,
          roi_under: 0,
        });

        setStatistics(combinedStats);

      } else {
        // СТАНДАРТНАЯ ЗАГРУЗКА БЕЗ ЛИГ
        const [matchesResponse, statsResponse,allMatchesResponse] = await Promise.all([
          axios.get<Match[]>(`${API_BASE_URL}/api/matches/?${params.toString()}`),
          axios.get<Statistics>(`${API_BASE_URL}/api/matches/statistics/?${params.toString()}`),
          axios.get<Match[]>(`${API_BASE_URL}/api/matches/`),
          axios.get<Statistics>(`${API_BASE_URL}/api/matches/statistics/`)
        ]);

        // СОХРАНЯЕМ ТОЛЬКО ЗДЕСЬ - ОДИН РАЗ
        localStorage.setItem('matchesCache', JSON.stringify(matchesResponse.data));
        localStorage.setItem('statisticsCache', JSON.stringify(statsResponse.data));
        localStorage.setItem('cacheTimestamp', Date.now().toString());

        setMatches(matchesResponse.data);
        setStatistics(statsResponse.data);

        allMatchesData = allMatchesResponse.data;
      }

      // ЗАГРУЖАЕМ ДАННЫЕ ДЛЯ КЭША И УНИКАЛЬНЫХ ЗНАЧЕНИЙ
      const [allMatchesResponse, allStatsResponse] = await Promise.all([
        axios.get<Match[]>(`${API_BASE_URL}/api/matches/`),
        axios.get<Statistics>(`${API_BASE_URL}/api/matches/statistics/`)
      ]);

      setAllMatchesCache(allMatchesResponse.data);
      setAllStatisticsCache(allStatsResponse.data);

      allMatchesData = allMatchesResponse.data;

      // ... логика для уникальных значений ...
      const leaguesMap = new Map<string, League>();
      const homes = new Set<string>();
      const aways = new Set<string>();
      const oneOs = new Set<string>();
      const oneEs = new Set<string>();
      const xOs = new Set<string>();
      const xEs = new Set<string>();
      const twoOs = new Set<string>();
      const twoEs = new Set<string>();
      const btsOs = new Set<string>();
      const btsEs = new Set<string>();
      const btsNoOs = new Set<string>();
      const btsNoEs = new Set<string>();
      const overOs = new Set<string>();
      const overEs = new Set<string>();
      const underOs = new Set<string>();
      const underEs = new Set<string>();
      const firstHalfs = new Set<string>();
      const matchesResults = new Set<string>();

      allMatchesData.forEach((match: Match) => {
        // Лиги
        if (match.league_id && match.league) {
          leaguesMap.set(match.league_id, {
            id: match.league_id,
            name: getBaseLeagueName(match.league)
          });
        }
        
        homes.add(match.home);
        aways.add(match.away);
        oneOs.add(match.one_o.toFixed(2));
        oneEs.add(match.one_e.toFixed(2));
        xOs.add(match.x_o.toFixed(2));
        xEs.add(match.x_e.toFixed(2));
        twoOs.add(match.two_o.toFixed(2));
        twoEs.add(match.two_e.toFixed(2));
        btsOs.add(match.bts_o.toFixed(2));
        btsEs.add(match.bts_e.toFixed(2));
        btsNoOs.add(match.bts_no_o.toFixed(2));
        btsNoEs.add(match.bts_no_e.toFixed(2));
        overOs.add(match.over_o.toFixed(2));
        overEs.add(match.over_e.toFixed(2));
        underOs.add(match.under_o.toFixed(2));
        underEs.add(match.under_e.toFixed(2));
        
        if (match.first_half) firstHalfs.add(match.first_half);
        if (match.match) matchesResults.add(match.match);
      });

      // Устанавливаем уникальные значения
      const sortedLeagues = Array.from(leaguesMap.values()).sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setUniqueLeagues(sortedLeagues);
      setUniqueTeams(Array.from(new Set([...Array.from(homes), ...Array.from(aways)])).sort());
      setUniqueOneOs(Array.from(oneOs).sort());
      setUniqueOneEs(Array.from(oneEs).sort());
      setUniqueXOs(Array.from(xOs).sort());
      setUniqueXEs(Array.from(xEs).sort());
      setUniqueTwoOs(Array.from(twoOs).sort());
      setUniqueTwoEs(Array.from(twoEs).sort());
      setUniqueBtsOs(Array.from(btsOs).sort());
      setUniqueBtsEs(Array.from(btsEs).sort());
      setUniqueBtsNoOs(Array.from(btsNoOs).sort());
      setUniqueBtsNoEs(Array.from(btsNoEs).sort());
      setUniqueOverOs(Array.from(overOs).sort());
      setUniqueOverEs(Array.from(overEs).sort());
      setUniqueUnderOs(Array.from(underOs).sort());
      setUniqueUnderEs(Array.from(underEs).sort());
      setUniqueFirstHalfs(Array.from(firstHalfs).sort());
      setUniqueMatches(Array.from(matchesResults).sort());

    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
      setShowSplash(false); // ← Скрываем сплеш-скрин когда все загружено
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const filtersToCheck = [
        'one-o-filter', 'one-e-filter', 'x-o-filter', 'x-e-filter',
        'two-o-filter', 'two-e-filter', 'bts-o-filter', 'bts-e-filter',
        'bts-no-o-filter', 'bts-no-e-filter', 'over-o-filter', 'over-e-filter',
        'under-o-filter', 'under-e-filter', 'first-half-filter', 'matches-filter',
        'bts-result-filter', 'total-goals-filter', 'leagues-filter' 
      ];

      filtersToCheck.forEach(filterAttr => {
        const filterElement = document.querySelector(`[data-attribute="${filterAttr}"]`);
        if (filterElement && !filterElement.contains(event.target as Node)) {
          switch (filterAttr) {
            case 'one-o-filter': setShowOneOCheckboxes(false); break;
            case 'one-e-filter': setShowOneEsCheckboxes(false); break;
            case 'x-o-filter': setShowXOCheckboxes(false); break;
            case 'x-e-filter': setShowXEsCheckboxes(false); break;
            case 'two-o-filter': setShowTwoOCheckboxes(false); break;
            case 'two-e-filter': setShowTwoEsCheckboxes(false); break;
            case 'bts-o-filter': setShowBtsOCheckboxes(false); break;
            case 'bts-e-filter': setShowBtsEsCheckboxes(false); break;
            case 'bts-no-o-filter': setShowBtsNoOCheckboxes(false); break;
            case 'bts-no-e-filter': setShowBtsNoEsCheckboxes(false); break;
            case 'over-o-filter': setShowOverOCheckboxes(false); break;
            case 'over-e-filter': setShowOverEsCheckboxes(false); break;
            case 'under-o-filter': setShowUnderOCheckboxes(false); break;
            case 'under-e-filter': setShowUnderEsCheckboxes(false); break;
            case 'first-half-filter': setShowFirstHalfsCheckboxes(false); break;
            case 'matches-filter': setShowMatchesCheckboxes(false); break;
            case 'bts-result-filter': setShowBtsResultCheckboxes(false); break; 
            case 'total-goals-filter': setShowTotalGoalsCheckboxes(false); break; 
            case 'leagues-filter': setShowLeaguesCheckboxes(false); break; 
          }
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    showOneOCheckboxes, showOneEsCheckboxes, showXOCheckboxes, showXEsCheckboxes,
    showTwoOCheckboxes, showTwoEsCheckboxes, showBtsOCheckboxes, showBtsEsCheckboxes,
    showBtsNoOCheckboxes, showBtsNoEsCheckboxes, showOverOCheckboxes, showOverEsCheckboxes,
    showUnderOCheckboxes, showUnderEsCheckboxes, showFirstHalfsCheckboxes, showMatchesCheckboxes,
    showBtsResultCheckboxes, showTotalGoalsCheckboxes 
  ]);

  useEffect(() => {
    const hasActiveFilters = 
      selectedLeagues.length > 0 || selectedTeam.length > 0 || showHome || showAway ||
      selectedOneOs.length > 0 || selectedOneEs.length > 0 || selectedXOs.length > 0 ||
      selectedXEs.length > 0 || selectedTwoOs.length > 0 || selectedTwoEs.length > 0 ||
      selectedBtsOs.length > 0 || selectedBtsEs.length > 0 || selectedBtsNoOs.length > 0 ||
      selectedBtsNoEs.length > 0 || selectedOverOs.length > 0 || selectedOverEs.length > 0 ||
      selectedUnderOs.length > 0 || selectedUnderEs.length > 0 || selectedFirstHalfs.length > 0 ||
      selectedMatches.length > 0 || selectedBtsResult.length > 0 || selectedTotalGoals.length > 0;

    fetchMatches(!hasActiveFilters);
  }, [
    selectedLeagues, selectedTeam, showHome, showAway,
    selectedOneOs, selectedOneEs, selectedXOs, selectedXEs,
    selectedTwoOs, selectedTwoEs, selectedBtsOs, selectedBtsEs,
    selectedBtsNoOs, selectedBtsNoEs, selectedOverOs, selectedOverEs,
    selectedUnderOs, selectedUnderEs, selectedFirstHalfs, selectedMatches,
    selectedBtsResult, selectedTotalGoals
  ]);

  useEffect(() => {
    const hasActiveOddsFilters = 
      selectedLeagues.length > 0 || 
      selectedTeam.length > 0 || 
      showHome || showAway ||
      selectedOneOs.length > 0 || selectedOneEs.length > 0 || selectedXOs.length > 0 ||
      selectedXEs.length > 0 || selectedTwoOs.length > 0 || selectedTwoEs.length > 0 ||
      selectedBtsOs.length > 0 || selectedBtsEs.length > 0 || selectedBtsNoOs.length > 0 ||
      selectedBtsNoEs.length > 0 || selectedOverOs.length > 0 || selectedOverEs.length > 0 ||
      selectedUnderOs.length > 0 || selectedUnderEs.length > 0 || selectedFirstHalfs.length > 0 ||
      selectedMatches.length > 0 || selectedBtsResult.length > 0 || selectedTotalGoals.length > 0;

    if (!hasActiveOddsFilters && matches.length > 0) {
      fetchStatisticsForAllMatches();
    }
  }, [
    selectedLeagues, selectedTeam,showHome, showAway,
    selectedOneOs, selectedOneEs, selectedXOs, selectedXEs,
    selectedTwoOs, selectedTwoEs, selectedBtsOs, selectedBtsEs,
    selectedBtsNoOs, selectedBtsNoEs, selectedOverOs, selectedOverEs,
    selectedUnderOs, selectedUnderEs, selectedFirstHalfs, selectedMatches,
    matches,selectedBtsResult,selectedTotalGoals
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      const filteredTeams = uniqueTeams.filter(team =>
        team.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredTeams);
    } else {
      setSearchResults([]);
    }
  };

  const handleTeamSelect = (teamName: string) => {
    setSelectedTeam([teamName]);
    setSearchTerm(teamName);
    setSearchResults([]);
  };

  const handleResetFilters = () => {
    setSelectedLeagues([]);
    setSelectedTeam([]);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedOneOs([]);
    setSelectedOneEs([]);
    setSelectedXOs([]);
    setSelectedXEs([]);
    setSelectedTwoOs([]);
    setSelectedTwoEs([]);
    setSelectedBtsOs([]);
    setSelectedBtsEs([]);
    setSelectedBtsNoOs([]);
    setSelectedBtsNoEs([]);
    setSelectedOverOs([]);
    setSelectedOverEs([]);
    setSelectedUnderOs([]);
    setSelectedUnderEs([]);
    setSelectedFirstHalfs([]);
    setSelectedMatches([]);
    setSelectedBtsResult([]);
    setSelectedTotalGoals([]);
    setShowHome(false);
    setShowAway(false);
    setSearchTerm('');  // ← ОЧИСТКА REACT СОСТОЯНИЯ
    setSearchResults([]); // ← ОЧИСТКА РЕЗУЛЬТАТОВ
    
    // Сброс всех чекбоксов
    setShowOneOCheckboxes(false);
    setShowOneEsCheckboxes(false);
    setShowXOCheckboxes(false);
    setShowXEsCheckboxes(false);
    setShowTwoOCheckboxes(false);
    setShowTwoEsCheckboxes(false);
    setShowBtsOCheckboxes(false);
    setShowBtsEsCheckboxes(false);
    setShowBtsNoOCheckboxes(false);
    setShowBtsNoEsCheckboxes(false);
    setShowOverOCheckboxes(false);
    setShowOverEsCheckboxes(false);
    setShowUnderOCheckboxes(false);
    setShowUnderEsCheckboxes(false);
    setShowFirstHalfsCheckboxes(false);
    setShowMatchesCheckboxes(false);
    setShowBtsResultCheckboxes(false);
    setShowTotalGoalsCheckboxes(false);

    if (allMatchesCache.length > 0) {
      setMatches(allMatchesCache);
      // Загружаем общую статистику
      axios.get<Statistics>(`${API_BASE_URL}/api/matches/statistics/`)
        .then(response => setStatistics(response.data))
        .catch(err => console.error('Error loading statistics:', err));
    } else {
      fetchMatches(true);
    }
  };

  const fetchStatisticsForAllMatches = async () => {
    try {
      const statsResponse = await axios.get<Statistics>(
        `${API_BASE_URL}/api/matches/statistics/`
      );
      setStatistics(statsResponse.data);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const formatRoi = (roi: number | null) => {
    if (roi === null || isNaN(roi)) {
      return '';
    }
    const sign = roi >= 0 ? '+' : '';
    const color = roi >= 0 ? 'green' : 'red';
    return <span style={{ color }}>{`${sign}${roi.toFixed(2)}`}</span>;
  };

  const getFullLeagueName = (league: string): string => {
    if (!league) return '';
    return league.split(' - ')[0].trim();
  };

  const filteredMatches = useMemo(() => {
    if (!selectedLeagues.length) return matches;
    return matches.filter(match => selectedLeagues.includes(match.league_id));
  }, [matches, selectedLeagues]);

  const renderCheckboxFilter = (
    label: string,
    selectedValues: string[],
    availableValues: string[],
    filterType: keyof typeof filters,
    showDropdown: boolean,
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>,
    dataAttribute: string
  ) => {
    // Функция для получения отображаемого текста
    const getDisplayText = () => {
      if (selectedValues.length === 0) return '\u00A0'; // неразрывный пробел
      if (selectedValues.length === 1) {
        // Для лиг показываем название вместо ID
        if (filterType === 'leagues') {
          const league = uniqueLeagues.find(l => l.id === selectedValues[0]);
          return league ? league.name : selectedValues[0];
        }
        return selectedValues[0]; // Для остальных показываем значение
      }
      return `${selectedValues.length} selected`;
    };

    // Функция для получения заголовка при наведении
    const getTitle = () => {
      if (selectedValues.length <= 1) return '';
      if (filterType === 'leagues') {
        return selectedValues.map(id => {
          const league = uniqueLeagues.find(l => l.id === id);
          return league ? league.name : id;
        }).join(', ');
      }
      return selectedValues.join(', ');
    };

    // Определяем стиль dropdown в зависимости от типа фильтра
    const getDropdownStyle = () => {
      if (filterType === 'leagues') return checkboxDropdownWideStyle;
      if (filterType === 'total_goals') return { ...checkboxDropdownStyle, minWidth: '100px' };
      return checkboxDropdownStyle;
    };

    return (
      <div style={{
        ...filterItemStyle,
        ...(filterType === 'leagues' && { minWidth: '250px' })
      }} data-attribute={dataAttribute}>
        <label style={labelStyle}>{label}</label>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={selectWithDropdownStyle}
            title={getTitle()} // подсказка при наведении
          >
            {getDisplayText()}
          </button>
          
          {showDropdown && (
            <div style={getDropdownStyle()}>
              {availableValues.map(value => {
                const displayValue = filterType === 'leagues' 
                  ? uniqueLeagues.find(league => league.id === value)?.name || value
                  : value;
                  
                return (
                  <div key={value} style={{
                    ...checkboxItemStyle,
                    whiteSpace: 'nowrap' as const,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(value)}
                      onChange={() => handleCheckboxChange(filterType, value)}
                      style={{ 
                        ...customCheckboxStyle,
                        ...(selectedValues.includes(value) ? customCheckboxCheckedStyle : {})
                      }}
                    />
                    <span title={displayValue}>{displayValue}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div style={{ padding: '10px' }}>
        {showSplash && <SplashScreen />}
        <div style={{ color: 'red', marginTop: showSplash ? '100vh' : '0' }}>
          {error}
        </div>
      </div>
    );
  }

  // useEffect(() => {
  //   // Сразу показываем сплеш-скрин
  //   setShowSplash(true);
    
  //   const loadData = async () => {
  //     await fetchMatches();
  //     // Добавляем небольшую задержку для плавности
  //     setTimeout(() => setShowSplash(false), 100);
  //   };
    
  //   loadData();
  // }, []);

  // useEffect(() => {
  //   if (!authLoading) {
  //     setShowSplash(false);
  //   }
  // }, [authLoading]);

  // if (authLoading) {
  //   return (
  //     <div className="loading-container">
  //       <div className="loading-spinner"></div>
  //       <p>Загрузка...</p>
  //     </div>
  //   );
  // }

  useEffect(() => {
    setShowSplash(true);
    
    const loadData = async () => {
      if (isCacheFresh()) {
        // Используем кэш
        setMatches(JSON.parse(localStorage.getItem('matchesCache') || '[]'));
        setStatistics(JSON.parse(localStorage.getItem('statisticsCache') || 'null'));
        setShowSplash(false);
      } else {
        // Грузим новые данные
        await fetchMatches(false);
        setShowSplash(false);
      }
    };
    
    loadData();
  }, []);


  return (
    <div style={{ padding: '10px' }}>
      {showSplash && <SplashScreen />}
      <div ref={topBlockRef} style={topBlockStyle}>
        {statistics && (
          <div style={cardContainerStyle}>
            <div style={cardStyle}>
              <div style={cardCountStyle}>{statistics.total_matches}</div>
              <div style={cardTitleStyle}>Total Matches</div>
              <div style={cardRoiStyle}></div>
            </div>
            <div style={cardStyle}>
              <div style={cardCountStyle}>{statistics.home_wins_count}</div>
              <div style={cardTitleStyle}>Home Wins</div>
              <div style={cardRoiStyle}>{formatRoi(statistics.roi_home)}</div>
            </div>
            <div style={cardStyle}>
              <div style={cardCountStyle}>{statistics.draws_count}</div>
              <div style={cardTitleStyle}>Draws</div>
              <div style={cardRoiStyle}>{formatRoi(statistics.roi_draw)}</div>
            </div>
            <div style={cardStyle}>
              <div style={cardCountStyle}>{statistics.away_wins_count}</div>
              <div style={cardTitleStyle}>Away Wins</div>
              <div style={cardRoiStyle}>{formatRoi(statistics.roi_away)}</div>
            </div>
            <div style={cardStyle}>
  <div style={cardCountStyle}>{statistics.bts_yes_count}</div>
  <div style={cardTitleStyle}>BTS Yes</div>
  <div style={cardRoiStyle}>{formatRoi(statistics.roi_bts_yes)}</div>
</div>
<div style={cardStyle}>
  <div style={cardCountStyle}>{statistics.bts_no_count}</div>
  <div style={cardTitleStyle}>BTS No</div>
  <div style={cardRoiStyle}>{formatRoi(statistics.roi_bts_no)}</div>
</div>
<div style={cardStyle}>
  <div style={cardCountStyle}>{statistics.over_count}</div>
  <div style={cardTitleStyle}>Over</div>
  <div style={cardRoiStyle}>{formatRoi(statistics.roi_over)}</div>
</div>
<div style={cardStyle}>
  <div style={cardCountStyle}>{statistics.under_count}</div>
  <div style={cardTitleStyle}>Under</div>
  <div style={cardRoiStyle}>{formatRoi(statistics.roi_under)}</div>
</div>
</div>
)}

<div style={filtersContainerStyle}>
  <div style={filtersRowStyle}>

    {/* League */}
    {renderCheckboxFilter(
      "League",
      selectedLeagues,
      uniqueLeagues.map(league => league.id), 
      "leagues",
      showLeaguesCheckboxes,
      setShowLeaguesCheckboxes,
      "leagues-filter"
    )}
    
    <div style={{ ...filterItemStyle, minWidth: '110px', position: 'relative'}}>
      <label htmlFor="teamSearchFilter" style={labelStyle}>Team</label>
      <input
        id="teamSearchFilter"
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
        style={inputStyle}
        autoComplete="off" // ← ОТКЛЮЧЕНИЕ БРАУЗЕРНОГО АВТОЗАПОЛНЕНИЯ
      />
      {searchResults.length > 0 && searchTerm.length > 1 && (
        <ul style={searchResultsStyle}>
          {searchResults.map(team => (
            <li
              key={team}
              onClick={() => handleTeamSelect(team)}
              style={searchResultItemStyle}
            >
              {team}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div style={filterItemStyle}>
      <div style={{ display: 'flex', gap: '5px', marginTop: '16px' }}>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={showHome}
            onChange={() => setShowHome(!showHome)}
            style={{ marginRight: '3px' }}
          />
          Home
        </label>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={showAway}
            onChange={() => setShowAway(!showAway)}
            style={{ marginRight: '3px' }}
          />
          Away
        </label>
      </div>
    </div>

    {/* 1(o) Filter */}
    {renderCheckboxFilter(
      "1(o)",
      selectedOneOs,
      uniqueOneOs,
      // availableOneOs,
      "one_o",
      showOneOCheckboxes,
      setShowOneOCheckboxes,
      "one-o-filter"
    )}

    {/* 1(e) Filter */}
    {renderCheckboxFilter(
      "1(e)",
      selectedOneEs,
      uniqueOneEs,
      // availableOneEs,
      "one_e",
      showOneEsCheckboxes,
      setShowOneEsCheckboxes,
      "one-e-filter"
    )}

    {/* X(o) Filter */}
    {renderCheckboxFilter(
      "X(o)",
      selectedXOs,
      uniqueXOs,
      // availableXOs,
      "x_o",
      showXOCheckboxes,
      setShowXOCheckboxes,
      "x-o-filter"
    )}

    {/* X(e) Filter */}
    {renderCheckboxFilter(
      "X(e)",
      selectedXEs,
      uniqueXEs,
      // availableXEs,
      "x_e",
      showXEsCheckboxes,
      setShowXEsCheckboxes,
      "x-e-filter"
    )}

    {/* 2(o) Filter */}
    {renderCheckboxFilter(
      "2(o)",
      selectedTwoOs,
      uniqueTwoOs,
      // availableTwoOs,
      "two_o",
      showTwoOCheckboxes,
      setShowTwoOCheckboxes,
      "two-o-filter"
    )}

    {/* 2(e) Filter */}
    {renderCheckboxFilter(
      "2(e)",
      selectedTwoEs,
      uniqueTwoEs,
      // availableTwoEs,
      "two_e",
      showTwoEsCheckboxes,
      setShowTwoEsCheckboxes,
      "two-e-filter"
    )}

    {/* BTS(o) Filter */}
    {renderCheckboxFilter(
      "BTS(o)",
      selectedBtsOs,
      uniqueBtsOs,
      // availableBtsOs,
      "bts_o",
      showBtsOCheckboxes,
      setShowBtsOCheckboxes,
      "bts-o-filter"
    )}

    {/* BTS(e) Filter */}
    {renderCheckboxFilter(
      "BTS(e)",
      selectedBtsEs,
      uniqueBtsEs,
      // availableBtsEs,
      "bts_e",
      showBtsEsCheckboxes,
      setShowBtsEsCheckboxes,
      "bts-e-filter"
    )}

    {/* BTS_no(o) Filter */}
    {renderCheckboxFilter(
      "BTS_no(o)",
      selectedBtsNoOs,
      uniqueBtsNoOs,
      // availableBtsNoOs,
      "bts_no_o",
      showBtsNoOCheckboxes,
      setShowBtsNoOCheckboxes,
      "bts-no-o-filter"
    )}

    {/* BTS_no(e) Filter */}
    {renderCheckboxFilter(
      "BTS_no(e)",
      selectedBtsNoEs,
      uniqueBtsNoEs,
      // availableBtsNoEs,
      "bts_no_e",
      showBtsNoEsCheckboxes,
      setShowBtsNoEsCheckboxes,
      "bts-no-e-filter"
    )}

    {/* Over(o) Filter */}
    {renderCheckboxFilter(
      "Over(o)",
      selectedOverOs,
      uniqueOverOs,
      // availableOverOs,
      "over_o",
      showOverOCheckboxes,
      setShowOverOCheckboxes,
      "over-o-filter"
    )}

    {/* Over(e) Filter */}
    {renderCheckboxFilter(
      "Over(e)",
      selectedOverEs,
      uniqueOverEs,
      // availableOverEs,
      "over_e",
      showOverEsCheckboxes,
      setShowOverEsCheckboxes,
      "over-e-filter"
    )}

    {/* Under(o) Filter */}
    {renderCheckboxFilter(
      "Under(o)",
      selectedUnderOs,
      uniqueUnderOs,
      // availableUnderOs,
      "under_o",
      showUnderOCheckboxes,
      setShowUnderOCheckboxes,
      "under-o-filter"
    )}

    {/* Under(e) Filter */}
    {renderCheckboxFilter(
      "Under(e)",
      selectedUnderEs,
      uniqueUnderEs,
      // availableUnderEs,
      "under_e",
      showUnderEsCheckboxes,
      setShowUnderEsCheckboxes,
      "under-e-filter"
    )}

    {/* 1H Filter */}
    {renderCheckboxFilter(
      "1H",
      selectedFirstHalfs,
      uniqueFirstHalfs,
      // availableFirstHalfs,
      "first_half",
      showFirstHalfsCheckboxes,
      setShowFirstHalfsCheckboxes,
      "first-half-filter"
    )}

    {/* FT Filter */}
    {renderCheckboxFilter(
      "FT",
      selectedMatches,
      uniqueMatches,
      // availableMatches,
      "match",
      showMatchesCheckboxes,
      setShowMatchesCheckboxes,
      "matches-filter"
    )}

    {/* BTS Filter */}
    {renderCheckboxFilter(
      "BTS",
      selectedBtsResult,
       ['Yes', 'No'], // ← прямо здесь
        "bts_result", 
      // availableBtsResult,
      showBtsResultCheckboxes,
      setShowBtsResultCheckboxes,
      "bts-result-filter"
    )}

    {/* Total Filter */}
    {renderCheckboxFilter(
      "Total",
      selectedTotalGoals,
       ['Over 1.5', 'Under 1.5', 'Over 2.5', 'Under 2.5', 'Over 3.5', 'Under 3.5'],
      // availableTotalGoals,
      "total_goals",
      showTotalGoalsCheckboxes,
      setShowTotalGoalsCheckboxes,
      "total-goals-filter"
    )}

    <div style={{ ...filterItemStyle, minWidth: '80px', marginTop: '16px' }}>
      <button 
        onClick={handleResetFilters} 
        style={resetButtonStyle}
      >
        Reset
      </button>
    </div>
  </div>
</div>
</div>

<div style={tableContainerStyle}>
  <table style={tableStyle}>
    <thead>
      <tr style={stickyHeaderRowStyle}>
        <th style={{ minWidth: '120px' }}>Date</th>
        <th style={{ minWidth: '60px' }}>Home</th>
        <th style={{ minWidth: '60px' }}>Away</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>1(o)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>1(e)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>X(o)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>X(e)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>2(o)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>2(e)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>BTS(o)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>BTS(e)</th> 
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>B_no(o)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>B_no(e)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>Over(o)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>Over(e)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>Und(o)</th>
        <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>Und(e)</th>
        <th style={{ ...fixedWidthColumnStyle }}>1H</th>
        <th style={{ ...fixedWidthColumnStyle }}>FT</th>
        <th style={leagueHeaderStyle} >League</th>
      </tr>
    </thead>
    <tbody>
        {filteredMatches.map(match => {
          const matchDate = new Date(match.date);
          const day = matchDate.getDate().toString().padStart(2, '0');
          const month = (matchDate.getMonth() + 1).toString().padStart(2, '0');
          const year = matchDate.getFullYear();
          const hours = matchDate.getHours().toString().padStart(2, '0');
          const minutes = matchDate.getMinutes().toString().padStart(2, '0');
          const formattedDateTime = `${day}.${month}.${year}  ${hours}:${minutes}`;
          
          return (
            <tr key={match.id}>
              <td style={cellStyle}>{formattedDateTime}</td>
              <td style={cellStyle}>{match.home}</td>
              <td style={cellStyle}>{match.away}</td>
              <td style={cellStyle}>{match.one_o.toFixed(2)}</td>
              <td style={cellStyle}>{match.one_e.toFixed(2)}</td>
              <td style={cellStyle}>{match.x_o.toFixed(2)}</td>
              <td style={cellStyle}>{match.x_e.toFixed(2)}</td>
              <td style={cellStyle}>{match.two_o.toFixed(2)}</td>
              <td style={cellStyle}>{match.two_e.toFixed(2)}</td>
              <td style={cellStyle}>{match.bts_o.toFixed(2)}</td>
              <td style={cellStyle}>{match.bts_e.toFixed(2)}</td>
              <td style={cellStyle}>{match.bts_no_o.toFixed(2)}</td>
              <td style={cellStyle}>{match.bts_no_e.toFixed(2)}</td> 
              <td style={cellStyle}>{match.over_o.toFixed(2)}</td> 
              <td style={cellStyle}>{match.over_e.toFixed(2)}</td> 
              <td style={cellStyle}>{match.under_o.toFixed(2)}</td> 
              <td style={cellStyle}>{match.under_e.toFixed(2)}</td> 
              <td style={cellStyle}>{match.first_half || '-'}</td> 
              <td style={cellStyle}>{match.match || '-'}</td> 
              <td style={cellStyle_2} title={match.league}>{getFullLeagueName(match.league)}</td> 
              </tr>
             ); 
            }) }
        </tbody> 
      </table>
    </div> 
  </div>
 ); 
};

export default MatchList;

// // MatchList.tsx
// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import axios from 'axios';
// import {
//   cellStyle,
//   cellStyle_2,
//   verticalHeaderStyle,
//   fixedWidthColumnStyle,
//   cardContainerStyle,
//   cardStyle,
//   cardCountStyle,
//   cardTitleStyle,
//   cardRoiStyle,
//   topBlockStyle,
//   searchResultsStyle,
//   searchResultItemStyle,
//   tableStyle,
//   filtersContainerStyle,
//   filtersRowStyle,
//   filterItemStyle,
//   labelStyle,
//   checkboxLabelStyle,
//   inputStyle,
//   resetButtonStyle,
//   stickyHeaderRowStyle,
//   tableContainerStyle,
//   checkboxDropdownStyle,
//   checkboxItemStyle,
//   customCheckboxStyle,
//   customCheckboxCheckedStyle,
//   selectWithDropdownStyle,
//   checkboxDropdownWideStyle 
// } from './MatchList.styles';

// interface League {
//   id: string;
//   name: string;
// }

// interface Match {
//   id: number;
//   date: string;
//   home: string;
//   away: string;
//   league: string;
//   league_id: string;
//   one_o: number;
//   one_e: number;
//   x_o: number;
//   x_e: number;
//   two_o: number;
//   two_e: number;
//   bts_o: number;
//   bts_e: number;
//   bts_no_o: number;
//   bts_no_e: number;
//   over_o: number;
//   over_e: number;
//   under_o: number;
//   under_e: number;
//   first_half: string | null;
//   match: string | null;
//   goals: string | null;
//   link: string | null;
//   notes: string | null;
// }

// interface Statistics {
//   total_matches: number;
//   home_wins_count: number;
//   draws_count: number;
//   away_wins_count: number;
//   bts_yes_count: number;
//   bts_no_count: number;
//   over_count: number;
//   under_count: number;
//   roi_home: number;
//   roi_draw: number;
//   roi_away: number;
//   roi_bts_yes: number;
//   roi_bts_no: number;
//   roi_over: number;
//   roi_under: number;
// }

// const MatchList: React.FC = () => {
//   // Основные состояния
//   const [matches, setMatches] = useState<Match[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [statistics, setStatistics] = useState<Statistics | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [searchResults, setSearchResults] = useState<string[]>([]);
//   const [allMatchesCache, setAllMatchesCache] = useState<Match[]>([]);
//   const [allStatisticsCache, setAllStatisticsCache] = useState<Statistics | null>(null);

//   // Состояния фильтров выбора
//   const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
//   const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
//   const [showHome, setShowHome] = useState<boolean>(false);
//   const [showAway, setShowAway] = useState<boolean>(false);
//   const [selectedBtsResult, setSelectedBtsResult] = useState<string[]>([]);
//   const [selectedTotalGoals, setSelectedTotalGoals] = useState<string[]>([]);

//   // Состояния фильтров коэффициентов
//   const [selectedOneOs, setSelectedOneOs] = useState<string[]>([]);
//   const [selectedOneEs, setSelectedOneEs] = useState<string[]>([]);
//   const [selectedXOs, setSelectedXOs] = useState<string[]>([]);
//   const [selectedXEs, setSelectedXEs] = useState<string[]>([]);
//   const [selectedTwoOs, setSelectedTwoOs] = useState<string[]>([]);
//   const [selectedTwoEs, setSelectedTwoEs] = useState<string[]>([]);
//   const [selectedBtsOs, setSelectedBtsOs] = useState<string[]>([]);
//   const [selectedBtsEs, setSelectedBtsEs] = useState<string[]>([]);
//   const [selectedBtsNoOs, setSelectedBtsNoOs] = useState<string[]>([]);
//   const [selectedBtsNoEs, setSelectedBtsNoEs] = useState<string[]>([]);
//   const [selectedOverOs, setSelectedOverOs] = useState<string[]>([]);
//   const [selectedOverEs, setSelectedOverEs] = useState<string[]>([]);
//   const [selectedUnderOs, setSelectedUnderOs] = useState<string[]>([]);
//   const [selectedUnderEs, setSelectedUnderEs] = useState<string[]>([]);
//   const [selectedFirstHalfs, setSelectedFirstHalfs] = useState<string[]>([]);
//   const [selectedMatches, setSelectedMatches] = useState<string[]>([]);

//   // Состояния отображения чекбоксов
//   const [showOneOCheckboxes, setShowOneOCheckboxes] = useState<boolean>(false);
//   const [showOneEsCheckboxes, setShowOneEsCheckboxes] = useState<boolean>(false);
//   const [showXOCheckboxes, setShowXOCheckboxes] = useState<boolean>(false);
//   const [showXEsCheckboxes, setShowXEsCheckboxes] = useState<boolean>(false);
//   const [showTwoOCheckboxes, setShowTwoOCheckboxes] = useState<boolean>(false);
//   const [showTwoEsCheckboxes, setShowTwoEsCheckboxes] = useState<boolean>(false);
//   const [showBtsOCheckboxes, setShowBtsOCheckboxes] = useState<boolean>(false);
//   const [showBtsEsCheckboxes, setShowBtsEsCheckboxes] = useState<boolean>(false);
//   const [showBtsNoOCheckboxes, setShowBtsNoOCheckboxes] = useState<boolean>(false);
//   const [showBtsNoEsCheckboxes, setShowBtsNoEsCheckboxes] = useState<boolean>(false);
//   const [showOverOCheckboxes, setShowOverOCheckboxes] = useState<boolean>(false);
//   const [showOverEsCheckboxes, setShowOverEsCheckboxes] = useState<boolean>(false);
//   const [showUnderOCheckboxes, setShowUnderOCheckboxes] = useState<boolean>(false);
//   const [showUnderEsCheckboxes, setShowUnderEsCheckboxes] = useState<boolean>(false);
//   const [showFirstHalfsCheckboxes, setShowFirstHalfsCheckboxes] = useState<boolean>(false);
//   const [showMatchesCheckboxes, setShowMatchesCheckboxes] = useState<boolean>(false);
//   const [showBtsResultCheckboxes, setShowBtsResultCheckboxes] = useState<boolean>(false);
//   const [showTotalGoalsCheckboxes, setShowTotalGoalsCheckboxes] = useState<boolean>(false);
//   const [showLeaguesCheckboxes, setShowLeaguesCheckboxes] = useState<boolean>(false);

//   // Уникальные значения
//   const [uniqueLeagues, setUniqueLeagues] = useState<League[]>([]);
//   const [uniqueTeams, setUniqueTeams] = useState<string[]>([]);
//   const [uniqueOneOs, setUniqueOneOs] = useState<string[]>([]);
//   const [uniqueOneEs, setUniqueOneEs] = useState<string[]>([]);
//   const [uniqueXOs, setUniqueXOs] = useState<string[]>([]);
//   const [uniqueXEs, setUniqueXEs] = useState<string[]>([]);
//   const [uniqueTwoOs, setUniqueTwoOs] = useState<string[]>([]);
//   const [uniqueTwoEs, setUniqueTwoEs] = useState<string[]>([]);
//   const [uniqueBtsOs, setUniqueBtsOs] = useState<string[]>([]);
//   const [uniqueBtsEs, setUniqueBtsEs] = useState<string[]>([]);
//   const [uniqueBtsNoOs, setUniqueBtsNoOs] = useState<string[]>([]);
//   const [uniqueBtsNoEs, setUniqueBtsNoEs] = useState<string[]>([]);
//   const [uniqueOverOs, setUniqueOverOs] = useState<string[]>([]);
//   const [uniqueOverEs, setUniqueOverEs] = useState<string[]>([]);
//   const [uniqueUnderOs, setUniqueUnderOs] = useState<string[]>([]);
//   const [uniqueUnderEs, setUniqueUnderEs] = useState<string[]>([]);
//   const [uniqueFirstHalfs, setUniqueFirstHalfs] = useState<string[]>([]);
//   const [uniqueMatches, setUniqueMatches] = useState<string[]>([]);

//   const filters = {
//     one_o: selectedOneOs,
//     one_e: selectedOneEs,
//     x_o: selectedXOs,
//     x_e: selectedXEs,
//     two_o: selectedTwoOs,
//     two_e: selectedTwoEs,
//     bts_o: selectedBtsOs,
//     bts_e: selectedBtsEs,
//     bts_no_o: selectedBtsNoOs,
//     bts_no_e: selectedBtsNoEs,
//     over_o: selectedOverOs,
//     over_e: selectedOverEs,
//     under_o: selectedUnderOs,
//     under_e: selectedUnderEs,
//     first_half: selectedFirstHalfs,
//     match: selectedMatches,
//     bts_result: selectedBtsResult, 
//     total_goals: selectedTotalGoals, 
//     leagues: selectedLeagues,
//     team: selectedTeam
//   };

//   const topBlockRef = useRef<HTMLDivElement>(null);

//   const getBaseLeagueName = (fullLeagueName: string): string => {
//     if (!fullLeagueName) return '';
//     return fullLeagueName.split(' - ')[0].trim();
//   };

//   const handleCheckboxChange = (filterType: keyof typeof filters, value: string) => {
//     const setters: { [key in keyof typeof filters]: React.Dispatch<React.SetStateAction<string[]>> } = {
//       one_o: setSelectedOneOs,
//       one_e: setSelectedOneEs,
//       x_o: setSelectedXOs,
//       x_e: setSelectedXEs,
//       two_o: setSelectedTwoOs,
//       two_e: setSelectedTwoEs,
//       bts_o: setSelectedBtsOs,
//       bts_e: setSelectedBtsEs,
//       bts_no_o: setSelectedBtsNoOs,
//       bts_no_e: setSelectedBtsNoEs,
//       over_o: setSelectedOverOs,
//       over_e: setSelectedOverEs,
//       under_o: setSelectedUnderOs,
//       under_e: setSelectedUnderEs,
//       first_half: setSelectedFirstHalfs,
//       match: setSelectedMatches,
//       bts_result: setSelectedBtsResult, 
//       total_goals: setSelectedTotalGoals, 
//       leagues: setSelectedLeagues,
//       team: setSelectedTeam
//     } as any;

//     const setter = setters[filterType];
//     if (setter) {
//       setter(prev => 
//         prev.includes(value) 
//           ? prev.filter(val => val !== value) 
//           : [...prev, value]
//       );
//     }

//     // ПЕРЕОТКРЫВАЕМ ВЫПАДАЮЩИЙ СПИСОК ДЛЯ КОЭФФИЦИЕНТОВ
//     setTimeout(() => {
//       switch (filterType) {
//         case 'one_o': setShowOneOCheckboxes(true); break;
//         case 'one_e': setShowOneEsCheckboxes(true); break;
//         case 'x_o': setShowXOCheckboxes(true); break;
//         case 'x_e': setShowXEsCheckboxes(true); break;
//         case 'two_o': setShowTwoOCheckboxes(true); break;
//         case 'two_e': setShowTwoEsCheckboxes(true); break;
//         case 'bts_o': setShowBtsOCheckboxes(true); break;
//         case 'bts_e': setShowBtsEsCheckboxes(true); break;
//         case 'bts_no_o': setShowBtsNoOCheckboxes(true); break;
//         case 'bts_no_e': setShowBtsNoEsCheckboxes(true); break;
//         case 'over_o': setShowOverOCheckboxes(true); break;
//         case 'over_e': setShowOverEsCheckboxes(true); break;
//         case 'under_o': setShowUnderOCheckboxes(true); break;
//         case 'under_e': setShowUnderEsCheckboxes(true); break;
//         default: break;
//       }
//     }, 100);
//   };

//   const fetchMatches = async (useCache: boolean = false) => {
//     try {
//       setLoading(true);
//       setError(null);

//       if (useCache && allMatchesCache.length > 0 && allStatisticsCache) {
//         setMatches(allMatchesCache);
//         setStatistics(allStatisticsCache);
//         setLoading(false);
//         return;
//       }

//       const params = new URLSearchParams();
//       let allMatchesData: Match[] = [];

//       // ДОБАВЛЯЕМ ВСЕ ФИЛЬТРЫ КРОМЕ ЛИГ
//       if (selectedTeam.length > 0) {
//         params.append('team', selectedTeam[0]);
//         const locations = [];
//         if (showHome) locations.push('home');
//         if (showAway) locations.push('away');
//         if (locations.length > 0) params.append('location', locations.join(','));
//       }
//       if (selectedOneOs.length > 0) params.append('one_os', selectedOneOs.join(','));
//       if (selectedOneEs.length > 0) params.append('one_es', selectedOneEs.join(','));
//       if (selectedXOs.length > 0) params.append('x_os', selectedXOs.join(','));
//       if (selectedXEs.length > 0) params.append('x_es', selectedXEs.join(','));
//       if (selectedTwoOs.length > 0) params.append('two_os', selectedTwoOs.join(','));
//       if (selectedTwoEs.length > 0) params.append('two_es', selectedTwoEs.join(','));
//       if (selectedBtsOs.length > 0) params.append('bts_os', selectedBtsOs.join(','));
//       if (selectedBtsEs.length > 0) params.append('bts_es', selectedBtsEs.join(','));
//       if (selectedBtsNoOs.length > 0) params.append('bts_no_os', selectedBtsNoOs.join(','));
//       if (selectedBtsNoEs.length > 0) params.append('bts_no_es', selectedBtsNoEs.join(','));
//       if (selectedOverOs.length > 0) params.append('over_os', selectedOverOs.join(','));
//       if (selectedOverEs.length > 0) params.append('over_es', selectedOverEs.join(','));
//       if (selectedUnderOs.length > 0) params.append('under_os', selectedUnderOs.join(','));
//       if (selectedUnderEs.length > 0) params.append('under_es', selectedUnderEs.join(','));
//       if (selectedFirstHalfs.length > 0) params.append('first_halfs', selectedFirstHalfs.join(','));
//       if (selectedMatches.length > 0) params.append('matches', selectedMatches.join(','));
//       if (selectedBtsResult.length > 0) params.append('bts_result', selectedBtsResult.join(','));
//       if (selectedTotalGoals.length > 0) params.append('total_goals', selectedTotalGoals.join(','));

//       if (selectedLeagues.length > 0) {
//         // МНОЖЕСТВЕННЫЙ ВЫБОР ЛИГ + ДРУГИЕ ФИЛЬТРЫ
//         const matchesPromises = selectedLeagues.map(leagueId => 
//           axios.get<Match[]>(`http://localhost:8000/api/matches/?league_id=${leagueId}&${params.toString()}`)
//         );
//         const matchesResponses = await Promise.all(matchesPromises);
//         const allMatches = matchesResponses.flatMap(response => response.data);
//         setMatches(allMatches);

//         const statsPromises = selectedLeagues.map(leagueId =>
//           axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?league_id=${leagueId}&${params.toString()}`)
//         );
//         const statsResponses = await Promise.all(statsPromises);
        
//         const combinedStats = statsResponses.reduce((acc, response) => {
//           const stats = response.data;
//           return {
//             total_matches: acc.total_matches + stats.total_matches,
//             home_wins_count: acc.home_wins_count + stats.home_wins_count,
//             draws_count: acc.draws_count + stats.draws_count,
//             away_wins_count: acc.away_wins_count + stats.away_wins_count,
//             bts_yes_count: acc.bts_yes_count + stats.bts_yes_count,
//             bts_no_count: acc.bts_no_count + stats.bts_no_count,
//             over_count: acc.over_count + stats.over_count,
//             under_count: acc.under_count + stats.under_count,
//             roi_home: (acc.roi_home + stats.roi_home) / (acc.total_matches > 0 ? 2 : 1),
//             roi_draw: (acc.roi_draw + stats.roi_draw) / (acc.total_matches > 0 ? 2 : 1),
//             roi_away: (acc.roi_away + stats.roi_away) / (acc.total_matches > 0 ? 2 : 1),
//             roi_bts_yes: (acc.roi_bts_yes + stats.roi_bts_yes) / (acc.total_matches > 0 ? 2 : 1),
//             roi_bts_no: (acc.roi_bts_no + stats.roi_bts_no) / (acc.total_matches > 0 ? 2 : 1),
//             roi_over: (acc.roi_over + stats.roi_over) / (acc.total_matches > 0 ? 2 : 1),
//             roi_under: (acc.roi_under + stats.roi_under) / (acc.total_matches > 0 ? 2 : 1),
//           };
//         }, {
//           total_matches: 0,
//           home_wins_count: 0,
//           draws_count: 0,
//           away_wins_count: 0,
//           bts_yes_count: 0,
//           bts_no_count: 0,
//           over_count: 0,
//           under_count: 0,
//           roi_home: 0,
//           roi_draw: 0,
//           roi_away: 0,
//           roi_bts_yes: 0,
//           roi_bts_no: 0,
//           roi_over: 0,
//           roi_under: 0,
//         });

//         setStatistics(combinedStats);

//       } else {
//         // СТАНДАРТНАЯ ЗАГРУЗКА БЕЗ ЛИГ
//         const [matchesResponse, statsResponse, allMatchesResponse] = await Promise.all([
//           axios.get<Match[]>(`http://localhost:8000/api/matches/?${params.toString()}`),
//           axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?${params.toString()}`),
//           axios.get<Match[]>(`http://localhost:8000/api/matches/`)
//         ]);

//         setMatches(matchesResponse.data);
//         setStatistics(statsResponse.data);
//         allMatchesData = allMatchesResponse.data;
//       }

//       // ЗАГРУЖАЕМ ДАННЫЕ ДЛЯ КЭША И УНИКАЛЬНЫХ ЗНАЧЕНИЙ
//       const [allMatchesResponse, allStatsResponse] = await Promise.all([
//         axios.get<Match[]>(`http://localhost:8000/api/matches/`),
//         axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/`)
//       ]);

//       setAllMatchesCache(allMatchesResponse.data);
//       setAllStatisticsCache(allStatsResponse.data);
//       allMatchesData = allMatchesResponse.data;

//       // Логика для уникальных значений
//       const leaguesMap = new Map<string, League>();
//       const homes = new Set<string>();
//       const aways = new Set<string>();
//       const oneOs = new Set<string>();
//       const oneEs = new Set<string>();
//       const xOs = new Set<string>();
//       const xEs = new Set<string>();
//       const twoOs = new Set<string>();
//       const twoEs = new Set<string>();
//       const btsOs = new Set<string>();
//       const btsEs = new Set<string>();
//       const btsNoOs = new Set<string>();
//       const btsNoEs = new Set<string>();
//       const overOs = new Set<string>();
//       const overEs = new Set<string>();
//       const underOs = new Set<string>();
//       const underEs = new Set<string>();
//       const firstHalfs = new Set<string>();
//       const matchesResults = new Set<string>();

//       allMatchesData.forEach((match: Match) => {
//         // Лиги
//         if (match.league_id && match.league) {
//           leaguesMap.set(match.league_id, {
//             id: match.league_id,
//             name: getBaseLeagueName(match.league)
//           });
//         }
        
//         homes.add(match.home);
//         aways.add(match.away);
//         oneOs.add(match.one_o.toFixed(2));
//         oneEs.add(match.one_e.toFixed(2));
//         xOs.add(match.x_o.toFixed(2));
//         xEs.add(match.x_e.toFixed(2));
//         twoOs.add(match.two_o.toFixed(2));
//         twoEs.add(match.two_e.toFixed(2));
//         btsOs.add(match.bts_o.toFixed(2));
//         btsEs.add(match.bts_e.toFixed(2));
//         btsNoOs.add(match.bts_no_o.toFixed(2));
//         btsNoEs.add(match.bts_no_e.toFixed(2));
//         overOs.add(match.over_o.toFixed(2));
//         overEs.add(match.over_e.toFixed(2));
//         underOs.add(match.under_o.toFixed(2));
//         underEs.add(match.under_e.toFixed(2));
        
//         if (match.first_half) firstHalfs.add(match.first_half);
//         if (match.match) matchesResults.add(match.match);
//       });

//       // Устанавливаем уникальные значения
//       const sortedLeagues = Array.from(leaguesMap.values()).sort((a, b) => 
//         a.name.localeCompare(b.name)
//       );
//       setUniqueLeagues(sortedLeagues);
//       setUniqueTeams(Array.from(new Set([...Array.from(homes), ...Array.from(aways)])).sort());
//       setUniqueOneOs(Array.from(oneOs).sort());
//       setUniqueOneEs(Array.from(oneEs).sort());
//       setUniqueXOs(Array.from(xOs).sort());
//       setUniqueXEs(Array.from(xEs).sort());
//       setUniqueTwoOs(Array.from(twoOs).sort());
//       setUniqueTwoEs(Array.from(twoEs).sort());
//       setUniqueBtsOs(Array.from(btsOs).sort());
//       setUniqueBtsEs(Array.from(btsEs).sort());
//       setUniqueBtsNoOs(Array.from(btsNoOs).sort());
//       setUniqueBtsNoEs(Array.from(btsNoEs).sort());
//       setUniqueOverOs(Array.from(overOs).sort());
//       setUniqueOverEs(Array.from(overEs).sort());
//       setUniqueUnderOs(Array.from(underOs).sort());
//       setUniqueUnderEs(Array.from(underEs).sort());
//       setUniqueFirstHalfs(Array.from(firstHalfs).sort());
//       setUniqueMatches(Array.from(matchesResults).sort());

//     } catch (err) {
//       setError('Failed to load data. Please try again later.');
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const filtersToCheck = [
//         'one-o-filter', 'one-e-filter', 'x-o-filter', 'x-e-filter',
//         'two-o-filter', 'two-e-filter', 'bts-o-filter', 'bts-e-filter',
//         'bts-no-o-filter', 'bts-no-e-filter', 'over-o-filter', 'over-e-filter',
//         'under-o-filter', 'under-e-filter', 'first-half-filter', 'matches-filter',
//         'bts-result-filter', 'total-goals-filter', 'leagues-filter' 
//       ];

//       filtersToCheck.forEach(filterAttr => {
//         const filterElement = document.querySelector(`[data-attribute="${filterAttr}"]`);
//         if (filterElement && !filterElement.contains(event.target as Node)) {
//           switch (filterAttr) {
//             case 'one-o-filter': setShowOneOCheckboxes(false); break;
//             case 'one-e-filter': setShowOneEsCheckboxes(false); break;
//             case 'x-o-filter': setShowXOCheckboxes(false); break;
//             case 'x-e-filter': setShowXEsCheckboxes(false); break;
//             case 'two-o-filter': setShowTwoOCheckboxes(false); break;
//             case 'two-e-filter': setShowTwoEsCheckboxes(false); break;
//             case 'bts-o-filter': setShowBtsOCheckboxes(false); break;
//             case 'bts-e-filter': setShowBtsEsCheckboxes(false); break;
//             case 'bts-no-o-filter': setShowBtsNoOCheckboxes(false); break;
//             case 'bts-no-e-filter': setShowBtsNoEsCheckboxes(false); break;
//             case 'over-o-filter': setShowOverOCheckboxes(false); break;
//             case 'over-e-filter': setShowOverEsCheckboxes(false); break;
//             case 'under-o-filter': setShowUnderOCheckboxes(false); break;
//             case 'under-e-filter': setShowUnderEsCheckboxes(false); break;
//             case 'first-half-filter': setShowFirstHalfsCheckboxes(false); break;
//             case 'matches-filter': setShowMatchesCheckboxes(false); break;
//             case 'bts-result-filter': setShowBtsResultCheckboxes(false); break; 
//             case 'total-goals-filter': setShowTotalGoalsCheckboxes(false); break; 
//             case 'leagues-filter': setShowLeaguesCheckboxes(false); break; 
//           }
//         }
//       });
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [
//     showOneOCheckboxes, showOneEsCheckboxes, showXOCheckboxes, showXEsCheckboxes,
//     showTwoOCheckboxes, showTwoEsCheckboxes, showBtsOCheckboxes, showBtsEsCheckboxes,
//     showBtsNoOCheckboxes, showBtsNoEsCheckboxes, showOverOCheckboxes, showOverEsCheckboxes,
//     showUnderOCheckboxes, showUnderEsCheckboxes, showFirstHalfsCheckboxes, showMatchesCheckboxes,
//     showBtsResultCheckboxes, showTotalGoalsCheckboxes 
//   ]);

//   useEffect(() => {
//     const hasActiveFilters = 
//       selectedLeagues.length > 0 || selectedTeam.length > 0 || showHome || showAway ||
//       selectedOneOs.length > 0 || selectedOneEs.length > 0 || selectedXOs.length > 0 ||
//       selectedXEs.length > 0 || selectedTwoOs.length > 0 || selectedTwoEs.length > 0 ||
//       selectedBtsOs.length > 0 || selectedBtsEs.length > 0 || selectedBtsNoOs.length > 0 ||
//       selectedBtsNoEs.length > 0 || selectedOverOs.length > 0 || selectedOverEs.length > 0 ||
//       selectedUnderOs.length > 0 || selectedUnderEs.length > 0 || selectedFirstHalfs.length > 0 ||
//       selectedMatches.length > 0 || selectedBtsResult.length > 0 || selectedTotalGoals.length > 0;

//     fetchMatches(!hasActiveFilters);
//   }, [
//     selectedLeagues, selectedTeam, showHome, showAway,
//     selectedOneOs, selectedOneEs, selectedXOs, selectedXEs,
//     selectedTwoOs, selectedTwoEs, selectedBtsOs, selectedBtsEs,
//     selectedBtsNoOs, selectedBtsNoEs, selectedOverOs, selectedOverEs,
//     selectedUnderOs, selectedUnderEs, selectedFirstHalfs, selectedMatches,
//     selectedBtsResult, selectedTotalGoals
//   ]);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     if (term.length > 1) {
//       const filteredTeams = uniqueTeams.filter(team =>
//         team.toLowerCase().includes(term.toLowerCase())
//       );
//       setSearchResults(filteredTeams);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const handleTeamSelect = (teamName: string) => {
//     setSelectedTeam([teamName]);
//     setSearchTerm(teamName);
//     setSearchResults([]);
//   };

//   const handleResetFilters = () => {
//     setSelectedLeagues([]);
//     setSelectedTeam([]);
//     setSearchTerm('');
//     setSearchResults([]);
//     setSelectedOneOs([]);
//     setSelectedOneEs([]);
//     setSelectedXOs([]);
//     setSelectedXEs([]);
//     setSelectedTwoOs([]);
//     setSelectedTwoEs([]);
//     setSelectedBtsOs([]);
//     setSelectedBtsEs([]);
//     setSelectedBtsNoOs([]);
//     setSelectedBtsNoEs([]);
//     setSelectedOverOs([]);
//     setSelectedOverEs([]);
//     setSelectedUnderOs([]);
//     setSelectedUnderEs([]);
//     setSelectedFirstHalfs([]);
//     setSelectedMatches([]);
//     setSelectedBtsResult([]);
//     setSelectedTotalGoals([]);
//     setShowHome(false);
//     setShowAway(false);
    
//     // Сброс всех чекбоксов
//     setShowOneOCheckboxes(false);
//     setShowOneEsCheckboxes(false);
//     setShowXOCheckboxes(false);
//     setShowXEsCheckboxes(false);
//     setShowTwoOCheckboxes(false);
//     setShowTwoEsCheckboxes(false);
//     setShowBtsOCheckboxes(false);
//     setShowBtsEsCheckboxes(false);
//     setShowBtsNoOCheckboxes(false);
//     setShowBtsNoEsCheckboxes(false);
//     setShowOverOCheckboxes(false);
//     setShowOverEsCheckboxes(false);
//     setShowUnderOCheckboxes(false);
//     setShowUnderEsCheckboxes(false);
//     setShowFirstHalfsCheckboxes(false);
//     setShowMatchesCheckboxes(false);
//     setShowBtsResultCheckboxes(false);
//     setShowTotalGoalsCheckboxes(false);

//     if (allMatchesCache.length > 0) {
//       setMatches(allMatchesCache);
//       setStatistics(allStatisticsCache);
//     } else {
//       fetchMatches(true);
//     }
//   };

//   const formatRoi = (roi: number | null) => {
//     if (roi === null || isNaN(roi)) {
//       return '';
//     }
//     const sign = roi >= 0 ? '+' : '';
//     const color = roi >= 0 ? 'green' : 'red';
//     return <span style={{ color }}>{`${sign}${roi.toFixed(2)}`}</span>;
//   };

//   const getFullLeagueName = (league: string): string => {
//     if (!league) return '';
//     return league.split(' - ')[0].trim();
//   };

//   const filteredMatches = useMemo(() => {
//     if (!selectedLeagues.length) return matches;
//     return matches.filter(match => selectedLeagues.includes(match.league_id));
//   }, [matches, selectedLeagues]);

//   const renderCheckboxFilter = (
//     label: string,
//     selectedValues: string[],
//     availableValues: string[],
//     filterType: keyof typeof filters,
//     showDropdown: boolean,
//     setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>,
//     dataAttribute: string
//   ) => {
//     // Функция для получения отображаемого текста
//     const getDisplayText = () => {
//       if (selectedValues.length === 0) return '\u00A0'; // неразрывный пробел
//       if (selectedValues.length === 1) {
//         // Для лиг показываем название вместо ID
//         if (filterType === 'leagues') {
//           const league = uniqueLeagues.find(l => l.id === selectedValues[0]);
//           return league ? league.name : selectedValues[0];
//         }
//         return selectedValues[0]; // Для остальных показываем значение
//       }
//       return `${selectedValues.length} selected`;
//     };

//     // Функция для получения заголовка при наведении
//     const getTitle = () => {
//       if (selectedValues.length <= 1) return '';
//       if (filterType === 'leagues') {
//         return selectedValues.map(id => {
//           const league = uniqueLeagues.find(l => l.id === id);
//           return league ? league.name : id;
//         }).join(', ');
//       }
//       return selectedValues.join(', ');
//     };

//     // Определяем стиль dropdown в зависимости от типа фильтра
//     const getDropdownStyle = () => {
//       if (filterType === 'leagues') return checkboxDropdownWideStyle;
//       if (filterType === 'total_goals') return { ...checkboxDropdownStyle, minWidth: '100px' };
//       return checkboxDropdownStyle;
//     };

//     return (
//       <div style={{
//         ...filterItemStyle,
//         ...(filterType === 'leagues' && { minWidth: '250px' })
//       }} data-attribute={dataAttribute}>
//         <label style={labelStyle}>{label}</label>
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setShowDropdown(!showDropdown)}
//             style={selectWithDropdownStyle}
//             title={getTitle()} // подсказка при наведении
//           >
//             {getDisplayText()}
//           </button>
          
//           {showDropdown && (
//             <div style={getDropdownStyle()}>
//               {availableValues.map(value => {
//                 const displayValue = filterType === 'leagues' 
//                   ? uniqueLeagues.find(league => league.id === value)?.name || value
//                   : value;
                  
//                 return (
//                   <div key={value} style={{
//                     ...checkboxItemStyle,
//                     whiteSpace: 'nowrap' as const,
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis'
//                   }}>
//                     <input
//                       type="checkbox"
//                       checked={selectedValues.includes(value)}
//                       onChange={() => handleCheckboxChange(filterType, value)}
//                       style={{ 
//                         ...customCheckboxStyle,
//                         ...(selectedValues.includes(value) ? customCheckboxCheckedStyle : {})
//                       }}
//                     />
//                     <span title={displayValue}>{displayValue}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (error) {
//     return <div style={{ color: 'red' }}>{error}</div>;
//   }

//   return (
//     <div style={{ padding: '10px' }}>
//       <div ref={topBlockRef} style={topBlockStyle}>
//         {statistics && (
//           <div style={cardContainerStyle}>
//             <div style={cardStyle}>
//               <div style={cardCountStyle}>{statistics.total_matches}</div>
//               <div style={cardTitleStyle}>Total Matches</div>
//               <div style={cardRoiStyle}></div>
//             </div>
//             <div style={cardStyle}>
//               <div style={cardCountStyle}>{statistics.home_wins_count}</div>
//               <div style={cardTitleStyle}>Home Wins</div>
//               <div style={cardRoiStyle}>{formatRoi(statistics.roi_home)}</div>
//             </div>
//             <div style={cardStyle}>
//               <div style={cardCountStyle}>{statistics.draws_count}</div>
//               <div style={cardTitleStyle}>Draws</div>
//               <div style={cardRoiStyle}>{formatRoi(statistics.roi_draw)}</div>
//             </div>
//             <div style={cardStyle}>
//               <div style={cardCountStyle}>{statistics.away_wins_count}</div>
//               <div style={cardTitleStyle}>Away Wins</div>
//               <div style={cardRoiStyle}>{formatRoi(statistics.roi_away)}</div>
//             </div>
//             <div style={cardStyle}>
//               <div style={cardCountStyle}>{statistics.bts_yes_count}</div>
//               <div style={cardTitleStyle}>BTS Yes</div>
//               <div style={cardRoiStyle}>{formatRoi(statistics.roi_bts_yes)}</div>
//             </div>
//             <div style={cardStyle}>
//               <div style={cardCountStyle}>{statistics.bts_no_count}</div>
//               <div style={cardTitleStyle}>BTS No</div>
//               <div style={cardRoiStyle}>{formatRoi(statistics.roi_bts_no)}</div>
//             </div>
//             <div style={cardStyle}>
//               <div style={cardCountStyle}>{statistics.over_count}</div>
//               <div style={cardTitleStyle}>Over</div>
//               <div style={cardRoiStyle}>{formatRoi(statistics.roi_over)}</div>
//             </div>
//             <div style={cardStyle}>
//               <div style={cardCountStyle}>{statistics.under_count}</div>
//               <div style={cardTitleStyle}>Under</div>
//               <div style={cardRoiStyle}>{formatRoi(statistics.roi_under)}</div>
//             </div>
//           </div>
//         )}

//         <div style={filtersContainerStyle}>
//           <div style={filtersRowStyle}>
//             {/* ФИЛЬТР КОМАНДЫ */}
//             <div style={filterItemStyle}>
//               <label style={labelStyle}>Team</label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   placeholder="Search team..."
//                   style={inputStyle}
//                 />
//                 {searchResults.length > 0 && (
//                   <div style={searchResultsStyle}>
//                     {searchResults.map((team, index) => (
//                       <div
//                         key={index}
//                         style={searchResultItemStyle}
//                         onClick={() => handleTeamSelect(team)}
//                       >
//                         {team}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* ЧЕКБОКСЫ ДОМА/В ГОСТЯХ */}
//             <div style={filterItemStyle}>
//               <label style={labelStyle}>Location</label>
//               <div style={{ display: 'flex', gap: '10px' }}>
//                 <label style={checkboxLabelStyle}>
//                   <input
//                     type="checkbox"
//                     checked={showHome}
//                     onChange={() => setShowHome(!showHome)}
//                   />
//                   Home
//                 </label>
//                 <label style={checkboxLabelStyle}>
//                   <input
//                     type="checkbox"
//                     checked={showAway}
//                     onChange={() => setShowAway(!showAway)}
//                   />
//                   Away
//                 </label>
//               </div>
//             </div>

//             {/* ФИЛЬТР ЛИГ */}
//             {renderCheckboxFilter(
//               'Leagues',
//               selectedLeagues,
//               uniqueLeagues.map(league => league.id),
//               'leagues',
//               showLeaguesCheckboxes,
//               setShowLeaguesCheckboxes,
//               'leagues-filter'
//             )}

//             {/* ФИЛЬТР РЕЗУЛЬТАТОВ BTS */}
//             {renderCheckboxFilter(
//               'BTS Result',
//               selectedBtsResult,
//               ['Yes', 'No'],
//               'bts_result',
//               showBtsResultCheckboxes,
//               setShowBtsResultCheckboxes,
//               'bts-result-filter'
//             )}

//             {/* ФИЛЬТР ТОТАЛОВ */}
//             {renderCheckboxFilter(
//               'Total Goals',
//               selectedTotalGoals,
//               ['Over', 'Under'],
//               'total_goals',
//               showTotalGoalsCheckboxes,
//               setShowTotalGoalsCheckboxes,
//               'total-goals-filter'
//             )}

//             {/* КНОПКА СБРОСА */}
//             <div style={filterItemStyle}>
//               <button onClick={handleResetFilters} style={resetButtonStyle}>
//                 Reset Filters
//               </button>
//             </div>
//           </div>

//           <div style={filtersRowStyle}>
//             {/* ФИЛЬТРЫ КОЭФФИЦИЕНТОВ */}
//             {renderCheckboxFilter('1 O', selectedOneOs, uniqueOneOs, 'one_o', showOneOCheckboxes, setShowOneOCheckboxes, 'one-o-filter')}
//             {renderCheckboxFilter('1 E', selectedOneEs, uniqueOneEs, 'one_e', showOneEsCheckboxes, setShowOneEsCheckboxes, 'one-e-filter')}
//             {renderCheckboxFilter('X O', selectedXOs, uniqueXOs, 'x_o', showXOCheckboxes, setShowXOCheckboxes, 'x-o-filter')}
//             {renderCheckboxFilter('X E', selectedXEs, uniqueXEs, 'x_e', showXEsCheckboxes, setShowXEsCheckboxes, 'x-e-filter')}
//             {renderCheckboxFilter('2 O', selectedTwoOs, uniqueTwoOs, 'two_o', showTwoOCheckboxes, setShowTwoOCheckboxes, 'two-o-filter')}
//             {renderCheckboxFilter('2 E', selectedTwoEs, uniqueTwoEs, 'two_e', showTwoEsCheckboxes, setShowTwoEsCheckboxes, 'two-e-filter')}
//             {renderCheckboxFilter('BTS O', selectedBtsOs, uniqueBtsOs, 'bts_o', showBtsOCheckboxes, setShowBtsOCheckboxes, 'bts-o-filter')}
//             {renderCheckboxFilter('BTS E', selectedBtsEs, uniqueBtsEs, 'bts_e', showBtsEsCheckboxes, setShowBtsEsCheckboxes, 'bts-e-filter')}
//             {renderCheckboxFilter('BTS NO O', selectedBtsNoOs, uniqueBtsNoOs, 'bts_no_o', showBtsNoOCheckboxes, setShowBtsNoOCheckboxes, 'bts-no-o-filter')}
//             {renderCheckboxFilter('BTS NO E', selectedBtsNoEs, uniqueBtsNoEs, 'bts_no_e', showBtsNoEsCheckboxes, setShowBtsNoEsCheckboxes, 'bts-no-e-filter')}
//             {renderCheckboxFilter('Over O', selectedOverOs, uniqueOverOs, 'over_o', showOverOCheckboxes, setShowOverOCheckboxes, 'over-o-filter')}
//             {renderCheckboxFilter('Over E', selectedOverEs, uniqueOverEs, 'over_e', showOverEsCheckboxes, setShowOverEsCheckboxes, 'over-e-filter')}
//             {renderCheckboxFilter('Under O', selectedUnderOs, uniqueUnderOs, 'under_o', showUnderOCheckboxes, setShowUnderOCheckboxes, 'under-o-filter')}
//             {renderCheckboxFilter('Under E', selectedUnderEs, uniqueUnderEs, 'under_e', showUnderEsCheckboxes, setShowUnderEsCheckboxes, 'under-e-filter')}
//             {renderCheckboxFilter('1st Half', selectedFirstHalfs, uniqueFirstHalfs, 'first_half', showFirstHalfsCheckboxes, setShowFirstHalfsCheckboxes, 'first-half-filter')}
//             {renderCheckboxFilter('Match', selectedMatches, uniqueMatches, 'match', showMatchesCheckboxes, setShowMatchesCheckboxes, 'matches-filter')}
//           </div>
//         </div>
//       </div>

//       <div style={tableContainerStyle}>
//         <table style={tableStyle}>
//           <thead>
//             <tr style={stickyHeaderRowStyle}>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Date</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>League</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Home</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Away</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>1 O</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>1 E</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>X O</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>X E</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>2 O</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>2 E</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>BTS O</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>BTS E</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>BTS NO O</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>BTS NO E</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Over O</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Over E</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Under O</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Under E</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>1st Half</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Match</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Goals</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Link</th>
//               <th style={{ ...fixedWidthColumnStyle, ...verticalHeaderStyle }}>Notes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={23} style={{ textAlign: 'center', padding: '20px' }}>
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredMatches.length === 0 ? (
//               <tr>
//                 <td colSpan={23} style={{ textAlign: 'center', padding: '20px' }}>
//                   No matches found
//                 </td>
//               </tr>
//             ) : (
//               filteredMatches.map((match) => (
//                 <tr key={match.id}>
//                   <td style={cellStyle}>{match.date}</td>
//                   <td style={cellStyle}>{getFullLeagueName(match.league)}</td>
//                   <td style={cellStyle}>{match.home}</td>
//                   <td style={cellStyle}>{match.away}</td>
//                   <td style={cellStyle_2}>{match.one_o.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.one_e.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.x_o.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.x_e.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.two_o.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.two_e.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.bts_o.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.bts_e.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.bts_no_o.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.bts_no_e.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.over_o.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.over_e.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.under_o.toFixed(2)}</td>
//                   <td style={cellStyle_2}>{match.under_e.toFixed(2)}</td>
//                   <td style={cellStyle}>{match.first_half}</td>
//                   <td style={cellStyle}>{match.match}</td>
//                   <td style={cellStyle}>{match.goals}</td>
//                   <td style={cellStyle}>
//                     {match.link ? (
//                       <a href={match.link} target="_blank" rel="noopener noreferrer">
//                         Link
//                       </a>
//                     ) : (
//                       'N/A'
//                     )}
//                   </td>
//                   <td style={cellStyle}>{match.notes}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MatchList;