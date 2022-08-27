const Player = function() {
    this.inventory = new Array(27);
    this.health = 10.0;
    this.hotbarIndex = 0;
    this.hurtTimer = 0;

    this.sneaking = false;
    this.jumping = false;
    this.falling = false;

    this.getHotbar = () => this.inventory.slice(0,9);
    this.getEmptySlots = () => this.inventory.filter(e=>!e).map((_,i) => i);
    this.getItemIndecies = (name) => this.inventory.filter(item=>item.name == name).map((_,i) => i);

    this.addItem = (item) => {
        const emptySlot = this.getEmptySlots()[0];
        this.inventory[emptySlot] = item;

        const fullIndecies = this.getItemIndecies(item.name);
        const emptyIndecies = this.getEmptySlots();
        if (!fullIndecies) {
            if (!emptyIndecies) return false;
            return this.inventory[emptyIndecies[0]] = item;
        }
        const stackSize = item.stackSize;
        var toDistribute = item.count;
        for (const index of fullIndecies) {
            const count = this.inventory[index].count;
            if (count == stackSize) continue;
            this.inventory[index].count = -1;
            toDistribute -= (stackSize - count);
        }
    }

    this.attack = () => {};
};

export default Player;
