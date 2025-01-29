import weaponIcon from './assets/weaponitems_icon.png'
import vitalityIcon from './assets/vitalityitems_icon.png'
import spiritIcon from './assets/spirititems_icon.png'
import { EyeIcon } from '@heroicons/react/24/outline'

const globals = {
    //ASSETS API
    Deadlock_Assets_API_Address: "https://assets.deadlock-api.com",
    Deadlock_Assets_Heroes_Endpoint: "/v2/heroes",
    Deadlock_Assets_Items_Endpoint: "/v2/items/by-type/upgrade",

    //DATA API
    Deadlock_Data_API_Address: "https://data.deadlock-api.com",
    Deadlock_Data_PatchNotes_Endpoint: "/v1/patch-notes",

    globalColors:{
        greyBackground: "#333333",
        stone800Background: '#292524',
        stoneBackgroundGradient: "bg-gradient-to-r from-stone-800 via-transparent to-stone-800",
        offWhite:"#d2d2cb",
       
    },

    itemColors: {
        vitality:{
            base:"#7cbb1e",
            medium:"#6ca319",
            mediumDark:"#4f7613",
            dark:"#3a580e",
        },
        spirit:{
            base:"#bc84e1",
            medium:"#9063b6",
            mediumDark:"#65388a",
            dark:"#352145",
        },
        weapon:{
            base:"#ec981a",
            medium:"#d48611",
            mediumDark:"#845815",
            dark:"#5e3c08",
        },
        search:{base:"#ccbda7"}
    },
    
    itemTypes: {
        weapon:1,
        vitality:2,
        spirit:3,
    },

    itemTypeImgs:{
        weapon:weaponIcon,
        vitality:vitalityIcon,
        spirit:spiritIcon,
        search:EyeIcon
    },

    innateHiddenProperties: new Set([
        "MoveWhileShootingSpeedPenaltyReductionPercent",
        "MoveWhileZoomedSpeedPenaltyReductionPercent",
        "AirControlPercent", 
        "TechRadiusMultiplier",
        "HealAmpRegenPenaltyPercent",
        "HealAmpCastPercent",
        "HealAmpRegenPercent",
        "DegenResistance",
        "GroundDashReductionPercent",
        "ChannelMoveSpeed",
        "MoveSpeedMax",
        "ImbuedTechRadiusMultiplier",
        "NonImbuedTechRadiusMultiplier",
        "TechArmorDamageReduction",
        "TechPowerReduction",
        "SkipFrames",
        "HealAmpReceivePenaltyPercent",
        "ActivatedFireRate",
        "BonusFireRatePlayerUnit"
    ]),

    passiveHiddenProperties: new Set([
        "AbilityCooldown"
    ]),

    itemIDtoNameMap:{
        BaseAttackDamagePercent:"Weapon Damage",
        BonusClipSizePercent:"Ammo",
        BulletResist:"Bullet Resist",
        BonusFireRate:"Fire Rate",
        BulletShieldMaxHealth:"Bullet Shield Health",
        BonusBulletSpeedPercent:"Bullet Velocity",
        TechPower:"Spirit Power",
        TechShieldMaxHealth:"Spirit Shield Health",
        BonusHealth:"Bonus Health",
        BonusHealthRegen:"Health Regen",
        NonPlayerBonusWeaponPower:"Weapon Damage vs. NPCs",
        NonPlayerBulletResist:"Bullet Resist vs. NPCs",
        BonusSprintSpeed:"Sprint Speed",
        BonusClipSize:"Ammo",
        SlideScale:"Slide Distance",
        ReloadSpeedMultipler:"Reload Time",
        MeleeDistanceScale:"Heavy Melee Distance",
        SpiritPower:"Spirit Power",
        LocalBulletArmorReduction:"Bullet Resist",
        SlowResistancePercent:"Movement Slow Resist",
        BulletLifestealPercent:"Bullet Lifesteal",
        MeleeResistPercent:"Melee Resist",
        TechResist:"Spirit Resist",
        BonusMoveSpeed:"Move Speed",
        BonusAttackRangePercent:"Weapon Fall-off Range",
        BonusZoomPercent:"Weapon Zoom",
        FireRateSlow:"Fire Rate Slow",
        AbilityLifestealPercentHero:"Spirit Lifesteal",
        MaxHealthLossPercent:"Max Health",
        SlowPercent:"Bullet Slow Proc",
        StatusResistancePercent:"Debuff Resist",
        CooldownReduction:"Cooldown Reduction",
        StaminaCooldownReduction:"Stamina Recovery",
        BonusMeleeDamagePercent:"Melee Damage",
        TechRangeMultiplier:"Ability Range",
        AirMoveIncreasePercent:"Air Jump/Dash Distance",
        CooldownReductionOnChargedAbilities:"Cooldown Reduction For Charged Abilities",
        BonusAbilityDurationPercent:"Ability Duration",
        ImbuedTechRangeMultiplier:"Imbued Ability Range",
        NonImbuedTechRangeMultiplier:"Non-Imbued Ability Range",
        BonusAbilityCharges:"Bonus Ability Charges",
        CooldownBetweenChargeReduction:"Faster Time Between Charges",
        ImbuedCooldownReduction:"Imbued Ability Cooldown Reduction",
        NonImbuedCooldownReduction:"Non-Imbued Ability Cooldown Reduction",
        ImbuedBonusDuration:"Imbued Ability Duration",
        NonImbuedBonusDuration:"Non-Imbued Ability Duration",
        TechArmorDamageReduction:"Spirit Resist On Spirit Damage",
        Stamina:"Stamina"

    },

    itemIDtoUnitMap:{
        BaseAttackDamagePercent:{sign:"+",units:"%"},
        BonusClipSizePercent:{sign:"+",units:"%"},
        BulletResist:{sign:"+",units:"%"},
        BonusFireRate:{sign:"+",units:"%"},
        BulletShieldMaxHealth:{sign:"+",units:""},
        BonusBulletSpeedPercent:{sign:"+",units:"%"},
        TechPower:{sign:"+",units:""},
        TechShieldMaxHealth:{sign:"+",units:""},
        BonusHealth:{sign:"+",units:""},
        BonusHealthRegen:{sign:"+",units:""},
        NonPlayerBonusWeaponPower:{sign:"+",units:"%"},
        NonPlayerBulletResist:{sign:"+",units:"%"},
        BonusSprintSpeed:{sign:"+",units:"/s"},
        BonusClipSize:{sign:"+",units:""},
        SlideScale:{sign:"+",units:"%"},
        ReloadSpeedMultipler:{sign:"-",units:"%"},
        MeleeDistanceScale:{sign:"+",units:"%"},
        SpiritPower:{sign:"+",units:""},
        LocalBulletArmorReduction:{sign:"-",units:"%"},
        SlowResistancePercent:{sign:"+",units:"%"},
        BulletLifestealPercent:{sign:"+",units:"%"},
        MeleeResistPercent:{sign:"+",units:"%"},
        TechResist:{sign:"+",units:"%"},
        BonusMoveSpeed:{sign:"+",units:"/s"},
        BonusAttackRangePercent:{sign:"+",units:"%"},
        BonusZoomPercent:{sign:"+",units:"%"},
        FireRateSlow:{sign:"",units:"%"},
        AbilityLifestealPercentHero:{sign:"+",units:"%"},
        MaxHealthLossPercent:{sign:"-",units:"%"},
        SlowPercent:{sign:"+",units:"%"},
        StatusResistancePercent:{sign:"+",units:"%"},
        CooldownReduction:{sign:"+",units:"%"},
        StaminaCooldownReduction:{sign:"+",units:"%"},
        BonusMeleeDamagePercent:{sign:"+",units:"%"},
        TechRangeMultiplier:{sign:"+",units:"%"},
        AirMoveIncreasePercent:{sign:"+",units:"%"},
        CooldownReductionOnChargedAbilities:{sign:"+",units:"%"},
        BonusAbilityDurationPercent:{sign:"+",units:"%"},
        ImbuedTechRangeMultiplier:{sign:"+",units:"%"},
        NonImbuedTechRangeMultiplier:{sign:"+",units:"%"},
        BonusAbilityCharges:{sign:"+",units:""},
        CooldownBetweenChargeReduction:{sign:"+",units:"%"},
        ImbuedCooldownReduction:{sign:"+",units:"%"},
        NonImbuedCooldownReduction:{sign:"+",units:"%"},
        ImbuedBonusDuration:{sign:"+",units:"%"},
        NonImbuedBonusDuration:{sign:"+",units:"%"},
        TechArmorDamageReduction:{sign:"+",units:"%"},
        Stamina:{sign:"+",units:""},
    }
}

export default globals;

