import globals from '../globals';

export function getDamageData(build){
    
    const items = build.itemOrder
    const hero = build.hero
    const baseStats = hero.starting_stats
    const levelMods = hero.standard_level_up_upgrades
    const boonAmounts = hero.level_info

    //base abilities
    const weaponPrimary = hero.weaponPrimary
    const weaponSecondary = hero.weaponSecondary
    const weaponMelee = hero.melee
    const signatures = hero.abilities

    //handle unfinished loading of hero data
    if(!weaponPrimary){
        return [{
            weaponDmg: 0,
            spiritDmg: 0,
        }]
    }


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



    //damage outputs
    let weaponDamage = 0
    let spiritDamage = 0

    //item bonuses
    
    let totalSouls = 0
    let boonLevel = 0
    let abilityUnlocks = 0
    let abilityPoints = 0
    let lastBoonIndex = 0

    let spiritPower = 0
    
    function getBoonLevel(){
        let i = 0
        const boonVals = Object.values(hero.level_info).slice(lastBoonIndex)

        while(i < boonVals.length && boonVals[i].required_gold<=totalSouls){
            //we have reached this boon since buying the last item: add its bonuses to build
            const bonuses = boonVals[i].bonus_currencies
            if(bonuses){
                bonuses.forEach((bonus)=>{
                    if(bonus==="EAbilityUnlocks"){
                        abilityUnlocks+=1
                    }
                    else if(bonus==="EAbilityPoints"){
                        abilityPoints+=1
                    }
                })
            }
            if(boonVals[i].use_standard_upgrade){
                boonLevel+=1
            }
            i+=1
        }
        lastBoonIndex = i-1
        
    }

    function getScaledStatValue(scaleInfo){
        const scale = scaleInfo.scale
        const scalingStat = scaleInfo.scaling_stat
        switch(scalingStat){
            case "ETechPower":
                return scale * spiritPower
            default:
                return 0
        }
    }

    let itemScalings = {
        fireRatePercent:0,
        clipSizePercent:0,
        clipSizeBonus:0,
        weaponDamagePercent:0,
        reloadSpeedPercentDecrease:0,
    }

    function getBulletDPS(){
        
        // FinalWeaponDamage = (BaseBulletDmg * WeaponDmg% * DmgBonus% + FlatWeaponDmg) * dmgFalloff * (BulletResist - BulletResistReduction%) * IncreasedBulletDmg% * CritMultiplier
        const baseBulletDmg = weaponPrimary.weapon_info.bullet_damage

        const bulletIncreasePerBoon = levelMods.MODIFIER_VALUE_BASE_BULLET_DAMAGE_FROM_LEVEL??0

        let baseClipSize = weaponPrimary.weapon_info.clip_size

        //handle per-hero special scaling
            let specialWeaponScaling = 0
            if(hero.scaling_stats.EBulletDamage){
                const scaleValue = getScaledStatValue(hero.scaling_stats.EBulletDamage)
                specialWeaponScaling = scaleValue
            }
            if(hero.scaling_stats.EClipSize){
                const scaleValue = getScaledStatValue(hero.scaling_stats.EClipSize)
                specialWeaponScaling = scaleValue
                baseClipSize = Math.floor(baseClipSize+scaleValue)
            }

        //base damage per bullet (after applying current boon level)
        const leveledBaseBulletDamage = baseBulletDmg + (boonLevel * bulletIncreasePerBoon) + specialWeaponScaling
        
        //total damage per bullet after item buffs
        const scaledDamagePerBullet = leveledBaseBulletDamage * (1 + itemScalings.weaponDamagePercent)
        
        //damage per shot (for guns with multiple bullets per shot)
        const bulletsPerShot = weaponPrimary.weapon_info.bullets
        const damagePerShot = scaledDamagePerBullet * bulletsPerShot

        //damage per clip
        const clipSize = (baseClipSize + itemScalings.clipSizeBonus) * (1 + itemScalings.clipSizePercent)
        const accuracy = 1
        const damagePerClip = damagePerShot * Math.round(clipSize * accuracy)

        //clips per second
        const timePerBulletSeconds = weaponPrimary.weapon_info.cycle_time
        const scaledTimePerBulletSeconds = timePerBulletSeconds / (1 + itemScalings.fireRatePercent)
        const secondsPerClip = (clipSize * scaledTimePerBulletSeconds) + weaponPrimary.weapon_info.reload_duration

        const damagePerSecond = damagePerClip / secondsPerClip

        return damagePerSecond
    }


    

    function addItemScaling(scalings, item){

        //add base bonus
        const baseBonus = globals.itemBaseBonuses[item.item_slot_type][item.cost]
        const baseBonusType = globals.itemBaseBonusTypes[item.item_slot_type]
        
        switch(baseBonusType){
            case "Weapon Damage":
                scalings.weaponDamagePercent += (baseBonus/100)
                break;
        }

        //add innate scalings
        item.innateProperties.forEach((prop)=>{
            switch(prop.provided_property_type){
                case "MODIFIER_VALUE_BASEATTACK_DAMAGE_PERCENT":
                    scalings.weaponDamagePercent += (prop.value/100)
                    break;
                case "MODIFIER_VALUE_AMMO_CLIP_SIZE_PERCENT":
                    scalings.clipSizePercent += (prop.value/100)
                    break;
                case "MODIFIER_VALUE_FIRE_RATE":
                    scalings.fireRatePercent += (prop.value/100)
                    break;
                case "MODIFIER_VALUE_AMMO_CLIP_SIZE":
                    scalings.clipSizeBonus += prop.value
                    break;
                case "MODIFIER_VALUE_RELOAD_SPEED":
                    scalings.reloadSpeedPercentDecrease += (prop.value/100)
                    break;
                case "MODIFIER_VALUE_FIRE_RATE_SLOW":
                    scalings.fireRatePercent -= (prop.value/100)
                    break;
            }
        })

        
        return scalings
    }



    const initWeaponDmg = getBulletDPS()
    const dataPoints = [{
        totalCost: 0,
        weaponDmg: initWeaponDmg,
        spiritDmg: 0,
    }]

    
    

    /********************* MAIN CALCULATION ***********************/
    items.forEach((item)=>{
        //add item cost to total and increase boons if possible
        totalSouls += item.cost
        getBoonLevel()
        itemScalings = addItemScaling(itemScalings, item)

        const weaponDmg = getBulletDPS()

        dataPoints.push(
            {
                totalCost: totalSouls,
                weaponDmg: weaponDmg,
                spiritDmg: 0,
            }
        )


    })
    
    return dataPoints
}



