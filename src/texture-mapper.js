const cubeAll = (name) => new Array(6).fill(name);
const cubeBottomTop = (top,side,bottom) => [side,side,side,side,top,bottom];
const cubeColumn = (top,side) => cubeBottomTop(top,side,top);

export const blockTextureMapping = {
    dirt: cubeAll("dirt"),
    stone: cubeAll("stone"),
    log: cubeColumn("oak_log_top","oak_log"),
    bedrock: cubeAll("bedrock"),
    diamond: cubeAll("diamond"),
    grass: cubeBottomTop("grass_top","grass_side","dirt"),
    oak_log: cubeColumn("oak_log_top","oak_log"),
    leaves:cubeAll("leaves"),
    planks: cubeAll("planks"),
    cobblestone: cubeAll("cobblestone"),
}

export const getFaceIndex = (faceName) => ["north","east","south","west","up","down"].indexOf(faceName);