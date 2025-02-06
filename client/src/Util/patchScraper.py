import requests
from bs4 import BeautifulSoup
import json
import os

# File path for storing patch notes
JSON_FILE = "../assets/patch_notes.json"

# List of patch note URLs 
# New Patches are put as the TOP Url !!!
PATCH_URLS = [
    "https://forums.playdeadlock.com/threads/01-27-2025-update.54590/",
    "https://forums.playdeadlock.com/threads/01-19-2025-update.53961/",
    "https://forums.playdeadlock.com/threads/01-17-2025-update.53607/",
    "https://forums.playdeadlock.com/threads/01-12-2025-update.53389/",
    "https://forums.playdeadlock.com/threads/12-31-2024-update.52769/",
    "https://forums.playdeadlock.com/threads/12-21-2024-update.52206/",
    "https://forums.playdeadlock.com/threads/12-17-2024-update.52008/",
    "https://forums.playdeadlock.com/threads/12-06-2024-update.50599/",
    "https://forums.playdeadlock.com/threads/11-29-2024-update.49470/",
    "https://forums.playdeadlock.com/threads/11-21-2024-update.47476/",
    "https://forums.playdeadlock.com/threads/11-13-2024-update.46391/",
    "https://forums.playdeadlock.com/threads/11-10-2024-update.45689/",
    "https://forums.playdeadlock.com/threads/11-07-2024-update.44786/",
    "https://forums.playdeadlock.com/threads/11-01-2024-update.43705/",
    "https://forums.playdeadlock.com/threads/10-29-2024-update.42985/",
    "https://forums.playdeadlock.com/threads/10-27-2024-update.42492/",
    "https://forums.playdeadlock.com/threads/10-24-2024-update.40951/",
    "https://forums.playdeadlock.com/threads/10-18-2024-update-2.39693/",
    "https://forums.playdeadlock.com/threads/10-18-2024-update.39630/",
    "https://forums.playdeadlock.com/threads/10-15-2024-update.38925/",
]

# Keywords for different categories
CATEGORY_KEYWORDS = {
    "Character Patches": ["Abrams:", "Bebop:", "Calico:", "Dynamo:", "Grey Talon:", "Haze:", "Holliday:", "Infernus:", "Ivy:", "Kelvin:", 
                            "Lady Geist:", "Lash:", "Mcginnis:", "Mirage:", "Mo & Krill:", "Paradox:", "Pocket:", "Seven:", "Shiv:", 
                            "The Magnificent Sinclair:", "Sinclair:", "Vindicta:", "Viscous:", "Vyper:", "Warden:", "Wraith:", "Yamato:"],

    "Weapon Item Patches": ["Basic Magazine:", "Close Quarters:", "Headshot Booster:", "High-Velocity Mag:", "Hollow Point Ward:", "Monster Rounds:", "Rapid Rounds:", "Restorative Shot:", 
                            "Active Reload:", "Berserker:", "Kinetic Dash:", "Long Range:", "Melee Charge:", "Mystic Shot:", "Slowing Bullets:", "Soul Shredder Bullets:", "Swift Striker:", "Fleetfoot:", 
                            "Burst Fire:", "Escalating Resilience:", "Headhunter:", "Hunter's Aura:", "Intensifying Magazine:", "Point Blank:", "Pristine Emblem:", "Sharpshooter:", "Spellslinger Headshots:", "Tesla Bullets:", "Titanic Magazine:", "Toxic Bullets:", "Alchemical Fire:", "Heroic Aura:", "Warp Stone:", 
                            "Crippling Headshot:", "Frenzy:", "Glass Cannon:", "Lucky Shot:", "Ricochet:", "Silencer:", "Spiritual Overflow:", "Shadow Weave:", "Vampiric Burst:"],

    "Vitality Item Patches": ["Enduring Spirit:", "Extra Health:", "Extra Regen:", "Extra Stamina:", "Melee Lifesteal:", "Sprint Boots:", "Healing Rite:", 
                              "Bullet Armor:", "Bullet Lifesteal:", "Combat Barrier:", "Debuff Reducer:", "Enchanter's Barrier:", "Enduring Speed:", "Healbane:", "Healing Booster:", "Reactive Barrier:", "Spirit Armor:", "Spirit Lifesteal:", "Divine Barrier:", "Healing Nova:", "Restorative Locket:", "Return Fire:", 
                              "Fortitude:", "Improved Bullet Armor:", "Improved Spirit Armor:", "Lifestrike:", "Superior Stamina:", "Debuff Remover:", "Majestic Leap:", "Metal Skin:", "Rescue Beam:", 
                              "Inhibitor:", "Leech:", "Siphon Bullets:", "Veil Walker:", "Colossus:", "Phantom Strike:", "Unstoppable:"],

    "Spirit Item Patches": ["Ammo Scavenger:", "Extra Charge:", "Extra Spirit:", "Mystic Reach:", "Spirit Strike:", "Infuser:", 
                            "Bullet Resist Shredder", "Duration Extender", "Improved Cooldown", "Mystic Vulnerability", "Quicksilver Reload", "Suppressor", "Cold Front", "Decay", "Slowing Hex", "Withering Whip", 
                            "Arcane Surge", "Improved Burst", "Improved Reach", "Improved Spirit", "Mystic Slow", "Rapid Recharge", "Spirit Snatch", "Superior Cooldown", "Superior Duration", "Surge of Power", "Torment Pulse", "Ethereal Shift", "Knockdown", "Silence Glyph", 
                            "Boundless Spirit", "Diviner's Kevlar", "Escalating Exposure", "Mystic Reverb", "Curse", "Echo Shard", "Magic Carpet", "Refresher"]
}

# Function to categorize a line of text
def categorize_line(line):
    lower_line = line.lower()  # Convert line to lowercase
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword.lower() in lower_line for keyword in keywords):  # Convert keywords to lowercase
            return category
    return "General Updates"

# Load existing patch notes if the file exists
if os.path.exists(JSON_FILE):
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        try:
            patch_notes = json.load(f)
        except json.JSONDecodeError:
            patch_notes = []
else:
    patch_notes = []

# Loop through each patch URL and scrape
new_patches = []
for url in PATCH_URLS:
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch {url}")
        continue

    soup = BeautifulSoup(response.text, "html.parser")

    title_tag = soup.find("h1", class_="p-title-value")
    title = title_tag.get_text(strip=True) if title_tag else "Unknown Title"

    content_div = soup.find("article", class_="message-body")
    if not content_div:
        print(f"Failed to extract content from {url}")
        continue

    for img in content_div.find_all("img"):
        img.decompose()
    for a in content_div.find_all("a"):
        a.unwrap()

    # Process and categorize content
    content_lines = content_div.get_text("\n", strip=True).split("\n")
    categorized_content = {
        "Character Patches": [],
        "Weapon Item Patches": [],
        "Vitality Item Patches": [],
        "Spirit Item Patches": [],
        "General Updates": []
    }

    for line in content_lines:
        category = categorize_line(line)
        categorized_content[category].append(line)

    patch_data = {
        "title": title,
        "url": url,
        "latest": False,
        "categories": categorized_content  # Store content in categorized format
    }

    if not any(existing["url"] == patch_data["url"] for existing in patch_notes):
        new_patches.append(patch_data)

# Update existing patches to remove "latest" flag
for patch in patch_notes:
    patch["latest"] = False

# Mark the newest patch as latest
if new_patches:
    new_patches[0]["latest"] = True
    patch_notes = new_patches + patch_notes

# Save categorized patch notes
with open(JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(patch_notes, f, indent=4, ensure_ascii=False)

print(f"Categorized patch notes saved in '{JSON_FILE}'")