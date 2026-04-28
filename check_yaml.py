import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('profile-from-guides.yaml', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

# Check 2: Block scalar (| format) in bio_short and bio_long
bio_short_start = None
bio_long_start = None
for i, line in enumerate(lines):
    if line.startswith('bio_short: |'):
        bio_short_start = i
    if line.startswith('bio_long: |'):
        bio_long_start = i

print(f"Check 2 - bio_short uses pipe format: PASS (line {bio_short_start + 1})" if bio_short_start else "Check 2 - FAIL")
print(f"Check 2 - bio_long uses pipe format: PASS (line {bio_long_start + 1})" if bio_long_start else "Check 2 - FAIL")

# Check 3: Unicode characters (middle dot and emdash)
has_bullet = '·' in content
has_emdash = '—' in content
print(f"Check 3 - Contains middle dot (·): {'PASS' if has_bullet else 'FAIL'}")
print(f"Check 3 - Contains emdash (—): {'PASS' if has_emdash else 'FAIL'}")

# Check 4: Trailing whitespace on block scalar lines
block_issues = []
in_bio_block = False
for i, line in enumerate(lines):
    if line.startswith('bio_short: |') or line.startswith('bio_long: |'):
        in_bio_block = True
    elif in_bio_block and line and not line.startswith(' '):
        in_bio_block = False
    
    if in_bio_block and line and line[-1] in ' \t':
        block_issues.append((i+1, line))

if block_issues:
    print(f"Check 4 - Trailing whitespace: FAIL ({len(block_issues)} lines found)")
    for line_num, line_text in block_issues[:3]:
        print(f"  Line {line_num}")
else:
    print("Check 4 - No trailing whitespace: PASS")

# Check 5: research_rows with citations
import re
research_lines = '\n'.join([l for l in lines if 'research_rows' in '\n'.join(lines[max(0,i-10):i+10])])
desc_count = len(re.findall(r'description: ".*·.*"', content))
star_count = len(re.findall(r'\*\w+\*', content))
print(f"Check 5 - research_rows with middle dot citations: PASS ({desc_count} found)" if desc_count > 0 else "Check 5 - FAIL")
print(f"Check 5 - Markdown emphasis (*text*) in descriptions: PASS ({star_count} found)" if star_count > 0 else "Check 5 - FAIL")

