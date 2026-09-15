export function NetworkDiagram({ className }: { className?: string }) {
  const layers = [
    { x: 40, nodes: 3 },
    { x: 140, nodes: 4 },
    { x: 240, nodes: 2 },
  ];
  const y = (count: number, index: number) => 20 + ((110 - 0) / (count + 1)) * (index + 1);

  return (
    <svg viewBox="0 0 280 150" className={className} role="img" aria-label="Feed-forward neural network diagram">
      {layers.slice(0, -1).map((layer, li) =>
        Array.from({ length: layer.nodes }).map((_, i) =>
          Array.from({ length: layers[li + 1]!.nodes }).map((__, j) => (
            <line
              key={`${li}-${i}-${j}`}
              x1={layer.x}
              y1={y(layer.nodes, i)}
              x2={layers[li + 1]!.x}
              y2={y(layers[li + 1]!.nodes, j)}
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.25"
            />
          )),
        ),
      )}
      {layers.map((layer, li) =>
        Array.from({ length: layer.nodes }).map((_, i) => (
          <circle
            key={`n-${li}-${i}`}
            cx={layer.x}
            cy={y(layer.nodes, i)}
            r="7"
            fill="var(--document)"
            stroke="currentColor"
            strokeWidth="1"
          />
        )),
      )}
      <text x="40" y="145" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.6">
        input
      </text>
      <text x="140" y="145" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.6">
        hidden
      </text>
      <text x="240" y="145" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.6">
        output
      </text>
    </svg>
  );
}
