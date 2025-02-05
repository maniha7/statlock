import requests
from bs4 import BeautifulSoup

# Here we would just paste each new patch note link here (lmk if there is a better way to do this)
BASE_URL = "https://forums.playdeadlock.com/threads/01-27-2025-update.54590/"

# Function to clean HTML
def clean_and_format_html(html):
    soup = BeautifulSoup(html, "html.parser")
    
    # Removes Images
    for img in soup.find_all("img"):
        img.decompose()
    
    # Removes Links but Saves Text (We can change this to remove it all if we want)
    for a in soup.find_all("a"):
        a.replace_with(a.text)
    
    # Convert line breaks into list items
    text_lines = soup.get_text("\n", strip=True).split("\n")
    
    # Format as list
    formatted_html = "<ul>\n"
    for line in text_lines:
        if line.strip():  # Ignore empty lines
            formatted_html += f"    <li>{line}</li>\n"
    formatted_html += "</ul>"

    return formatted_html

# Function to get the latest patch note
def get_latest_patch_note():
    response = requests.get(BASE_URL, headers={"User-Agent": "Mozilla/5.0"})
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    
    # Find the latest patch note thread
    latest_thread = soup.select_one("div.structItem-title a[href]")
    if not latest_thread:
        print("No patch notes found.")
        return None
    
    thread_title = latest_thread.get_text(strip=True)
    thread_url = f"https://forums.playdeadlock.com{latest_thread['href']}"
    
    # Fetch the patch note content
    thread_response = requests.get(thread_url, headers={"User-Agent": "Mozilla/5.0"})
    if thread_response.status_code != 200:
        print(f"Failed to fetch patch note: {thread_response.status_code}")
        return None

    thread_soup = BeautifulSoup(thread_response.text, "html.parser")
    
    # Extract the main content
    post_content = thread_soup.select_one("article .bbWrapper")
    if not post_content:
        print("Patch note content not found.")
        return None

    # Clean and format the HTML
    formatted_html = clean_and_format_html(str(post_content))
    
    return {
        "title": thread_title,
        "url": thread_url,
        "content_html": formatted_html
    }

# Fetch latest patch note
latest_patch = get_latest_patch_note()
if latest_patch:
    # Save as an HTML file
    file_name = "Latest_Deadlock_Patch_Note.html"
    with open(file_name, "w", encoding="utf-8") as f:
        f.write(f"<h1>{latest_patch['title']}</h1>\n")
        f.write(f"<p><a href='{latest_patch['url']}'>View on Forum</a></p>\n")
        f.write(latest_patch["content_html"])

    print(f"Latest patch note saved as '{file_name}'")
else:
    print("No patch note found.")

