import requests
from bs4 import BeautifulSoup
import json
import os

# Define the JSON file path
JSON_FILE = "../assets/patch_notes.json"

# Function to fetch and parse the Steam news page
def scrape_steam_patch(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch {url}")
        return None
    
    soup = BeautifulSoup(response.text, "lxml")
    
    # Debugging: Print all div elements to find content structure
    print("Page div structure:")
    for div in soup.find_all("div"):
        print(div.get("class"))
    
    title_tag = soup.find("div", class_="headline")
    title = title_tag.get_text(strip=True) if title_tag else "Unknown Title"
    
    # Try multiple possible containers for content
    content_div = (soup.find("div", class_="bb_ul") or 
                   soup.find("div", class_="newsPostContent") or 
                   soup.find("div", class_="article_content") or 
                   soup.find("div", class_="post_body"))
    
    if not content_div:
        print(f"Failed to extract content from {url}")
        return None
    
    for img in content_div.find_all("img"):
        img.decompose()
    for a in content_div.find_all("a"):
        a.unwrap()
    
    content_lines = content_div.get_text("\n", strip=True).split("\n")
    
    categorized_content = categorize_content(content_lines)
    
    return {
        "title": title,
        "url": url.strip(),
        "latest": False,
        "categories": categorized_content
    }
# Function to categorize patch notes based on keywords
def categorize_content(lines):
    CATEGORY_KEYWORDS = {
        "Character Patches": ["hero", "Abrams:", "Bebop:", "Calico:", "Dynamo:", "Grey Talon:", "Haze:", "Holliday:", "Infernus:", "Ivy:", "Kelvin:", 
                            "Lady Geist:", "Lash:", "Mcginnis:", "Mirage:", "Mo & Krill:", "Paradox:", "Pocket:", "Seven:", "Shiv:", 
                            "The Magnificent Sinclair:", "Sinclair:", "Vindicta:", "Viscous:", "Vyper:", "Warden:", "Wraith:", "Yamato:"],

        "Weapon Item Patches": ["Basic Magazine:", "Close Quarters:", "Headshot Booster:", "High-Velocity Mag:", "Hollow Point Ward:", "Monster Rounds:", "Rapid Rounds:", "Restorative Shot:", 
                            "Active Reload:", "Berserker:", "Kinetic Dash:", "Long Range:", "Melee Charge:", "Mystic Shot:", "Slowing Bullets:", "Soul Shredder Bullets:", "Swift Striker:", "Fleetfoot:", 
                            "Burst Fire:", "Escalating Resilience:", "Headhunter:", "Hunter's Aura:", "Intensifying Magazine:", "Point Blank:", "Pristine Emblem:", "Sharpshooter:", "Spellslinger Headshots:", "Tesla Bullets:", "Titanic Magazine:", "Toxic Bullets:", "Alchemical Fire:", "Heroic Aura:", "Warp Stone:", 
                            "Crippling Headshot:", "Frenzy:", "Glass Cannon:", "Lucky Shot:", "Ricochet:", "Silencer:", "Spiritual Overflow:", "Shadow Weave:", "Vampiric Burst:"],

        "Vitality Item Patches":["Enduring Spirit:", "Extra Health:", "Extra Regen:", "Extra Stamina:", "Melee Lifesteal:", "Sprint Boots:", "Healing Rite:", 
                              "Bullet Armor:", "Bullet Lifesteal:", "Combat Barrier:", "Debuff Reducer:", "Enchanter's Barrier:", "Enduring Speed:", "Healbane:", "Healing Booster:", "Reactive Barrier:", "Spirit Armor:", "Spirit Lifesteal:", "Divine Barrier:", "Healing Nova:", "Restorative Locket:", "Return Fire:", 
                              "Fortitude:", "Improved Bullet Armor:", "Improved Spirit Armor:", "Lifestrike:", "Superior Stamina:", "Debuff Remover:", "Majestic Leap:", "Metal Skin:", "Rescue Beam:", 
                              "Inhibitor:", "Leech:", "Siphon Bullets:", "Veil Walker:", "Colossus:", "Phantom Strike:", "Unstoppable:"],

        "Spirit Item Patches": ["Ammo Scavenger:", "Extra Charge:", "Extra Spirit:", "Mystic Reach:", "Spirit Strike:", "Infuser:", 
                            "Bullet Resist Shredder", "Duration Extender", "Improved Cooldown", "Mystic Vulnerability", "Quicksilver Reload", "Suppressor", "Cold Front", "Decay", "Slowing Hex", "Withering Whip", 
                            "Arcane Surge", "Improved Burst", "Improved Reach", "Improved Spirit", "Mystic Slow", "Rapid Recharge", "Spirit Snatch", "Superior Cooldown", "Superior Duration", "Surge of Power", "Torment Pulse", "Ethereal Shift", "Knockdown", "Silence Glyph", 
                            "Boundless Spirit", "Diviner's Kevlar", "Escalating Exposure", "Mystic Reverb", "Curse", "Echo Shard", "Magic Carpet", "Refresher"],
                            
        "General Updates": ["fix", "update", "balance"]
    }
    
    categorized_content = {key: [] for key in CATEGORY_KEYWORDS}
    categorized_content["General Updates"] = []
    
    for line in lines:
        categorized = False
        for category, keywords in CATEGORY_KEYWORDS.items():
            if any(keyword in line.lower() for keyword in keywords):
                categorized_content[category].append(line)
                categorized = True
                break
        if not categorized:
            categorized_content["General Updates"].append(line)
    
    return categorized_content

# Function to load existing patch data
def load_existing_patches():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

# Function to save patch data
def save_patches(patches):
    for patch in patches:
        patch["latest"] = False
    if patches:
        patches[0]["latest"] = True
    
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(patches, f, indent=4)

# Main script execution
def main():
    steam_patch_url = "https://store.steampowered.com/news/app/1422450/view/530965072572320687"
    
    existing_patches = load_existing_patches()
    print("Existing patch URLs:")
    for patch in existing_patches:
        print(patch["url"].strip())
    
    new_patch = scrape_steam_patch(steam_patch_url)
    
    if new_patch:
        print(f"Checking for URL match: {new_patch['url']}")
        if not any(patch["url"].strip().lower() == new_patch["url"].strip().lower() for patch in existing_patches):
            existing_patches.insert(0, new_patch)
            save_patches(existing_patches)
            print("New Steam patch added!")
        else:
            print("Patch already exists in JSON file.")
    else:
        print("No new Steam patch found.")

if __name__ == "__main__":
    main()
