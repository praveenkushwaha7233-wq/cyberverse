import re
from pathlib import Path
path = Path('templates/index.html')
text = path.read_text(encoding='utf-8')
void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
stack = []
errors = []
for m in re.finditer(r'<(/?)([A-Za-z0-9:-]+)([^>]*)>', text):
    closing = m.group(1) == '/'
    tag = m.group(2).lower()
    rest = m.group(3)
    selfclosing = rest.strip().endswith('/') or tag in void_tags
    if closing:
        if not stack:
            errors.append(f'Closing tag </{tag}> with empty stack at position {m.start()}')
        else:
            top = stack[-1]
            if top == tag:
                stack.pop()
            else:
                errors.append(f'Closing tag </{tag}> does not match open <{top}> at position {m.start()}')
                while stack and stack[-1] != tag:
                    stack.pop()
                if stack and stack[-1] == tag:
                    stack.pop()
    elif not selfclosing:
        stack.append(tag)

print('errors', len(errors))
for e in errors[:50]:
    print(e)
print('stack size', len(stack), stack[:20])
