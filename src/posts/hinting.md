# TrueType hinting, an insight for the curious

<small>published on 16th June 2024</small>

---

TrueType hinting is a technology in digital typography that ensures text remains clear and readable across different screen resolutions and display devices. Released by Apple in 1991, TrueType is a font-scaling technology that allows fonts to look sharp at any size. Hinting used to be very important but it becomes less and less relevant for usage on modern devices with resolutions higher than 72dpi.

Font in the TrueType format contain instructions for the rendering software how to adjust the display of vector-based fonts on pixel grids. These instructions, or "hints," modify the way individual characters are displayed at small sizes or low resolutions to enhance legibility and aesthetic quality.

![Alt Text](/posts/hinting/base.png)
![Alt Text](/posts/hinting/unhinted_bitmap.png)
![Alt Text](/posts/hinting/hinted_vector.png)
![Alt Text](/posts/hinting/hinted_bitmap.png)

When text is displayed on a screen, each character is represented by a grid of pixels. However, the transformation from the vector outline of a character to the pixel grid can lead to distortions, especially at small sizes or lower resolutions. Hinting solves these issues by providing specific guidance on adjusting the placement and shape of the font’s vector outlines to better align with the pixel grid.

While hinting significantly enhances font clarity, it is a complex and labor-intensive process. Crafting effective hints requires a deep understanding of both typography and the technical constraints of digital displays. Moreover, different rendering engines and operating systems may interpret hints differently, leading to variations in appearance across platforms.

Although many of you read this article on a phone or another device with high resolution, there are still many people who can't afford high resolution screen or don't mind low resolution. There are also different applications of font, such as digital signages, embedded systems like operating systems of coffee machines, or a receipt printer. TrueType hinting therefore remains a vital aspect of digital typography. As display technology continues to evolve, hinting will likely adapt to new standards, ensuring that text remains sharp and readable in our increasingly digital world.

## Inteview with Greg Hitchcock

---

Greg Hitchcock is a distinguished software engineer and font technologist at Microsoft, renowned for his pivotal contributions to digital typography. With a career spanning several decades, Hitchcock has played a critical role in the development of font rendering technologies, most notably TrueType. His expertise in font hinting has been instrumental in enhancing the clarity and readability of text on digital screens, significantly impacting how users experience text on various devices. As a key figure at Microsoft, Greg Hitchcock's work continues to influence the evolution of digital typography, ensuring high-quality text rendering across different platforms.


_How big is your team? And how big was your team in the past?_

> Our team, for the past twenty years or so is called Advanced Reading Technologies and we’ve varied in size from six (right now) to eight. There are several teams currently working on fonts at Microsoft and if you go back in time to the early and mid-1990’s, we were all on the same team with around 20 people. It was larger because the team did all the engineering and marketing and font creation for the company. Advanced Reading Technologies has a different charter from other teams working on fonts. The team is made up of font designers, cognitive scientists and computer engineers. We like to take a technical challenge and use a font project to bring the project to fruition. Times New Roman, Arial, & al., were to figure out font production and more importantly how to hint fonts. Tahoma, Verdana, Georgia, & al., were to use hinting and font design to optimize for screen reading. Palatino Linotype was to figure out OpenType Layout and gray-scale hinting. Berling Antiqua and Frutiger Linotype & al. were to figure out ClearType hinting. The ClearType Font Collection was to figure out Japanese stroke reduction through hinting and refine ClearType hinting. Gabriola was to work on more advanced OpenType Layout. Sitka was to figure out how to design outlines based on science and to figure out optical scaling. We are working on several other font project that will come out in the future that also promote new technological concepts. The other font teams at Microsoft have to solve more pragmatic solutions such as creating fonts for UI, fonts for many languages and cultures across the world, and fonts for providing rich typography across our products.
 
_I think there must have been a lot of work, when you worked on Windows' ClearType font collection. Are new fonts still being added? If yes, are they still hinted by people? Is it partially or fully automated?_
 
> The ClearType Font Collection was a specific project that we got funded for 26 fonts. It was a lot of work, but in ways it was easier than previous projects because the team we brought together to work on this was very skilled in making fonts. Mike and Geraldine led the project internally while John Hudson helped to manage the project externally. Much of the work was getting the budget for the project, convincing the Office team to use them for default fonts (which didn’t go exactly as we planned), and support for Meiryo as a system UI font. Our font projects are mostly hinted usually with a combination of automated with some manual adjustments.
 
_Can you estimate how many users of VTT there are? Was it primarily designed as an internal tool or something to be shared with public?_

> I don’t know for sure, we get a handful of questions. I would venture a guess that there are 20 or so active users and several hundred occasional users. 

> The tool was originally created by a company called Type Solutions to automatically hint fonts and the product was called TypeMan. It was a Macintosh only product. The creator was Sampo Kaasila. Prior to developing TypeMan, Sampo was at Apple Computer working on the creation of TrueType. Prior to that he was at Imagen working on font technologies. At Imagen Sampo worked on a font technology that included an instruction based “hinting” technique. In 1987, Apple hired away Sampo, Imagen’s lead engineer for font technology, to create TrueType. In 1989 Sampo left Apple to develop an autohinting technology called TypeMan. In 1990, Microsoft chose TypeMan to help in the creation of TrueType forms of Times New Roman and Arial. Sampo had developed the autohinter which output the high-level language then called TypeMan Talk. The TypeMan Talk was then compiled into a TrueType optimized Assembler for creating the binary code in the TrueType file. Fine-tuning could be applied at any of these steps. Most of the Times New Roman and Arial glyphs contain some level of fine-tuning. So, Sampo created TypeMan as a product to sell. In the mid-1990’s, Microsoft licensed the code from Type Solutions for use with our projects. The internal version of this tool went through several versions as we worked on auto-hinting ideas. It was first called TTEd (for TrueType Editor), then DovMan (named after one of the developers working on autohinting). Then we added the visual hinting and the product was renamed Visual TrueType, or VTT for short. Around 1997, we ported the product to Windows. Initially it could run on both Windows and the Macintosh. When Apple moved to Intel processors, the Macintosh version slowly disappeared. In the early 2000’s, most of the work was on additional autohinting work for VTT. From Microsoft’s point of view, the tool was for internal use, although we provided it to font vendors who made fonts for Microsoft. Eventually we put the tool on our website for free usage, but you had to sign an end-user license agreement.
 

_Is it correct to say that VTT processes VTT talk into glyph program which is then compiled directly to binary? Or is there something between? Like what we see in TTX. Or is TTX TTGlyph assembly showing just another interpretation of the hinting instructions? Is what we see in TTX the lowest low of hinting instructions that can be read by human?_

_This is glyph program dialog from VTT_

```truetype
USEMYMETRICS[]
OFFSET[R], 24, 0, 0
OVERLAP[]
OFFSET[R], 297, 161, 0

SVTCA[X]
CALL[], 11, 18, 0, 32, 3, 87
SHC[2], 2
SHC[2], 3
```
 
_This is the output of TTX_
 
```xml
<TTGlyph name="Adieresis" xMin="12" yMin="0" xMax="720" yMax="980">
    <component glyphName="A" x="0" y="0" flags="0x204"/>
    <component glyphName="dieresis.case" x="161" y="0" flags="0x4"/>
    <instructions>
    <assembly>
        PUSHB[ ]            /* 8 values pushed */
        3 2 11 18 0 32 3 87
        SVTCA[1]            /* SetFPVectorToAxis */
        CALL[ ]   /* CallFunction */
        SHC[0]   /* ShiftContourByLastPt */
        SHC[0]   /* ShiftContourByLastPt */
    </assembly>
    </instructions>
</TTGlyph>
```
 
> I would make a minor change to your statement. “It is correct to say that VTT compiles ‘vtt talk’ into ‘glyph program’ which is then assembled (or optimized assembled) directly to binary”.

> The VTT low-level language, or “assembly language” is a textual representation of the binary. This was developed by Sampo. The one anomaly with this language is the static instructions for building composites, which do not have a corollary to the TrueType instruction set. (At one point we were hoping that instructions could modify the composite code). The composite instructions include OFFSET, SOFFSET, ANCHOR, SANCHOR, USEMYMETRICS, OVERLAP, &c. For now, let’s ignore these instructions as they work differently. The TrueType assembler is an optimizing assembler in that it can make the code more optimal yet still have a clean syntax.
> For example,
```
#PUSH, 1, 2, 3
ADD[]
ADD[]
```
> is slightly confusing if you are not highly familiar with stack based languages.
```
#PUSH, 1,2
ADD[]
#PUSH, 3
ADD[]
```
> is a little better, but this is even better…
```
ADD[],1,2
ADD[],*,3  /* Where ‘*’ means the top element on the stack */
```
 
> This becomes more important when dealing with values, point numbers, and CVT values. The VTT assembler abstracts away push instructions to allow for a cleaner syntax and the ability to optimize the push code. There are a few “pragmas” used to enable this, #PUSHON, #PUSHOFF, #PUSH, #BEGIN, and #END. Using the pragmas, I can get the VTT assembler to more closely match the TTX output:

```
#PUSHOFF
PUSHB[], 3, 2, 11, 18, 0, 32, 3, 87
SVTCA[X]
CALL[]
SHC[0]
SHC[0]
#PUSHON
```
 
> The difficulty with this is, which values are passed to the CALL and which contour numbers are applied to the first and second SHC instructions? The VTT syntax makes this much clearer.
 
_If everything above is correct, then there are some stuff that still need to be in glyph program and can't be done in VTT talk, right? For example calling function (from VTT's shipped template) 87 to center glyph's accent. Why isn't it that glyph programs and font program are not in much higher language so that it would be much more accessible to people? Does it even make sense to create an abstraction of something like hinting for very few people making hinting? I heard about people writing their own functions to achieve even pixel distribution, I can't imagine how they found out how to write those._
 
> Optimally, the VTT Talk should be kept up-to-date with techniques that people add to the assembly. (Adding an ASM to the VTT Talk is a work-around, but not very nice). We just have not gotten around to doing this work yet. People writing their own functions is one of the advantages of a technology like TrueType, in that if you can think of a better way to handle a problem, you can implement it in the low-level of VTT. But, as you also imply, this takes a significant level of experience.
 
_I read that you are thinking about open-sourcing VTT. Is it true? Is open sourcing hard in such a big company as Microsoft? Did Microsoft's view on this change after acquisition of GitHub and the work they did on VS?_
 
> We are internally discussing this. To do a good job open-sourcing requires investing resources to watch the work and handle the pull-requests. We’ve been discussing this prior to the GitHub acquisition. It is also possible that we might pull some components out of VTT and open-source them separately. There are also some potential problems because some of the components in VTT are technologies that Microsoft has licensed and there might be some limitations the we have for open-sourcing those portions—which might be very important parts 😊. We have also made a few contributions to FontTools related to the TSI tables, including some of the new VTT features related to variable fonts. We have been doing work in Python on several internal and external projects.

_[Guido van Rossum](https://en.wikipedia.org/wiki/Guido_van_Rossum) recently joined Microsoft, is Microsoft trying now to go a bit more towards Python? Now there many developer friendly platforms and tools like Azure, new Command Line and Windows subsystem for Linux for example._
 
> It clearly seems like more work is being done in Python. Microsoft, in the 1980’s, did a significant amount of work with an operating system we worked on called Xenix, which has the same heritage as Linux on PC systems.
 
_What would be an example of the simplest function that you can think of? Let’s say this was in Python, I would expect something like:_
 
```
def add(a, b):
    return a + b
```

> Maybe even simpler is this:
```
def neg(a)
    return -a
```
> in TrueType this would look like:
```
FDEF 100
    #PUSHOFF
    #BEGIN
    NEG[]
    #END
    #PUSHON
ENDF[]
```
> Ignoring the pragmas, for the binary this looks like:
```
FDEF 100
    NEG[]
ENDF[]
```


Thanks a lot for the interview Greg! Also thanks a lot to Mike Duggan!!!