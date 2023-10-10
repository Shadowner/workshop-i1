export enum PartyStatus {
    LOBBY, // On attend que les joueurs se connectent
    DISCOVERING, // Chaque joueur découvre son histoire
    PLAYING, // Les joueurs jouent (Impossible de voter)
    STATISTIC, // Des statistiques sur l'histoire
    FINISHED, // La partie est terminée
}

/**
 * Exemple d'une partie
 * LOBBY
 * DISCOVERING
 * PLAYING
 * VOTING
 * STATISTIC
 * DISCOVERING
 * PLAYING
 * VOTING
 * STATISTIC
 * FINISHED
 */