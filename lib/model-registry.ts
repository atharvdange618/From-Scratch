import Post from "./models/Post";
import Project from "./models/Project";

export function ensureModelsLoaded() {
  return { Post, Project };
}

export { Post, Project };
