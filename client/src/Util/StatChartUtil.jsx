

export function getDamageData(build){
    const items = build.itemOrder
    const hero = build.hero
    const baseStats = hero.starting_stats
    const levelMods = hero.standard_level_up_upgrades
    const boonAmounts = hero.level_info


    //BASE STATS 
    const regen = baseStats.base_health_regen.value
    const heavyMeleeDmg = baseStats.heavy_melee_damage.value
    const lightMeleeDmg = baseStats.light_melee_damage.value
    const maxHealth = baseStats.max_health.value
    const maxMovespeed = baseStats.max_move_speed.value
    const sprintSpeed = baseStats.sprint_speed.value
    const reloadSpeed = baseStats.reload_speed.value
    const weaponPowerScale = baseStats.weapon_power_scale.value

    //STATS ON LEVEL UP (BOON)
    const levelUpWeaponDmg = levelMods.MODIFIER_VALUE_BASE_BULLET_DAMAGE_FROM_LEVEL
    const levelUpHealth = levelMods.MODIFIER_VALUE_BASE_HEALTH_FROM_LEVEL
    const levelUpMeleeDmg = levelMods.MODIFIER_VALUE_BASE_MELEE_DAMAGE_FROM_LEVEL
    const levelUpBoonCount = levelMods.MOFIFIER_VALUE_BOON_COUNT
    const levelUpBulletResist = levelMods.MODIFIER_VALUE_BULLET_ARMOR_DAMAGE_RESIST
    const levelUpSpiritResist = levelMods.MODIFIER_VALUE_TECH_ARMOR_DAMAGE_RESIST
    const levelUpSpiritDmg = levelMods.MODIFIER_VALUE_TECH_DAMAGE_PERCENT





    items.forEach((item)=>{

    })
}