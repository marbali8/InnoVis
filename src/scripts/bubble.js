
function Bubble(x, y) {

    this.x = x;
    this.y = y;
    this.r = 48;
    this.col = color(255);

    this.changeColor(){
        this.col = color(random(255), random(255), random(255));
    }

    this.display = function () {
        stroke(255);
        fill(255, 100);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    this.update = function () {
        this.x = this.x + random(-1, 1);
        this.y = this.y + random(-1, 1);
    }


}