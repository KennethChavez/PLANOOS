import { useEffect, useRef } from 'react';

interface NetworkPoint {
  x: number;
  y: number;
  type: 'ap' | 'rj45';
  label?: string;
  ipAddress?: string;
}

interface CablePath {
  from: NetworkPoint;
  to: NetworkPoint;
  type: 'cat6' | 'cat6a';
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

    const drawRoom = (x: number, y: number, width: number, height: number, fillColor: string, label: string, sublabel?: string) => {
      const rx = x * scale + offsetX;
      const ry = y * scale + offsetY;
      const rw = width * scale;
      const rh = height * scale;

      ctx.fillStyle = fillColor;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, rw, rh);

      ctx.fillStyle = '#1e293b';
      ctx.font = sublabel ? 'bold 12px Arial' : '11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (sublabel) {
        ctx.fillText(label, rx + rw / 2, ry + rh / 2 - 6);
        ctx.font = '9px Arial';
        ctx.fillText(sublabel, rx + rw / 2, ry + rh / 2 + 6);
      } else {
        ctx.fillText(label, rx + rw / 2, ry + rh / 2);
      }
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

    const drawAP = (x: number, y: number, label: string, ipAddress: string) => {
      const px = x * scale + offsetX;
      const py = y * scale + offsetY;
      const radius = 8;

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AP', px, py - 1);

      ctx.fillStyle = '#1e293b';
      ctx.font = '7px Arial';
      ctx.fillText(label, px, py + 10);
      ctx.font = '6px Arial';
      ctx.fillStyle = '#dc2626';
      ctx.fillText(ipAddress, px, py + 18);
    };

    const drawRJ45 = (x: number, y: number, label: string, ipAddress: string) => {
      const px = x * scale + offsetX;
      const py = y * scale + offsetY;
      const size = 6;

      ctx.fillStyle = '#2563eb';
      ctx.fillRect(px - size / 2, py - size / 2, size, size);

      ctx.strokeStyle = '#1e60a6';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px - size / 2, py - size / 2, size, size);

      ctx.fillStyle = '#1e293b';
      ctx.font = '6px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, px, py + 8);
      ctx.fillStyle = '#2563eb';
      ctx.fillText(ipAddress, px, py + 14);
    };

    const drawCable = (fromX: number, fromY: number, toX: number, toY: number, type: 'cat6' | 'cat6a') => {
      const fx = fromX * scale + offsetX;
      const fy = fromY * scale + offsetY;
      const tx = toX * scale + offsetX;
      const ty = toY * scale + offsetY;

      if (type === 'cat6a') {
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
      }

      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawStairs(5, 112, 15, 15);
    drawRoom(5, 130, 20, 15, '#f0fdf4', 'PRINTER', undefined);
    drawGrid(35, 125, 15, 20, 2, 3);
    drawRoom(60, 125, 40, 20, '#f0fdf4', 'ZONA AC', undefined);
    drawGrid(60, 125, 40, 20, 2, 5);

    drawGrid(10, 85, 12, 18, 3, 1);
    ctx.fillStyle = '#1e293b';
    ctx.font = '10px Arial';
    ctx.save();
    ctx.translate(25 * scale + offsetX, 94 * scale + offsetY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('PRINTERS', 0, 0);
    ctx.restore();

    drawRoom(35, 80, 20, 25, '#f1f5f9', 'RECEPCION LOBBY', 'PLIHSA');

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
      drawRoom(ws.x, ws.y, 10, 10, '#fef3c7', ws.label, undefined);
    });

    drawRoom(50, 45, 8, 20, '#fef3c7', 'EVELYN', undefined);
    drawRoom(50, 15, 8, 20, '#fef3c7', 'MONTALVO', undefined);

    drawRoom(65, 15, 35, 50, '#e0f2fe', 'SALA', 'TELA');

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(offsetX, offsetY, 110 * scale, 135 * scale);

    ctx.setLineDash([]);

    drawAP(82, 30, 'AP-5', '192.168.1.25');
    drawAP(25, 85, 'AP-1', '192.168.1.21');
    drawAP(45, 85, 'AP-2', '192.168.1.22');
    drawAP(18, 45, 'AP-3', '192.168.1.23');
    drawAP(16, 100, 'AP-4', '192.168.1.24');

    drawRJ45(10, 25, 'RJ-1', '192.168.1.31');
    drawRJ45(14, 25, 'RJ-2', '192.168.1.32');
    drawRJ45(20, 25, 'RJ-3', '192.168.1.33');
    drawRJ45(24, 25, 'RJ-4', '192.168.1.34');
    drawRJ45(30, 25, 'RJ-5', '192.168.1.35');
    drawRJ45(34, 25, 'RJ-6', '192.168.1.36');

    drawCable(82, 30, 82, 15, 'cat6a');
    drawCable(25, 85, 25, 100, 'cat6a');
    drawCable(45, 85, 45, 100, 'cat6a');
    drawCable(18, 45, 18, 55, 'cat6a');
    drawCable(16, 100, 16, 112, 'cat6a');

    drawCable(10, 25, 10, 35, 'cat6');
    drawCable(14, 25, 14, 35, 'cat6');
    drawCable(20, 25, 20, 35, 'cat6');
    drawCable(24, 25, 24, 35, 'cat6');
    drawCable(30, 25, 30, 35, 'cat6');
    drawCable(34, 25, 34, 35, 'cat6');

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('LEYENDA RED:', offsetX + 600, offsetY + 10);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(offsetX + 610, offsetY + 30, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.font = '9px Arial';
    ctx.fillText('AP Unifi 7 Pro', offsetX + 625, offsetY + 33);

    ctx.fillStyle = '#2563eb';
    ctx.fillRect(offsetX + 607, offsetY + 48, 6, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillText('RJ45 - Cat 6', offsetX + 625, offsetY + 51);

    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(offsetX + 605, offsetY + 68);
    ctx.lineTo(offsetX + 625, offsetY + 68);
    ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.fillText('Cable Cat 6A', offsetX + 635, offsetY + 65);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(offsetX + 605, offsetY + 88);
    ctx.lineTo(offsetX + 625, offsetY + 88);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#1e293b';
    ctx.fillText('Cable Cat 6', offsetX + 635, offsetY + 85);

  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-xl font-light text-slate-900">Plano Infraestructura de Red - 2D</h2>
        <p className="text-sm text-slate-500 mt-1">Escala: 1:100 | Sistema UNIFI 7 PRO | Cat 6A para AP, Cat 6 para RJ45</p>
      </div>
      <div className="overflow-x-auto">
        <canvas
          ref={canvasRef}
          width={1200}
          height={900}
          className="border border-slate-200 rounded"
        />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Puntos de Acceso (AP)</h3>
          <ul className="space-y-2 text-slate-600">
            <li>AP-1: Lobby - 192.168.1.21</li>
            <li>AP-2: Zona Central - 192.168.1.22</li>
            <li>AP-3: Entre Mario y Desk 3 - 192.168.1.23</li>
            <li>AP-4: Zona Printers - 192.168.1.24</li>
            <li>AP-5: Sala TELA - 192.168.1.25</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Puntos de Red (RJ45)</h3>
          <ul className="space-y-2 text-slate-600">
            <li>Desktop 1: RJ-1, RJ-2 (192.168.1.31-32)</li>
            <li>Desktop 2: RJ-3, RJ-4 (192.168.1.33-34)</li>
            <li>Desktop 3: RJ-5, RJ-6 (192.168.1.35-36)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FloorPlan2D;
