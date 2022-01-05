/* eslint-disable require-jsdoc */
declare module 'obj-file-parser' {
  class ObjFileParser {
    public constructor(data: string);
    public parse(): {
      materialLibraries: string[];
      models: {
        faces: {
          group: string;
          material: string;
          smoothingGroup: number;
          vertices: {
            textureCoordsIndex: number;
            vertexIndex: number;
            vertexNormalIndex: number;
          }[];
        }[];
        name: string;
        textureCoords: {
          u: number;
          v: number;
          w: number;
        }[];
        vertexNormals: {
          x: number;
          y: number;
          z: number;
        }[];
        vertices: {
          x: number;
          y: number;
          z: number;
        }[];
      }[];
    };
  }
  export default ObjFileParser;
}
