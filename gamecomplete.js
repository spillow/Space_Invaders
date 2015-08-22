/* @flow */

"use strict";

(function()
{
    class Game
    {
        constructor(canvasId)
        {
            var canvas   = document.getElementById(canvasId)
            var screen   = canvas.getContext('2d')
            var gameSize = { x: canvas.width, y: canvas.height }
            this.engine  = new GameEngine(screen, gameSize)
            this.score   = 0

            var bodies = createInvaders(this).concat(
                [new Player(this, gameSize)])

            for (var i = 0; i < bodies.length; i++)
            {
                this.engine.addObject(bodies[i])
            }

            this.engine.start()
        }

        invadersBelow(invader)
        {
            return this.engine.getObjects(function(b) {
                return b instanceof Invader &&
                    b.center.y > invader.center.y &&
                    b.center.x - invader.center.x < invader.size.x;
            }).length > 0;
        }

        incScore()
        {
            this.score += 20
            var score = document.getElementById("score")
            score.innerHTML = "Score: " + this.score
        }
    }

    class Player extends Object
    {
        constructor(game, gameSize)
        {
            super()
            this.game = game;
            this.size = { x: 15, y: 15 };
            this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y };
            this.keyboarder = new Keyboarder();
        };

        draw(screen)
        {
            drawObject(this, screen, "player.png")
        }

        collide(engine, other)
        {
            playSound("killed.wav")
            engine.delObject(this)
            var gameover = document.getElementById("gameover")
            gameover.innerHTML = "Game Over!"
        }

        update(engine)
        {
            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT))
            {
                this.center.x -= 2;
            }
            else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT))
            {
                this.center.x += 2;
            }

            if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE))
            {
                var bullet = new Bullet({ x: this.center.x,
                                          y: this.center.y - this.size.y / 2 },
                                        { x: 0, y: -6 });
                engine.addObject(bullet);
                playSound("shoot.wav")
                this.keyboarder.stopKey(this.keyboarder.KEYS.SPACE)
            }
        }
    }

    class Bullet extends Object
    {
        constructor(center, velocity)
        {
            super()
            this.size = { x: 3, y: 3 };
            this.center = center;
            this.velocity = velocity;
        }

        collide(engine, other)
        {
            engine.delObject(this)
        }

        update(engine)
        {
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;
        }

        draw(screen)
        {
            drawRect(screen, this)
        }
    }

    class Invader extends Object
    {
        constructor(game, center)
        {
            super()
            this.size = { x: 15, y: 15 };
            this.center = center;
            this.patrolX = 0;
            this.speedX = 0.3 * 30;
            this.game = game;
            this.count = 0;
        }

        collide(engine, other)
        {
            engine.delObject(this)
            playSound("invaderkilled.wav")
            this.game.incScore()
        }

        draw(screen)
        {
            drawObject(this, screen, "enemy.svg")
        }

        update(engine)
        {
            this.count++
            if (this.count < 30)
            {
                return
            }

            this.count = 0

            if (this.patrolX < 0 || this.patrolX > 40)
            {
                this.speedX = -this.speedX;

                // roll down the screen
                this.center.y += 10
            }

            this.center.x += this.speedX;
            this.patrolX += this.speedX;

            if (Math.random() > 0.50 && !this.game.invadersBelow(this))
            {
                var bullet = new Bullet({
                    x: this.center.x,
                    y: this.center.y + this.size.y / 2 },
                    { x: Math.random() / 5.0 - 0.1, y: +2 });
                engine.addObject(bullet);
            }
        }
    }

    var createInvaders = function(game)
    {
        var invaders = [];
        for (var i = 0; i < 40; i++)
        {
            var x = 30 + (i % 8) * 30;
            var y = 30 + (i % 5) * 30;
            invaders.push(new Invader(game, { x: x, y: y }));
        }

        return invaders;
    };

    var drawRect = function(screen, body)
    {
        screen.fillStyle = "white"
        screen.fillRect(body.center.x - body.size.x / 2,
                        body.center.y - body.size.y / 2,
                        body.size.x, body.size.y);
    };

    var playSound = function(url)
    {
        var sound = new Audio(url)
        sound.play()
    };

    var Keyboarder = function()
    {
        var keyState = {};

        window.onkeydown = function(e)
        {
            if (!(e.keyCode in keyState) || keyState[e.keyCode] === false)
            {
                keyState[e.keyCode] = true;
            }
        };

        window.onkeyup = function(e)
        {
            keyState[e.keyCode] = false;
        };

        this.isDown = function(keyCode)
        {
            return keyState[keyCode] === true;
        };

        this.stopKey = function(keyCode)
        {
            return keyState[keyCode] = "down";
        };

        this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
    };

    var drawObject = function(obj, screen, url)
    {
        var img = new Image()
        img.src = url
        screen.drawImage(img,
            obj.center.x - obj.size.x / 2,
            obj.center.y - obj.size.y / 2,
            obj.size.x, obj.size.y);
    }

    window.onload = function()
    {
        new Game("screen");
    };
})();
