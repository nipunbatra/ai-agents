"""Illustrations for the part breaks and the application slides, in one flat style, with Gemini's image model.

    python3 scripts/make_images.py                  every image in plan/images.json that is missing
    python3 scripts/make_images.py app-coding ...   just these (overwrites)

Writes figures/<name>.jpg. Needs GEMINI_API_KEY. The prompts and the style line are in plan/images.json; each image
was generated, not drawn by hand, and is credited as such on the slides.
"""
import io, json, os, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPEC = json.loads((ROOT / 'plan' / 'images.json').read_text())
MODEL = os.environ.get('IMAGE_MODEL', SPEC['model'])
client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])


def make(item):
    name, prompt, aspect = item['name'], item['prompt'], item.get('aspect', '1:1')
    out = ROOT / 'figures' / f'{name}.jpg'
    for attempt in range(3):
        try:
            r = client.models.generate_content(
                model=MODEL, contents=f"{prompt}\n\nStyle: {SPEC['style']}",
                config=types.GenerateContentConfig(response_modalities=['IMAGE'],
                                                   image_config=types.ImageConfig(aspect_ratio=aspect)))
            for part in r.candidates[0].content.parts:
                if part.inline_data:
                    im = Image.open(io.BytesIO(part.inline_data.data)).convert('RGB')
                    im.thumbnail((1024, 1024))
                    im.save(out, quality=86)
                    return name, im.size
        except Exception as e:
            err = e
    return name, f'FAILED: {err if "err" in dir() else "no image"}'


if __name__ == '__main__':
    only = sys.argv[1:]
    items = [i for i in SPEC['images'] if (i['name'] in only) if only] if only else \
        [i for i in SPEC['images'] if not (ROOT / 'figures' / f"{i['name']}.jpg").exists()]
    with ThreadPoolExecutor(6) as ex:
        for name, res in ex.map(make, items):
            print(name, res)
