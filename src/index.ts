export * from "./Communication";
export * from "./Commands";

export const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
