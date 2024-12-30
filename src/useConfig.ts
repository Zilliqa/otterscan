/** Defines a chain you can connect to
 */
export type ChainConnection = {
  /** Chain Info - if not present, we will assume it is null */
  info?: ChainInfo;
  /** Name to put in the menu */
  menuName: string;
  /** URL to connect to */
  url?: string;
  /** Faucet URL */
  faucets?: string[];
  /** Hostname prefixes that default to this connection */
  hostnames?: string[];
};

/**
 * Defines a set of metadata for a certain chain.
 *
 * Users may define where it comes from, but it usually will come
 * from config file or read from chainlist directory.
 */
export type ChainInfo = {
  /**
   * Full name of the chain.
   */
  name: string;

  /**
   * If this is a testnet, list example faucets; used by a certain part of
   * ots UI.
   */
  faucets: string[];

  /**
   * Describe the chain native token, e.g., mainnet is ETH, polygon is MATIC.
   */
  nativeCurrency: {
    /**
     * The full native token name, e.g. "Ether"
     */
    name: string;

    /**
     * The native token symbol, e.g. "ETH"
     */
    symbol: string;

    /**
     * The native token number of decimals, e.g. mainnet == 18.
     */
    decimals: number;
  };
};

/**
 * Defines the sources for price information on the chain. Other than from
 * trusted oracle sources, price information can be manipulated.
 */
export type PriceOracleInfo = {
  /**
   * If set, shows the native token price.
   */
  nativeTokenPrice?: {
    /**
     * A Chainlink AggregatorV3 compatible smart contract address acting
     * as an oracle for the native token's price in USD.
     *
     * Note: You can deploy a contract that is compatible with the AggregatorV3
     * interface but does not actually use Chainlink oracles; for instance,
     * a custom contract that estimates the native token's USD price from an
     * on-chain source could be deployed.
     */
    ethUSDOracleAddress: string;
    /**
     * Number of decimals used by the oracle contract, output by calling
     * `decimals()`.
     */
    ethUSDOracleDecimals: number;
  };

  /**
   * The address of the wrapped native token contract, which should match the
   * WETH variable in Uniswap router contracts. This is used to estimate the
   * price of tokens which have at least one Uniswap pool with the wrapped
   * native token.
   */
  wrappedEthAddress?: string;

  /**
   * If defined, considers UniswapV2 pairs when estimating token prices for
   * tokens which do not have a Chainlink oracle.
   */
  uniswapV2?: {
    factoryAddress: string;
  };

  /**
   * If defined, considers UniswapV3 pairs when estimating token prices for
   * tokens which do not have a Chainlink oracle. 0.01%, 0.05%, 0.3%, and 1%
   * fee tiers are checked.
   */
  uniswapV3?: {
    factoryAddress: string;
  };
};

export const defaultChainInfo: ChainInfo = {
  name: "",
  faucets: [],
  nativeCurrency: {
    name: "Zilliqa",
    symbol: "ZIL",
    decimals: 18,
  },
};

/**
 * This is a 1:1 mapping to public/config.json file which is fetched on
 * page load.
 */
export type OtterscanConfig = {
  /**
   * URL for Erigon JSON-RPC endpoint.
   */
  erigonURL?: string;

  /**
   * (optional) URL for Beacon chain REST API (for merged chains)
   */
  beaconAPI?: string;

  /**
   * URL for static assets (logos, 4bytes, topic0, etc.)
   */
  assetsURLPrefix?: string;

  /**
   * Enable experimental features (possibly still undocumented)
   */
  experimental?: boolean;

  /**
   * Hardcode a chain ID here, avoiding having to probe the ETH provider
   * for it, saving network calls.
   */
  experimentalFixedChainId?: number;

  /**
   * Optional info about the chain; it may be predefined from config.json,
   * but also it can omitted, in which can it should be auto detected from
   * provider network + fetching the chain metadata file (in this case
   * there is an initial network hop + repaint).
   *
   * Hosted instances will probably want to hardcode the chain info during
   * initialization.
   */
  chainInfo?: ChainInfo;

  /**
   * Optional site customization options
   */
  branding?: {
    /**
     * Site name shown in page titles, home, and header.
     */
    siteName?: string;
    /**
     * Additional name shown only in page titles.
     */
    networkTitle?: string;
    /**
     * If set to true, hides new feature announcements on the home page.
     */
    hideAnnouncements?: boolean;
  };

  sourcify?: {
    /**
     * Optional custom Sourcify sources object with the keys "ipfs" and
     * "central_server" whose values are their respective root URLs.
     */
    sources?: { [key: string]: string };

    /**
     * See https://github.com/ethereum/sourcify/tree/staging/services/server#choosing-the-storage-backend
     *
     * "RepositoryV1" for the original backend format whose source filenames
     * are derived from the contract metadata.
     * "RepositoryV2" to use the Sourcify backend format which uses keccak256
     * hashes for source file names since source file names can be arbitrary
     * strings.
     */
    backendFormat?: string;
  };

  /**
   * Optional custom price oracle information for estimating the current price
   * of the native token and all other tokens.
   */
  priceOracleInfo?: PriceOracleInfo;

  /**
   * Optional settings for chains that follow the OP Stack.
   */
  opChainSettings?: {
    /**
     * The root URL of a block explorer for the layer-1 of this chain, without
     * a trailing forward slash, e.g. "https://sepolia.otterscan.io".
     */
    l1ExplorerURL?: string;
  };

  /**
   * Temporary config option, until address labels are complete: Enables setting
   * address labels which are kept in local storage.
   */
  WIP_customAddressLabels?: boolean;

  /** Version number
   */
  version?: string;

  /** Chain connections
   */
  connections?: ChainConnection[];
};

/**
 * Default location for fetching the config file.
 */
export const DEFAULT_CONFIG_FILE = "/config.json";

/** Stash a connection and go to it */
export const newConnection = async (
  config: OtterscanConfig,
  name: string,
  connection: string,
): Promise<boolean> => {
  var storage = window["localStorage"];
  var storageConfiguration = JSON.parse(
    storage.getItem("otterscanConfig") ?? "{}",
  );
  if (!(storageConfiguration instanceof Object)) {
    storageConfiguration = {};
  }
  console.log("newConnection storage " + storageConfiguration);
  var conn = storageConfiguration["connections"] ?? config.connections;
  conn = conn.filter((val: ChainConnection) => val.menuName !== name);
  conn.push({ menuName: name, url: connection });
  storageConfiguration["connections"] = conn;
  console.log("storing " + JSON.stringify(storageConfiguration));
  storage.setItem("otterscanConfig", JSON.stringify(storageConfiguration));
  return true;
};

/** Stores the connection with the given name in local storage - issuing a page reload will then
 * get us to use it.
 */
export const chooseConnection = async (
  config: OtterscanConfig,
  connection: string,
): Promise<boolean> => {
  var storage = window["localStorage"];
  var storageConfiguration = JSON.parse(
    storage.getItem("otterscanConfig") ?? "{}",
  );
  if (!(storageConfiguration instanceof Object)) {
    storageConfiguration = {};
  }
  console.log("storage " + storageConfiguration);
  let connections =
    storageConfiguration["connections"] ?? config.connections ?? [];
  for (var chain of connections) {
    if (chain.menuName === connection) {
      console.log(`Changing to ${chain.menuName}, URL ${chain.url} .. `);
      storageConfiguration["erigonURL"] = chain.url;
      storageConfiguration["faucets"] = chain.faucets;
      storageConfiguration["info"] = chain.info;
      storage.setItem("otterscanConfig", JSON.stringify(storageConfiguration));
      console.log("stash " + JSON.stringify(storageConfiguration));
      return true;
    }
  }
  return false;
};

export const deleteParametersFromLocation = async (): Promise<boolean> => {
  window.location.search = "";
  return true;
};

export const forgetLocalStorage = async (): Promise<boolean> => {
  window["localStorage"].removeItem("otterscanConfig");
  return true;
};

/**
 * Loads the global configuration according to the following criteria:
 *
 * - if the entire JSON is informed via VITE_CONFIG_JSON env variable, use it
 * - otherwise fetch the JSON from default config URL
 * - if fetching the JSON, allows to override some keys using VITE_ env variables
 */
export const loadOtterscanConfig = async (): Promise<OtterscanConfig> => {
  // vite config override has precedence over everything
  if (import.meta.env.VITE_CONFIG_JSON !== undefined) {
    console.log("Using hardcoded config: ");
    console.log(import.meta.env.VITE_CONFIG_JSON);

    // We trust the contents of VITE_CONFIG_JSON to be a valid
    // Otterscan JSON configuration
    try {
      return JSON.parse(import.meta.env.VITE_CONFIG_JSON);
    } catch (err) {
      throw new Error("Error while reading config file", { cause: err });
    }
  }

  // We fetch the config file from the deployment site, optionally overriding
  // some keys during development time
  const configURL = DEFAULT_CONFIG_FILE;

  try {
    const res = await fetch(configURL);
    const data = await res.json();
    // Override config for local dev
    var config: OtterscanConfig = { ...data };
    if (import.meta.env.DEV) {
      config.erigonURL = import.meta.env.VITE_ERIGON_URL ?? config.erigonURL;
      config.beaconAPI =
        import.meta.env.VITE_BEACON_API_URL ?? config.beaconAPI;
      config.assetsURLPrefix =
        import.meta.env.VITE_ASSETS_URL ?? config.assetsURLPrefix;
      config.experimental =
        import.meta.env.VITE_EXPERIMENTAL ?? config.experimental;
      if (import.meta.env.VITE_EXPERIMENTAL_FIXED_CHAIN_ID !== undefined) {
        config.experimentalFixedChainId = parseInt(
          import.meta.env.VITE_EXPERIMENTAL_FIXED_CHAIN_ID,
        );
      }
    }
    if (config.version === undefined) {
      config.version = "(unknown)";
    }
    if (import.meta.env.VITE_OTTERSCAN_VERSION !== undefined) {
      config.version = import.meta.env.VITE_OTTERSCAN_VERSION;
    }
    try {
      import("../autogen/version.ts").then((mod) => {
        config.version = mod.OTTERSCAN_VERSION;
      });
    } catch (e) {
      // The version import doesn't exist - we're probably a development version.
    }
    console.log(JSON.stringify(config));
    var storageConfiguration: any = {};
    try {
      var storage = window["localStorage"];
      if (storage !== undefined) {
        storageConfiguration = JSON.parse(
          storage.getItem("otterscanConfig") ?? "{}",
        );
        console.log("storage Config " + JSON.stringify(storageConfiguration));
      }
    } catch (err) {
      console.log(`Failed to get localStorage config - ${err}`);
    }

    // Default by hostname
    try {
      var host = window.location.host;
      var connections =
        storageConfiguration["connections"] ?? config.connections;
      if (connections !== undefined) {
        for (var c of connections) {
          const hosts = c.hostnames;
          if (hosts !== undefined) {
            for (var h of hosts) {
              if (host.startsWith(h)) {
                if (!("erigonURL" in storageConfiguration)) {
                  storageConfiguration["erigonURL"] = c.url;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      throw new Error(`Error setting URL from hostname: ${err}`);
    }

    // Set up URL parameters.
    try {
      var params = new URLSearchParams(window.location.search);
      // Historical - this is the parameter devex used to use.
      if (params.has("network")) {
        const url = params.get("network");
        storageConfiguration["erigonURL"] = url;
        var connections =
          storageConfiguration["connections"] ?? config.connections;
        var found = false;
        for (var c of connections) {
          if (c.url === url) {
            if (params.has("name")) {
              let name = params.get("name");
              connections = connections.map((c: ChainConnection) => {
                if (c.url == url) {
                  c.menuName = name!;
                }
                return c;
              });
            }
            found = true;
            break;
          }
        }
        if (!found) {
          var name = params.get("name") ?? url;
          connections.push({ menuName: name, url });
        }
        storageConfiguration["connections"] = connections;
        console.log("sc = " + JSON.stringify(storageConfiguration));
      }
    } catch (err) {
      console.log(`Error parsing parameters - ${err}`);
    }

    // Stash
    try {
      var storage = window["localStorage"];
      if (storage !== undefined) {
        storage.setItem(
          "otterscanConfig",
          JSON.stringify(storageConfiguration),
        );
      }
    } catch (err) {
      console.log(`Error storing back to local storage - ${err}`);
    }
    config = { ...config, ...storageConfiguration };
    console.log(JSON.stringify(config));
    console.info("Loaded app config");
    console.info(config);
    return config;
  } catch (err) {
    throw new Error(`Error while reading config file: ${configURL}`, {
      cause: err,
    });
  }
};
