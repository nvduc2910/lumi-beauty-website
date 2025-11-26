#!/usr/bin/env python3
"""
Script to update English HTML files with translations from script.js
Replaces Vietnamese text with English translations based on data-translate attributes
"""
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup

def extract_translations_from_script(script_path):
    """Extract English translations from script.js"""
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the en: section
    en_start = content.find('  en: {')
    if en_start == -1:
        raise ValueError("Could not find 'en:' section in script.js")
    
    # Find the end of the en: object (before 'ko:')
    ko_start = content.find('  ko: {', en_start)
    if ko_start == -1:
        raise ValueError("Could not find end of 'en:' section")
    
    en_section = content[en_start:ko_start]
    
    translations = {}
    lines = en_section.split('\n')
    
    current_key = None
    current_value_lines = []
    in_multiline_string = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Skip comments and empty lines
        if stripped.startswith('//') or not stripped:
            continue
        
        # Check for key: pattern (key without quotes)
        if ':' in stripped and not in_multiline_string:
            colon_pos = stripped.find(':')
            key = stripped[:colon_pos].strip()
            value_part = stripped[colon_pos+1:].strip()
            
            # Save previous key if exists
            if current_key and current_value_lines:
                value = ' '.join(current_value_lines).strip()
                # Remove quotes and clean up
                value = re.sub(r'^["\']|["\']$', '', value)
                value = value.rstrip(',').strip()
                if value:
                    translations[current_key] = value
                current_key = None
                current_value_lines = []
            
            # Check if value is on same line
            if value_part:
                if value_part.startswith('"'):
                    # String value
                    if value_part.endswith('",') or (value_part.endswith('"') and not value_part.endswith('\\"')):
                        # Complete on one line
                        value = value_part[1:-1].rstrip(',').strip()
                        translations[key] = value
                    else:
                        # Multi-line string starting
                        current_key = key
                        current_value_lines = [value_part[1:]]  # Remove opening quote
                        in_multiline_string = True
                else:
                    # Key without value on this line, value is on next line(s)
                    current_key = key
                    in_multiline_string = False
            else:
                # Key with no value on this line, value is on next line(s)
                current_key = key
                in_multiline_string = False
        
        elif in_multiline_string and current_key:
            # Continuation of multi-line string
            if stripped.endswith('",') or (stripped.endswith('"') and not stripped.endswith('\\"')):
                # End of string
                line_content = stripped[:-1].rstrip(',').strip()
                current_value_lines.append(line_content)
                value = ' '.join(current_value_lines).strip()
                translations[current_key] = value
                current_key = None
                current_value_lines = []
                in_multiline_string = False
            else:
                current_value_lines.append(stripped)
        
        elif current_key and not in_multiline_string:
            # Value on next line(s) after key:
            if stripped.startswith('"'):
                if stripped.endswith('",') or (stripped.endswith('"') and not stripped.endswith('\\"')):
                    # Complete on one line
                    value = stripped[1:-1].rstrip(',').strip()
                    translations[current_key] = value
                    current_key = None
                else:
                    # Multi-line starting
                    current_value_lines = [stripped[1:]]
                    in_multiline_string = True
            else:
                # Might be continuation
                current_value_lines.append(stripped)
    
    # Handle any remaining key
    if current_key and current_value_lines:
        value = ' '.join(current_value_lines).strip()
        value = re.sub(r'^["\']|["\']$', '', value)
        value = value.rstrip(',').strip()
        if value:
            translations[current_key] = value
    
    return translations

def update_html_file(html_path, translations):
    """Update HTML file with English translations"""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    updated = False
    
    # Find all elements with data-translate attribute
    elements = soup.find_all(attrs={'data-translate': True})
    
    for element in elements:
        translate_key = element.get('data-translate')
        if translate_key in translations:
            english_text = translations[translate_key]
            
            # Check if element has data-translate-attr (for meta tags, etc.)
            translate_attr = element.get('data-translate-attr')
            if translate_attr:
                # Update the specified attribute(s)
                attrs = [a.strip() for a in translate_attr.split(',')]
                for attr in attrs:
                    if attr == 'innerHTML':
                        element.string = ''
                        # Handle HTML content
                        if '<' in english_text:
                            element.append(BeautifulSoup(english_text, 'html.parser'))
                        else:
                            element.string = english_text
                    elif attr:
                        element[attr] = english_text
            elif element.get('data-translate-html'):
                # Update innerHTML
                element.string = ''
                if '<' in english_text:
                    element.append(BeautifulSoup(english_text, 'html.parser'))
                else:
                    element.string = english_text
            else:
                # Update text content
                # Special handling for elements with children (like nav links with arrows)
                if element.find_all():
                    # If element has children, we need to be careful
                    # For nav-link-with-dropdown, preserve the arrow
                    if 'nav-link-with-dropdown' in element.get('class', []):
                        # Replace the span content
                        span = element.find('span')
                        if span:
                            span.string = english_text
                        else:
                            # Clear and add new content
                            element.clear()
                            element.append(BeautifulSoup(f'<span>{english_text}</span>', 'html.parser'))
                            # Re-add arrow if it exists
                            arrow = soup.new_tag('img', src='icons/arrow-down.svg', alt='Dropdown', class_='nav-dropdown-arrow')
                            element.append(arrow)
                    else:
                        # For other elements with children, update text but preserve structure
                        # Clear text nodes but keep HTML structure
                        for text_node in element.find_all(string=True):
                            if text_node.parent == element:
                                text_node.replace_with(english_text)
                                break
                else:
                    # Simple text replacement
                    element.string = english_text
            
            updated = True
    
    if updated:
        # Write back to file
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        return True
    return False

def main():
    """Main function"""
    script_path = Path('/Users/duckie2910/Documents/lumi-beauty-website/script.js')
    en_dir = Path('/Users/duckie2910/Documents/lumi-beauty-website/en')
    
    print("Extracting English translations from script.js...")
    try:
        translations = extract_translations_from_script(script_path)
        print(f"Found {len(translations)} translation keys")
    except Exception as e:
        print(f"Error extracting translations: {e}")
        return
    
    # Find all HTML files in en directory
    html_files = list(en_dir.rglob('*.html'))
    
    if not html_files:
        print("No HTML files found in en directory")
        return
    
    print(f"\nFound {len(html_files)} HTML file(s) to process\n")
    
    updated_count = 0
    for html_file in html_files:
        try:
            if update_html_file(html_file, translations):
                print(f"✓ Updated: {html_file}")
                updated_count += 1
            else:
                print(f"- No changes: {html_file}")
        except Exception as e:
            print(f"✗ Error processing {html_file}: {e}")
    
    print(f"\n✓ Completed: {updated_count} file(s) updated")

if __name__ == '__main__':
    main()

