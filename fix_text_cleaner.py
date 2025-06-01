import re

# Read the current file
with open('cinefluent/subtitle_processor.py', 'r') as f:
    content = f.read()

# Fix the formatting pattern to properly remove subtitle formatting codes
# Old pattern removes individual characters: [{}\\]
# New pattern removes complete formatting codes: {[^}]*}
old_pattern = "self.formatting_pattern = re.compile(r'[{}\\\\]')"
new_pattern = "self.formatting_pattern = re.compile(r'\\{[^}]*\\}')"

content = content.replace(old_pattern, new_pattern)

# Write back
with open('cinefluent/subtitle_processor.py', 'w') as f:
    f.write(content)

print("✅ Fixed TextCleaner formatting pattern")
