from http.server import BaseHTTPRequestHandler
import json
import os
from supabase import create_client, Client
from urllib.parse import parse_qs, urlparse
import re

def get_supabase_client():
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_ANON_KEY')
    return create_client(url, key)

def parse_float_list(param_str):
    if not param_str:
        return []
    return [float(o.strip()) for o in param_str.split(',') if o.strip().replace('.', '', 1).isdigit()]

def parse_string_list(param_str):
    if not param_str:
        return []
    return [s.strip() for s in param_str.split(',')]

def get_filtered_matches(params):
    """Получает отфильтрованные матчи (та же логика что в matches.py)"""
    supabase = get_supabase_client()
    query = supabase.table('new_main_league').select('*').order('date', desc=True)
    
    # Применяем все те же фильтры что в matches.py
    # (копируем логику фильтрации)
    
    # 1. Фильтр по league_id
    if params.get('league_id'):
        try:
            league_id = int(params['league_id'])
            query = query.eq('league_id', league_id)
        except (ValueError, TypeError):
            query = query.eq('league_id', params['league_id'])
    
    # 2-6. Остальные фильтры (копируем из matches.py)
    # ... [все фильтры из matches.py] ...
    
    response = query.execute()
    matches = response.data
    
    # Применяем клиентские фильтры
    filtered_matches = []
    for match in matches:
        if match.get('match') and ' - ' in str(match['match']):
            if re.match(r'^\d+\s*-\s*\d+$', str(match['match'])):
                filtered_matches.append(match)
    
    return filtered_matches

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Парсим параметры
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query) if parsed_url.query else {}
            
            params = {}
            for key, value_list in query_params.items():
                params[key] = value_list[0] if value_list else None
            
            # Получаем отфильтрованные матчи
            matches = get_filtered_matches(params)
            
            total_matches = len(matches)
            
            stats = {
                'total_matches': total_matches,
                'home_wins_count': 0,
                'draws_count': 0,
                'away_wins_count': 0,
                'bts_yes_count': 0,
                'bts_no_count': 0,
                'over_count': 0,
                'under_count': 0,
                'roi_home': 0.0,
                'roi_draw': 0.0,
                'roi_away': 0.0,
                'roi_bts_yes': 0.0,
                'roi_bts_no': 0.0,
                'roi_over': 0.0,
                'roi_under': 0.0,
            }
            
            # Переменные для ROI расчетов
            total_stake_home = 0
            total_profit_home = 0
            total_stake_draw = 0
            total_profit_draw = 0
            total_stake_away = 0
            total_profit_away = 0
            total_stake_bts_yes = 0
            total_profit_bts_yes = 0
            total_stake_bts_no = 0
            total_profit_bts_no = 0
            total_stake_over = 0
            total_profit_over = 0
            total_stake_under = 0
            total_profit_under = 0
            
            # Проходим по каждому матчу для расчета статистики
            for match in matches:
                home_score = None
                away_score = None
                total_goals = None
                
                if match.get('match') and ' - ' in str(match['match']):
                    try:
                        scores = str(match['match']).split(' - ')
                        home_score = int(scores[0].strip())
                        away_score = int(scores[1].strip())
                        total_goals = home_score + away_score
                    except (ValueError, IndexError):
                        continue
                
                if home_score is not None and away_score is not None:
                    # Победа дома (P1)
                    if match.get('one_e') and match['one_e'] > 0:
                        total_stake_home += 1
                        if home_score > away_score:
                            stats['home_wins_count'] += 1
                            total_profit_home += (match['one_e'] - 1)
                        else:
                            total_profit_home -= 1
                    
                    # Ничья (X)
                    if match.get('x_e') and match['x_e'] > 0:
                        total_stake_draw += 1
                        if home_score == away_score:
                            stats['draws_count'] += 1
                            total_profit_draw += (match['x_e'] - 1)
                        else:
                            total_profit_draw -= 1
                    
                    # Победа в гостях (P2)
                    if match.get('two_e') and match['two_e'] > 0:
                        total_stake_away += 1
                        if home_score < away_score:
                            stats['away_wins_count'] += 1
                            total_profit_away += (match['two_e'] - 1)
                        else:
                            total_profit_away -= 1
                    
                    # BTS (Обе забьют)
                    bts_result = (home_score > 0 and away_score > 0)
                    
                    if match.get('bts_e') and match['bts_e'] > 0:
                        total_stake_bts_yes += 1
                        if bts_result:
                            stats['bts_yes_count'] += 1
                            total_profit_bts_yes += (match['bts_e'] - 1)
                        else:
                            total_profit_bts_yes -= 1
                    
                    if match.get('bts_no_e') and match['bts_no_e'] > 0:
                        total_stake_bts_no += 1
                        if not bts_result:
                            stats['bts_no_count'] += 1
                            total_profit_bts_no += (match['bts_no_e'] - 1)
                        else:
                            total_profit_bts_no -= 1
                    
                    # Тотал (Over/Under 2.5)
                    if total_goals is not None:
                        if match.get('over_e') and match['over_e'] > 0:
                            total_stake_over += 1
                            if total_goals > 2.5:
                                stats['over_count'] += 1
                                total_profit_over += (match['over_e'] - 1)
                            else:
                                total_profit_over -= 1
                        
                        if match.get('under_e') and match['under_e'] > 0:
                            total_stake_under += 1
                            if total_goals < 2.5:
                                stats['under_count'] += 1
                                total_profit_under += (match['under_e'] - 1)
                            else:
                                total_profit_under -= 1
            
            # Вычисляем ROI
            if total_stake_home > 0:
                stats['roi_home'] = total_profit_home
            if total_stake_draw > 0:
                stats['roi_draw'] = total_profit_draw
            if total_stake_away > 0:
                stats['roi_away'] = total_profit_away
            if total_stake_bts_yes > 0:
                stats['roi_bts_yes'] = total_profit_bts_yes
            if total_stake_bts_no > 0:
                stats['roi_bts_no'] = total_profit_bts_no
            if total_stake_over > 0:
                stats['roi_over'] = total_profit_over
            if total_stake_under > 0:
                stats['roi_under'] = total_profit_under
            
            # Отправляем ответ
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(stats).encode('utf-8'))
            
        except Exception as e:
            print(f"Error in statistics API: {str(e)}")
            self.send_error_response(500, str(e))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {'error': message}
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
