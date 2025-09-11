from http.server import BaseHTTPRequestHandler
import json
import os
from urllib.parse import urlparse

# Импортируем ваши существующие модули
from matches import handler as matches_handler_class
from statistics import handler as stats_handler_class

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        try:
            if '/matches/statistics' in path:
                # Статистика
                stats_handler = stats_handler_class()
                stats_handler.path = self.path
                stats_handler.headers = self.headers
                stats_handler.wfile = self.wfile
                stats_handler.send_response = self.send_response
                stats_handler.send_header = self.send_header
                stats_handler.end_headers = self.end_headers
                return stats_handler.do_GET()
                
            elif '/matches' in path:
                # Матчи
                matches_handler = matches_handler_class()
                matches_handler.path = self.path
                matches_handler.headers = self.headers
                matches_handler.wfile = self.wfile
                matches_handler.send_response = self.send_response
                matches_handler.send_header = self.send_header
                matches_handler.end_headers = self.end_headers
                return matches_handler.do_GET()
                
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Not Found'}).encode())
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()