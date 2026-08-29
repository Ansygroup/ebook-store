import sys
sys.path.insert(0, 'scripts/book_content')
import career_switch_kit, sell_anything_online, focus_in_a_distracted_world

BAD_CHARS = set('*#_`[]')

for mod in (career_switch_kit, sell_anything_online, focus_in_a_distracted_world):
    counts = []
    for title, paras in mod.CHAPTERS:
        assert isinstance(title, str) and 3 <= len(title) <= 80, (mod.__name__, title)
        assert len(paras) == 8, (mod.__name__, title, len(paras))
        for p in paras:
            wc = len(p.split())
            counts.append(wc)
            assert 80 <= wc <= 130, (mod.__name__, title, wc)
            assert '\u2014' not in p and '\u2013' not in p, (mod.__name__, title)
            assert not BAD_CHARS.intersection(p), (mod.__name__, title)
    print("%s: PASS | chapters=%d paragraphs=%d words/para=(%d-%d)" % (
        mod.__name__, len(mod.CHAPTERS), sum(len(c[1]) for c in mod.CHAPTERS),
        min(counts), max(counts)))
print('ALL CHECKS PASSED')
