"""Build notebook/agents.ipynb from notebook/agents.py (cells marked with "# %%"), and optionally run it.

    python3 scripts/build_notebook.py            build only
    RECORD_DIR=data/traces ~/base/bin/python scripts/build_notebook.py --run
                                                 build, run every cell with the Gemini key from the environment,
                                                 keep the outputs, and write the traces the slides use to data/traces/
"""
import os, re, sys
from pathlib import Path
import nbformat

ROOT = Path(__file__).resolve().parents[1]
SRC, OUT = ROOT / 'notebook' / 'agents.py', ROOT / 'notebook' / 'agents.ipynb'
COLAB = 'https://colab.research.google.com/github/nipunbatra/ai-agents/blob/main/notebook/agents.ipynb'

cells = []
for block in re.split(r'^# %%', SRC.read_text(), flags=re.M)[1:]:
    head, _, body = block.partition('\n')
    if head.strip().startswith('[markdown]'):
        text = '\n'.join(re.sub(r'^# ?', '', line) for line in body.strip('\n').split('\n'))
        cell = nbformat.v4.new_markdown_cell(text)
        anchor = re.search(r'<a id="([\w-]+)"', text)
        if anchor:                                   # Colab's #scrollTo= finds a cell by its id
            cell.id = anchor.group(1)
        cells.append(cell)
    else:
        cells.append(nbformat.v4.new_code_cell(body.strip('\n')))
badge = f'[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)]({COLAB})'
cells[0].source = cells[0].source.replace('\n', f'\n\n{badge}\n', 1)
nb = nbformat.v4.new_notebook(cells=cells, metadata={
    'kernelspec': {'name': 'python3', 'display_name': 'Python 3', 'language': 'python'},
    'language_info': {'name': 'python'}, 'colab': {'provenance': []}})

if '--run' in sys.argv:
    from nbclient import NotebookClient
    if os.environ.get('RECORD_DIR'):
        os.environ['RECORD_DIR'] = str((ROOT / os.environ['RECORD_DIR']).resolve())
    os.environ.pop('GOOGLE_API_KEY', None)          # use GEMINI_API_KEY, as a reader would
    NotebookClient(nb, timeout=900, kernel_name='python3', resources={'metadata': {'path': str(ROOT / 'notebook')}}).execute()
nbformat.write(nb, OUT)
print(OUT, len(cells), 'cells', '(run)' if '--run' in sys.argv else '')
