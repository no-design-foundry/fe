# Beziers (not the town in France)

Many of us recognize bezier curves from Adobe. They're incredibly powerful tools, used far beyond just in vector editing softwares. To keep things short and fun, I’ll introduce three examples that showcase interactive aspects of bezier curves closely tied to type design. To help you understand the math and see how the curves are drawn, I’ve prepared three interactive demos just for you. Cubic curves are easier to work with and Quadratic curves are faster to render, which is not really relevant anymore in today's environment.

## Cubic

Cubic is typical for two control points along with the start and end points. This additional control allows for more complex, elegant curves, making cubic Béziers the standard in graphic applications such as vector illustrations and digital fonts, where precision and flexibility are key. 

<div component="BezierPlayground" curve="[[50,450],[200,50],[800,50],[950,450]]"></div>

## Quadratic

I bet many of you have seen this one when trying to open a font in a font editor. People typically don't design in Quadratic curves. Designer typically designs in cubic curves and then their font editor converts their drawing to quadratic bezier.

<div component="BezierPlayground"  curve="[[50,450],[501,51],[950,450]]"></div>

## Interpolation

As long as the contours are compatible, this means they have the same number of contours and segments, then can be interpolated between each other. That's right, not all what you see in a typeface is drawn, many things are calculated/interpolated.

<div
    component="BezierInterpolationPlayground"
    curveA="[[50,450],[50,150],[350,50],[950,50]]"
    curveB="[[200,450],[200,200],[500,150],[950,150]]"
>
</div>

Further reading 
https://pomax.github.io/bezierinfo/
https://en.wikipedia.org/wiki/Bézier_curve
