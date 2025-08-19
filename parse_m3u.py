
import re
import json

def parse_m3u(file_path):
    channels = []
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    entries = re.findall(r'#EXTINF:(-1.*?),(.*?)\n(.*?)\n', content, re.DOTALL)

    for entry in entries:
        attributes_str = entry[0]
        channel_name = entry[1].strip()
        stream_url = entry[2].strip()

        tvg_id_match = re.search(r'tvg-id="(.*?)"', attributes_str)
        tvg_logo_match = re.search(r'tvg-logo="(.*?)"', attributes_str)
        group_title_match = re.search(r'group-title="(.*?)"', attributes_str)

        tvg_id = tvg_id_match.group(1) if tvg_id_match else ''
        tvg_logo = tvg_logo_match.group(1) if tvg_logo_match else ''
        group_title = group_title_match.group(1) if group_title_match else 'Other'

        # Attempt to extract country and language from tvg-id or channel name
        country = ''
        language = ''

        # Basic attempt to get country from tvg-id (e.g., 'Channel.us' -> 'us')
        if tvg_id and '.' in tvg_id:
            country = tvg_id.split('.')[-1].split('@')[0].upper()
            if len(country) != 2: # Not a valid 2-letter country code
                country = ''

        # Basic attempt to get language from channel name (very rudimentary)
        # This is a placeholder and would need more sophisticated NLP for accuracy
        if 'English' in channel_name: language = 'English'
        elif 'Spanish' in channel_name: language = 'Spanish'
        elif 'French' in channel_name: language = 'French'
        # Add more languages as needed

        channels.append({
            'name': channel_name,
            'url': stream_url,
            'tvg_id': tvg_id,
            'tvg_logo': tvg_logo,
            'category': group_title,
            'country': country,
            'language': language
        })
    return channels

if __name__ == '__main__':
    m3u_file = 'iptv.m3u'
    output_json_file = 'channels.json'
    channels_data = parse_m3u(m3u_file)
    with open(output_json_file, 'w', encoding='utf-8') as f:
        json.dump(channels_data, f, indent=4)
    print(f'Parsed {len(channels_data)} channels and saved to {output_json_file}')


