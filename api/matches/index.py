from http.server import BaseHTTPRequestHandler
import json
import os
from supabase import create_client, Client
from urllib.parse import parse_qs, urlparse
import time

def get_supabase_client():
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_ANON_KEY')
    return create_client(url, key)

def parse_float_list(param_str):
    """Парсит строку с числами через запятую в список float"""
    if not param_str:
        return []
    return [float(o.strip()) for o in param_str.split(',') if o.strip().replace('.', '', 1).isdigit()]

def parse_string_list(param_str):
    """Парсит строку через запятую в список строк"""
    if not param_str:
        return []
    return [s.strip() for s in param_str.split(',')]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            start_time = time.time()
            
            # Парсим URL и параметры
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query) if parsed_url.query else {}
            
            # Извлекаем первое значение из списка для каждого параметра
            params = {}
            for key, value_list in query_params.items():
                params[key] = value_list[0] if value_list else None
            
            supabase = get_supabase_client()
            
            # Начальный запрос к таблице new_main_league с сортировкой по дате
            query = supabase.table('new_main_league').select('*').order('date', desc=True)
            
            # 1. Фильтр по league_id (основной)
            if params.get('league_id'):
                try:
                    league_id = int(params['league_id'])
                    query = query.eq('league_id', league_id)
                except (ValueError, TypeError):
                    query = query.eq('league_id', params['league_id'])
            
            # 2. Фильтр по лигам (частичное совпадение)
            if params.get('leagues'):
                leagues_list = parse_string_list(params['leagues'])
                # Для каждой лиги используем ilike
                if len(leagues_list) == 1:
                    query = query.ilike('league', f'{leagues_list[0]}*')
                else:
                    # Для нескольких лиг делаем OR условие через RPC или несколько запросов
                    # Пока оставим простую фильтрацию на стороне клиента
                    pass
            
            # 3. Фильтр по команде и локации
            if params.get('team'):
                team = params['team']
                location = params.get('location', '').lower()
                
                if location:
                    locations = location.split(',')
                    if 'home' in locations and 'away' in locations:
                        # Обе локации - ищем в обеих полях
                        query = query.or_(f'home.ilike.%{team}%,away.ilike.%{team}%')
                    elif 'home' in locations:
                        query = query.ilike('home', f'%{team}%')
                    elif 'away' in locations:
                        query = query.ilike('away', f'%{team}%')
                else:
                    # Без указания локации - ищем в обеих полях
                    query = query.or_(f'home.ilike.%{team}%,away.ilike.%{team}%')
            
            # 4. Фильтры по коэффициентам (odds)
            odds_filters = {
                'one_os': 'one_o',
                'x_os': 'x_o', 
                'two_os': 'two_o',
                'bts_os': 'bts_o',
                'bts_no_os': 'bts_no_o',
                'over_os': 'over_o',
                'under_os': 'under_o'
            }
            
            for param_key, db_field in odds_filters.items():
                if params.get(param_key):
                    odds_list = parse_float_list(params[param_key])
                    if odds_list:
                        query = query.in_(db_field, odds_list)
            
            # 5. Фильтры по ожидаемым значениям (expected)
            expected_filters = {
                'one_es': 'one_e',
                'x_es': 'x_e',
                'two_es': 'two_e', 
                'bts_es': 'bts_e',
                'bts_no_es': 'bts_no_e',
                'over_es': 'over_e',
                'under_es': 'under_e'
            }
            
            for param_key, db_field in expected_filters.items():
                if params.get(param_key):
                    expected_list = parse_float_list(params[param_key])
                    if expected_list:
                        query = query.in_(db_field, expected_list)
            
            # 6. Фильтры по счетам
            if params.get('first_halfs'):
                first_halfs = parse_string_list(params['first_halfs'])
                if first_halfs:
                    query = query.in_('first_half', first_halfs)
            
            if params.get('matches'):
                matches_filter = parse_string_list(params['matches'])
                if matches_filter:
                    query = query.in_('match', matches_filter)
            
            # Выполняем основной запрос
            response = query.execute()
            matches = response.data
            
            # Дополнительная фильтрация на стороне клиента для сложных условий
            
            # Фильтр: только матчи с корректным форматом счета
            filtered_matches = []
            for match in matches:
                if match.get('match') and ' - ' in str(match['match']):
                    # Проверяем, что это действительно счет (цифра - цифра)
                    import re
                    if re.match(r'^\d+\s*-\s*\d+$', str(match['match'])):
                        filtered_matches.append(match)
            matches = filtered_matches
            
            # Фильтр по нескольким лигам (если не обработан в SQL)
            if params.get('leagues'):
                leagues_list = parse_string_list(params['leagues'])
                if len(leagues_list) > 1:
                    league_filtered = []
                    for match in matches:
                        league_name = match.get('league', '')
                        for league in leagues_list:
                            if league.lower() in league_name.lower():
                                league_filtered.append(match)
                                break
                    matches = league_filtered
            
            # Фильтр по BTS результату
            if params.get('bts_result'):
                bts_filter = params['bts_result'].lower()
                bts_filtered = []
                for match in matches:
                    if match.get('match') and ' - ' in str(match['match']):
                        try:
                            scores = str(match['match']).split(' - ')
                            home_score = int(scores[0].strip())
                            away_score = int(scores[1].strip())
                            
                            bts_result = (home_score > 0 and away_score > 0)
                            
                            if bts_filter == 'yes' and bts_result:
                                bts_filtered.append(match)
                            elif bts_filter == 'no' and not bts_result:
                                bts_filtered.append(match)
                        except (ValueError, IndexError):
                            continue
                matches = bts_filtered
            
            # Фильтр по общему количеству голов
            if params.get('total_goals'):
                total_goals_filter = params['total_goals']
                goals_filtered = []
                for match in matches:
                    if match.get('match') and ' - ' in str(match['match']):
                        try:
                            scores = str(match['match']).split(' - ')
                            home_score = int(scores[0].strip())
                            away_score = int(scores[1].strip())
                            total_goals = home_score + away_score
                            
                            value_str = total_goals_filter.replace('Over ', '').replace('Under ', '')
                            value = float(value_str)
                            
                            if 'Over' in total_goals_filter and total_goals > value:
                                goals_filtered.append(match)
                            elif 'Under' in total_goals_filter and total_goals < value:
                                goals_filtered.append(match)
                        except (ValueError, IndexError):
                            continue
                matches = goals_filtered
            
            end_time = time.time()
            print(f"Matches API execution time: {end_time - start_time:.4f} seconds")
            
            # Отправляем ответ
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(matches).encode('utf-8'))
            
        except Exception as e:
            print(f"Error in matches API: {str(e)}")
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
