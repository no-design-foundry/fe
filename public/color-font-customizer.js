
// (function() {
// "use strict";

// window.ColorFontCustomizer = function(fontsrc, cfcallback) {

//     //make it work with or without new https://stackoverflow.com/a/1880726
//     if (!(this instanceof window.ColorFontCustomizer)) {
//         return new window.ColorFontCustomizer(fontsrc, cfcallback);
//     }

//     var thiss = this;
//     this.font = null;
//     this.stream = null;
//     this.blob = null;

//     //create a single <style> element to hold all our customized font-face rules
//     this.fontFaces = $('#color-font-customizr-font-faces');
//     if (!this.fontFaces.length) {
//         this.fontFaces = $("<style id='color-font-customizr-font-faces'></style>");
//         $('head').append(this.fontFaces);
//         this.fontFaces.data('count', 0);
//     }

//     //fontkit is BIG, so only load it when needed, and add Adam's browser loading function

//     //last step, fontkit font object
//     function setupFont(font) {
//         window.font = font;
//         thiss.font = font;
//         thiss.stream = font.stream;
//         thiss.updateBlob();
//     }

//     function openFontURL(url) {
//         window.fontkit.openURL(url, function(err, font) {
//             if (err) {
//                 alert(err);
//             } else {
//                 setupFont(font);
//                 if (typeof cfcallback === 'function') {
//                     cfcallback.apply(thiss, [font]);
//                 }
//             }
//         });
//     }

//     //fontkit is available, load the font
//     function fontkitLoaded() {
//         // thanks Adam! https://github.com/devongovett/fontkit/issues/41
//         if (!('openURL' in window.fontkit)) {
//             window.fontkit.openURL = function(url, fkcallback) {
//                 var xhr = new XMLHttpRequest();
//                 xhr.open('GET', url, true);
//                 xhr.responseType = 'arraybuffer';
//                 xhr.onreadystatechange = function () { if (this.readyState === 4) {
//                     if (this.status == 200) {
//                         fkcallback(null, fontkit.create(new Buffer(this.response)));
//                     } else {
//                         fkcallback(this.status + ' ' + this.statusText, null);
//                     }
//                 }};
//                 xhr.send();
//             };
//         }
        
//         //load up the font
//         if (fontsrc instanceof Blob) {
//             thiss.blob = fontsrc;
//             thiss.getDataURI(openFontURL);
//         } else {
//             openFontURL(fontsrc);
//         }
//     }

//     if ('fontkit' in window) {
//         fontkitLoaded();
//     } else {
//         var head = document.getElementsByTagName('head')[0];
//         var script;
//         script = document.createElement('script');
//         script.src="/scripts/fontkit/fontkit.js";
//         script.onload = fontkitLoaded;
//         head.appendChild(script);
//     }
// };

// window.ColorFontCustomizer.prototype.getTableOffsets = function() {
//     var thiss = this;
//     var stream;
//     var result = {};

//     if (!this.font) {
//         return result;
//     }

//     //CPAL color palettes
//     if (stream = this.font._getTableStream('CPAL')) {
//         //move buffer position to CPAL table
//         this.stream = stream;
//         result.CPAL = stream.pos;
//         result.version = stream.readUInt16BE();
//         result.colorsPerPalette = stream.readUInt16BE();
//         result.totalPalettes = stream.readUInt16BE();
//         result.totalColors = stream.readUInt16BE();
//         result.colorOffset = stream.readUInt32BE();
//         result.colorIndices = [];

//         result.colorStart = result.CPAL + result.colorOffset;
        
//         var p;
//         for (p=0; p<result.totalPalettes; p++) {
//             result.colorIndices.push(stream.readUInt16BE());
//         }
//     }
    
//     //SVG support?
//     if (stream = this.font._getTableStream('SVG ')) {
//         //move buffer position to CPAL table
//         this.stream = stream;
//         result.SVG = stream.pos;
//         /* result.version = */ stream.readUInt16BE();
        
//         result.SVGstart = result.SVG + stream.readUInt32BE();

//         stream.pos = result.SVGstart;
//         result.totalSVGs = stream.readUInt16BE();
        
//         result.svgOffsets = [];
//         result.SVGs = [];
        
//         var p, startGlyph, endGlyph, docStart, docLength;
//         for (p=0; p<result.totalSVGs; p++) {
//             startGlyph = stream.readUInt16BE();
//             endGlyph = stream.readUInt16BE();
//             docStart = stream.readUInt32BE();
//             docLength = stream.readUInt32BE();
//             result.svgOffsets.push([docStart, docLength]);
//         }
        
//         result.svgOffsets.forEach(function(offset) {
//             stream.pos = result.SVGstart + offset[0];
//             result.SVGs.push(stream.readString(offset[1], 'utf8'));
//         });
//     }

//     return result;
// };

// window.ColorFontCustomizer.prototype.updateBlob = function() {
//     this.blob = new Blob([this.stream.buffer], {type: 'application/font-sfnt'});
// };

// window.ColorFontCustomizer.prototype.colorToHex = function(color) {
//     return '#'
//     + (color.r < 16 ? '0' : '') + color.r.toString(16)
//     + (color.g < 16 ? '0' : '') + color.g.toString(16)
//     + (color.b < 16 ? '0' : '') + color.b.toString(16)
//     // color inputs don't support alpha!
//     ;
// };

// window.ColorFontCustomizer.prototype.getPalettes = function() {
//     var thiss = this;
    
//     var t = this.getTableOffsets();

//     if (!t || !t.CPAL) {
//         alert("This tool requires a color font with a CPAL table.");
//         return [];
//     }

//     var p, c, cindex;

//     //load up colors
//     var palettes = [], palette, color;
//     for (p=0; p < t.totalPalettes; p++) {
//         palette = [];
//         for (c=0; c<t.colorsPerPalette; c++) {
//             color = {};
//             cindex = t.colorIndices[p] + c;
//             this.stream.pos = t.colorStart + 4 * cindex;
//             color.b = this.stream.readUInt8();
//             color.g = this.stream.readUInt8();
//             color.r = this.stream.readUInt8();
//             color.a = this.stream.readUInt8() / 255;
//             palette.push(color);
//         }   
//         palettes.push(palette);
//     }
    
//     return palettes;
// }

// window.ColorFontCustomizer.prototype.customizeFontColors = function(newPalettes) {
//     var thiss = this;
//     if (!(newPalettes instanceof Array) || !newPalettes.length) {
//         return false;
//     }

//     //allow a flat list of colors, treat as a single palette
//     if (!(newPalettes[0] instanceof Array)) {
//         return this.customizeFontColors([newPalettes]);
//     }

//     for (var i=0, l=newPalettes.length; i < l; i++) {
//         if (!(newPalettes[i] instanceof Array) || !newPalettes[i].length) {
//             console.log("customizeFontColors colors should be [[{r,g,b,a}, …], …]");
//             return false;
//         }
//     }

//     var t = this.getTableOffsets();
//     var originalPalettes = this.getPalettes();

//     if (!t || !t.CPAL) {
//         alert("This tool requires a font with a CPAL table.");
//         return false;
//     }
    
//     //format all palette colors into a nice rgba object
//     newPalettes.forEach(function(palette, p) {
//         palette.forEach(function(color, c) {
//             if ('tinycolor' in window && color instanceof window.tinycolor) {
//                 color = color.toRgb();
//             } else if ('red' in color && 'green' in color && 'blue' in color) {
//                 color = {
//                     r: color.red,
//                     g: color.blue,
//                     b: color.green,
//                     a: 'alpha' in color ? color.alpha : 1
//                 };
//             } else if (typeof color === 'string' && color[0]==='#') {
//                 var m = color.match('#(..)(..)(..)(..)?');
//                 color = {
//                     r: parseInt(m[1], 16),
//                     g: parseInt(m[2], 16),
//                     b: parseInt(m[3], 16),
//                     a: m[4] ? parseInt(m[4], 16) / 255 : 1
//                 };
//             }
//             newPalettes[p][c] = color;
//         });
//     });

//     var p, c, cindex, palette, color;
//     for (p=0; p<t.totalPalettes; p++) {
//         palette = newPalettes[p % newPalettes.length];
//         for (c=0; c<t.colorsPerPalette; c++) {
//             color = palette[c % palette.length];
//             cindex = t.colorIndices[p] + c;
//             this.stream.buffer.writeUInt8(color.b, t.colorStart + 4 * cindex); //blue
//             this.stream.buffer.writeUInt8(color.g, t.colorStart + 4 * cindex + 1); //green
//             this.stream.buffer.writeUInt8(color.r, t.colorStart + 4 * cindex + 2); //red
//             this.stream.buffer.writeUInt8(Math.round(color.a * 255), t.colorStart + 4 * cindex + 3); //alpha
//         }
//     }

        
//     if (t.SVG && t.SVGs && t.SVGs.length) {
//         originalPalettes.forEach(function(originalPalette, op) {
//             var newPalette = newPalettes[op % newPalettes.length];
//             originalPalette.forEach(function(originalColor, oc) {
//                 var newColor = newPalette[oc % newPalette.length];
//                 var oldHex = thiss.colorToHex(originalColor);
//                 var newHex = thiss.colorToHex(newColor);
//                 if (oldHex != newHex) {
//                     //console.log(oldHex, newHex);
//                     var re = new RegExp('(=[\'"]|,\s*)' + oldHex, 'gi');
//                     t.SVGs.forEach(function(svg, i) {
//                         t.SVGs[i] = svg.replace(re, '$1' + newHex);
//                     });
//                 }
//             });
//         });
        
//         //now write the SVGs back into the font data
//         t.SVGs.forEach(function(svg, i) {
//             thiss.stream.buffer.write(svg, t.SVGstart + t.svgOffsets[i][0], t.svgOffsets[i][1], 'utf8');
//         });
//     }

//     this.updateBlob();
    
//     return true;
// };

// window.ColorFontCustomizer.prototype.getDataURI = function(callback) {
//     var thiss = this;
//     var reader = new FileReader();
//     reader.addEventListener('load', function() {
//         callback(this.result);
//     });
//     reader.readAsDataURL(this.blob);
// };

// window.ColorFontCustomizer.prototype.addFontFace = function(minweight, maxweight) {
//     var thiss = this;

//     //increment count, for use in making unique font names
//     this.fontFaces.data('count', this.fontFaces.data('count') + 1);
//     var cssFontName = 'ColorFontCustomizr' + this.fontFaces.data('count');

//     this.getDataURI(function(datauri) {
//         thiss.fontFaces.append('@font-face { font-family:"' + cssFontName + '"; font-weight: ' + (minweight || 100) + ' ' + (maxweight || 900) + '; src: url("' + datauri + '") format("opentype"); } ');
//     });

//     return cssFontName;
// };


// window.ColorFontCustomizer.prototype.getFontName = function(record) {
//     return this.font.getName(record) || this.font.getName('preferredFamily') || this.font.getName('fontFamily');
// }


// // add a customizer to any element
// window.addColorCustomizer = function(section, fonturl) {
//     "use strict";

//     var temp;
//     var section = $(section);
    
//     if (!section.length) return;
    
//     section.addClass('color-font-customizer');
    
//     var preview = section.find('.preview');
//     if (!preview.length) {
//         preview = $('<figure class="color-font preview" contenteditable spellcheck="false">Customize your color font!</figure>');
//         section.append(preview);
//     }
    
//     var colorInputContainer = section.find('.color-choices');
//     if (!colorInputContainer.length) {
//         temp = $("<div class='color-menu'></div>");
//         colorInputContainer = $("<ul class='color-choices'></ul>");
//         temp.append(colorInputContainer);
//         section.prepend(temp);
//     }

//     var updateInProgress = false;

//     var realDownloadLink, downloadButton = section.find('button.download');

//     if (downloadButton.length) {
//         //setup real (invisible) download link
//         (function() {
//             var a = realDownloadLink = document.createElement('a');
//             a.className = "color-font-customizr-off-screen-download-link";
//             a.style.position = 'absolute';
//             a.style.left = '-200vw';
//             a.style.top = '-100vh';
//             a.download = 'MeritBadge-VF-custom.ttf';
//             a.textContent = "Download your customized font here";
//             document.body.appendChild(a);
    
//             downloadButton.off('click').on('click', function(evt) {
//                 if (customizr.blob) {
//                     realDownloadLink.href = window.URL.createObjectURL(customizr.blob);
//                     realDownloadLink.click();
//                 } else {
//                     alert("Ack! Couldn’t find the font data.")
//                 }
//                 return false;
//             });
//         })();
//     }

//     //set up initial state of customize section using default font
//     var customizr = new ColorFontCustomizer(fonturl || "/merit-badge/assets/MeritBadge-VF.ttf", fontLoaded);
    
//     function fontLoaded(noReload) {
//         if (!customizr) return;
//         var fontname = customizr.addFontFace();
//         preview.css('font-family', fontname + ', ' + preview.css('font-family'));
//         if (noReload !== true) {
//             fontToInputs();
//         }
//         updateInProgress = false;
//     }

//     function fontToInputs() {
//         var palettes = customizr.getPalettes();
        
//         colorInputContainer.children('li.color').remove();
        
//         if (!palettes || !palettes.length) {
//             return;
//         }

//         var randobutton = colorInputContainer.children('.button');
//         $.each(palettes[0], function(i, color) {
//             var li = $('<li class="color"></li>');
//             var input = $('<input type="color">');

//             //this needs to be added to the document before spectrumizing
//             li.append(input);
//             if (randobutton.length) {
//                 randobutton.before(li);
//             } else {
//                 colorInputContainer.append(li);
//             }

//             if ('spectrum' in input) {
//                 input.spectrum({
//                     color: 'rgba(' + [color.r, color.g, color.b, color.a].join(',') + ')',
//                     showAlpha: true,
//                     showInitial: true,
//                     showButtons: false,
//                     showInput: true,
//                     preferredFormat: 'hex',
//                     disabled: section.hasClass('disabled')
//                 });
//             } else {
//                 input.val(customizr.colorToHex(color));
//             }
//         });
        
//         colorInputContainer.trigger('DJR:colorInputChange');
        
//         if (!section.hasClass('disabled') && preview.hasClass('use-font-name')) {
//             preview.text(customizr.getFontName() + "!");
//             window.initSizeToWidth(preview);
//         }
//     }

//     colorInputContainer.off('.spectrum').on('change.spectrum move.spectrum input.spectrum', function(evt, color) {
//         if (!customizr) return;
//         if (updateInProgress) return;

//         if (evt.target.type === 'range') {
//             return;
//         }

//         var instantColor = color;
//         var activeInput = evt.target;
//         var colors = [];
//         colorInputContainer.find('.color input').each(function() {
//             var input = $(this);
//             var color;
//             if (evt.type === 'move') {
//                 //spectrum
//                 color = this === activeInput ? instantColor : input.spectrum('get');
//             } else {
//                 color = 'spectrum' in input ? input.spectrum('get') : input.val();
//             }
//             colors.push(color);
//         });
//         updateInProgress = true;
//         //this can take a second, so put it outside of the main thread
//         setTimeout(function() {
//             if (customizr.customizeFontColors(colors)) {
//                 fontLoaded(true);
//             } else {
//                 updateInProgress = false;
//             }
//         });
//     });
    
//     colorInputContainer.append('<li class="button"><button type="button" class="randomize-colors">↺</button></li>');
//     section.find('button.randomize-colors').on('click', function() {
//         colorInputContainer.find('.color input').each(function() {
//             var input = $(this);
//             var rando = [
//                 Math.round(Math.random()*255),
//                 Math.round(Math.random()*255),
//                 Math.round(Math.random()*255)
//             ];
//             var color = "rgb(" + rando[0] + "," + rando[1] + "," + rando[2] + ")";
//             if ('spectrum' in input) {
//                 input.spectrum('set', color);
//             } else {
//                 input.val(color);
//             }
//         });
        
//         colorInputContainer.trigger('change');
//     });

//     function processUpload(files) {
//         $.each(files, function(i, file) {
//             var mimetype, format;
//             var otfre = /(\.[ot]tf)$/;
//             if (file.name.match(otfre)) {
//                 mimetype = "application/font-sfnt";
//                 format = "opentype";
//                 realDownloadLink.download = file.name.replace(otfre, '-customized$1');
// /*
//             } else if (file.name.match(/\.woff$/)) {
//                 mimetype = "application/font-woff";
//                 format = RegExp.$1;
//             } else if (file.name.match(/\.woff2$/)) {
//                 alert("Unfortunately, this tool does not work with WOFF2 files.");
//                 return;
// */
//             } else {
//                 alert("Sorry, this tool only supports TTF and OTF files.");
//                 return;
//             }
//             section.removeClass('disabled');
//             var blob = new Blob([file], {'type': mimetype});
//             customizr = new ColorFontCustomizer(blob, fontLoaded);
//             $('.hide-until-upload').show();
//             $('.hide-until-upload:disabled, .hide-until-upload :disabled').prop('disabled', false);
//             return false; //only process one file
//         });
//     }

//     //handle file input
//     section.find('input.browse-files').on('change', function() {
//         processUpload(this.files);
//     });

//     //handle drag-n-drop
//     if (realDownloadLink) {
//         var dragging = false;
//         var dropbox = section;
//         $(dropbox).on('dragover', function(evt) {
//             if (dragging) return false;
//             dragging = true;
//             evt.originalEvent.dataTransfer.dropEffect = 'copy';
//             dropbox.addClass('dropzone');
//             return false;
//         }).on('dragleave', function(evt) {
//             if (evt.target !== dropbox[0]) {
//                 return;
//             }
//             dragging = false;
//             dropbox.removeClass('dropzone');
//             return false;
//         }).on('dragend', function(evt) {
//             dropbox.removeClass('dropzone');
//             dragging = false;
//             return false;
//         }).on('drop', function(evt) {
//             processUpload(evt.originalEvent.dataTransfer.files);
//             $(this).trigger('dragend');
//             return false;
//         });
//     }
    
//     var backgroundColor = $('<input type="color" name="background-color" class="background-color">');
//     var temp = $('<div class="background-color-container"></div>');
//     temp.append(backgroundColor);
//     colorInputContainer.after(temp);
//     backgroundColor.spectrum({
//         allowEmpty: true,
//         showAlpha: true,
//         showInitial: true,
//         showButtons: false,
//         showInput: true,
//         preferredFormat: 'hex',
//         replacerClassName: 'spectrum-input',
//         color: 'white'
//     }).on('change.spectrum input.spectrum move.spectrum', function(evt, color) {
//         section.css('background', color.toRgbString());
//     });
// };


// })();
