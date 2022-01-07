class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration});
            // removed padding, reverse and loop
        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;

    };

    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        // if (this.isDone()) {
        //     if (this.loop) {
        //         this.elapsedTime -= this.totalTime;
        //     } else {
        //         return;
        //     }
        // }

        let frame = this.currentFrame();
        //if (this.reverse) frame = this.frameCount - frame - 1;
        ctx.drawImage(this.spritesheet,
            this.xStart + frame * this.width, this.yStart,
            //this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
            this.width, this.height,
            x, y,
            this.width * scale,
            this.height * scale);

        // if (PARAMS.DEBUG) {
        //     ctx.strokeStyle = 'Green';
        //     ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        // }
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};