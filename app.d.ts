import { Player } from "./model/player.ts";

// You can add shortcut if you define an importmap
declare module "https://deno.land/x/quickapi@v0.0.4/mod.ts" {
    export interface Requester {
        player: Player
    }
}