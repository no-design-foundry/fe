export default [
  {
    type: "filterDetailView",
    title: "X-Ray",
    identifier: "x_ray",
    slug: "x-ray",
    isHidden: false,
    isNew: false,
    scaleThumbnailOnMobile: true,
    isNewUntil: "01-08-2024",
    layerColors: ["#000"],
    opentypeFeatures: [
      {
        label: "Background",
        tag: "ss01"
      },
      {
        label: "Filled",
        tag: "ss02",
        checked: !true
      }
    ],
    variableFontControlSliders: [
      {
        label: "Outline Width",
        tag: "OTLN",
        min: 1,
        max: 20,
        defaultValue: 10,
      },
      {
        label: "Line Width",
        tag: "LINE",
        min: 1,
        max: 20,
        defaultValue: 12,
      },
      {
        label: "Point Size",
        tag: "POIN",
        min: 10,
        max: 40,
        defaultValue: 30,
      },
      {
        label: "Handle Size",
        tag: "HAND",
        min: 10,
        max: 40,
        defaultValue: 25,
      },
    ],
    inputs: [
      {
        type: "colors",
        label: "Colors",
        names: ["outline_color", "line_color", "point_color"],
        labels: ["Outline Color", "Line Color", "Point Color"],
        defaultValues: ["#FF0000", "#00FF00", "#0000FF"],
      },
    ]
  },
  {
    type: "filterDetailView",
    title: "Pan",
    identifier: "pan",
    slug: "pan",
    isNew: false,
    scaleThumbnailOnMobile: true,
    isHidden: false,
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
        defaultValue: 100,
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
        min: 30,
        max: 60,
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
      {
        label: "Depth",
        tag: "DPTH",
        min: 0,
        max: 100,
        defaultValue: 50,
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
    isNew: false,
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
  },
  // {
  //   type: "post",
  //   slug: "bezier",
  //   title: "Beziers (Not the town in France)",
  // }
];
