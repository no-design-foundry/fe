export default [
  {
    type: "filterDetailView",
    title: "Rastr",
    identifier: "rasterizer",
    slug: "rasterizer",
    layerColors: ["#000"],
    inputs: [
      {
        type: "range",
        label: "Resolution",
        name: "resolution",
        min: 10,
        max: 150,
        defaultValue: 20,
      },
    ],
  },
  {
    type: "filterDetailView",
    title: "Rotorizer",
    identifier: "rotorizer",
    slug: "rotorizer",
    layerColors: ["gray", "#000"],
    variableFontControlSliders: [
      {
        label: "Rotation",
        tag: "RTTX",
        min: 0,
        max: 360,
        defaultValue: 130,
      },
    ],
    inputs: [
      {
        type: "range",
        label: "Depth",
        name: "depth",
        min: 2,
        max: 600,
        defaultValue: 100,
      },
    ],
  },
  {
    type: "filterDetailView",
    title: "Pan",
    identifier: "pan",
    slug: "pan",
    isNew: true,
    scaleThumbnailOnMobile: true,
    isHidden: !true,
    layerColors: ["#000"],
    variableFontControlSliders: [
      {
        label: "Angle",
        tag: "ANGL",
        min: 0,
        max: 360-45,
        defaultValue: 45,
        step: 45
      },
      {
        label: "Thickness",
        tag: "THCK",
        min: 20,
        max: 100,
        defaultValue: 60,
      },
      {
        label: "Flipped End",
        tag: "FLIP",
        min: 0,
        max: 100,
        defaultValue: 50,
      },
    ],
    inputs: [
      {
        type: "range",
        label: "Step",
        name: "step",
        min: 10,
        max: 50,
        defaultValue: 20,
      },
      {
        type: "checkbox",
        label: "Shadow",
        name: "shadow",
        defaultValue: false,
      }, 
    ]
  },
  {
    type: "filterDetailView",
    title: "X-Ray",
    identifier: "x_ray",
    slug: "x-ray",
    isHidden: true,
    isNew: true,
    scaleThumbnailOnMobile: true,
    isNewUntil: "01-08-2024",
    layerColors: ["#000"],
    variableFontControlSliders: [
      {
        label: "Line Width",
        tag: "LINE",
        min: 10,
        max: 400,
        defaultValue: 100,
      },
      {
        label: "Point Size",
        tag: "POIN",
        min: 10,
        max: 400,
        defaultValue: 100,
      },
      {
        label: "Handle Size",
        tag: "HAND",
        min: 10,
        max: 400,
        defaultValue: 100,
      },
    ],
    inputs: []
  },
  {
    type: "filterDetailView",
    title: "Extruder",
    identifier: "extruder",
    slug: "extruder",
    isHidden: true,
    scaleThumbnailOnMobile: true,
    isNew: true,
    isNewUntil: "01-08-2024",
    layerColors: ["#000", "transparent"],
    variableFontControlSliders: [
      {
        label: "Depth",
        tag: "DPTH",
        min: 10,
        max: 400,
        defaultValue: 100,
      }
    ],
    inputs: [
      {
        type: "range",
        label: "Angle",
        name: "angle",
        min: 0,
        max: 360,
        defaultValue: 330,
      },
    ],
  },
  {
    type: "post",
    slug: "hinting",
    title: "TrueType hinting, an insight for the curious",
  }
];
