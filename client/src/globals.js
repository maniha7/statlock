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
        test: "bg-stone-800",
        stoneBackgroundGradient: "bg-gradient-to-r from-stone-800 via-transparent to-stone-800"
        
    },

    itemColors: {
        vitality:"#7cbb1e",
        spirit:"#ce91ff",
        weapon:"#ec981a",
        search:"#ccbda7"
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
        BulletLifeStealPercent:"Bullet Lifesteal",
        MeleeResistPercent:"Melee Resist",
        TechResist:"Spirit Resist",
        BonusMoveSpeed:"Move Speed",
        BonusAttackRangePercent:"Weapon Fall-off Range",
        BonusZoomPercent:"Weapon Zoom",
        FireRateSlow:"Fire Rate Slow",
        AbilityLifeStealPercentHero:"Spirit Lifesteal",
        MaxHealthLossPercent:"Max Health",
        SlowPercent:"Bullet Slow Proc",
        StatusResistancePercent:"Debuff Resist",
        CooldownReduction:"Cooldown Reduction",
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
        BonusSprintSpeed:{sign:"+",units:"m/s"},
        BonusClipSize:{sign:"+",units:""},
        SlideScale:{sign:"+",units:"%"},
        ReloadSpeedMultipler:{sign:"-",units:"%"},
        MeleeDistanceScale:{sign:"+",units:"%"},
        SpiritPower:{sign:"+",units:""},
        LocalBulletArmorReduction:{sign:"-",units:"%"},
        SlowResistancePercent:{sign:"+",units:"%"},
        BulletLifeStealPercent:{sign:"+",units:"%"},
        MeleeResistPercent:{sign:"+",units:"%"},
        TechResist:{sign:"+",units:"%"},
        BonusMoveSpeed:{sign:"+",units:"m/s"},
        BonusAttackRangePercent:{sign:"+",units:"%"},
        BonusZoomPercent:{sign:"+",units:"%"},
        FireRateSlow:{sign:"",units:"%"},
        AbilityLifeStealPercentHero:{sign:"+",units:"%"},
        MaxHealthLossPercent:{sign:"-",units:"%"},
        SlowPercent:{sign:"+",units:"%"},
        StatusResistancePercent:{sign:"+",units:"%"},
        CooldownReduction:{sign:"+",units:"%"},
    }
}

export default globals;

