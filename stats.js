class PlayerStats {
    constructor(health, hurt, hurtTimeout, hurtTimer, dead, damageDealt) {
        Object.assign(this, { health, hurt, hurtTimeout, hurtTimer, dead, damageDealt });
    }
}

class EnemyStats {
    constructor(speed, health, hurt, hurtTimeout, hurtTimer, dead, deadTimeout, deadTimer, damageDealt, attackTimeout, attackTimer) {
        Object.assign(this, { speed, health, hurt, hurtTimeout, hurtTimer, dead, deadTimeout, deadTimer, damageDealt, attackTimeout, attackTimer });
    }
}