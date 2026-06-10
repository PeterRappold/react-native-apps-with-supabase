#!/usr/bin/env python3
import json
import shlex
from pathlib import Path

SKILLS_DIR = Path(__file__).parent


def load_skills():
    skills = {}
    for p in SKILLS_DIR.glob('*.json'):
        try:
            data = json.loads(p.read_text())
            trigger = data.get('trigger')
            if trigger:
                skills[trigger] = data
        except Exception as e:
            print(f'Failed to load {p.name}: {e}')
    return skills


def parse_invoke(invocation: str):
    # invocation example: /agent command="deploy" options={"env":"staging"}
    parts = shlex.split(invocation)
    if not parts:
        return None, {}
    trigger = parts[0]
    args = {}
    for token in parts[1:]:
        if '=' not in token:
            continue
        k, v = token.split('=', 1)
        # try JSON parse for object/strings/numbers
        try:
            parsed = json.loads(v)
        except Exception:
            # strip quotes if present
            parsed = v.strip('"')
        args[k] = parsed
    return trigger, args


if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print('Usage: run_skill.py "/agent command=... options={...}"')
        sys.exit(2)

    invocation = sys.argv[1]
    skills = load_skills()
    trigger, args = parse_invoke(invocation)

    if trigger not in skills:
        print('No skill for trigger:', trigger)
        print('Available triggers:', ', '.join(sorted(skills.keys())))
        sys.exit(1)

    skill = skills[trigger]
    print('Invoking skill:', skill.get('id'))
    print('Name:', skill.get('name'))
    print('Agent mode:', bool(skill.get('agent')))
    print('Parsed args:')
    print(json.dumps(args, indent=2, ensure_ascii=False))
    # simple validation against declared inputs
    inputs = skill.get('inputs', [])
    missing = []
    for inp in inputs:
        if inp.get('required') and inp.get('name') not in args:
            missing.append(inp.get('name'))
    if missing:
        print('Missing required inputs:', missing)
        sys.exit(3)

    print('Skill invocation appears valid (syntactic check).')
