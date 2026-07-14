import re, json

md = open('marketing/email-sequence.md', encoding='utf-8').read()
chunks = re.split(r'\n## Email \d+ — [^\n]+\n', md)
emails = []
for c in chunks[1:]:
    c = c.strip()
    m = re.search(r'\*\*Subject:\*\*\s*(.+)', c)
    subject = m.group(1).strip() if m else 'No subject'
    body = re.sub(r'\*\*Subject:\*\*\s*.+\n', '', c).strip()
    emails.append({'subject': subject, 'body': body})

json.dump(emails, open('marketing/sequence.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('emails staged:', len(emails))
for i, e in enumerate(emails, 1):
    print(f'  {i}. {e["subject"][:50]}')
