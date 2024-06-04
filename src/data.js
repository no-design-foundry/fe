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
    type: "post",
    slug: "hinting",
    title: "TrueType hinting, an insight for the curious █▇▅▂▄▁▃▆▇▂▅▃▄▁▆█",
  }
];
