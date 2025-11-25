import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const FloorPlan3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(45);
  const [tilt, setTilt] = useState(30);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 5;

    const project = (x: number, y: number, z: number) => {
      const rad = (rotation * Math.PI) / 180;
      const tiltRad = (tilt * Math.PI) / 180;

      const rotX = x * Math.cos(rad) - y * Math.sin(rad);
      const rotY = x * Math.sin(rad) + y * Math.cos(rad);
      const rotZ = z;

      const projX = rotX;
      const projY = rotY * Math.cos(tiltRad) - rotZ * Math.sin(tiltRad);

      return {
        x: centerX + projX * scale,
        y: centerY - projY * scale,
      };
    };

    const drawBox = (
      x: number,
      y: number,
      z: number,
      width: number,
      depth: number,
      height: number,
      color: string,
      label?: string
    ) => {
      const corners = [
        project(x, y, z),
        project(x + width, y, z),
        project(x + width, y + depth, z),
        project(x, y + depth, z),
        project(x, y, z + height),
        project(x + width, y, z + height),
        project(x + width, y + depth, z + height),
        project(x, y + depth, z + height),
      ];

      ctx.fillStyle = color;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      ctx.lineTo(corners[1].x, corners[1].y);
      ctx.lineTo(corners[2].x, corners[2].y);
      ctx.lineTo(corners[3].x, corners[3].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const topColor = shadeColor(color, 20);
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(corners[4].x, corners[4].y);
      ctx.lineTo(corners[5].x, corners[5].y);
      ctx.lineTo(corners[6].x, corners[6].y);
      ctx.lineTo(corners[7].x, corners[7].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const sideColor = shadeColor(color, -15);
      ctx.fillStyle = sideColor;
      ctx.beginPath();
      ctx.moveTo(corners[1].x, corners[1].y);
      ctx.lineTo(corners[5].x, corners[5].y);
      ctx.lineTo(corners[6].x, corners[6].y);
      ctx.lineTo(corners[2].x, corners[2].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (label) {
        const labelPos = project(x + width / 2, y + depth / 2, z + height + 2);
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, labelPos.x, labelPos.y);
      }
    };

    const drawAP3D = (x: number, y: number, z: number, label: string) => {
      const pos = project(x, y, z);
      const radius = 8;

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AP', pos.x, pos.y);

      ctx.fillStyle = '#1e293b';
      ctx.font = '7px Arial';
      ctx.fillText(label, pos.x, pos.y + 12);
    };

    const drawRJ453D = (x: number, y: number, z: number, label: string) => {
      const pos = project(x, y, z);
      const size = 6;

      ctx.fillStyle = '#2563eb';
      ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);

      ctx.strokeStyle = '#1e60a6';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pos.x - size / 2, pos.y - size / 2, size, size);

      ctx.fillStyle = '#1e293b';
      ctx.font = '6px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, pos.x, pos.y + 10);
    };

    const shadeColor = (color: string, percent: number): string => {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return (
        '#' +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBox(-55, -60, 0, 110, 135, 0.5, '#e2e8f0');

    drawBox(-45, 52, 0.5, 20, 15, 8, '#86efac');
    drawBox(-45, 32, 0.5, 15, 15, 8, '#cbd5e1');
    drawBox(-10, 45, 0.5, 15, 20, 8, '#fde047');
    drawBox(5, 45, 0.5, 40, 20, 8, '#a5f3fc');

    drawBox(-40, 5, 0.5, 12, 18, 6, '#86efac');
    drawBox(-20, 0, 0.5, 20, 25, 10, '#f1f5f9', 'LOBBY');

    for (let i = 0; i < 3; i++) {
      drawBox(10 + i * 12, 0, 0.5, 10, 15, 8, '#fde047');
    }

    const deskPositions = [
      { x: -40, y: -25 },
      { x: -30, y: -25 },
      { x: -20, y: -25 },
      { x: -10, y: -25 },
      { x: -40, y: -35 },
      { x: -30, y: -35 },
      { x: -20, y: -35 },
      { x: -10, y: -35 },
    ];

    deskPositions.forEach(desk => {
      drawBox(desk.x, desk.y, 0.5, 10, 10, 5, '#fef3c7');
    });

    drawBox(0, -35, 0.5, 8, 20, 5, '#fed7aa');

    const deskPositions2 = [
      { x: -40, y: -55 },
      { x: -30, y: -55 },
      { x: -20, y: -55 },
      { x: -10, y: -55 },
      { x: -40, y: -65 },
      { x: -30, y: -65 },
      { x: -20, y: -65 },
      { x: -10, y: -65 },
    ];

    deskPositions2.forEach(desk => {
      drawBox(desk.x, desk.y, 0.5, 10, 10, 5, '#fef3c7');
    });

    drawBox(0, -65, 0.5, 8, 20, 5, '#fed7aa');

    drawBox(10, -65, 0.5, 35, 50, 12, '#bfdbfe', 'SALA TELA');

    drawAP3D(82, 30, 5, 'AP-5');
    drawAP3D(25, 85, 5, 'AP-1');
    drawAP3D(45, 85, 5, 'AP-2');
    drawAP3D(18, 45, 5, 'AP-3');
    drawAP3D(16, 100, 5, 'AP-4');

    drawRJ453D(10, 25, 1, 'RJ-1');
    drawRJ453D(14, 25, 1, 'RJ-2');
    drawRJ453D(20, 25, 1, 'RJ-3');
    drawRJ453D(24, 25, 1, 'RJ-4');
    drawRJ453D(30, 25, 1, 'RJ-5');
    drawRJ453D(34, 25, 1, 'RJ-6');

  }, [rotation, tilt]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const startX = e.clientX;
    const startRotation = rotation;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      setRotation(startRotation + deltaX * 0.5);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const resetView = () => {
    setRotation(45);
    setTilt(30);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-xl font-light text-slate-900">Plano Infraestructura de Red - 3D</h2>
        <p className="text-sm text-slate-500 mt-1">Vista isométrica interactiva con puntos de red</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={resetView}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          <span className="text-sm font-medium">Resetear Vista</span>
        </button>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 w-16">Rotación:</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-xs text-slate-500 w-8">{Math.round(rotation)}°</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 w-16">Inclinación:</label>
            <input
              type="range"
              min="0"
              max="60"
              value={tilt}
              onChange={(e) => setTilt(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-xs text-slate-500 w-8">{Math.round(tilt)}°</span>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={1000}
        height={800}
        onMouseDown={handleMouseDown}
        className="w-full border border-slate-200 rounded cursor-move"
      />
      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Puntos de Acceso (AP) 3D</h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div>AP-1: Lobby (Altura 5m)</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div>AP-2: Central (Altura 5m)</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div>AP-3: Mario/Desk3 (Altura 5m)</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div>AP-4: Printers (Altura 5m)</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div>AP-5: Sala TELA (Altura 5m)</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Puntos de Red (RJ45) 3D</h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600"></div>Desktop 1: RJ-1, RJ-2</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600"></div>Desktop 2: RJ-3, RJ-4</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600"></div>Desktop 3: RJ-5, RJ-6</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FloorPlan3D;
