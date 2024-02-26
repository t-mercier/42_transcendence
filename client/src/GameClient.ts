import { GameCommon, V2 } from './GameCommon';
import { socket } from './game.socket';

export default class GameClient extends GameCommon {
  ctx!: CanvasRenderingContext2D;
  b!: V2;
  keys = {
    w: false,
    s: false,
    i: false,
    k: false,
  };
  evdown!: (e: KeyboardEvent) => void;
  evup!: (e: KeyboardEvent) => void;
  user!: string;
  id!: string;
  frameid!: number;
  iv!: unknown;

  load(ctx: CanvasRenderingContext2D, user: string, id: string) {
    this.unload();
    this.ctx = ctx;
    this.user = user;
    this.create(GameClient.W, GameClient.H);
    this.frameid = 0;
    this.id = id;

    this.b = { x: this.w / 2, y: this.h / 2 };

    this.evdown = ((e: KeyboardEvent) => {
      if (e.repeat) return;
      this.onkeychange(e.key);
      if (e.key in this.keys) this.keys[e.key as keyof typeof this.keys] = true;
    }).bind(this);
    this.evup = ((e: KeyboardEvent) => {
      if (e.repeat) return;

      this.onkeychange(e.key);
      if (e.key in this.keys)
        this.keys[e.key as keyof typeof this.keys] = false;
    }).bind(this);

    socket.connect();
    this.mcb = socket.emit.bind(socket);

    socket.onAny((e, v) => this.emit(e, v, false));

    this.on('frame', (e) => {
      console.log('frame');

      this.b = e.b.p;
      this.pa = e.pa;
      this.pb = e.pb;
    });
    this.emit('create', this.id);
    this.emit('join', this.id);
    this.on('join', (v) => {
      this.users.add(v);
    });

    this.on('leave', (v) => {
      this.users.delete(v);
    });

    // this.iv = setInterval(() => {
    //   this.update();
    // }, 1000 / 30);

    window.addEventListener('keydown', this.evdown);
    window.addEventListener('keyup', this.evup);
    this.draw();
  }

  unload() {
    window.removeEventListener('keydown', this.evdown);
    window.removeEventListener('keyup', this.evup);
    socket.disconnect();
    cancelAnimationFrame(this.frameid);
    // clearInterval(this.iv);
  }

  start() {
    this.emit('start', this.id);
  }

  joinAnon() {
    this.emit('join_anon', this.id);
  }

  onkeychange(key: string) {
    if (key == 'w') this.emit('up', this.user);
    else if (key == 's') this.emit('down', this.user);
  }

  update() {
    if (this.keys.i) {
      this.pb = Math.min(
        this.h - GameClient.PH - GameClient.PPAD,
        Math.max(GameClient.PPAD, this.pb - GameClient.PSPEED),
      );
    } else if (this.keys.k) {
      this.pb = Math.min(
        this.h - GameClient.PH - GameClient.PPAD,
        Math.max(GameClient.PPAD, this.pb + GameClient.PSPEED),
      );
    }
  }

  _draw = this.draw.bind(this);

  draw() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.w, this.h);

    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';

    this.ctx.fillRect(10, this.pa, 20, 100);
    this.ctx.fillRect(this.ctx.canvas.width - 30, this.pb, 20, 100);

    this.ctx.beginPath();
    this.ctx.arc(this.b.x, this.b.y, 10, 0, 2 * Math.PI, false);
    this.ctx.fill();

    this.frameid = requestAnimationFrame(this._draw);
  }
}
