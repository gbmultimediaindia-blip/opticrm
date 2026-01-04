import re

with open('components/dashboard/invoice-dialog.tsx', 'r') as f:
    lines = f.readlines()

tags = []
for i, line in enumerate(lines):
    # simple regex to find tags
    # ignore comments
    line = re.sub(r'{/\*.*?\*/}', '', line)
    
    # find all tags
    matches = re.findall(r'</?([a-zA-Z0-9\.]+)[\s>]', line)
    
    # Need to handle self-closing tags
    # regex for <Tag ... />
    self_closing = re.findall(r'<([a-zA-Z0-9\.]+)[^>]*/>', line)
    
    # To properly order, we should scan the string index.
    # This is a bit complex for a one-off script, let's just count totals
    pass

# Better approach: simplistic counter
balance = {}
stack = []

void_elements = ['input', 'img', 'br', 'hr', 'meta', 'link']

content = "".join(lines)
# Remove comments
content = re.sub(r'{/\*.*?\*/}', '', content)

# Iterate through tags
# <Tag> or </Tag> or <Tag />
ptr = 0
while ptr < len(content):
    start = content.find('<', ptr)
    if start == -1: break
    
    end = content.find('>', start)
    if end == -1: break
    
    tag_content = content[start+1:end]
    if tag_content.startswith('?'): 
        ptr = end + 1
        continue # xml decl
        
    is_closing = tag_content.startswith('/')
    is_self_closing = tag_content.strip().endswith('/')
    
    tag_name_match = re.match(r'/?([a-zA-Z0-9\.]+)', tag_content)
    if not tag_name_match:
        ptr = end + 1
        continue
        
    tag_name = tag_name_match.group(1)
    
    if tag_name.lower() in void_elements:
        ptr = end + 1
        continue
        
    if is_self_closing:
        ptr = end + 1
        continue
        
    if is_closing:
        if not stack:
            print(f"Error: Unexpected closing tag {tag_name} at index {start}")
        else:
            last = stack.pop()
            if last != tag_name:
                print(f"Error: Mismatched tag. Expected closing {last}, got {tag_name} at index {start}")
                # Look for context
                line_num = content[:start].count('\n') + 1
                print(f"Line: {line_num}")
                # break/continue?
    else:
        stack.append(tag_name)
        
    ptr = end + 1

if stack:
    print(f"Unclosed tags: {stack}")

