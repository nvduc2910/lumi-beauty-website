#!/usr/bin/env python3
import re
import os
from pathlib import Path

def remove_data_translate(content):
    """Remove all data-translate and data-translate-attr attributes"""
    # Remove data-translate="..." 
    content = re.sub(r'\s+data-translate="[^"]*"', '', content)
    # Remove data-translate-attr="..."
    content = re.sub(r'\s+data-translate-attr="[^"]*"', '', content)
    # Remove data-translate-html
    content = re.sub(r'\s+data-translate-html', '', content)
    return content

def update_links(content):
    """Update links to renamed files"""
    replacements = {
        'contact.html': 'lien-he.html',
        'gallery.html': 'thu-vien-anh.html',
        'feedback.html': 'cam-nhan-khach-hang.html',
        'href="contact.html"': 'href="lien-he.html"',
        'href="gallery.html"': 'href="thu-vien-anh.html"',
        'href="feedback.html"': 'href="cam-nhan-khach-hang.html"',
        'href="../contact.html"': 'href="../lien-he.html"',
        'href="../gallery.html"': 'href="../thu-vien-anh.html"',
        'href="../feedback.html"': 'href="../cam-nhan-khach-hang.html"',
        'href="services/contact.html"': 'href="services/lien-he.html"',
        'href="services/gallery.html"': 'href="services/thu-vien-anh.html"',
        'href="services/feedback.html"': 'href="services/cam-nhan-khach-hang.html"',
        'url": "contact.html"': 'url": "lien-he.html"',
        'url": "gallery.html"': 'url": "thu-vien-anh.html"',
        'url": "feedback.html"': 'url": "cam-nhan-khach-hang.html"',
        'url": "https://lumibeauty.studio/contact.html"': 'url": "https://lumibeauty.studio/vi/lien-he.html"',
        'url": "https://lumibeauty.studio/gallery.html"': 'url": "https://lumibeauty.studio/vi/thu-vien-anh.html"',
        'url": "https://lumibeauty.studio/feedback.html"': 'url": "https://lumibeauty.studio/vi/cam-nhan-khach-hang.html"',
    }
    for old, new in replacements.items():
        content = content.replace(old, new)
    return content

def process_file(file_path):
    """Process a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove data-translate attributes
        content = remove_data_translate(content)
        
        # Update links
        content = update_links(content)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Processed: {file_path}")
        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    vi_dir = Path('/Users/duckie2910/Documents/lumi-beauty-website/vi')
    
    # Find all HTML files
    html_files = list(vi_dir.rglob('*.html'))
    
    print(f"Found {len(html_files)} HTML files to process")
    
    for html_file in html_files:
        process_file(html_file)
    
    print("Done processing all files!")

if __name__ == '__main__':
    main()

