"""Daily mean PM2.5 for ten Indian cities, January 2025 to October 2026: the table the data-analyst agent works on.

    python3 scripts/sci/make_aq_csv.py        writes notebook/data/india_pm25_daily.csv

Values are CAMS model estimates (Copernicus Atmosphere Monitoring Service) served by the Open-Meteo air-quality API
(https://open-meteo.com/en/docs/air-quality-api, data CC BY 4.0). They are modelled, not station readings.
"""
import csv
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'notebook' / 'data' / 'india_pm25_daily.csv'
CITIES = {  # name: (latitude, longitude)
    'Delhi': (28.61, 77.21), 'Lucknow': (26.85, 80.95), 'Patna': (25.59, 85.14), 'Kolkata': (22.57, 88.36),
    'Ahmedabad': (23.03, 72.58), 'Gandhinagar': (23.22, 72.65), 'Mumbai': (19.08, 72.88), 'Pune': (18.52, 73.86),
    'Bengaluru': (12.97, 77.59), 'Chennai': (13.08, 80.27)}
START, END = '2025-01-01', '2026-10-31'

rows = []
for city, (lat, lon) in CITIES.items():
    r = requests.get('https://air-quality-api.open-meteo.com/v1/air-quality', timeout=60,
                     headers={'User-Agent': 'ai-agents-talk/1.0 (educational)'},
                     params={'latitude': lat, 'longitude': lon, 'hourly': 'pm2_5', 'start_date': START, 'end_date': END,
                             'timezone': 'Asia/Kolkata'})
    r.raise_for_status()
    h = r.json()['hourly']
    days = {}
    for t, v in zip(h['time'], h['pm2_5']):
        if v is not None:
            days.setdefault(t[:10], []).append(v)
    for d in sorted(days):
        if len(days[d]) >= 18:                     # keep days with most hours present
            rows.append((d, city, round(sum(days[d]) / len(days[d]), 1)))
    print(city, len(days), 'days')

OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open('w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['date', 'city', 'pm25'])
    w.writerows(rows)
assert len({r[1] for r in rows}) == len(CITIES)
assert all(0 <= r[2] < 1500 for r in rows)
print(OUT, len(rows), 'rows')
