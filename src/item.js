export const Item = function(name,{stacksize=64,durability=0}) {
    this.name = name;
    this.stacksize = stacksize;
    this.durability = durability;
    this.count = 1;
}