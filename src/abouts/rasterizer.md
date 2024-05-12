A font that had this filter applied on went through the process of rasterisation. It's the same rasterization that rasterizes fonts on your iPhone or a Android phone, a coffee machines or something completely else. Software behind it is called [FreeType](https://freetype.org/) and it's an open source rasterizer that is used in the industry. 

Such rasterisation is very complex process, it uses font's information called hinting. Hinting simply hints the rasterizer what to do. It can tell it to make sure to have this stroke the same amount of pixels as this stroke or show overshoot only if the font size is above 20px. If the font doesn't contain any hinting, then the rasterizer tries to do its best job.

General rule is that fonts with suffix `.ttf` should have better displaying capabilities than fonts ending with `.otf`. Old classic as Verdana, Arial or Times New Roman perform very well when rasterised in small sizes. 

The smallest sizes in some of the older fonts were specially prepared as separate bitmaps. Someone was really there, drawing that system font bitmap of eight pixels!

__Have a look, contribute or copy__
[github.com/jansindl3r/rasterizer](https://github.com/jansindl3r/rasterizer)