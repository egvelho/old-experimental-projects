const Typeson = require("typeson");

const typeson = new Typeson().register([
    require("typeson-registry/dist/types/date"),
    require("typeson-registry/dist/types/undef"),
    require("typeson-registry/dist/types/map"),
    require("typeson-registry/dist/types/nan"),
    require("typeson-registry/dist/types/negative-infinity"),
    require("typeson-registry/dist/types/regexp"),
    require("typeson-registry/dist/types/set"),
    require("typeson-registry/dist/types/bigint"),
    require("typeson-registry/dist/types/arraybuffer"),
    require("typeson-registry/dist/types/dataview"),
    require("typeson-registry/dist/types/imagebitmap"),
    require("typeson-registry/dist/types/imagedata"),
    require("typeson-registry/dist/types/blob"),
    require("typeson-registry/dist/types/error"),
    require("typeson-registry/dist/types/file"),
    require("typeson-registry/dist/types/infinity"),
]);

export default typeson;
