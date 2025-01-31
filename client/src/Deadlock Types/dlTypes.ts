interface HeroDescription {
    lore: string | null,
    role: string | null,
    playstyle: string | null,
}

interface HeroImages {
    icon_hero_card: string | null,
    icon_hero_card_webp: string | null,
    icon_image_small: string | null,
    icon_image_small_webp: string | null,
    minimap_image: string | null,
    minimap_image_webp: string | null,
    selection_image: string | null,
    selection_image_webp: string | null,
    top_bar_image: string | null,
    top_bar_image_webp: string | null,
    top_bar_vertical: string | null,
    top_bar_vertical_webp: string | null,
    weapon_image: string | null,
    weapon_image_webp: string | null,
}

export interface Hero {
    id: number,
    class_name: string,
    name: string,
    description: HeroDescription,
    recommended_upgrades: Array<string> | null,
    recommended_ability_order: Array<string> | null,
    player_selectable: boolean,
    bot_selectable: boolean,
    disabled: boolean,
    in_development: boolean,
    needs_testing: boolean,
    assigned_players_only: boolean,
    limited_testing: boolean,
    complexity: number,
    skin: number,
    readability: number,
    images: HeroImages,
    //todo finish
}


export interface ShopItem {
    
}