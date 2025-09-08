// // MatchList.tsx
// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import axios from 'axios';

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
//   const [matches, setMatches] = useState<Match[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [statistics, setStatistics] = useState<Statistics | null>(null);
//   const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
//   const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
//   const [showHome, setShowHome] = useState<boolean>(false);
//   const [showAway, setShowAway] = useState<boolean>(false);
//   const [selectedOneOs, setSelectedOneOs] = useState<string[]>([]);
//   const [selectedXOs, setSelectedXOs] = useState<string[]>([]);
//   const [selectedTwoOs, setSelectedTwoOs] = useState<string[]>([]);
//   const [selectedBtsOs, setSelectedBtsOs] = useState<string[]>([]);
//   const [selectedBtsNoOs, setSelectedBtsNoOs] = useState<string[]>([]);
//   const [selectedOverOs, setSelectedOverOs] = useState<string[]>([]);
//   const [selectedUnderOs, setSelectedUnderOs] = useState<string[]>([]);
//   const [selectedFirstHalfs, setSelectedFirstHalfs] = useState<string[]>([]);
//   const [selectedMatches, setSelectedMatches] = useState<string[]>([]);
//   const [selectedOneEs, setSelectedOneEs] = useState<string[]>([]);
//   const [selectedXEs, setSelectedXEs] = useState<string[]>([]);
//   const [selectedTwoEs, setSelectedTwoEs] = useState<string[]>([]);
//   const [selectedBtsEs, setSelectedBtsEs] = useState<string[]>([]);
//   const [selectedBtsNoEs, setSelectedBtsNoEs] = useState<string[]>([]);
//   const [selectedOverEs, setSelectedOverEs] = useState<string[]>([]);
//   const [selectedUnderEs, setSelectedUnderEs] = useState<string[]>([]);
//   const [selectedBtsResult, setSelectedBtsResult] = useState<string[]>([]);
//   const [selectedTotalGoals, setSelectedTotalGoals] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [searchResults, setSearchResults] = useState<string[]>([]);
//   const [uniqueLeagues, setUniqueLeagues] = useState<League[]>([]);
//   const [uniqueOneOs, setUniqueOneOs] = useState<string[]>([]);
//   const [uniqueXOs, setUniqueXOs] = useState<string[]>([]);
//   const [uniqueTwoOs, setUniqueTwoOs] = useState<string[]>([]);
//   const [uniqueBtsOs, setUniqueBtsOs] = useState<string[]>([]);
//   const [uniqueBtsNoOs, setUniqueBtsNoOs] = useState<string[]>([]);
//   const [uniqueOverOs, setUniqueOverOs] = useState<string[]>([]);
//   const [uniqueUnderOs, setUniqueUnderOs] = useState<string[]>([]);
//   const [uniqueFirstHalfs, setUniqueFirstHalfs] = useState<string[]>([]);
//   const [uniqueMatches, setUniqueMatches] = useState<string[]>([]);
//   const [uniqueOneEs, setUniqueOneEs] = useState<string[]>([]);
//   const [uniqueXEs, setUniqueXEs] = useState<string[]>([]);
//   const [uniqueTwoEs, setUniqueTwoEs] = useState<string[]>([]);
//   const [uniqueBtsEs, setUniqueBtsEs] = useState<string[]>([]);
//   const [uniqueBtsNoEs, setUniqueBtsNoEs] = useState<string[]>([]);
//   const [uniqueOverEs, setUniqueOverEs] = useState<string[]>([]);
//   const [uniqueUnderEs, setUniqueUnderEs] = useState<string[]>([]);
//   const [uniqueTeams, setUniqueTeams] = useState<string[]>([]);

//   const topBlockRef = useRef<HTMLDivElement>(null);
//   const totalOptions = ['Over 1.5', 'Under 1.5', 'Over 2.5', 'Under 2.5', 'Over 3.5', 'Under 3.5'];

//   const getBaseLeagueName = (fullLeagueName: string): string => {
//     if (!fullLeagueName) return '';
//     return fullLeagueName.split(' - ')[0].trim();
//   };

//   const fetchMatches = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const params = new URLSearchParams();
//       if (selectedLeagues.length > 0) params.append('league_id', selectedLeagues[0]);
//       if (selectedTeam.length > 0) {
//         params.append('team', selectedTeam[0]);
//         const locations = [];
//         if (showHome) locations.push('home');
//         if (showAway) locations.push('away');
//         if (locations.length > 0) params.append('location', locations.join(','));
//       }
//       if (selectedOneOs.length > 0) params.append('one_os', selectedOneOs.join(','));
//       if (selectedXOs.length > 0) params.append('x_os', selectedXOs.join(','));
//       if (selectedTwoOs.length > 0) params.append('two_os', selectedTwoOs.join(','));
//       if (selectedBtsOs.length > 0) params.append('bts_os', selectedBtsOs.join(','));
//       if (selectedBtsNoOs.length > 0) params.append('bts_no_os', selectedBtsNoOs.join(','));
//       if (selectedOverOs.length > 0) params.append('over_os', selectedOverOs.join(','));
//       if (selectedUnderOs.length > 0) params.append('under_os', selectedUnderOs.join(','));
//       if (selectedFirstHalfs.length > 0) params.append('first_halfs', selectedFirstHalfs.join(','));
//       if (selectedMatches.length > 0) params.append('matches', selectedMatches.join(','));
//       if (selectedOneEs.length > 0) params.append('one_es', selectedOneEs.join(','));
//       if (selectedXEs.length > 0) params.append('x_es', selectedXEs.join(','));
//       if (selectedTwoEs.length > 0) params.append('two_es', selectedTwoEs.join(','));
//       if (selectedBtsEs.length > 0) params.append('bts_es', selectedBtsEs.join(','));
//       if (selectedBtsNoEs.length > 0) params.append('bts_no_es', selectedBtsNoEs.join(','));
//       if (selectedOverEs.length > 0) params.append('over_es', selectedOverEs.join(','));
//       if (selectedUnderEs.length > 0) params.append('under_es', selectedUnderEs.join(','));
//       if (selectedBtsResult.length > 0) params.append('bts_result', selectedBtsResult[0]);
//       if (selectedTotalGoals.length > 0) params.append('total_goals', selectedTotalGoals[0]);

//       const [matchesResponse, statsResponse, allMatchesResponse] = await Promise.all([
//         axios.get<Match[]>(`http://localhost:8000/api/matches/?${params.toString()}`),
//         axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?${params.toString()}`),
//         axios.get<Match[]>(`http://localhost:8000/api/matches/`)
//       ]);

//       setMatches(matchesResponse.data);
//       setStatistics(statsResponse.data);

//       // Собираем уникальные лиги
//       const leaguesMap = new Map<string, League>();
//       allMatchesResponse.data.forEach(match => {
        
//         if (match.league_id && match.league) {
//           leaguesMap.set(match.league_id, {
//             id: match.league_id,
//             name: getBaseLeagueName(match.league)
//           });
//         }
//       });

//       // Преобразуем в массив и сортируем по названию
//       const sortedLeagues = Array.from(leaguesMap.values()).sort((a, b) => 
//         a.name.localeCompare(b.name)
//       );
//       setUniqueLeagues(sortedLeagues);

//       // const leaguesMap = new Map<string, League>();
//       const homes = new Set<string>();
//       const aways = new Set<string>();
//       const oneOs = new Set<string>();
//       const xOs = new Set<string>();
//       const twoOs = new Set<string>();
//       const btsOs = new Set<string>();
//       const btsNoOs = new Set<string>();
//       const overOs = new Set<string>();
//       const underOs = new Set<string>();
//       const firstHalfs = new Set<string>();
//       const matchesResults = new Set<string>();
//       const oneEs = new Set<string>();
//       const xEs = new Set<string>();
//       const twoEs = new Set<string>();
//       const btsEs = new Set<string>();
//       const btsNoEs = new Set<string>();
//       const overEs = new Set<string>();
//       const underEs = new Set<string>();

//       allMatchesResponse.data.forEach(match => {
//         homes.add(match.home);
//         aways.add(match.away);
//         oneOs.add(match.one_o.toFixed(2));
//         xOs.add(match.x_o.toFixed(2));
//         twoOs.add(match.two_o.toFixed(2));
//         btsOs.add(match.bts_o.toFixed(2));
//         btsNoOs.add(match.bts_no_o.toFixed(2));
//         overOs.add(match.over_o.toFixed(2));
//         underOs.add(match.under_o.toFixed(2));
//         if (match.first_half) firstHalfs.add(match.first_half);
//         if (match.match) matchesResults.add(match.match);
//         oneEs.add(match.one_e.toFixed(2));
//         xEs.add(match.x_e.toFixed(2));
//         twoEs.add(match.two_e.toFixed(2));
//         btsEs.add(match.bts_e.toFixed(2));
//         btsNoEs.add(match.bts_no_e.toFixed(2));
//         overEs.add(match.over_e.toFixed(2));
//         underEs.add(match.under_e.toFixed(2));
//       });

//       setUniqueTeams(Array.from(new Set([...Array.from(homes), ...Array.from(aways)])).sort());
//       setUniqueOneOs(Array.from(oneOs).sort());
//       setUniqueXOs(Array.from(xOs).sort());
//       setUniqueTwoOs(Array.from(twoOs).sort());
//       setUniqueBtsOs(Array.from(btsOs).sort());
//       setUniqueBtsNoOs(Array.from(btsNoOs).sort());
//       setUniqueOverOs(Array.from(overOs).sort());
//       setUniqueUnderOs(Array.from(underOs).sort());
//       setUniqueFirstHalfs(Array.from(firstHalfs).sort());
//       setUniqueMatches(Array.from(matchesResults).sort());
//       setUniqueOneEs(Array.from(oneEs).sort());
//       setUniqueXEs(Array.from(xEs).sort());
//       setUniqueTwoEs(Array.from(twoEs).sort());
//       setUniqueBtsEs(Array.from(btsEs).sort());
//       setUniqueBtsNoEs(Array.from(btsNoEs).sort());
//       setUniqueOverEs(Array.from(overEs).sort());
//       setUniqueUnderEs(Array.from(underEs).sort());

//     } catch (err) {
      
//       setError('Failed to load data. Please try again later.');
//       // console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchMatches();
//   }, [
//     selectedLeagues, selectedTeam, showHome, showAway,
//     selectedOneOs, selectedXOs, selectedTwoOs, selectedBtsOs, selectedBtsNoOs,
//     selectedOverOs, selectedUnderOs, selectedFirstHalfs, selectedMatches,
//     selectedOneEs, selectedXEs, selectedTwoEs, selectedBtsEs, selectedBtsNoEs,
//     selectedOverEs, selectedUnderEs, selectedBtsResult, selectedTotalGoals
//   ]);

//   const handleSelectChange = (
//     e: React.ChangeEvent<HTMLSelectElement>,
//     setter: React.Dispatch<React.SetStateAction<string[]>>
//   ) => {
//     const value = e.target.value;
//     if (value === '') {
//       setter([]);
//     } else {
//       setter([value]);
//     }
//   };

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
//     setSelectedXOs([]);
//     setSelectedTwoOs([]);
//     setSelectedBtsOs([]);
//     setSelectedBtsNoOs([]);
//     setSelectedOverOs([]);
//     setSelectedUnderOs([]);
//     setSelectedFirstHalfs([]);
//     setSelectedMatches([]);
//     setSelectedOneEs([]);
//     setSelectedXEs([]);
//     setSelectedTwoEs([]);
//     setSelectedBtsEs([]);
//     setSelectedBtsNoEs([]);
//     setSelectedOverEs([]);
//     setSelectedUnderEs([]);
//     setSelectedBtsResult([]);
//     setSelectedTotalGoals([]);
//     setShowHome(false);
//     setShowAway(false);
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

//   const cellStyle: React.CSSProperties = {
//     padding: '4px 6px',
//     border: '1px solid #444',
//     textAlign: 'center',
//     whiteSpace: 'nowrap',
//     boxSizing: 'border-box',
//   };

//   const cellStyle_2: React.CSSProperties = {
//     padding: '4px 6px',
//     border: '1px solid #444',
//     textAlign: 'left',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     maxWidth: 150,
//     boxSizing: 'border-box',
//     cursor: 'default',
//   };

//   const verticalHeaderStyle: React.CSSProperties = {
//     writingMode: 'vertical-lr',
//     textOrientation: 'mixed',
//     transform: 'rotate(180deg)',
//     whiteSpace: 'nowrap',
//     padding: '4px 6px',
//     textAlign: 'center',
//     verticalAlign: 'middle',
//     minWidth: '30px',
//     boxSizing: 'border-box',
//     border: '1px solid #444',
//   };

//   const fixedWidthColumnStyle: React.CSSProperties = {
//     minWidth: '45px',
//   };

//   const cardContainerStyle: React.CSSProperties = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
//     gap: '10px',
//     marginBottom: '15px',
//     backgroundColor: '#333',
//     borderRadius: '8px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//   };

//   const cardStyle: React.CSSProperties = {
//     backgroundColor: '#444',
//     padding: '10px',
//     borderRadius: '8px',
//     textAlign: 'center',
//     color: 'white',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     minHeight: '80px',
//   };

//   const cardCountStyle: React.CSSProperties = {
//     fontSize: '1.5em',
//     fontWeight: 'bold',
//     marginBottom: '3px',
//   };

//   const cardTitleStyle: React.CSSProperties = {
//     fontSize: '0.8em',
//     color: '#bbb',
//     marginBottom: '3px',
//   };

//   const cardRoiStyle: React.CSSProperties = {
//     fontSize: '0.7em',
//     fontWeight: 'bold',
//   };

//   const topBlockStyle: React.CSSProperties = {
//     position: 'sticky',
//     top: 0,
//     zIndex: 100,
//     backgroundColor: '#282c34',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//   };

//     // Загрузка данных при фильрации без черного экрана
//   <tbody>
//     {loading ? (
//       <tr>
//         <td colSpan={22} style={{ textAlign: 'center', padding: '20px' }}>
//           Loading data...
//         </td>
//       </tr>
//     ) : filteredMatches.length === 0 ? (
//       <tr>
//         <td colSpan={22} style={{ textAlign: 'center', padding: '20px' }}>
//           No matches found or access restricted.
//         </td>
//       </tr>
//     ) : (
//       filteredMatches.map(match => (
//         <tr key={match.id}>
//           {/* Ячейки с данными */}
//         </tr>
//       ))
//     )}
//   </tbody>

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

//         <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
//           <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
//             <div>
//               <label htmlFor="selectLeagueFilter">League:</label>
//               <select
//                 id="selectLeagueFilter"
//                 value={selectedLeagues.length > 0 ? selectedLeagues[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedLeagues)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueLeagues.map(league => (
//                   <option key={league.id} value={league.id}>{league.name}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div style={{ position: 'relative' }}>
//               <label htmlFor="teamSearchFilter">Team:</label>
//               <input
//                 id="teamSearchFilter"
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 placeholder="Search team..."
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               />
//               {searchResults.length > 0 && searchTerm.length > 1 && (
//                 <ul style={{
//                   position: 'absolute',
//                   top: '100%',
//                   left: 0,
//                   right: 0,
//                   backgroundColor: '#333',
//                   border: '1px solid #555',
//                   borderRadius: '3px',
//                   maxHeight: '200px',
//                   overflowY: 'auto',
//                   zIndex: 101,
//                   listStyle: 'none',
//                   padding: 0,
//                   margin: 0,
//                 }}>
//                   {searchResults.map(team => (
//                     <li
//                       key={team}
//                       onClick={() => handleTeamSelect(team)}
//                       style={{
//                         padding: '8px 10px',
//                         cursor: 'pointer',
//                         borderBottom: '1px solid #444',
//                       }}
//                     >
//                       {team}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={showHome}
//                   onChange={() => setShowHome(!showHome)}
//                 />
//                 Home
//               </label>
//               <label style={{ marginLeft: 10 }}>
//                 <input
//                   type="checkbox"
//                   checked={showAway}
//                   onChange={() => setShowAway(!showAway)}
//                 />
//                 Away
//               </label>
//             </div>

//             <div>
//               <label htmlFor="selectOneOFilter">1(o):</label>
//               <select
//                 id="selectOneOFilter"
//                 value={selectedOneOs.length > 0 ? selectedOneOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedOneOs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueOneOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectOneEFilter">1(e):</label>
//               <select
//                 id="selectOneEFilter"
//                 value={selectedOneEs.length > 0 ? selectedOneEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedOneEs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueOneEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectXoFilter">X(o):</label>
//               <select
//                 id="selectXoFilter"
//                 value={selectedXOs.length > 0 ? selectedXOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedXOs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueXOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectXeFilter">X(e):</label>
//               <select
//                 id="selectXeFilter"
//                 value={selectedXEs.length > 0 ? selectedXEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedXEs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueXEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectTwoOFilter">2(o):</label>
//               <select
//                 id="selectTwoOFilter"
//                 value={selectedTwoOs.length > 0 ? selectedTwoOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedTwoOs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueTwoOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectTwoEFilter">2(e):</label>
//               <select
//                 id="selectTwoEFilter"
//                 value={selectedTwoEs.length > 0 ? selectedTwoEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedTwoEs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueTwoEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectBtsOFilter">BTS(o):</label>
//               <select
//                 id="selectBtsOFilter"
//                 value={selectedBtsOs.length > 0 ? selectedBtsOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsOs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueBtsOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectBtsEFilter">BTS(e):</label>
//               <select
//                 id="selectBtsEFilter"
//                 value={selectedBtsEs.length > 0 ? selectedBtsEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsEs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueBtsEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectBtsNoOFilter">BTS_no(o):</label>
//               <select
//                 id="selectBtsNoOFilter"
//                 value={selectedBtsNoOs.length > 0 ? selectedBtsNoOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsNoOs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueBtsNoOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectBtsNoEFilter">BTS_no(e):</label>
//               <select
//                 id="selectBtsNoEFilter"
//                 value={selectedBtsNoEs.length > 0 ? selectedBtsNoEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsNoEs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueBtsNoEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectOverOFilter">Over(o):</label>
//               <select
//                 id="selectOverOFilter"
//                 value={selectedOverOs.length > 0 ? selectedOverOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedOverOs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueOverOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectOverEFilter">Over(e):</label>
//               <select
//                 id="selectOverEFilter"
//                 value={selectedOverEs.length > 0 ? selectedOverEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedOverEs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueOverEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectUnderOFilter">Under(o):</label>
//               <select
//                 id="selectUnderOFilter"
//                 value={selectedUnderOs.length > 0 ? selectedUnderOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedUnderOs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueUnderOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectUnderEFilter">Under(e):</label>
//               <select
//                 id="selectUnderEFilter"
//                 value={selectedUnderEs.length > 0 ? selectedUnderEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedUnderEs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueUnderEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectFirstHalfFilter">1H:</label>
//               <select
//                 id="selectFirstHalfFilter"
//                 value={selectedFirstHalfs.length > 0 ? selectedFirstHalfs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedFirstHalfs)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueFirstHalfs.map(score => (
//                   <option key={score} value={score}>{score}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectMatchFilter">FT:</label>
//               <select
//                 id="selectMatchFilter"
//                 value={selectedMatches.length > 0 ? selectedMatches[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedMatches)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {uniqueMatches.map(score => (
//                   <option key={score} value={score}>{score}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectBtsResultFilter">BTS:</label>
//               <select
//                 id="selectBtsResultFilter"
//                 value={selectedBtsResult.length > 0 ? selectedBtsResult[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsResult)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             </div>
//             <div>
//               <label htmlFor="selectTotalGoalsFilter">Total Goals:</label>
//               <select
//                 id="selectTotalGoalsFilter"
//                 value={selectedTotalGoals.length > 0 ? selectedTotalGoals[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedTotalGoals)}
//                 style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}
//               >
//                 <option value=""></option>
//                 {totalOptions.map(option => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <button 
//                 onClick={handleResetFilters} 
//                 style={{ 
//                   padding: '8px 15px', 
//                   backgroundColor: '#007bff', 
//                   color: 'white', 
//                   border: 'none', 
//                   borderRadius: '5px', 
//                   cursor: 'pointer',
//                   marginTop: '10px',
//                 }}
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div style={{ overflowX: 'auto' }}>
//         <table style={{ 
//             borderCollapse: 'collapse', 
//             width: '100%',
//             fontSize: '0.85em',
//             margin: '0 auto',
//         }}>
//           <thead>
//             <tr>
//               <th style={{ ...verticalHeaderStyle, minWidth: '120px' }}>Date</th>
//               <th style={{ ...verticalHeaderStyle, minWidth: '90px' }}>Home</th>
//               <th style={{ ...verticalHeaderStyle, minWidth: '90px' }}>Away</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>1(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>1(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>X(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>X(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>2(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>2(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>BTS(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>BTS(e)</th> 
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>BTS_no(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>BTS_no(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>Over(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>Over(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>Under(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>Under(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>1H</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>FT</th>
//               <th style={{ ...verticalHeaderStyle }}>League</th>
//               </tr>
//            </thead>
//            <tbody>
//                {matches.map(match => {
//                 const matchDate = new Date(match.date);
//                 const formattedDate = matchDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
//                 const formattedTime = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//                 return (
//                   <tr key={match.id}>
//                     <td style={cellStyle}>{`${formattedDate} ${formattedTime}`}</td>
//                     <td style={cellStyle}>{match.home}</td>
//                     <td style={cellStyle}>{match.away}</td>
//                     <td style={cellStyle}>{match.one_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.one_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.x_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.x_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.two_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.two_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.bts_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.bts_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.bts_no_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.bts_no_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.over_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.over_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.under_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.under_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.first_half || '-'}</td>
//                     <td style={cellStyle}>{match.match || '-'}</td>
//                     <td style={cellStyle_2} title={match.league}>{getFullLeagueName(match.league)}</td>
//                   </tr>
//                 );
//               })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MatchList;

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
//   selectStyle,
//   inputStyle,
//   resetButtonStyle,
//   stickyHeaderRowStyle,
//   tableContainerStyle,
//   checkboxDropdownStyle,
//   checkboxItemStyle,
//   customCheckboxStyle,
//   customCheckboxCheckedStyle,
//   selectWithDropdownStyle
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
//   const [matches, setMatches] = useState<Match[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [statistics, setStatistics] = useState<Statistics | null>(null);
//   const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
//   const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
//   const [showHome, setShowHome] = useState<boolean>(false);
//   const [showAway, setShowAway] = useState<boolean>(false);
//   const [selectedOneOs, setSelectedOneOs] = useState<string[]>([]);
//   const [selectedXOs, setSelectedXOs] = useState<string[]>([]);
//   const [selectedTwoOs, setSelectedTwoOs] = useState<string[]>([]);
//   const [selectedBtsOs, setSelectedBtsOs] = useState<string[]>([]);
//   const [selectedBtsNoOs, setSelectedBtsNoOs] = useState<string[]>([]);
//   const [selectedOverOs, setSelectedOverOs] = useState<string[]>([]);
//   const [selectedUnderOs, setSelectedUnderOs] = useState<string[]>([]);
//   const [selectedFirstHalfs, setSelectedFirstHalfs] = useState<string[]>([]);
//   const [selectedMatches, setSelectedMatches] = useState<string[]>([]);
//   const [selectedOneEs, setSelectedOneEs] = useState<string[]>([]);
//   const [selectedXEs, setSelectedXEs] = useState<string[]>([]);
//   const [selectedTwoEs, setSelectedTwoEs] = useState<string[]>([]);
//   const [selectedBtsEs, setSelectedBtsEs] = useState<string[]>([]);
//   const [selectedBtsNoEs, setSelectedBtsNoEs] = useState<string[]>([]);
//   const [selectedOverEs, setSelectedOverEs] = useState<string[]>([]);
//   const [selectedUnderEs, setSelectedUnderEs] = useState<string[]>([]);
//   const [selectedBtsResult, setSelectedBtsResult] = useState<string[]>([]);
//   const [selectedTotalGoals, setSelectedTotalGoals] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [searchResults, setSearchResults] = useState<string[]>([]);
//   const [uniqueLeagues, setUniqueLeagues] = useState<League[]>([]);
//   const [uniqueOneOs, setUniqueOneOs] = useState<string[]>([]);
//   const [uniqueXOs, setUniqueXOs] = useState<string[]>([]);
//   const [uniqueTwoOs, setUniqueTwoOs] = useState<string[]>([]);
//   const [uniqueBtsOs, setUniqueBtsOs] = useState<string[]>([]);
//   const [uniqueBtsNoOs, setUniqueBtsNoOs] = useState<string[]>([]);
//   const [uniqueOverOs, setUniqueOverOs] = useState<string[]>([]);
//   const [uniqueUnderOs, setUniqueUnderOs] = useState<string[]>([]);
//   const [uniqueFirstHalfs, setUniqueFirstHalfs] = useState<string[]>([]);
//   const [uniqueMatches, setUniqueMatches] = useState<string[]>([]);
//   const [uniqueOneEs, setUniqueOneEs] = useState<string[]>([]);
//   const [uniqueXEs, setUniqueXEs] = useState<string[]>([]);
//   const [uniqueTwoEs, setUniqueTwoEs] = useState<string[]>([]);
//   const [uniqueBtsEs, setUniqueBtsEs] = useState<string[]>([]);
//   const [uniqueBtsNoEs, setUniqueBtsNoEs] = useState<string[]>([]);
//   const [uniqueOverEs, setUniqueOverEs] = useState<string[]>([]);
//   const [uniqueUnderEs, setUniqueUnderEs] = useState<string[]>([]);
//   const [uniqueTeams, setUniqueTeams] = useState<string[]>([]);
//   const [allMatchesCache, setAllMatchesCache] = useState<Match[]>([]);
//   const [allStatisticsCache, setAllStatisticsCache] = useState<Statistics | null>(null);
//   const [showOneOCheckboxes, setShowOneOCheckboxes] = useState<boolean>(false);
//   const [showOneEsCheckboxes, setShowOneEsCheckboxes] = useState<boolean>(false);

//   // ПРАВИЛЬНЫЙ объект filters (соответствует свойствам Match)
//   const filters = {
//     one_o: selectedOneOs,
//     x_o: selectedXOs,
//     two_o: selectedTwoOs,
//     bts_o: selectedBtsOs,
//     bts_no_o: selectedBtsNoOs,
//     over_o: selectedOverOs,
//     under_o: selectedUnderOs,
//     first_half: selectedFirstHalfs,
//     match: selectedMatches,
//     one_e: selectedOneEs,
//     x_e: selectedXEs,
//     two_e: selectedTwoEs,
//     bts_e: selectedBtsEs,
//     bts_no_e: selectedBtsNoEs,
//     over_e: selectedOverEs,
//     under_e: selectedUnderEs,
//     // btsResult и totalGoals могут не быть в Match, нужно проверить
//     leagues: selectedLeagues,
//     team: selectedTeam
//   };

//   const topBlockRef = useRef<HTMLDivElement>(null);
//   const totalOptions = ['Over 1.5', 'Under 1.5', 'Over 2.5', 'Under 2.5', 'Over 3.5', 'Under 3.5'];

//   const getBaseLeagueName = (fullLeagueName: string): string => {
//     if (!fullLeagueName) return '';
//     return fullLeagueName.split(' - ')[0].trim();
//   };

//   // ИСПРАВЛЕННАЯ функция getAvailableOdds
//   const getAvailableOdds = (filterType: keyof typeof filters): string[] => {
//     try {
//       const anyFilters = filters as any;
//       const anyMatches = matches as any[];

//       // Если нет матчей, возвращаем пустой массив
//       if (anyMatches.length === 0) return [];

//       const otherFilterKeys = Object.keys(anyFilters)
//         .filter(key => key !== filterType && anyFilters[key].length > 0);

//       // Если в других фильтрах ничего не выбрано - возвращаем все уникальные значения
//       if (otherFilterKeys.length === 0) {
//         const allValues = anyMatches.map(match => {
//           const value = match[filterType];
//           return typeof value === 'number' ? value.toFixed(2) : String(value);
//         });
//         return [...new Set(allValues)].sort();
//       }

//       // Фильтруем матчи по выбранным значениям в других фильтрах
//       const filteredMatches = anyMatches.filter(match =>
//         otherFilterKeys.every(filterKey => {
//           const filterValues = anyFilters[filterKey];
//           const matchValue = match[filterKey];
//           return filterValues.includes(typeof matchValue === 'number' ? matchValue.toFixed(2) : String(matchValue));
//         })
//       );

//       // Получаем доступные значения для текущего фильтра
//       const availableValues = filteredMatches.map(match => {
//         const value = match[filterType];
//         return typeof value === 'number' ? value.toFixed(2) : String(value);
//       });

//       return [...new Set(availableValues)].sort();
//     } catch (error) {
//       console.error('Error in getAvailableOdds:', error, 'filterType:', filterType);
//       return [];
//     }
//   };

//   // Для фильтра 1(o) - используем правильное название свойства
//   const availableOneOs = useMemo(() => getAvailableOdds('one_o'), [filters, matches]);

//   // Для фильтра 1(e)
//   const availableOneEs = useMemo(() => getAvailableOdds('one_e'), [filters, matches]);

//   // ДОБАВЛЕН обработчик
//   // const handleOneOCheckboxChange = (oddValue: string) => {
//   //   setSelectedOneOs(prev =>
//   //     prev.includes(oddValue)
//   //       ? prev.filter(val => val !== oddValue)
//   //       : [...prev, oddValue]
//   //   );
//   // };

//   // const handleOneOCheckboxChange = (oddValue: string) => {
//   //   setSelectedOneOs(prev => {
//   //     const newSelection = prev.includes(oddValue)
//   //       ? prev.filter(val => val !== oddValue)
//   //       : [...prev, oddValue];
      
//   //     // Если сняли последнюю галочку - обновляем статистику
//   //     if (newSelection.length === 0) {
//   //       setTimeout(() => {
//   //         fetchStatisticsForAllMatches();
//   //       }, 100);
//   //     }
      
//   //     return newSelection;
//   //   });
//   // };

//   const handleCheckboxChange = (filterType: keyof typeof filters, value: string) => {
//     const setters: { [key in keyof typeof filters]: React.Dispatch<React.SetStateAction<string[]>> } = {
//       one_o: setSelectedOneOs,
//       x_o: setSelectedXOs,
//       two_o: setSelectedTwoOs,
//       bts_o: setSelectedBtsOs,
//       bts_no_o: setSelectedBtsNoOs,
//       over_o: setSelectedOverOs,
//       under_o: setSelectedUnderOs,
//       first_half: setSelectedFirstHalfs,
//       match: setSelectedMatches,
//       one_e: setSelectedOneEs,
//       x_e: setSelectedXEs,
//       two_e: setSelectedTwoEs,
//       bts_e: setSelectedBtsEs,
//       bts_no_e: setSelectedBtsNoEs,
//       over_e: setSelectedOverEs,
//       under_e: setSelectedUnderEs,
//       // bts_result: setSelectedBtsResult,
//       // total_goals: setSelectedTotalGoals,
//       leagues: setSelectedLeagues,
//       team: setSelectedTeam
//     };

//   const setter = setters[filterType];
//   if (setter) {
//     setter(prev => 
//       prev.includes(value) 
//         ? prev.filter(val => val !== value) 
//         : [...prev, value]
//     );
//   }
// };

//   {availableOneOs.map(odd => (
//     <div key={odd} style={checkboxItemStyle}>
//       <input
//         type="checkbox"
//         checked={selectedOneOs.includes(odd)}
//         // onChange={() => handleOneOCheckboxChange(odd)}
//         onChange={() => handleCheckboxChange('one_o', odd)}
//         style={{ 
//           ...customCheckboxStyle,
//           ...(selectedOneOs.includes(odd) ? customCheckboxCheckedStyle : {})
//         }}
//       />
//       <span>{odd}</span>
//     </div>
//   ))}

//   const fetchMatches = async (useCache: boolean = false) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Если используем кэш и он есть
//       if (useCache && allMatchesCache.length > 0 && allStatisticsCache) {
//         setMatches(allMatchesCache);
//         setStatistics(allStatisticsCache);
//         setLoading(false);
//         return;
//       }

//       const params = new URLSearchParams();
//       if (selectedLeagues.length > 0) params.append('league_id', selectedLeagues[0]);
//       if (selectedTeam.length > 0) {
//         params.append('team', selectedTeam[0]);
//         const locations = [];
//         if (showHome) locations.push('home');
//         if (showAway) locations.push('away');
//         if (locations.length > 0) params.append('location', locations.join(','));
//       }
//       if (selectedOneOs.length > 0) params.append('one_os', selectedOneOs.join(','));
//       if (selectedXOs.length > 0) params.append('x_os', selectedXOs.join(','));
//       if (selectedTwoOs.length > 0) params.append('two_os', selectedTwoOs.join(','));
//       if (selectedBtsOs.length > 0) params.append('bts_os', selectedBtsOs.join(','));
//       if (selectedBtsNoOs.length > 0) params.append('bts_no_os', selectedBtsNoOs.join(','));
//       if (selectedOverOs.length > 0) params.append('over_os', selectedOverOs.join(','));
//       if (selectedUnderOs.length > 0) params.append('under_os', selectedUnderOs.join(','));
//       if (selectedFirstHalfs.length > 0) params.append('first_halfs', selectedFirstHalfs.join(','));
//       if (selectedMatches.length > 0) params.append('matches', selectedMatches.join(','));
//       if (selectedOneEs.length > 0) params.append('one_es', selectedOneEs.join(','));
//       if (selectedXEs.length > 0) params.append('x_es', selectedXEs.join(','));
//       if (selectedTwoEs.length > 0) params.append('two_es', selectedTwoEs.join(','));
//       if (selectedBtsEs.length > 0) params.append('bts_es', selectedBtsEs.join(','));
//       if (selectedBtsNoEs.length > 0) params.append('bts_no_es', selectedBtsNoEs.join(','));
//       if (selectedOverEs.length > 0) params.append('over_es', selectedOverEs.join(','));
//       if (selectedUnderEs.length > 0) params.append('under_es', selectedUnderEs.join(','));
//       if (selectedBtsResult.length > 0) params.append('bts_result', selectedBtsResult[0]);
//       if (selectedTotalGoals.length > 0) params.append('total_goals', selectedTotalGoals[0]);

//       const [matchesResponse, statsResponse, allMatchesResponse] = await Promise.all([
//         axios.get<Match[]>(`http://localhost:8000/api/matches/?${params.toString()}`),
//         axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?${params.toString()}`),
//         axios.get<Match[]>(`http://localhost:8000/api/matches/`),
//          axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/`)
//       ]);

//       setMatches(matchesResponse.data);
//       setStatistics(statsResponse.data);

//       // Сохраняем в кэш
//       setAllMatchesCache(allMatchesResponse.data);
//       setAllStatisticsCache(statsResponse.data);

//       const leaguesMap = new Map<string, League>();
//       allMatchesResponse.data.forEach(match => {
//         if (match.league_id && match.league) {
//           leaguesMap.set(match.league_id, {
//             id: match.league_id,
//             name: getBaseLeagueName(match.league)
//           });
//         }
//       });

//       const sortedLeagues = Array.from(leaguesMap.values()).sort((a, b) => 
//         a.name.localeCompare(b.name)
//       );
//       setUniqueLeagues(sortedLeagues);

//       const homes = new Set<string>();
//       const aways = new Set<string>();
//       const oneOs = new Set<string>();
//       const xOs = new Set<string>();
//       const twoOs = new Set<string>();
//       const btsOs = new Set<string>();
//       const btsNoOs = new Set<string>();
//       const overOs = new Set<string>();
//       const underOs = new Set<string>();
//       const firstHalfs = new Set<string>();
//       const matchesResults = new Set<string>();
//       const oneEs = new Set<string>();
//       const xEs = new Set<string>();
//       const twoEs = new Set<string>();
//       const btsEs = new Set<string>();
//       const btsNoEs = new Set<string>();
//       const overEs = new Set<string>();
//       const underEs = new Set<string>();

//       allMatchesResponse.data.forEach(match => {
//         homes.add(match.home);
//         aways.add(match.away);
//         oneOs.add(match.one_o.toFixed(2));
//         xOs.add(match.x_o.toFixed(2));
//         twoOs.add(match.two_o.toFixed(2));
//         btsOs.add(match.bts_o.toFixed(2));
//         btsNoOs.add(match.bts_no_o.toFixed(2));
//         overOs.add(match.over_o.toFixed(2));
//         underOs.add(match.under_o.toFixed(2));
//         if (match.first_half) firstHalfs.add(match.first_half);
//         if (match.match) matchesResults.add(match.match);
//         oneEs.add(match.one_e.toFixed(2));
//         xEs.add(match.x_e.toFixed(2));
//         twoEs.add(match.two_e.toFixed(2));
//         btsEs.add(match.bts_e.toFixed(2));
//         btsNoEs.add(match.bts_no_e.toFixed(2));
//         overEs.add(match.over_e.toFixed(2));
//         underEs.add(match.under_e.toFixed(2));
//       });

//       setUniqueTeams(Array.from(new Set([...Array.from(homes), ...Array.from(aways)])).sort());
//       setUniqueOneOs(Array.from(oneOs).sort());
//       setUniqueXOs(Array.from(xOs).sort());
//       setUniqueTwoOs(Array.from(twoOs).sort());
//       setUniqueBtsOs(Array.from(btsOs).sort());
//       setUniqueBtsNoOs(Array.from(btsNoOs).sort());
//       setUniqueOverOs(Array.from(overOs).sort());
//       setUniqueUnderOs(Array.from(underOs).sort());
//       setUniqueFirstHalfs(Array.from(firstHalfs).sort());
//       setUniqueMatches(Array.from(matchesResults).sort());
//       setUniqueOneEs(Array.from(oneEs).sort());
//       setUniqueXEs(Array.from(xEs).sort());
//       setUniqueTwoEs(Array.from(twoEs).sort());
//       setUniqueBtsEs(Array.from(btsEs).sort());
//       setUniqueBtsNoEs(Array.from(btsNoEs).sort());
//       setUniqueOverEs(Array.from(overEs).sort());
//       setUniqueUnderEs(Array.from(underEs).sort());

//     } catch (err) {
//       setError('Failed to load data. Please try again later.');
//       console.error('Error loading data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (showOneOCheckboxes) {
//         const filterElement = document.querySelector('[data-one-o-filter]');
//         if (filterElement && !filterElement.contains(event.target as Node)) {
//           setShowOneOCheckboxes(false);
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showOneOCheckboxes]);

//   useEffect(() => {
//     const hasActiveFilters = 
//       selectedLeagues.length > 0 || selectedTeam.length > 0 || showHome || showAway ||
//       selectedOneOs.length > 0 || selectedXOs.length > 0 || selectedTwoOs.length > 0 ||
//       selectedBtsOs.length > 0 || selectedBtsNoOs.length > 0 || selectedOverOs.length > 0 ||
//       selectedUnderOs.length > 0 || selectedFirstHalfs.length > 0 || selectedMatches.length > 0 ||
//       selectedOneEs.length > 0 || selectedXEs.length > 0 || selectedTwoEs.length > 0 ||
//       selectedBtsEs.length > 0 || selectedBtsNoEs.length > 0 || selectedOverEs.length > 0 ||
//       selectedUnderEs.length > 0 || selectedBtsResult.length > 0 || selectedTotalGoals.length > 0;

//     fetchMatches(!hasActiveFilters);
//   }, [
//     selectedLeagues, selectedTeam, showHome, showAway,
//     selectedOneOs, selectedXOs, selectedTwoOs, selectedBtsOs, selectedBtsNoOs,
//     selectedOverOs, selectedUnderOs, selectedFirstHalfs, selectedMatches,
//     selectedOneEs, selectedXEs, selectedTwoEs, selectedBtsEs, selectedBtsNoEs,
//     selectedOverEs, selectedUnderEs, selectedBtsResult, selectedTotalGoals
//   ]);

//   const handleSelectChange = (
//     e: React.ChangeEvent<HTMLSelectElement>,
//     setter: React.Dispatch<React.SetStateAction<string[]>>
//   ) => {
//     const value = e.target.value;
//     if (value === '') {
//       setter([]);
//     } else {
//       setter([value]);
//     }
//   };

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
//     setSelectedXOs([]);
//     setSelectedTwoOs([]);
//     setSelectedBtsOs([]);
//     setSelectedBtsNoOs([]);
//     setSelectedOverOs([]);
//     setSelectedUnderOs([]);
//     setSelectedFirstHalfs([]);
//     setSelectedMatches([]);
//     setSelectedOneEs([]);
//     setSelectedXEs([]);
//     setSelectedTwoEs([]);
//     setSelectedBtsEs([]);
//     setSelectedBtsNoEs([]);
//     setSelectedOverEs([]);
//     setSelectedUnderEs([]);
//     setSelectedBtsResult([]);
//     setSelectedTotalGoals([]);
//     setShowHome(false);
//     setShowAway(false);
//     setShowOneOCheckboxes(false);

//     // Восстановление из кэша
//     if (allMatchesCache.length > 0 && allStatisticsCache) {
//       setMatches(allMatchesCache);
//       setStatistics(allStatisticsCache); // ← ВОТ ЭТОЙ СТРОКИ НЕ БЫЛО!
//     } else {
//       fetchMatches(true);
//     }

//     // Всегда делаем запрос для свежей статистики
//     fetchStatisticsForAllMatches();
//   };

//   const fetchStatisticsForAllMatches = async () => {
//     try {
//       const statsResponse = await axios.get<Statistics>(
//         'http://localhost:8000/api/matches/statistics/'
//       );
//       setStatistics(statsResponse.data);
//     } catch (err) {
//       console.error('Error loading statistics:', err);
//     }
//   };

//   // const handleOneOCheckboxChange = (oddValue: string) => {
//   //   if (selectedOneOs.includes(oddValue)) {
//   //     setSelectedOneOs(selectedOneOs.filter(val => val !== oddValue));
//   //   } else {
//   //     setSelectedOneOs([...selectedOneOs, oddValue]);
//   //   }
//   // };

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

//   // Загрузка данных при фильрации без черного экрана
//   <tbody>
//     {loading ? (
//       <tr>
//         <td colSpan={22} style={{ textAlign: 'center', padding: '20px' }}>
//           Loading data...
//         </td>
//       </tr>
//     ) : filteredMatches.length === 0 ? (
//       <tr>
//         <td colSpan={22} style={{ textAlign: 'center', padding: '20px' }}>
//           No matches found or access restricted.
//         </td>
//       </tr>
//     ) : (
//       filteredMatches.map(match => (
//         <tr key={match.id}>
//           {/* Ячейки с данными */}
//         </tr>
//       ))
//     )}
//   </tbody>

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
//             <div style={{ ...filterItemStyle, minWidth: '110px' }}>
//               <label htmlFor="selectLeagueFilter" style={labelStyle}>League</label>
//               <select
//                 id="selectLeagueFilter"
//                 value={selectedLeagues.length > 0 ? selectedLeagues[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedLeagues)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueLeagues.map(league => (
//                   <option key={league.id} value={league.id}>{league.name}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div style={{ ...filterItemStyle, minWidth: '110px', position: 'relative' }}>
//               <label htmlFor="teamSearchFilter" style={labelStyle}>Team</label>
//               <input
//                 id="teamSearchFilter"
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 placeholder="Search..."
//                 style={inputStyle}
//               />
//               {searchResults.length > 0 && searchTerm.length > 1 && (
//                 <ul style={searchResultsStyle}>
//                   {searchResults.map(team => (
//                     <li
//                       key={team}
//                       onClick={() => handleTeamSelect(team)}
//                       style={searchResultItemStyle}
//                     >
//                       {team}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div style={filterItemStyle}>
//               <div style={{ display: 'flex', gap: '5px', marginTop: '16px' }}>
//                 <label style={checkboxLabelStyle}>
//                   <input
//                     type="checkbox"
//                     checked={showHome}
//                     onChange={() => setShowHome(!showHome)}
//                     style={{ marginRight: '3px' }}
//                   />
//                   Home
//                 </label>
//                 <label style={checkboxLabelStyle}>
//                   <input
//                     type="checkbox"
//                     checked={showAway}
//                     onChange={() => setShowAway(!showAway)}
//                     style={{ marginRight: '3px' }}
//                   />
//                   Away
//                 </label>
//               </div>
//             </div>

//             {/* <div style={filterItemStyle}>
//               <label htmlFor="selectOneOFilter" style={labelStyle}>1(o)</label>
//               <select
//                 id="selectOneOFilter"
//                 value={selectedOneOs.length > 0 ? selectedOneOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedOneOs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueOneOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div> */}

//             <div style={{ ...filterItemStyle, position: 'relative' }} data-one-o-filter>
//               <label style={labelStyle}>1(o)</label>
//               <div style={{ position: 'relative' }}>
//                 <button
//                   onClick={() => setShowOneOCheckboxes(!showOneOCheckboxes)}
//                   style={selectWithDropdownStyle}
//                 >
//                   {selectedOneOs.length > 0 ? `${selectedOneOs.length} selected` : '\u00A0'}
//                 </button>
                
//                 {showOneOCheckboxes && (
//                   <div style={checkboxDropdownStyle}>
//                     {availableOneOs.map(odd => (
//                       <div key={odd} style={checkboxItemStyle}>
//                         <input
//                           type="checkbox"
//                           checked={selectedOneOs.includes(odd)}
//                           // onChange={() => handleOneOCheckboxChange(odd)}
//                           onChange={() => handleCheckboxChange('one_o', odd)}
//                           style={{ 
//                             ...customCheckboxStyle,
//                             ...(selectedOneOs.includes(odd) ? customCheckboxCheckedStyle : {})
//                           }}
//                         />
//                         <span>{odd}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

            
//             <div style={filterItemStyle}>
//               <label htmlFor="selectOneEFilter" style={labelStyle}>1(e)</label>
//               <select
//                 id="selectOneEFilter"
//                 value={selectedOneEs.length > 0 ? selectedOneEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedOneEs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {availableOneEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>


//             <div style={filterItemStyle}>
//               <label htmlFor="selectXoFilter" style={labelStyle}>X(o)</label>
//               <select
//                 id="selectXoFilter"
//                 value={selectedXOs.length > 0 ? selectedXOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedXOs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueXOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectXeFilter" style={labelStyle}>X(e)</label>
//               <select
//                 id="selectXeFilter"
//                 value={selectedXEs.length > 0 ? selectedXEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedXEs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueXEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectTwoOFilter" style={labelStyle}>2(o)</label>
//               <select
//                 id="selectTwoOFilter"
//                 value={selectedTwoOs.length > 0 ? selectedTwoOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedTwoOs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueTwoOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectTwoEFilter" style={labelStyle}>2(e)</label>
//               <select
//                 id="selectTwoEFilter"
//                 value={selectedTwoEs.length > 0 ? selectedTwoEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedTwoEs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueTwoEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectBtsOFilter" style={labelStyle}>BTS(o)</label>
//               <select
//                 id="selectBtsOFilter"
//                 value={selectedBtsOs.length > 0 ? selectedBtsOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsOs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueBtsOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectBtsEFilter" style={labelStyle}>BTS(e)</label>
//               <select
//                 id="selectBtsEFilter"
//                 value={selectedBtsEs.length > 0 ? selectedBtsEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsEs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueBtsEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectBtsNoOFilter" style={labelStyle}>BTS_no(o)</label>
//               <select
//                 id="selectBtsNoOFilter"
//                 value={selectedBtsNoOs.length > 0 ? selectedBtsNoOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsNoOs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueBtsNoOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectBtsNoEFilter" style={labelStyle}>BTS_no(e)</label>
//               <select
//                 id="selectBtsNoEFilter"
//                 value={selectedBtsNoEs.length > 0 ? selectedBtsNoEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsNoEs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueBtsNoEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectOverOFilter" style={labelStyle}>Over(o)</label>
//               <select
//                 id="selectOverOFilter"
//                 value={selectedOverOs.length > 0 ? selectedOverOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedOverOs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueOverOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectOverEFilter" style={labelStyle}>Over(e)</label>
//               <select
//                 id="selectOverEFilter"
//                 value={selectedOverEs.length > 0 ? selectedOverEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedOverEs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueOverEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectUnderOFilter" style={labelStyle}>Under(o)</label>
//               <select
//                 id="selectUnderOFilter"
//                 value={selectedUnderOs.length > 0 ? selectedUnderOs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedUnderOs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueUnderOs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectUnderEFilter" style={labelStyle}>Under(e)</label>
//               <select
//                 id="selectUnderEFilter"
//                 value={selectedUnderEs.length > 0 ? selectedUnderEs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedUnderEs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueUnderEs.map(odd => (
//                   <option key={odd} value={odd}>{odd}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectFirstHalfFilter" style={labelStyle}>1H</label>
//               <select
//                 id="selectFirstHalfFilter"
//                 value={selectedFirstHalfs.length > 0 ? selectedFirstHalfs[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedFirstHalfs)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueFirstHalfs.map(score => (
//                   <option key={score} value={score}>{score}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectMatchFilter" style={labelStyle}>FT</label>
//               <select
//                 id="selectMatchFilter"
//                 value={selectedMatches.length > 0 ? selectedMatches[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedMatches)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {uniqueMatches.map(score => (
//                   <option key={score} value={score}>{score}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectBtsResultFilter" style={labelStyle}>BTS</label>
//               <select
//                 id="selectBtsResultFilter"
//                 value={selectedBtsResult.length > 0 ? selectedBtsResult[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedBtsResult)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             </div>

//             <div style={filterItemStyle}>
//               <label htmlFor="selectTotalGoalsFilter" style={labelStyle}>Total</label>
//               <select
//                 id="selectTotalGoalsFilter"
//                 value={selectedTotalGoals.length > 0 ? selectedTotalGoals[0] : ''}
//                 onChange={(e) => handleSelectChange(e, setSelectedTotalGoals)}
//                 style={selectStyle}
//               >
//                 <option value=""></option>
//                 {totalOptions.map(option => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             </div>

//             <div style={{ ...filterItemStyle, minWidth: '80px', marginTop: '16px' }}>
//               <button 
//                 onClick={handleResetFilters} 
//                 style={resetButtonStyle}
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>

//       <div style={tableContainerStyle}>
//         <table style={tableStyle}>
//           <thead>
//             <tr style={stickyHeaderRowStyle}>
//               <th style={{  minWidth: '120px' }}>Date</th>
//               <th style={{  minWidth: '90px' }}>Home</th>
//               <th style={{  minWidth: '90px' }}>Away</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>1(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>1(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>X(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>X(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>2(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>2(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>BTS(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>BTS(e)</th> 
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>B_no(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>B_no(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>O_2.5(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>O_2.5(e)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>U_2.5(o)</th>
//               <th style={{ ...verticalHeaderStyle, ...fixedWidthColumnStyle }}>U_2.5(e)</th>
//               <th style={{  ...fixedWidthColumnStyle }}>1H</th>
//               <th style={{  ...fixedWidthColumnStyle }}>FT</th>
//               <th>League</th>
//             </tr>
//           </thead>
//           <tbody>
//               {matches.map(match => {
//                 const matchDate = new Date(match.date);
//                 // const formattedDate = matchDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
//                 // const formattedTime = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//                 const day = matchDate.getDate().toString().padStart(2, '0');
//                 const month = (matchDate.getMonth() + 1).toString().padStart(2, '0');
//                 const year = matchDate.getFullYear();
//                 const hours = matchDate.getHours().toString().padStart(2, '0');
//                 const minutes = matchDate.getMinutes().toString().padStart(2, '0');

//                 const formattedDateTime = `${day}.${month}.${year}  ${hours}:${minutes}`;
//                 return (
//                   <tr key={match.id}>
//                     <td style={cellStyle}>{`${formattedDateTime}`}</td>
//                     <td style={cellStyle}>{match.home}</td>
//                     <td style={cellStyle}>{match.away}</td>
//                     <td style={cellStyle}>{match.one_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.one_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.x_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.x_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.two_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.two_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.bts_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.bts_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.bts_no_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.bts_no_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.over_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.over_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.under_o.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.under_e.toFixed(2)}</td>
//                     <td style={cellStyle}>{match.first_half || '-'}</td>
//                     <td style={cellStyle}>{match.match || '-'}</td>
//                     <td style={cellStyle_2} title={match.league}>{getFullLeagueName(match.league)}</td>
//                   </tr>
//                 );
//               })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MatchList;


// MatchList.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
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
  // selectStyle,
  inputStyle,
  resetButtonStyle,
  stickyHeaderRowStyle,
  tableContainerStyle,
  checkboxDropdownStyle,
  checkboxItemStyle,
  customCheckboxStyle,
  customCheckboxCheckedStyle,
  selectWithDropdownStyle,
  checkboxDropdownWideStyle // ← ДОБАВЬТЕ ЭТОТ ИМПОРТ
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
  // Основные состояния
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
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
  // const [statsLoading, setStatsLoading] = useState<boolean>(false);

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
  // Уникальные значения для BTS и Total (фиксированные массивы)
  // const [uniqueBtsResult] = useState<string[]>(['Yes', 'No']);
  // const [uniqueTotalGoals] = useState<string[]>(['Over 1.5', 'Under 1.5', 'Over 2.5', 'Under 2.5', 'Over 3.5', 'Under 3.5']);

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

  const topBlockRef = useRef<HTMLDivElement>(null);
  // const totalOptions = ['Over 1.5', 'Under 1.5', 'Over 2.5', 'Under 2.5', 'Over 3.5', 'Under 3.5'];

  const getBaseLeagueName = (fullLeagueName: string): string => {
    if (!fullLeagueName) return '';
    return fullLeagueName.split(' - ')[0].trim();
  };

  // const getAvailableOdds = (filterType: keyof typeof filters): string[] => {
  //   try {
  //     const anyFilters = filters as any;
  //     const anyMatches = matches as any[];

  //     if (anyMatches.length === 0) return [];

  //     const otherFilterKeys = Object.keys(anyFilters)
  //       .filter(key => key !== filterType && anyFilters[key].length > 0);

  //     if (otherFilterKeys.length === 0) {
  //       const allValues = anyMatches.map(match => {
  //         const value = match[filterType];
  //         return typeof value === 'number' ? value.toFixed(2) : String(value);
  //       });
  //       return [...new Set(allValues)].sort();
  //     }

  //     const filteredMatches = anyMatches.filter(match =>
  //       otherFilterKeys.every(filterKey => {
  //         const filterValues = anyFilters[filterKey];
  //         const matchValue = match[filterKey];
  //         return filterValues.includes(typeof matchValue === 'number' ? matchValue.toFixed(2) : String(matchValue));
  //       })
  //     );

  //     const availableValues = filteredMatches.map(match => {
  //       const value = match[filterType];
  //       return typeof value === 'number' ? value.toFixed(2) : String(value);
  //     });

  //     return [...new Set(availableValues)].sort();
  //   } catch (error) {
  //     console.error('Error in getAvailableOdds:', error, 'filterType:', filterType);
  //     return [];
  //   }
  // };

  // // Available values для всех фильтров
  // const availableOneOs = useMemo(() => getAvailableOdds('one_o'), [filters, matches]);
  // const availableOneEs = useMemo(() => getAvailableOdds('one_e'), [filters, matches]);
  // const availableXOs = useMemo(() => getAvailableOdds('x_o'), [filters, matches]);
  // const availableXEs = useMemo(() => getAvailableOdds('x_e'), [filters, matches]);
  // const availableTwoOs = useMemo(() => getAvailableOdds('two_o'), [filters, matches]);
  // const availableTwoEs = useMemo(() => getAvailableOdds('two_e'), [filters, matches]);
  // const availableBtsOs = useMemo(() => getAvailableOdds('bts_o'), [filters, matches]);
  // const availableBtsEs = useMemo(() => getAvailableOdds('bts_e'), [filters, matches]);
  // const availableBtsNoOs = useMemo(() => getAvailableOdds('bts_no_o'), [filters, matches]);
  // const availableBtsNoEs = useMemo(() => getAvailableOdds('bts_no_e'), [filters, matches]);
  // const availableOverOs = useMemo(() => getAvailableOdds('over_o'), [filters, matches]);
  // const availableOverEs = useMemo(() => getAvailableOdds('over_e'), [filters, matches]);
  // const availableUnderOs = useMemo(() => getAvailableOdds('under_o'), [filters, matches]);
  // const availableUnderEs = useMemo(() => getAvailableOdds('under_e'), [filters, matches]);
  // const availableFirstHalfs = useMemo(() => getAvailableOdds('first_half'), [filters, matches]);
  // const availableMatches = useMemo(() => getAvailableOdds('match'), [filters, matches]);
  // const availableBtsResult = useMemo(() => ['Yes', 'No'], []);
  // const availableTotalGoals = useMemo(() => totalOptions, []);

  // const handleCheckboxChange = (filterType: keyof typeof filters, value: string) => {
  //   const setters: { [key in keyof typeof filters]: React.Dispatch<React.SetStateAction<string[]>> } = {
  //     one_o: setSelectedOneOs,
  //     one_e: setSelectedOneEs,
  //     x_o: setSelectedXOs,
  //     x_e: setSelectedXEs,
  //     two_o: setSelectedTwoOs,
  //     two_e: setSelectedTwoEs,
  //     bts_o: setSelectedBtsOs,
  //     bts_e: setSelectedBtsEs,
  //     bts_no_o: setSelectedBtsNoOs,
  //     bts_no_e: setSelectedBtsNoEs,
  //     over_o: setSelectedOverOs,
  //     over_e: setSelectedOverEs,
  //     under_o: setSelectedUnderOs,
  //     under_e: setSelectedUnderEs,
  //     first_half: setSelectedFirstHalfs,
  //     match: setSelectedMatches,
  //     bts_result: setSelectedBtsResult, 
  //     total_goals: setSelectedTotalGoals, 
  //     leagues: setSelectedLeagues,
  //     team: setSelectedTeam
  //   } as any;

  //   const setter = setters[filterType];
  //   if (setter) {
  //     setter(prev => 
  //       prev.includes(value) 
  //         ? prev.filter(val => val !== value) 
  //         : [...prev, value]
  //     );
  //   }
  // };

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

  // const fetchMatches = async (useCache: boolean = false) => {
  //   try {
  //     setLoading(true);
  //     setStatsLoading(true);
  //     setError(null);

  //     if (useCache && allMatchesCache.length > 0 && allStatisticsCache) {
  //       setMatches(allMatchesCache);
  //       setStatistics(allStatisticsCache);
  //       setLoading(false);
  //       setStatsLoading(false);
  //       return;
  //     }

  //     let allMatchesData: Match[] = []; // ← ОБЪЯВЛЯЕМ ПЕРЕМЕННУЕ ЗАРАНЕЕ
  //     let allStatsData: Statistics | null = null;

  //     if (selectedLeagues.length > 0) {
  //       // Множественный выбор лиг
  //       const matchesPromises = selectedLeagues.map(leagueId => 
  //         axios.get<Match[]>(`http://localhost:8000/api/matches/?league_id=${leagueId}`)
  //       );
  //       const matchesResponses = await Promise.all(matchesPromises);
  //       const allMatches = matchesResponses.flatMap(response => response.data);
  //       setMatches(allMatches);

  //       const statsPromises = selectedLeagues.map(leagueId =>
  //         axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?league_id=${leagueId}`)
  //       );
  //       const statsResponses = await Promise.all(statsPromises);
        
  //       const combinedStats = statsResponses.reduce((acc, response) => {
  //         const stats = response.data;
  //         return {
  //           total_matches: acc.total_matches + stats.total_matches,
  //           home_wins_count: acc.home_wins_count + stats.home_wins_count,
  //           draws_count: acc.draws_count + stats.draws_count,
  //           away_wins_count: acc.away_wins_count + stats.away_wins_count,
  //           bts_yes_count: acc.bts_yes_count + stats.bts_yes_count,
  //           bts_no_count: acc.bts_no_count + stats.bts_no_count,
  //           over_count: acc.over_count + stats.over_count,
  //           under_count: acc.under_count + stats.under_count,
  //           roi_home: (acc.roi_home + stats.roi_home) / (acc.total_matches > 0 ? 2 : 1),
  //           roi_draw: (acc.roi_draw + stats.roi_draw) / (acc.total_matches > 0 ? 2 : 1),
  //           roi_away: (acc.roi_away + stats.roi_away) / (acc.total_matches > 0 ? 2 : 1),
  //           roi_bts_yes: (acc.roi_bts_yes + stats.roi_bts_yes) / (acc.total_matches > 0 ? 2 : 1),
  //           roi_bts_no: (acc.roi_bts_no + stats.roi_bts_no) / (acc.total_matches > 0 ? 2 : 1),
  //           roi_over: (acc.roi_over + stats.roi_over) / (acc.total_matches > 0 ? 2 : 1),
  //           roi_under: (acc.roi_under + stats.roi_under) / (acc.total_matches > 0 ? 2 : 1),
  //         };
  //       }, {
  //          total_matches: 0,
  //         home_wins_count: 0,
  //         draws_count: 0,
  //         away_wins_count: 0,
  //         bts_yes_count: 0,
  //         bts_no_count: 0,
  //         over_count: 0,
  //         under_count: 0,
  //         roi_home: 0,
  //         roi_draw: 0,
  //         roi_away: 0,
  //         roi_bts_yes: 0,
  //         roi_bts_no: 0,
  //         roi_over: 0,
  //         roi_under: 0,
  //       });

  //       setStatistics(combinedStats);

  //       // Загружаем данные для кэша
  //       const [allMatchesResponse, allStatsResponse] = await Promise.all([
  //         axios.get<Match[]>(`http://localhost:8000/api/matches/`),
  //         axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/`)
  //       ]);

  //       allMatchesData = allMatchesResponse.data; // ← СОХРАНЯЕМ ДАННЫЕ
  //       allStatsData = allStatsResponse.data;
  //       setAllMatchesCache(allMatchesData);
  //       setAllStatisticsCache(allStatsData);

  //     } else {
  //       // Стандартная загрузка
  //       const params = new URLSearchParams();
  //       // ... добавление параметров фильтров ...
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

  //       const [matchesResponse, statsResponse, allMatchesResponse, allStatsResponse] = await Promise.all([
  //         axios.get<Match[]>(`http://localhost:8000/api/matches/?${params.toString()}`),
  //         axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?${params.toString()}`),
  //         axios.get<Match[]>(`http://localhost:8000/api/matches/`),
  //         axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/`)
  //       ]);

  //       setMatches(matchesResponse.data);
  //       setStatistics(statsResponse.data);
        
  //       allMatchesData = allMatchesResponse.data; // ← СОХРАНЯЕМ ДАННЫЕ
  //       allStatsData = allStatsResponse.data;
  //       setAllMatchesCache(allMatchesData);
  //       setAllStatisticsCache(allStatsData);
  //     }

  //     // ТЕПЕРЬ ИСПОЛЬЗУЕМ allMatchesData вместо allMatchesResponse.data
  //     const leaguesMap = new Map<string, League>();
  //     allMatchesData.forEach((match: Match) => {
  //       if (match.league_id && match.league) {
  //         leaguesMap.set(match.league_id, {
  //           id: match.league_id,
  //           name: getBaseLeagueName(match.league)
  //         });
  //       }
  //     });

  //     const sortedLeagues = Array.from(leaguesMap.values()).sort((a, b) => 
  //       a.name.localeCompare(b.name)
  //     );
  //     setUniqueLeagues(sortedLeagues);

  //     // АНАЛОГИЧНО ДЛЯ ВСЕХ УНИКАЛЬНЫХ ЗНАЧЕНИЙ
  //     const homes = new Set<string>();
  //     const aways = new Set<string>();
  //     const oneOs = new Set<string>();
  //     const oneEs = new Set<string>();
  //     const xOs = new Set<string>();
  //     const xEs = new Set<string>();
  //     const twoOs = new Set<string>();
  //     const twoEs = new Set<string>();
  //     const btsOs = new Set<string>();
  //     const btsEs = new Set<string>();
  //     const btsNoOs = new Set<string>();
  //     const btsNoEs = new Set<string>();
  //     const overOs = new Set<string>();
  //     const overEs = new Set<string>();
  //     const underOs = new Set<string>();
  //     const underEs = new Set<string>();
  //     const firstHalfs = new Set<string>();
  //     const matchesResults = new Set<string>();

  //     allMatchesData.forEach((match: Match) => {
  //       homes.add(match.home);
  //       aways.add(match.away);
  //       oneOs.add(match.one_o.toFixed(2));
  //       oneEs.add(match.one_e.toFixed(2));
  //       xOs.add(match.x_o.toFixed(2));
  //       xEs.add(match.x_e.toFixed(2));
  //       twoOs.add(match.two_o.toFixed(2));
  //       twoEs.add(match.two_e.toFixed(2));
  //       btsOs.add(match.bts_o.toFixed(2));
  //       btsEs.add(match.bts_e.toFixed(2));
  //       btsNoOs.add(match.bts_no_o.toFixed(2));
  //       btsNoEs.add(match.bts_no_e.toFixed(2));
  //       overOs.add(match.over_o.toFixed(2));
  //       overEs.add(match.over_e.toFixed(2));
  //       underOs.add(match.under_o.toFixed(2));
  //       underEs.add(match.under_e.toFixed(2));
  //       if (match.first_half) firstHalfs.add(match.first_half);
  //       if (match.match) matchesResults.add(match.match);
  //     });

  //     setUniqueTeams(Array.from(new Set([...Array.from(homes), ...Array.from(aways)])).sort());
  //     setUniqueOneOs(Array.from(oneOs).sort());
  //     setUniqueOneEs(Array.from(oneEs).sort());
  //     setUniqueXOs(Array.from(xOs).sort());
  //     setUniqueXEs(Array.from(xEs).sort());
  //     setUniqueTwoOs(Array.from(twoOs).sort());
  //     setUniqueTwoEs(Array.from(twoEs).sort());
  //     setUniqueBtsOs(Array.from(btsOs).sort());
  //     setUniqueBtsEs(Array.from(btsEs).sort());
  //     setUniqueBtsNoOs(Array.from(btsNoOs).sort());
  //     setUniqueBtsNoEs(Array.from(btsNoEs).sort());
  //     setUniqueOverOs(Array.from(overOs).sort());
  //     setUniqueOverEs(Array.from(overEs).sort());
  //     setUniqueUnderOs(Array.from(underOs).sort());
  //     setUniqueUnderEs(Array.from(underEs).sort());
  //     setUniqueFirstHalfs(Array.from(firstHalfs).sort());
  //     setUniqueMatches(Array.from(matchesResults).sort());

  //   } catch (err) {
  //     setError('Failed to load data. Please try again later.');
  //     console.error('Error loading data:', err);
  //   } finally {
  //     setLoading(false);
  //     setStatsLoading(false);
  //   }
  // };

  // const fetchMatches = async (useCache: boolean = false) => {
  //   try {
  //     setLoading(true);
  //     setStatsLoading(true);
  //     setError(null);

  //     if (useCache && allMatchesCache.length > 0 && allStatisticsCache) {
  //       setMatches(allMatchesCache);
  //       setStatistics(allStatisticsCache);
  //       setLoading(false);
  //       setStatsLoading(false);
  //       return;
  //     }

  //     const params = new URLSearchParams();
      
  //     // ВСЕ ФИЛЬТРЫ В ОДНОМ ЗАПРОСЕ
  //     if (selectedLeagues.length > 0) {
  //       params.append('league_ids', selectedLeagues.join(','));
  //     }
  //     if (selectedTeam.length > 0) {
  //       params.append('team', selectedTeam[0]);
  //       const locations = [];
  //       if (showHome) locations.push('home');
  //       if (showAway) locations.push('away');
  //       if (locations.length > 0) params.append('location', locations.join(','));
  //     }
  //     if (selectedOneOs.length > 0) params.append('one_os', selectedOneOs.join(','));
  //     if (selectedOneEs.length > 0) params.append('one_es', selectedOneEs.join(','));
  //     if (selectedXOs.length > 0) params.append('x_os', selectedXOs.join(','));
  //     if (selectedXEs.length > 0) params.append('x_es', selectedXEs.join(','));
  //     if (selectedTwoOs.length > 0) params.append('two_os', selectedTwoOs.join(','));
  //     if (selectedTwoEs.length > 0) params.append('two_es', selectedTwoEs.join(','));
  //     if (selectedBtsOs.length > 0) params.append('bts_os', selectedBtsOs.join(','));
  //     if (selectedBtsEs.length > 0) params.append('bts_es', selectedBtsEs.join(','));
  //     if (selectedBtsNoOs.length > 0) params.append('bts_no_os', selectedBtsNoOs.join(','));
  //     if (selectedBtsNoEs.length > 0) params.append('bts_no_es', selectedBtsNoEs.join(','));
  //     if (selectedOverOs.length > 0) params.append('over_os', selectedOverOs.join(','));
  //     if (selectedOverEs.length > 0) params.append('over_es', selectedOverEs.join(','));
  //     if (selectedUnderOs.length > 0) params.append('under_os', selectedUnderOs.join(','));
  //     if (selectedUnderEs.length > 0) params.append('under_es', selectedUnderEs.join(','));
  //     if (selectedFirstHalfs.length > 0) params.append('first_halfs', selectedFirstHalfs.join(','));
  //     if (selectedMatches.length > 0) params.append('matches', selectedMatches.join(','));
  //     if (selectedBtsResult.length > 0) params.append('bts_result', selectedBtsResult.join(','));
  //     if (selectedTotalGoals.length > 0) params.append('total_goals', selectedTotalGoals.join(','));

  //     // ЕДИНЫЙ ЗАПРОС ДЛЯ ВСЕХ ФИЛЬТРОВ
  //     const [matchesResponse, statsResponse, allMatchesResponse, allStatsResponse] = await Promise.all([
  //       axios.get<Match[]>(`http://localhost:8000/api/matches/?${params.toString()}`),
  //       axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?${params.toString()}`),
  //       axios.get<Match[]>(`http://localhost:8000/api/matches/`),
  //       axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/`)
  //     ]);

  //     setMatches(matchesResponse.data);
  //     setStatistics(statsResponse.data);
  //     setAllMatchesCache(allMatchesResponse.data);
  //     setAllStatisticsCache(allStatsResponse.data);

  //     // ... остальная логика для уникальных значений ...
  //     const allMatchesData = allMatchesResponse.data;

  //     const homes = new Set<string>();
  //     const aways = new Set<string>();
  //     const oneOs = new Set<string>();
  //     const oneEs = new Set<string>();
  //     const xOs = new Set<string>();
  //     const xEs = new Set<string>();
  //     const twoOs = new Set<string>();
  //     const twoEs = new Set<string>();
  //     const btsOs = new Set<string>();
  //     const btsEs = new Set<string>();
  //     const btsNoOs = new Set<string>();
  //     const btsNoEs = new Set<string>();
  //     const overOs = new Set<string>();
  //     const overEs = new Set<string>();
  //     const underOs = new Set<string>();
  //     const underEs = new Set<string>();
  //     const firstHalfs = new Set<string>();
  //     const matchesResults = new Set<string>();
      
  //     const leaguesMap = new Map<string, League>();
  //     allMatchesData.forEach((match: Match) => {
  //       if (match.league_id && match.league) {
  //         leaguesMap.set(match.league_id, {
  //           id: match.league_id,
  //           name: getBaseLeagueName(match.league)
  //         });
  //       }
      

  //       // Команды
  //       homes.add(match.home);
  //       aways.add(match.away);
        
  //       // Коэффициенты
  //       oneOs.add(match.one_o.toFixed(2));
  //       oneEs.add(match.one_e.toFixed(2));
  //       xOs.add(match.x_o.toFixed(2));
  //       xEs.add(match.x_e.toFixed(2));
  //       twoOs.add(match.two_o.toFixed(2));
  //       twoEs.add(match.two_e.toFixed(2));
  //       btsOs.add(match.bts_o.toFixed(2));
  //       btsEs.add(match.bts_e.toFixed(2));
  //       btsNoOs.add(match.bts_no_o.toFixed(2));
  //       btsNoEs.add(match.bts_no_e.toFixed(2));
  //       overOs.add(match.over_o.toFixed(2));
  //       overEs.add(match.over_e.toFixed(2));
  //       underOs.add(match.under_o.toFixed(2));
  //       underEs.add(match.under_e.toFixed(2));
        
  //       // Результаты
  //       if (match.first_half) firstHalfs.add(match.first_half);
  //       if (match.match) matchesResults.add(match.match);
  //     });

  //     const sortedLeagues = Array.from(leaguesMap.values()).sort((a, b) => 
  //       a.name.localeCompare(b.name)
  //     );
  //     setUniqueLeagues(sortedLeagues);
  //     setUniqueTeams(Array.from(new Set([...Array.from(homes), ...Array.from(aways)])).sort());
  //     setUniqueOneOs(Array.from(oneOs).sort());
  //     setUniqueOneEs(Array.from(oneEs).sort());
  //     setUniqueXOs(Array.from(xOs).sort());
  //     setUniqueXEs(Array.from(xEs).sort());
  //     setUniqueTwoOs(Array.from(twoOs).sort());
  //     setUniqueTwoEs(Array.from(twoEs).sort());
  //     setUniqueBtsOs(Array.from(btsOs).sort());
  //     setUniqueBtsEs(Array.from(btsEs).sort());
  //     setUniqueBtsNoOs(Array.from(btsNoOs).sort());
  //     setUniqueBtsNoEs(Array.from(btsNoEs).sort());
  //     setUniqueOverOs(Array.from(overOs).sort());
  //     setUniqueOverEs(Array.from(overEs).sort());
  //     setUniqueUnderOs(Array.from(underOs).sort());
  //     setUniqueUnderEs(Array.from(underEs).sort());

  //     // Уникальные результаты
  //     setUniqueFirstHalfs(Array.from(firstHalfs).sort());
  //     setUniqueMatches(Array.from(matchesResults).sort());

  //   } catch (err) {
  //     setError('Failed to load data. Please try again later.');
  //     console.error('Error loading data:', err);
  //   } finally {
  //     setLoading(false);
  //     setStatsLoading(false);
  //   }
  // };

  const fetchMatches = async (useCache: boolean = false) => {
    try {
      setLoading(true);
      // setStatsLoading(true);
      setError(null);

      if (useCache && allMatchesCache.length > 0 && allStatisticsCache) {
        setMatches(allMatchesCache);
        setStatistics(allStatisticsCache);
        setLoading(false);
        // setStatsLoading(false);
        return;
      }

      const params = new URLSearchParams();
      let allMatchesData: Match[] = [];
      // let allStatsData: Statistics | null = null;

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
          axios.get<Match[]>(`http://localhost:8000/api/matches/?league_id=${leagueId}&${params.toString()}`)
        );
        const matchesResponses = await Promise.all(matchesPromises);
        const allMatches = matchesResponses.flatMap(response => response.data);
        setMatches(allMatches);

        const statsPromises = selectedLeagues.map(leagueId =>
          axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?league_id=${leagueId}&${params.toString()}`)
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
        const [matchesResponse, statsResponse, allMatchesResponse] = await Promise.all([
          axios.get<Match[]>(`http://localhost:8000/api/matches/?${params.toString()}`),
          axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/?${params.toString()}`),
          axios.get<Match[]>(`http://localhost:8000/api/matches/`),
          axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/`)
        ]);

        setMatches(matchesResponse.data);
        setStatistics(statsResponse.data);
        allMatchesData = allMatchesResponse.data;
        // allStatsData = allStatsResponse.data;
      }

      // ЗАГРУЖАЕМ ДАННЫЕ ДЛЯ КЭША И УНИКАЛЬНЫХ ЗНАЧЕНИЙ
      const [allMatchesResponse, allStatsResponse] = await Promise.all([
        axios.get<Match[]>(`http://localhost:8000/api/matches/`),
        axios.get<Statistics>(`http://localhost:8000/api/matches/statistics/`)
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
        
        // Команды
        homes.add(match.home);
        aways.add(match.away);
        
        // Коэффициенты
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
        
        // Результаты
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
      // setStatsLoading(false);
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

  // const handleSelectChange = (
  //   e: React.ChangeEvent<HTMLSelectElement>,
  //   setter: React.Dispatch<React.SetStateAction<string[]>>
  // ) => {
  //   const value = e.target.value;
  //   if (value === '') {
  //     setter([]);
  //   } else {
  //     setter([value]);
  //   }
  // };

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
      axios.get<Statistics>('http://localhost:8000/api/matches/statistics/')
        .then(response => setStatistics(response.data))
        .catch(err => console.error('Error loading statistics:', err));
    } else {
      fetchMatches(true);
    }

    // if (allMatchesCache.length > 0 && allStatisticsCache) {
    //   setMatches(allMatchesCache);
    //   setStatistics(allStatisticsCache);
    // } else {
    //   fetchMatches(true);
    // }

    // fetchStatisticsForAllMatches();
  };

  const fetchStatisticsForAllMatches = async () => {
    try {
      const statsResponse = await axios.get<Statistics>(
        'http://localhost:8000/api/matches/statistics/'
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

  // const renderCheckboxFilter = (
  //   label: string,
  //   selectedValues: string[],
  //   availableValues: string[],
  //   filterType: keyof typeof filters,
  //   showDropdown: boolean,
  //   setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>,
  //   dataAttribute: string
  // ) => (
  //   <div style={{
  //     ...filterItemStyle,
  //     ...(filterType === 'leagues' && { 
  //       minWidth: '250px'
  //     })
  //   }} data-attribute={dataAttribute}>
  //     <label style={labelStyle}>{label}</label>
  //     <div style={{ position: 'relative' }}>
  //       <button
  //         onClick={() => setShowDropdown(!showDropdown)}
  //         style={selectWithDropdownStyle}
  //       >
  //         {selectedValues.length > 0 ? `${selectedValues.length} selected` : '\u00A0'}
  //       </button>
        
  //       {showDropdown && (
  //          <div style={filterType === 'leagues' ? checkboxDropdownWideStyle : 
  //          filterType === 'total_goals' ? 
  //         { ...checkboxDropdownStyle, minWidth: '100px' } : // ← Явная ширина для Total
  //         checkboxDropdownStyle}> 
  //           {availableValues.map(value => {
  //             const displayValue = filterType === 'leagues' 
  //               ? uniqueLeagues.find(league => league.id === value)?.name || value
  //               : value;
                
  //             return (
  //               <div key={value} style={{
  //                 ...checkboxItemStyle,
  //                 whiteSpace: 'nowrap' as const,
  //                 overflow: 'hidden',
  //                 textOverflow: 'ellipsis'
  //               }}>
  //                 <input
  //                   type="checkbox"
  //                   checked={selectedValues.includes(value)}
  //                   onChange={() => handleCheckboxChange(filterType, value)}
  //                   style={{ 
  //                     ...customCheckboxStyle,
  //                     ...(selectedValues.includes(value) ? customCheckboxCheckedStyle : {})
  //                   }}
  //                 />
  //                 <span title={displayValue}>{displayValue}</span>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

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

  // Загрузка данных при фильрации без черного экрана
  <tbody>
    {loading ? (
      <tr>
        <td colSpan={22} style={{ textAlign: 'center', padding: '20px' }}>
          Loading data...
        </td>
      </tr>
    ) : filteredMatches.length === 0 ? (
      <tr>
        <td colSpan={22} style={{ textAlign: 'center', padding: '20px' }}>
          No matches found or access restricted.
        </td>
      </tr>
    ) : (
      filteredMatches.map(match => (
        <tr key={match.id}>
          {/* Ячейки с данными */}
        </tr>
      ))
    )}
  </tbody>

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '10px' }}>
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
        <th style={{ minWidth: '90px' }}>Home</th>
        <th style={{ minWidth: '90px' }}>Away</th>
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
        <th>League</th>
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

// весь код с разными вариантами функций