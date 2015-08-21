
"use strict";

class Object
{
    constructor()
    {
        this.collect = false
    }

    update()
    {
        throw new Error("Calling abstract update() on Object!");
    }

    draw()
    {
        throw new Error("Calling abstract draw() on Object!");
    }

    collide(other)
    {
        throw new Error("Calling abstract collide() on Object!");
    }
}

var colliding = function(b1, b2)
{
    return !(b1 === b2 ||
      // b1 right side to left of b2 left side
      b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
      // b1 bottom above b2 top
      b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
      // b1 left greater than b2 right
      b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
      // b1 top below b2 bottom
      b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
}

class GameEngine
{
    constructor(screen, gameSize)
    {
        this.objects = []
        this.screen = screen
        this.gameSize = gameSize
    }

    delObject(obj)
    {
        obj.collect = true
    }

    addObject(obj)
    {
        this.objects.push(obj)
    }

    getObjects(f)
    {
        return this.objects.filter(f)
    }

    update()
    {
        for (var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].update(this);
        }

        for (var i = 0; i < this.objects.length; i++)
        {
            for (var j = 0; j < this.objects.length; j++)
            {
                if (colliding(this.objects[i], this.objects[j]))
                {
                    this.objects[i].collide(this, this.objects[j])
                    this.objects[j].collide(this, this.objects[i])
                }
            }
        }

        this.objects =
            this.objects.filter(function (obj) { return !obj.collect })
    }

    draw()
    {
        this.screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y);
        for (var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].draw(this.screen);
        }
    }

    start()
    {
        var self = this;
        var tick = function()
        {
            self.update();
            self.draw();
            requestAnimationFrame(tick);
        }

        tick()
    }
}
