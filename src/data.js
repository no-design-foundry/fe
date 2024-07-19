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
    title: "X-Ray",
    identifier: "x_ray",
    slug: "x_ray",
    isHidden: true,
    isNew: true,
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
    inputs: [],
  },
  {
    type: "filterDetailView",
    title: "Pan",
    identifier: "pan",
    slug: "pan",
    isNew: true,
    isHidden: true,
    layerColors: ["#000"],
    variableFontControlSliders: [
      {
        label: "Angle",
        tag: "ANGL",
        min: 0,
        max: 360,
        defaultValue: 45,
      },
      {
        label: "Step",
        tag: "STEP",
        min: 40,
        max: 100,
        defaultValue: 45,
      },
      {
        label: "Thickness",
        tag: "THCK",
        min: 20,
        max: 80,
        defaultValue: 20,
      },
      {
        label: "Flipped End",
        tag: "FLIP",
        min: 0,
        max: 100,
        defaultValue: 0,
      },
    ],
    inputs: [
      {
        label: "Min Length",
        name: "min_length",
        min: 0,
        max: 100,
        defaultValue: 2,
      },      
    ]
  },
  {
    type: "filterDetailView",
    title: "Extruder",
    identifier: "extruder",
    slug: "extruder",
    isHidden: true,
    isNew: true,
    isNewUntil: "01-08-2024",
    layerColors: ["gray", "#000"],
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
