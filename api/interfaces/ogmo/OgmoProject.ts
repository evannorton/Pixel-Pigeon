interface OgmoProject {
  readonly levelPaths: string[];
  readonly tilesets: {
    readonly label: string;
    readonly path: string;
  }[];
}

export default OgmoProject;
