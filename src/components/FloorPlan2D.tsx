import { useEffect, useRef } from 'react';

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sublabel?: string;
  type: 'room' | 'desk' | 'utility' | 'lobby';
  rotation?: number;
}

const FloorPlan2D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 6;
    const offsetX = 20;
    const offsetY = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawRoom = (room: Room) => {
      const x = room.x * scale + offsetX;
      const y = room.y * scale + offsetY;
      const w = room.width * scale;
      const h = room.height * scale;

      ctx.save();

      if (room.rotation) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate((room.rotation * Math.PI) / 180);
        ctx.translate(-(x + w / 2), -(y + h / 2));
      }

      if (room.type === 'lobby') {
        ctx.fillStyle = '#f1f5f9';
      } else if (room.type === 'room') {
        ctx.fillStyle = '#e0f2fe';
      } else if (room.type === 'desk') {
        ctx.fillStyle = '#fef3c7';
      } else {
        ctx.fillStyle = '#f0fdf4';
      }

      ctx.fillRect(x, y, w, h);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = '#1e293b';
      ctx.font = room.type === 'lobby' ? 'bold 14px Arial' : '11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (room.sublabel) {
        ctx.fillText(room.label, x + w / 2, y + h / 2 - 6);
        ctx.font = '9px Arial';
        ctx.fillText(room.sublabel, x + w / 2, y + h / 2 + 6);
      } else {
        ctx.fillText(room.label, x + w / 2, y + h / 2);
      }

      ctx.restore();
    };

    const drawStairs = (x: number, y: number, width: number, height: number) => {
      const sx = x * scale + offsetX;
      const sy = y * scale + offsetY;
      const sw = width * scale;
      const sh = height * scale;

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(sx, sy, sw, sh);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, sw, sh);

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      for (let i = 1; i < 8; i++) {
        const step = sy + (i * sh) / 8;
        ctx.beginPath();
        ctx.moveTo(sx, step);
        ctx.lineTo(sx + sw, step);
        ctx.stroke();
      }

      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ESCALERAS', sx + sw / 2, sy + sh / 2);
    };

    const drawGrid = (x: number, y: number, width: number, height: number, rows: number, cols: number) => {
      const gx = x * scale + offsetX;
      const gy = y * scale + offsetY;
      const gw = width * scale;
      const gh = height * scale;

      ctx.fillStyle = '#fefce8';
      ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(gx, gy, gw, gh);

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;

      for (let i = 1; i < rows; i++) {
        ctx.beginPath();
        ctx.moveTo(gx, gy + (i * gh) / rows);
        ctx.lineTo(gx + gw, gy + (i * gh) / rows);
        ctx.stroke();
      }

      for (let j = 1; j < cols; j++) {
        ctx.beginPath();
        ctx.moveTo(gx + (j * gw) / cols, gy);
        ctx.lineTo(gx + (j * gw) / cols, gy + gh);
        ctx.stroke();
      }
    };

    drawStairs(5, 112, 15, 15);

    drawRoom({ x: 5, y: 130, width: 20, height: 15, label: 'PRINTER', type: 'utility' });

    drawGrid(35, 125, 15, 20, 2, 3);

    drawRoom({ x: 60, y: 125, width: 40, height: 20, label: 'ZONA AC', type: 'utility' });
    drawGrid(60, 125, 40, 20, 2, 5);

    drawGrid(10, 85, 12, 18, 3, 1);
    ctx.fillStyle = '#1e293b';
    ctx.font = '10px Arial';
    ctx.save();
    ctx.translate(25 * scale + offsetX, 94 * scale + offsetY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('PRINTERS', 0, 0);
    ctx.restore();

    drawRoom({ x: 35, y: 80, width: 20, height: 25, label: 'RECEPCION LOBBY', sublabel: 'PLIHSA', type: 'lobby' });

    for (let i = 0; i < 3; i++) {
      const gx = 65 + i * 12;
      drawGrid(gx, 80, 10, 15, 2, 2);
    }

    const workstations = [
      { x: 10, y: 55, label: 'Mercedez' },
      { x: 20, y: 55, label: 'Arnold' },
      { x: 30, y: 55, label: 'Jose' },
      { x: 40, y: 55, label: 'Angel' },
      { x: 10, y: 45, label: 'Silvia' },
      { x: 20, y: 45, label: 'Roldan' },
      { x: 30, y: 45, label: 'Mario' },
      { x: 40, y: 45, label: 'Lilian' },
      { x: 10, y: 25, label: '1' },
      { x: 20, y: 25, label: '2' },
      { x: 30, y: 25, label: '3' },
      { x: 40, y: 25, label: 'Victoria' },
      { x: 10, y: 15, label: 'Desk1' },
      { x: 20, y: 15, label: 'Desk2' },
      { x: 30, y: 15, label: 'Juan' },
      { x: 40, y: 15, label: 'Gerardo' },
    ];

    workstations.forEach(ws => {
      drawRoom({ x: ws.x, y: ws.y, width: 10, height: 10, label: ws.label, type: 'desk' });
    });

    drawRoom({ x: 50, y: 45, width: 8, height: 20, label: 'EVELYN', type: 'desk', rotation: 0 });
    drawRoom({ x: 50, y: 15, width: 8, height: 20, label: 'MONTALVO', type: 'desk', rotation: 0 });

    drawRoom({ x: 65, y: 15, width: 35, height: 50, label: 'SALA', sublabel: 'TELA', type: 'room' });

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(offsetX, offsetY, 110 * scale, 135 * scale);

  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-light text-slate-900">Vista en Planta - Segundo Piso</h2>
          <p className="text-sm text-slate-500 mt-1">Escala: 1:100</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-slate-900"></div>
            <span>Salas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 border border-slate-900"></div>
            <span>Escritorios</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-slate-900"></div>
            <span>Utilidad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 border border-slate-900"></div>
            <span>Lobby</span>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={1000}
        height={900}
        className="w-full border border-slate-200 rounded"
      />
    </div>
  );
};

export default FloorPlan2D;
