#!/usr/bin/env python3
"""
Script to translate HTML files from Vietnamese to English and Korean
using translations from script.js
"""
import re
import os
import json
from pathlib import Path

# Extract translations from script.js
def extract_translations():
    """Extract translations from script.js"""
    script_path = Path(__file__).parent / "script.js"
    
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the translations object
    # Look for: const translations = { ... }
    pattern = r'const\s+translations\s*=\s*({.*?});'
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print("Could not find translations in script.js")
        return None
    
    translations_str = match.group(1)
    
    # Try to parse as JSON (need to handle JavaScript syntax)
    # Replace single quotes with double quotes for JSON
    translations_str = translations_str.replace("'", '"')
    # Remove trailing commas
    translations_str = re.sub(r',(\s*[}\]])', r'\1', translations_str)
    
    try:
        translations = json.loads(translations_str)
        return translations
    except json.JSONDecodeError as e:
        print(f"Error parsing translations: {e}")
        # Fallback: manually extract key-value pairs
        return extract_translations_manual(content)

def extract_translations_manual(content):
    """Manually extract translations using regex"""
    translations = {'vi': {}, 'en': {}, 'ko': {}}
    
    # Pattern to match translation keys and values
    # Example: page_title: "Lumi Beauty - ...",
    pattern = r'(\w+):\s*"((?:[^"\\]|\\.)*)"'
    
    current_lang = None
    for line in content.split('\n'):
        line = line.strip()
        
        # Detect language block
        if 'vi:' in line or 'vi: {' in line:
            current_lang = 'vi'
        elif 'en:' in line or 'en: {' in line:
            current_lang = 'en'
        elif 'ko:' in line or 'ko: {' in line:
            current_lang = 'ko'
        
        if current_lang:
            matches = re.findall(pattern, line)
            for key, value in matches:
                # Unescape quotes
                value = value.replace('\\"', '"').replace('\\n', '\n')
                translations[current_lang][key] = value
    
    return translations

# Create a mapping from Vietnamese text to English/Korean
def create_text_mapping(translations):
    """Create a mapping from Vietnamese text to translations"""
    mapping = {
        'en': {},
        'ko': {}
    }
    
    if not translations:
        return mapping
    
    vi_dict = translations.get('vi', {})
    en_dict = translations.get('en', {})
    ko_dict = translations.get('ko', {})
    
    # Map Vietnamese values to English/Korean
    for key, vi_text in vi_dict.items():
        if key in en_dict:
            mapping['en'][vi_text] = en_dict[key]
        if key in ko_dict:
            mapping['ko'][vi_text] = ko_dict[key]
    
    return mapping

def translate_html_file(file_path, target_lang, text_mapping, translations):
    """Translate a single HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    mapping = text_mapping[target_lang]
    lang_dict = translations.get(target_lang, {})
    
    # Update lang attribute
    content = re.sub(r'<html\s+lang="vi">', f'<html lang="{target_lang}">', content)
    
    # Update title
    if 'page_title' in lang_dict:
        title_pattern = r'<title>.*?</title>'
        new_title = f'<title>{lang_dict["page_title"]}</title>'
        content = re.sub(title_pattern, new_title, content)
    
    # Update meta description
    if 'meta_description' in lang_dict:
        desc_pattern = r'<meta\s+name="description"\s+content="[^"]*">'
        new_desc = f'<meta name="description" content="{lang_dict["meta_description"]}">'
        content = re.sub(desc_pattern, new_desc, content)
    
    # Update meta keywords
    if 'meta_keywords' in lang_dict:
        keywords_pattern = r'<meta\s+name="keywords"\s+content="[^"]*">'
        new_keywords = f'<meta name="keywords" content="{lang_dict["meta_keywords"]}">'
        content = re.sub(keywords_pattern, new_keywords, content)
    
    # Update OG tags
    if 'og_title' in lang_dict:
        og_title_pattern = r'<meta\s+property="og:title"\s+content="[^"]*">'
        new_og_title = f'<meta property="og:title" content="{lang_dict["og_title"]}">'
        content = re.sub(og_title_pattern, new_og_title, content)
    
    if 'og_description' in lang_dict:
        og_desc_pattern = r'<meta\s+property="og:description"\s+content="[^"]*">'
        new_og_desc = f'<meta property="og:description" content="{lang_dict["og_description"]}">'
        content = re.sub(og_desc_pattern, new_og_desc, content)
    
    # Update Twitter tags
    if 'twitter_title' in lang_dict:
        twitter_title_pattern = r'<meta\s+name="twitter:title"\s+content="[^"]*">'
        new_twitter_title = f'<meta name="twitter:title" content="{lang_dict["twitter_title"]}">'
        content = re.sub(twitter_title_pattern, new_twitter_title, content)
    
    if 'twitter_description' in lang_dict:
        twitter_desc_pattern = r'<meta\s+name="twitter:description"\s+content="[^"]*">'
        new_twitter_desc = f'<meta name="twitter:description" content="{lang_dict["twitter_description"]}">'
        content = re.sub(twitter_desc_pattern, new_twitter_desc, content)
    
    # Translate text content (more complex - need to match Vietnamese text)
    # Sort by length (longest first) to avoid partial matches
    sorted_mapping = sorted(mapping.items(), key=lambda x: len(x[0]), reverse=True)
    
    for vi_text, translated_text in sorted_mapping:
        if vi_text in content:
            # Escape special regex characters
            escaped_vi = re.escape(vi_text)
            # Replace in text nodes (not in tags)
            # This is a simplified approach - may need refinement
            content = content.replace(vi_text, translated_text)
    
    # Update structured data JSON
    if 'navigationData' in content:
        # Update navigation names
        nav_updates = {
            'vi': {
                'Phun môi collagen': 'Collagen Lip Blushing',
                'Phun mày shading': 'Shading Ombre Brows',
                'Khử thâm môi cho nam nữ': 'Lip Neutralizing for Men & Women',
                'Phun mí mở tròng': 'Lashline Enhancement',
                'Thư viện ảnh': 'Gallery',
                'Cảm nhận khách hàng': 'Client Feedback',
                'Liên hệ': 'Contact'
            },
            'ko': {
                'Phun môi collagen': '콜라겐 / 베이비 립 타투',
                'Phun mày shading': '쉐이딩 / 파우더 브로우',
                'Khử thâm môi cho nam nữ': '남녀 입술 톤 브라이트닝',
                'Phun mí mở tròng': '미 오픈 아이라인',
                'Thư viện ảnh': '갤러리',
                'Cảm nhận khách hàng': '피드백',
                'Liên hệ': '연락처'
            }
        }
        
        if target_lang in nav_updates:
            for vi_name, translated_name in nav_updates[target_lang].items():
                content = content.replace(f'"name": "{vi_name}"', f'"name": "{translated_name}"')
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    base_dir = Path(__file__).parent
    
    print("Extracting translations from script.js...")
    translations = extract_translations()
    
    if not translations:
        print("Failed to extract translations. Using manual mapping...")
        # Fallback: read script.js and extract manually
        return
    
    print(f"Found translations for: {list(translations.keys())}")
    
    print("Creating text mapping...")
    text_mapping = create_text_mapping(translations)
    
    # Process English files
    en_dir = base_dir / 'en'
    if en_dir.exists():
        print(f"\nProcessing English files in {en_dir}...")
        html_files = list(en_dir.rglob('*.html'))
        for html_file in html_files:
            print(f"  Translating {html_file.relative_to(base_dir)}...")
            translate_html_file(html_file, 'en', text_mapping, translations)
    
    # Process Korean files
    ko_dir = base_dir / 'ko'
    if ko_dir.exists():
        print(f"\nProcessing Korean files in {ko_dir}...")
        html_files = list(ko_dir.rglob('*.html'))
        for html_file in html_files:
            print(f"  Translating {html_file.relative_to(base_dir)}...")
            translate_html_file(html_file, 'ko', text_mapping, translations)
    
    print("\nTranslation complete!")

if __name__ == '__main__':
    main()

