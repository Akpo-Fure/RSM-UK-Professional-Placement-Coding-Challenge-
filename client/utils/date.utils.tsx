const runtimeInHHMMSS = ({ runtime }: { runtime: number }) => {
  return `${new Date(runtime * 60 * 1000).toISOString().substr(11, 8)}`
}

export { runtimeInHHMMSS }
