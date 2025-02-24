import { getHeroes } from "../Util/ApiUtil";

export async function getHeroMap() {
    const heroes = await getHeroes(); // Fetch the hero array

    // Create a lookup object { hero_id: { name, image } }
    const heroMap = {};
    heroes.forEach(hero => {
        if (!hero.disabled) {
            heroMap[hero.id] = {
                name: hero.name,
                image: hero.images?.icon_image_small_webp || ""
            };
        }
    });

    return heroMap;
}