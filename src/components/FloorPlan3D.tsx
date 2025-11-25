import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const FloorPlan3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(45);
  const [tilt, setTilt] = useState(30);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      drawBox(-55, -60, 0, 110, 135, 0.5, '#e2e8f0');

      drawBox(-45, 52, 0.5, 20, 15, 8, '#86efac', 'PRINTER');
      drawBox(-45, 32, 0.5, 15, 15, 8, '#cbd5e1');
      drawBox(-10, 45, 0.5, 15, 20, 8, '#fde047');
      drawBox(5, 45, 0.5, 40, 20, 8, '#a5f3fc');

      drawBox(-40, 5, 0.5, 12, 18, 6, '#86efac');
      drawBox(-20, 0, 0.5, 20, 25, 10, '#f1f5f9', 'LOBBY');

      for (let i = 0; i < 3; i++) {
        drawBox(10 + i * 12, 0, 0.5, 10, 15, 8, '#fde047');
      }

      const deskPositions = [
        { x: -40, y: -25, label: 'Micah' },
        { x: -30, y: -25, label: 'Arnold' },
        { x: -20, y: -25, label: 'Jose' },
        { x: -10, y: -25, label: 'Angel' },
        { x: -40, y: -35, label: 'Liliana' },
        { x: -30, y: -35, label: 'Mario' },
        { x: -20, y: -35, label: 'Roldan' },
        { x: -10, y: -35, label: 'Steve' },
      ];

      deskPositions.forEach(desk => {
        drawBox(desk.x, desk.y, 0.5, 10, 10, 5, '#fef3c7', desk.label);
      });

      drawBox(0, -35, 0.5, 8, 20, 5, '#fed7aa', 'EVELYN');

      const deskPositions2 = [
        { x: -40, y: -55, label: '1' },
        { x: -30, y: -55, label: '2' },
        { x: -20, y: -55, label: '3' },
        { x: -10, y: -55, label: 'Victoria' },
        { x: -40, y: -65, label: 'Audi' },
        { x: -30, y: -65, label: 'Audi' },
        { x: -20, y: -65, label: 'Ivan' },
        { x: -10, y: -65, label: 'Gerardo' },
      ];

      deskPositions2.forEach(desk => {
        drawBox(desk.x, desk.y, 0.5, 10, 10, 5, '#fef3c7', desk.label);
      });

      drawBox(0, -65, 0.5, 8, 20, 5, '#fed7aa', 'MONTALVO');

      drawBox(10, -65, 0.5, 35, 50, 12, '#bfdbfe', 'SALA TELA');
    };

    draw();
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-light text-slate-900">Vista Isométrica 3D</h2>
          <p className="text-sm text-slate-500 mt-1">Arrastra para rotar la vista</p>
        </div>
        <div className="flex gap-4 items-center">
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
      </div>
      <canvas
        ref={canvasRef}
        width={1000}
        height={900}
        onMouseDown={handleMouseDown}
        className="w-full border border-slate-200 rounded cursor-move"
      />
    </div>
  );
};

export default FloorPlan3D;
