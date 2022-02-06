class BoundingBox {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });

        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }


    // returns true if there is a collision between this and oth
    collide(oth) {
        //console.log("checking collision. this.right: " + this.right + ", this.left: " + this.left);
        //console.log("oth.right: " + oth.right + ", oth.left: " + oth.left);

        if (
            this.right > oth.left &&
            this.left < oth.right &&
            this.top < oth.bottom &&
            this.bottom > oth.top
        )
            return true;
        return false;
    }
}
