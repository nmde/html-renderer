package main

import (
	"strconv"
	"syscall/js"
	"time"

	"github.com/JamesMilnerUK/pip-go"
)

func main() {
	js.Global().Set("castRays", js.FuncOf(castRays))
	select {}
}

func castRays(this js.Value, args []js.Value) interface{} {
	start := time.Now()
	intersections := make(map[string]interface{})
	polygons := make(map[string][]pip.Polygon)
	for i := 0; i < args[4].Length(); i += 1 {
		faces := args[4].Index(i).Get("faces")
		for j := 0; j < faces.Length(); j += 1 {
			polygon := pip.Polygon{
				Points: []pip.Point{},
			}
			vertices := faces.Index(j).Get("vertices")
			for k := 0; k < vertices.Length(); k += 1 {
				vertex := vertices.Index(k).Get("value")
				polygon.Points = append(polygon.Points, pip.Point{X: vertex.Index(0).Float(), Y: vertex.Index(1).Float()})
			}
			id := args[4].Index(i).Get("id").String()
			polygons[id] = append(polygons[id], polygon)
		}
	}
	println("Built polygons in " + time.Since(start).String())
	for x := args[0].Int(); x <= args[1].Int(); x += 1 {
		keyX := strconv.FormatInt(int64(x), 10)
		row := make(map[string]interface{})
		for y := args[2].Int(); y <= args[3].Int(); y += 1 {
			keyY := strconv.FormatInt(int64(y), 10)
			intersects := false
			for _, faces := range polygons {
				for _, polygon := range faces {
					intersects = intersects || pip.PointInPolygon(
						pip.Point{X: float64(x), Y: float64(y)},
						polygon,
					)
				}
			}
			row[keyY] = js.ValueOf(intersects)
		}
		intersections[keyX] = js.ValueOf(row)
	}
	println("Calculated intersections in " + time.Since(start).String())
	return js.ValueOf(intersections)
}
