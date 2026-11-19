"""Web-grounded fact checks for the talk, with Gemini and Google Search grounding.

    python3 scripts/research.py plan/research/queries.json      writes plan/research/<name>.md for each query

Each answer keeps the URLs Gemini's search returned, so SOURCES.md can cite them. Needs GEMINI_API_KEY.
"""
import json, os, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'plan' / 'research'
MODEL = os.environ.get('RESEARCH_MODEL', 'gemini-pro-latest')
client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])


def ask(name, query):
    cfg = types.GenerateContentConfig(tools=[types.Tool(google_search=types.GoogleSearch())], temperature=0.2)
    r = client.models.generate_content(model=MODEL, contents=query, config=cfg)
    links = []
    for c in r.candidates or []:
        g = c.grounding_metadata
        for ch in (g.grounding_chunks or []) if g else []:
            if ch.web:
                links.append(f'- [{ch.web.title}]({ch.web.uri})')
    text = f'# {name}\n\nModel: {MODEL}\n\n## Query\n\n{query}\n\n## Answer\n\n{r.text}\n\n## Search results used\n\n' + '\n'.join(dict.fromkeys(links)) + '\n'
    (OUT / f'{name}.md').write_text(text)
    return name, len(r.text or '')


if __name__ == '__main__':
    queries = json.loads(Path(sys.argv[1]).read_text())
    only = sys.argv[2:]
    with ThreadPoolExecutor(8) as ex:
        for name, n in ex.map(lambda kv: ask(*kv), [(k, v) for k, v in queries.items() if not only or k in only]):
            print(name, n, 'chars')
