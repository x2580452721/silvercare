import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HealthScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
}

const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score, label, size = 120 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = size;
    const height = size;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Scale
    const colorScale = d3.scaleLinear<string>()
      .domain([0, 60, 80, 100])
      .range(["#ef4444", "#f59e0b", "#10b981", "#059669"]);

    // Background Arc
    const arcBg = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append("path")
      .attr("d", arcBg as any)
      .attr("fill", "#e5e7eb");

    // Foreground Arc
    const arcFg = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle((score / 100) * 2 * Math.PI);

    g.append("path")
      .attr("d", arcFg as any)
      .attr("fill", colorScale(score))
      .attr("stroke-linecap", "round");

    // Text Score
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em")
      .attr("font-size", `${size * 0.25}px`)
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text(score);

    // Text Label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("font-size", `${size * 0.1}px`)
      .attr("fill", "#6b7280")
      .text(label);

  }, [score, label, size]);

  return <svg ref={svgRef} width={size} height={size} />;
};

export default HealthScoreGauge;