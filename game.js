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

            // TODO: Initialize game!
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
            // TODO
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
            // TODO
        }

        collide(engine, other)
        {
            // TODO
        }

        update(engine)
        {
            // TODO
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
            // TODO
        }

        update(engine)
        {
            // TODO
        }

        draw(screen)
        {
            // TODO
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
            // TODO
        }

        draw(screen)
        {
            // TODO
        }

        update(engine)
        {
            // TODO
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
        // TODO
    };

    var playSound = function(url)
    {
        // TODO
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
        // TODO
    }

    window.onload = function()
    {
        // TODO
    };
})();
