"use client";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph").then((m) => m.ForceGraph2D), {
  ssr: false,
});

export default function GraphClient({
  data,
}: {
  data: { nodes: Array<{ id: string; name?: string; group?: string }>; links: Array<{ source: string; target: string }> };
}) {
  return (
    <div className="h-[80vh]">
      <ForceGraph2D
        graphData={data as any}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D) => {
          const label = (node.name as string) || (node.id as string);
          ctx.fillStyle = (node.group as string) === "tag" ? "#60a5fa" : "#a78bfa";
          ctx.beginPath();
          ctx.arc((node.x as number) || 0, (node.y as number) || 0, 5, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.font = "10px sans-serif";
          ctx.fillText(label, ((node.x as number) || 0) + 6, ((node.y as number) || 0) + 3);
        }}
        linkColor={() => "rgba(255,255,255,0.2)"}
        backgroundColor="#0a0a0a"
      />
    </div>
  );
}
