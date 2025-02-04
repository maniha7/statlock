import weaponIcon from './assets/weaponitems_icon.png'
import vitalityIcon from './assets/vitalityitems_icon.png'
import spiritIcon from './assets/spirititems_icon.png'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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
        darkGrey:"#0d0d0d",
        stone800Background: '#292524',
        stoneBackgroundGradient: "bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900",
        stoneBackgroundGradient2: "bg-gradient-to-r from-stone-800 via-transparent to-stone-900",
        stoneBackgroundGradient3: "bg-gradient-to-r from-stone-900 to-stone-800",
        stoneBorderGradient: "border-gradient-to-r from-stone-600 to-stone-700",
        offWhite:"#d2d2cb",
        itemLabelBackground:"#F0E1CB",
        itemText:"#ffefd7",
        itemUnitsText:"#c4beb5",
        itemLabelBlack:"#070d0d",
        itemNegativePropertyRed:"#FF6B6B",
        itemCost:"#9affd6",
        deadLockDark:"#231f20",
        deadLockLight:"#f0dfbf",
    },

    itemColors: {
        vitality:{
            typeText:"#00FF9A",
            light:"#fff", //todo?
            base:"#74b01c",
            medium:"#659818",
            mediumDark:"#4d7214",
            mediumDarker:"#436310",
            dark:"#354f11",
            darkPlus:"#203500",
            veryDark:"#172801",
            t4gradient:"bg-gradient-to-br from-[#709c34] to-[#c7ee8e]",
            basetw:"bg-[#74b01c]"

        },
        spirit:{
            typeText:"#CE91FF",
            light:"#dbbff2",
            base:"#c288f0",
            medium:"#8b56b4",
            mediumDark:"#623585",
            mediumDarker:"#552D74",
            dark:"#43265b",
            darkPlus:"#372248",
            veryDark:"#291937",
            t4gradient:"bg-gradient-to-br from-[#9065b3] to-[#dabef0]",
            basetw:"bg-[#c288f0]"
        },
        weapon:{
            typeText:"#E39319",
            light:"#fff", //todo?
            base:"#d08d3e",
            medium:"#c97a03",
            mediumDark:"#80550f",
            mediumDarker:"#704A0C",
            dark:"#573908",
            darkPlus:"#573908",
            veryDark:"#392709",
            t4gradient:"bg-gradient-to-br from-[#a06d2c] to-[#f0c685]",
            basetw:"bg-[#d08d3e]"
        },
        search:{base:"#ccbda7"},
        
        
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
        search:MagnifyingGlassIcon
    },

    itemBaseBonuses:{
        weapon:{
            "500":6,
            "1250":10,
            "3000":12,
            "6000":18
        },
        vitality:{
            "500":11,
            "1250":14,
            "3000":17,
            "6000":20
        },
        spirit:{
            "500":4,
            "1250":8,
            "3000":12,
            "6000":16
        },
    },
    itemBaseBonusTypes:{
        weapon:"Weapon Damage",
        vitality:"Base Health",
        spirit:"Spirit Power"
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
        "AbilityCooldown",
        "ChainTickRate",
        "ImmunityDuration",
    ]),

    activeHiddenProperties: new Set([
        "AbilityCooldown",
        "ChainTickRate",
        "ImmunityDuration",
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
        Stamina:"Stamina",

    },

    itemIDtoNameMapPassive:{
        MagicIncreasePerStack:"Spirit Amp Per Stack",
        SpiritDamage:"Spirit Damage",
        TechArmorGain:"Spirit Resist Steal",
        TechPowerGain:"Spirit Power Steal",
        AmmoPerSoul:"Ammo Per Soul",
        SpiritPowerPerSoul:"Spirit Power Per Soul",
        AbilityDuration:"Duration",
        MaxStacks:"Max Stacks",
        BulletArmorReduction:"Bullet Resist",
        FireRateBonus:"Fire Rate Bonus",
        ProcCooldown:"Max Frequency",
        MaxHealthDamage:"Max Health Bonus Damage",
        MovementSpeedSlow:"Movement Slow",
        ImbuedTechPower:"Imbued Ability Spirit Power",
        MovementSpeedBonusDuration:"Move Speed Duration",
        DamagePulseAmount:"Pulse Damage",
        DamagePulseRadius:"Pulse Radius",
        BulletShieldOnCast:"Bullet Shield",
        TechShieldOnCast:"Spirit Shield",
        BuffDuration:"Buff Duration",
        TechDamagePercent:"Damage",
        DelayDuration:"Delay Duration",
        CloseRangeBonusWeaponPower:"Weapon Damage",
        CloseRangeBonusDamageRange:"Close Range",
        HeadShotBonusDamage:"Head Shot Bonus Damage",
        LongRangeBonusWeaponPower:"Weapon Damage",
        LongRangeBonusWeaponPowerMinRange:"Min. Distance",
        BonusHeavyMeleeDamage:"Bonus Heavy Damage",
        SlowDuration:"Slow Duration",
        SlowPercent:"Movement Slow",
        ShreddersTechAmp:"Spirit Amp",
        MaxArmorStacks:"Max Bullet Resist",
        BulletResistDuration:"Stack Duration",
        BulletResistPerStack:"Bullet Resist Per Stack",
        HealPercentPerHeadshot:"Heal Per Headshot",
        BaseAttackDamagePercentAtMaxDuration:"Max Weapon Damage",
        ShootDurationForMax:"Time For Max Damage",
        BaseAttackDamagePercentBonus:"Weapon Damage",
        BonusAmpPerHeadshot:"Spirit Amp Per Headshot",
        DebuffDuration:"Debuff Duration",
        AbilityLifestealPercentHero:"Spirit Lifesteal Proc",
        ProcBonusMagicDamage:"Spirit Damage",
        HealFromHero:"Healing From Heroes",
        HealFromNPC:"Healing From NPCs/Orbs",
        WeaponPowerPerStack:"Weapon Damage Per Stack",
        ActivatedFireRate:"Fire Rate",
        BonusFireRatePlayerUnit:"Minions Fire Rate",
        DamagePerChain:"Shock Damage",
        BonusPerChain:"Damage On Jump",
        ChainRadius:"Jump Radius",
        ProcChange:"Proc Chance",
        ChainCount:"Max Jumps",
        DotHealthPercent:"Bleed Damage",
        HealAmpReceivePenaltyPercent:"Healing Reduction",
        BulletResistReduction:"Bullet Resist Reduction",
        MagicResistReduction:"Spirit Resist Reduction",
        FervorBulletResist:"Bullet Resist",
        FervorFireRate:"Fire Rate",
        FervorMovespeed:"Move Speed",
        WeaponPowerPerKill:"Weapon Damage Per Kill",
        CritDamagePercent:"Bonus Weapon Damage",
        RicochetDamagePercent:"Ricochet Damage",
        BuildUpPerShot:"Buildup Per Shot",
        SilenceDuration:"Silence Duration",
        TechDamageReduction:"Spirit Damage Reduction",
        BonusSpirit:"Spirit Power",
        AttackDamageWhenShielded:"Weapon Damage While Shielded",
        FireRateWhenShielded:"Fire Rate While Shielded",
        BonusSpiritWithMagicShield:"Spirit Power While Shielded",
        CooldownReductionWithShield:"Cooldown Reduction While Shielded",
        HealOnKill:"Heal On Hero Kill",
        VexBarrierBulletMaxHealth:"Bullet Shield Health",
        VexBarrierTechMaxHealth:"Spirit Shield Health",
        VexBarrierShieldDuration:"Duration",
        OutgoingDamagePenaltyPercent:"Damage Penalty",
        HealthSteal:"Max HP Steal Per Bullet",
        StealDuration:"Steal Duration",
        InvisDuration:"Invisibility Duration",
    },

    itemIDtoNameMapActive:{
        ActiveBonusMoveSpeed:"Move Speed",
        AmbushBonusTechPower:"Ambush Spirit Power",
        AmbushBonusFireRate:"Ambush Fire Rate",
        AmbushDuration:"Ambush Duration",
        AbilityDuration:"Duration",
        ActiveBonusFireRate:"Fire Rate",
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
    },

    itemIDtoUnitMapPassive:{
        MagicIncreasePerStack:{sign:"+",units:"%"},
        SpiritDamage:{sign:"",units:""},
        TechArmorGain:{sign:"",units:""},
        TechPowerGain:{sign:"",units:""},
        AmmoPerSoul:{sign:"+",units:""},
        SpiritPowerPerSoul:{sign:"+",units:""},
        AbilityDuration:{sign:"",units:"s"},
        MaxStacks:{sign:"",units:""},
        BulletArmorReduction:{sign:"-",units:"%"},
        FireRateBonus:{sign:"",units:"%"},
        ProcCooldown:{sign:"",units:"s"},
        MaxHealthDamage:{sign:"",units:"%"},
        MovementSpeedSlow:{sign:"",units:"%"},
        ImbuedTechPower:{sign:"+",units:""},
        MovementSpeedBonusDuration:{sign:"",units:"s"},
        DamagePulseAmount:{sign:"",units:""},
        DamagePulseRadius:{sign:"",units:""},
        BulletShieldOnCast:{sign:"",units:""},
        TechShieldOnCast:{sign:"",units:""},
        BuffDuration:{sign:"",units:"s"},
        TechDamagePercent:{sign:"",units:"%"},
        DelayDuration:{sign:"",units:"s"},
        CloseRangeBonusWeaponPower:{sign:"+",units:"%"},
        CloseRangeBonusDamageRange:{sign:"",units:""},
        HeadShotBonusDamage:{sign:"+",units:""},
        LongRangeBonusWeaponPower:{sign:"+",units:"%"},
        LongRangeBonusWeaponPowerMinRange:{sign:"",units:""},
        BonusHeavyMeleeDamage:{sign:"+",units:"%"},
        SlowDuration:{sign:"",units:"s"},
        SlowPercent:{sign:"",units:"%"},
        ShreddersTechAmp:{sign:"",units:"%"},
        MaxArmorStacks:{sign:"",units:"%"},
        BulletResistDuration:{sign:"",units:"s"},
        BulletResistPerStack:{sign:"",units:"%"},
        HealPercentPerHeadshot:{sign:"",units:"%"},
        BaseAttackDamagePercentAtMaxDuration:{sign:"",units:"%"},
        ShootDurationForMax:{sign:"",units:"s"},
        BaseAttackDamagePercentBonus:{sign:"+",units:"%"},
        BonusAmpPerHeadshot:{sign:"+",units:"%"},
        DebuffDuration:{sign:"",units:"s"},
        AbilityLifestealPercentHero:{sign:"+",units:"%"},
        ProcBonusMagicDamage:{sign:"+",units:""},
        HealFromHero:{sign:"",units:""},
        HealFromNPC:{sign:"",units:""},
        WeaponPowerPerStack:{sign:"+",units:"%"},
        ActivatedFireRate:{sign:"+",units:"%"},
        BonusFireRatePlayerUnit:{sign:"+",units:"%"},
        DamagePerChain:{sign:"",units:""},
        BonusPerChain:{sign:"",units:""},
        ChainRadius:{sign:"",units:""},
        ProcChange:{sign:"",units:"%"},
        ChainCount:{sign:"",units:""},
        DotHealthPercent:{sign:"",units:"%/sec"},
        HealAmpReceivePenaltyPercent:{sign:"",units:"%"},
        BulletResistReduction:{sign:"",units:"%"},
        MagicResistReduction:{sign:"",units:"%"},
        FervorBulletResist:{sign:"+",units:"%"},
        FervorFireRate:{sign:"+",units:"%"},
        FervorMovespeed:{sign:"+",units:""},
        WeaponPowerPerKill:{sign:"+",units:"%"},
        CritDamagePercent:{sign:"+",units:"%"},
        RicochetDamagePercent:{sign:"",units:"%"},
        BuildUpPerShot:{sign:"",units:"%"},
        SilenceDuration:{sign:"",units:"s"},
        TechDamageReduction:{sign:"",units:"%"},
        BonusSpirit:{sign:"+",units:""},
        AttackDamageWhenShielded:{sign:"+",units:"%"},
        FireRateWhenShielded:{sign:"+",units:"%"},
        BonusSpiritWithMagicShield:{sign:"+",units:""},
        CooldownReductionWithShield:{sign:"+",units:"%"},
        HealOnKill:{sign:"",units:""},
        VexBarrierBulletMaxHealth:{sign:"+",units:""},
        VexBarrierTechMaxHealth:{sign:"+",units:""},
        VexBarrierShieldDuration:{sign:"",units:"s"},
        OutgoingDamagePenaltyPercent:{sign:"",units:"%"},
        HealthSteal:{sign:"",units:""},
        StealDuration:{sign:"",units:"s"},
        InvisDuration:{sign:"",units:"s"},
    },
    
    itemIDtoUnitMapActive:{

    }
}

export default globals;

