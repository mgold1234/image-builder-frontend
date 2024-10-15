function resolveRelPath(path = '') {
  return `${path.length > 0 ? `/${path}` : ''}`;
}

export { resolveRelPath };
