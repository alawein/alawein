import os, sys
sys.stdout.reconfigure(encoding='utf-8')
from datetime import date

data = {
    'adil':               {'ssot': 'MISSING',    'last_commit': '2026-04-16', 'commits': 12,  'ci': 6,  'has_git': True,  'pkg': 'py'},
    'alawein':            {'ssot': '2026-04-15',  'last_commit': '2026-04-19', 'commits': 272, 'ci': 16, 'has_git': True,  'pkg': 'none'},
    'alembiq':            {'ssot': '2026-03-27',  'last_commit': '2026-04-17', 'commits': 31,  'ci': 6,  'has_git': True,  'pkg': 'py'},
    'atelier-rounaq':     {'ssot': '2026-03-09',  'last_commit': '2026-04-09', 'commits': 37,  'ci': 10, 'has_git': True,  'pkg': 'ts'},
    'attributa':          {'ssot': '2026-03-09',  'last_commit': '2026-04-16', 'commits': 44,  'ci': 13, 'has_git': True,  'pkg': 'ts'},
    'bolts':              {'ssot': '2026-03-09',  'last_commit': '2026-04-16', 'commits': 55,  'ci': 6,  'has_git': True,  'pkg': 'ts'},
    'chshlab':            {'ssot': '2026-03-27',  'last_commit': '2026-04-06', 'commits': 66,  'ci': 1,  'has_git': True,  'pkg': 'ts'},
    'design-system':      {'ssot': '2026-04-08',  'last_commit': '2026-04-21', 'commits': 57,  'ci': 8,  'has_git': True,  'pkg': 'ts'},
    'edfp':               {'ssot': '2026-03-09',  'last_commit': '2026-04-17', 'commits': 35,  'ci': 6,  'has_git': True,  'pkg': 'py'},
    'fallax':             {'ssot': '2026-04-16',  'last_commit': '2026-04-19', 'commits': 49,  'ci': 3,  'has_git': True,  'pkg': 'py'},
    'gymboy':             {'ssot': '2026-03-09',  'last_commit': '2026-04-16', 'commits': 153, 'ci': 6,  'has_git': True,  'pkg': 'ts'},
    'helios':             {'ssot': '2026-03-09',  'last_commit': '2026-03-25', 'commits': 16,  'ci': 1,  'has_git': True,  'pkg': 'none'},
    'jobs-projects':      {'ssot': 'MISSING',    'last_commit': 'N/A',        'commits': 0,   'ci': 0,  'has_git': False, 'pkg': 'none'},
    'knowledge-base':     {'ssot': '2026-04-15',  'last_commit': '2026-04-15', 'commits': 29,  'ci': 9,  'has_git': True,  'pkg': 'ts'},
    'llmworks':           {'ssot': '2026-03-09',  'last_commit': '2026-04-16', 'commits': 43,  'ci': 7,  'has_git': True,  'pkg': 'ts'},
    'loopholelab':        {'ssot': 'MISSING',    'last_commit': '2026-04-08', 'commits': 21,  'ci': 4,  'has_git': True,  'pkg': 'ts'},
    'maglogic':           {'ssot': '2026-03-09',  'last_commit': '2026-03-25', 'commits': 22,  'ci': 3,  'has_git': True,  'pkg': 'py'},
    'meatheadphysicist':  {'ssot': '2026-03-09',  'last_commit': '2026-04-17', 'commits': 54,  'ci': 12, 'has_git': True,  'pkg': 'py'},
    'meshal-web':         {'ssot': '2026-04-13',  'last_commit': '2026-04-22', 'commits': 263, 'ci': 7,  'has_git': True,  'pkg': 'ts'},
    'optiqap':            {'ssot': '2026-04-10',  'last_commit': '2026-04-18', 'commits': 97,  'ci': 9,  'has_git': True,  'pkg': 'py'},
    'provegate':          {'ssot': 'MISSING',    'last_commit': '2026-04-04', 'commits': 6,   'ci': 5,  'has_git': True,  'pkg': 'py'},
    'qmatsim':            {'ssot': '2026-03-09',  'last_commit': '2026-04-04', 'commits': 16,  'ci': 4,  'has_git': True,  'pkg': 'py'},
    'qmlab':              {'ssot': '2026-03-09',  'last_commit': '2026-04-16', 'commits': 36,  'ci': 9,  'has_git': True,  'pkg': 'ts'},
    'quantumalgo':        {'ssot': '2026-04-08',  'last_commit': 'NO_CODE_COMMITS', 'commits': 0, 'ci': 0, 'has_git': False, 'pkg': 'py'},
    'qubeml':             {'ssot': '2026-03-09',  'last_commit': '2026-04-04', 'commits': 16,  'ci': 3,  'has_git': True,  'pkg': 'py'},
    'repz':               {'ssot': '2026-03-09',  'last_commit': '2026-04-16', 'commits': 66,  'ci': 17, 'has_git': True,  'pkg': 'ts'},
    'roka-oakland-hustle': {'ssot': '2026-04-16', 'last_commit': '2026-04-04', 'commits': 3,   'ci': 0,  'has_git': True,  'pkg': 'ts'},
    'scicomp':            {'ssot': '2026-03-09',  'last_commit': '2026-04-03', 'commits': 41,  'ci': 3,  'has_git': True,  'pkg': 'py'},
    'scribd':             {'ssot': '2026-03-09',  'last_commit': '2026-04-16', 'commits': 38,  'ci': 13, 'has_git': True,  'pkg': 'ts'},
    'simcore':            {'ssot': '2026-03-09',  'last_commit': '2026-04-19', 'commits': 48,  'ci': 10, 'has_git': True,  'pkg': 'ts'},
    'spincirc':           {'ssot': '2026-03-09',  'last_commit': '2026-03-25', 'commits': 13,  'ci': 3,  'has_git': True,  'pkg': 'py'},
    'workspace-tools':    {'ssot': '2026-04-15',  'last_commit': '2026-04-17', 'commits': 41,  'ci': 5,  'has_git': True,  'pkg': 'ts'},
}

GREEN_CUTOFF = date(2026, 2, 22)
YELLOW_CUTOFF = date(2025, 10, 26)

def parse_date(s):
    try:
        return date.fromisoformat(s[:10])
    except:
        return None

def classify(r, d):
    ssot = d['ssot']
    ssot_date = parse_date(ssot) if ssot != 'MISSING' else None
    commits = d['commits']
    ci = d['ci']
    has_git = d['has_git']
    last_commit = d['last_commit']

    if not has_git:
        return 'RED', 'no git repo'
    if ci == 0:
        return 'RED', 'no CI workflows'
    if last_commit in ('N/A', 'NO_CODE_COMMITS'):
        return 'RED', 'no code commits'
    if ssot_date is None:
        return 'RED', 'SSOT missing'
    if ssot_date < YELLOW_CUTOFF:
        return 'RED', 'SSOT older than 180 days (' + ssot + ')'
    if ssot_date >= GREEN_CUTOFF and commits > 0 and ci > 0:
        return 'GREEN', 'SSOT=' + ssot + ', commits=' + str(commits) + ', ci=' + str(ci)
    if YELLOW_CUTOFF <= ssot_date < GREEN_CUTOFF:
        return 'YELLOW', 'SSOT ' + ssot + ' is 61-180 days old'
    return 'YELLOW', 'SSOT=' + ssot + ', commits=' + str(commits)

print('=== HEALTH CLASSIFICATIONS ===')
counts = {'GREEN': 0, 'YELLOW': 0, 'RED': 0}
for r in sorted(data.keys()):
    d = data[r]
    color, reason = classify(r, d)
    counts[color] += 1
    print(r + ': ' + color + ' (' + reason + ')')

print()
print('Total repos: ' + str(len(data)))
print('GREEN: ' + str(counts['GREEN']) + '  YELLOW: ' + str(counts['YELLOW']) + '  RED: ' + str(counts['RED']))
