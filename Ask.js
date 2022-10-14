var Game;
(function (Game) {
    var Eros = /** @class */ (function () {
        function Eros() {
        }
        // inicio
        Eros.start = function () {
            if (Eros.canvas) {
                var canvas = Eros.canvas;
                canvas.width = 1024;
                canvas.height = 640;
                canvas.style.position = 'absolute';
                canvas.style.top = '50%';
                canvas.style.left = '50%';
                canvas.style.transform = 'translate(-50%,-50%)';
            }
            Player.selected = 0;
            Eros.controls();
            Eros.update();
            var fps = 0;
            var startTime = Date.now();
            var frame = 0;
            function tick() {
                var time = Date.now();
                frame++;
                if (time - startTime > 1000) {
                    fps = frame / ((time - startTime) / 1000);
                    startTime = time;
                    frame = 0;
                }
                if (Eros.ctx) {
                    Eros.ctx.fillText(fps.toFixed(1), 20, 20, 50);
                }
                window.requestAnimationFrame(tick);
            }
            tick();
        };
        // animacion
        Eros.update = function () {
            if (Player.selected < 0) {
                Player.selected = 0;
            }
            else if (Player.selected > Player.gun.length - 1) {
                Player.selected = Player.gun.length - 1;
            }
            // key controls handler
            if (Eros.lastKey_X == 'd') {
                Player.vel.x -= 0.1;
                if (Player.vel.x <= 0) {
                    Player.vel.x = 0;
                }
            }
            if (Eros.lastKey_X == 'a') {
                Player.vel.x += 0.1;
                if (Player.vel.x >= 0) {
                    Player.vel.x = 0;
                }
            }
            if (Eros.lastKey_Y == 's') {
                Player.vel.y -= 0.1;
                if (Player.vel.y <= 0) {
                    Player.vel.y = 0;
                }
            }
            if (Eros.lastKey_Y == 'w') {
                Player.vel.y += 0.1;
                if (Player.vel.y >= 0) {
                    Player.vel.y = 0;
                }
            }
            if (Eros.lastKey_X === '') {
                if (Player.vel.x > 4.7) {
                    Player.vel.x = 5;
                }
                else if (Player.vel.x < -4.7) {
                    Player.vel.x = -5;
                }
            }
            if (Eros.lastKey_Y === '') {
                if (Player.vel.y > 4.7) {
                    Player.vel.y = 5;
                }
                else if (Player.vel.y < -4.7) {
                    Player.vel.y = -5;
                }
            }
            // llama la funcion update indefinidamente
            requestAnimationFrame(Eros.update);
            if (Eros.canvas) {
                if (Eros.ctx) {
                    // limpialla pantalla
                    Eros.ctx.clearRect(0, 0, Eros.canvas.width, Eros.canvas.height);
                    // actualiza al jugador
                    Player.update();
                    // actualiza la posision del mouse
                    Mouse.update();
                }
            }
        };
        // controles
        Eros.controls = function () {
            window.addEventListener('keydown', Eros.keyDownHandler);
            window.addEventListener('keyup', Eros.keyUpHandler);
        };
        // keydown
        Eros.keyDownHandler = function (e) {
            switch (e.key) {
                case 'd':
                    Eros.lastKey_X = '';
                    Player.vel.x += 3;
                    break;
                case 'a':
                    Eros.lastKey_X = '';
                    Player.vel.x -= 3;
                    break;
                case 's':
                    Eros.lastKey_Y = '';
                    Player.vel.y += 3;
                    break;
                case 'w':
                    Eros.lastKey_Y = '';
                    Player.vel.y -= 3;
                    break;
            }
        };
        Eros.keyUpHandler = function (e) {
            switch (e.key) {
                case 'd':
                    Eros.lastKey_X = 'd';
                    break;
                case 'a':
                    Eros.lastKey_X = 'a';
                    break;
                case 's':
                    Eros.lastKey_Y = 's';
                    break;
                case 'w':
                    Eros.lastKey_Y = 'w';
                    break;
                case 'q':
                    Player.selected -= 1;
                    break;
                case 'e':
                    Player.selected += 1;
                    break;
            }
        };
        var _a;
        Eros.canvas = document.querySelector('canvas');
        Eros.ctx = (_a = Eros.canvas) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        return Eros;
    }());
    Game.Eros = Eros;
    // jugador
    var Player = /** @class */ (function () {
        function Player() {
        }
        // dibuja al jugador
        Player.draw = function () {
            Player.player.src = Player.bot;
            var c = Eros.ctx;
            if (c && Eros.canvas) {
                c.imageSmoothingEnabled = false;
                c.save();
                c.translate(Player.pos.x + Player.size.w / 2, Player.pos.y + Player.size.h / 2);
                if (Mouse.pos.x < Player.pos.x) {
                    c.scale(-1, 1);
                }
                c.fillStyle = 'black';
                Player.frame_width = Player.player.width / 4;
                c.fillStyle = 'red';
                c.drawImage(Player.player, Player.current_frame * Player.frame_width, 0, Player.frame_width, Player.frame_width, -32, -32, 64, 64);
                Player.fps += 1;
                if (Player.fps % 7 === 0) {
                    Player.current_frame++;
                }
                if (Player.current_frame > 3) {
                    Player.current_frame = 0;
                }
                c.restore();
            }
        };
        // dibuja el arma
        Player.drawGun = function () {
            if (Eros.ctx) {
                var ctx = Eros.ctx;
                // Store the current context state (i.e. rotation, translation etc..)
                ctx.save();
                var deg = ((Math.atan2(Player.pos.x - Mouse.pos.x, Player.pos.y - Mouse.pos.y) *
                    180) /
                    -Math.PI) *
                    Math.PI;
                //Convert degrees to radian
                var rad = deg / 180;
                //Set the origin to the center of the player
                if (Mouse.pos.x < Player.pos.x) {
                    ctx.translate(Player.pos.x + Player.size.w / 2 + 10, Player.pos.y + Player.size.h / 2 + 15);
                    ctx.scale(-1, 1);
                    rad = -deg / 180;
                }
                else {
                    ctx.translate(Player.pos.x + Player.size.w / 2 - 10, Player.pos.y + Player.size.h / 2 + 15);
                }
                //Rotate the canvas around the origin
                ctx.rotate(0);
                ctx.rotate(rad + 360 - 45 / 2);
                Player.weapon.src = Player.gun[Player.selected];
                //draw the image
                // ctx.drawImage(img, (width / 2) * -1, (height / 2) * -1, width, height);
                ctx.fillStyle = 'red';
                ctx.drawImage(Player.weapon, -16, -32, 64, 64);
                // Restore canvas state as saved from above
                ctx.restore();
            }
        };
        // animacion del judgador
        Player.update = function () {
            Player.check_offScreen();
            Player.draw();
            Player.drawGun();
            Player.pos.x += Player.vel.x;
            Player.pos.y += Player.vel.y;
        };
        // revisa si el jugador sale de la pantall
        Player.check_offScreen = function () {
            if (Eros.canvas) {
                var canvas = Eros.canvas;
                if (Player.pos.x < -Player.size.w) {
                    Player.pos.x = canvas.width + Player.size.w;
                }
                if (Player.pos.x > canvas.width + Player.size.w) {
                    Player.pos.x = -Player.size.w;
                }
                if (Player.pos.y < -Player.size.h) {
                    Player.pos.y = canvas.height + Player.size.h;
                }
                if (Player.pos.y > canvas.height + Player.size.h) {
                    Player.pos.y = -Player.size.h;
                }
            }
        };
        Player.pos = { x: 512 - 64, y: 320 - 64 };
        Player.vel = { x: 0, y: 0 };
        Player.size = { w: 64, h: 64 };
        Player.player = new Image();
        Player.bot = './assets/player/bmo.png';
        Player.weapon = new Image();
        Player.gun = ['./assets/guns/gun.png', './assets/guns/AK47.png'];
        Player.selected = 0;
        // frame
        Player.fps = 0;
        Player.frame_width = 0;
        Player.current_frame = 0;
        return Player;
    }());
    var Mouse = /** @class */ (function () {
        function Mouse() {
        }
        Mouse.update = function () {
            if (Eros.ctx) {
                var ctx = Eros.ctx;
                ctx.fillStyle = 'blue';
                ctx.fillRect(Mouse.pos.x, Mouse.pos.y, Mouse.w, Mouse.h);
            }
            if (Eros.canvas) {
                Eros.canvas.style.cursor = 'none';
                Eros.canvas.addEventListener('mousemove', function (e) {
                    Mouse.pos.x = e.offsetX;
                    Mouse.pos.y = e.offsetY;
                });
            }
        };
        Mouse.pos = {
            x: 0,
            y: 0
        };
        Mouse.w = 5;
        Mouse.h = 5;
        return Mouse;
    }());
})(Game || (Game = {}));
Game.Eros.start();
