export default function setup() {
  global.options = {
    clarinet: {
      manifestPath: './Clarinet.toml',
      initBeforeEach: false,
      coverage: false,
      costs: false,
      includeBootContracts: false,
    }
  };
}