import type { __ApiPreviewProps } from './api-utils'
import type { FontManifest, FontConfig } from './font-utils'
import type { LoadComponentsReturnType } from './load-components'
import type { MiddlewareRouteMatch } from '../shared/lib/router/utils/middleware-route-matcher'
import type { Params } from '../shared/lib/router/utils/route-matcher'
import type { NextConfig, NextConfigComplete } from './config-shared'
import type {
  NextParsedUrlQuery,
  NextUrlWithParsedQuery,
  RequestMeta,
} from './request-meta'
import type { ParsedUrlQuery } from 'querystring'
import type { RenderOptsPartial as PagesRenderOptsPartial } from './render'
import type { RenderOptsPartial as AppRenderOptsPartial } from './app-render/types'
import type {
  ResponseCacheBase,
  ResponseCacheEntry,
  ResponseGenerator,
} from './response-cache'
import type { UrlWithParsedQuery } from 'url'
import {
  NormalizeError,
  DecodeError,
  normalizeRepeatedSlashes,
  MissingStaticPage,
} from '../shared/lib/utils'
import type { PreviewData } from '../types'
import type { PagesManifest } from '../build/webpack/plugins/pages-manifest-plugin'
import type { BaseNextRequest, BaseNextResponse } from './base-http'
import type {
  ManifestRewriteRoute,
  ManifestRoute,
  PrerenderManifest,
} from '../build'
import type { ClientReferenceManifest } from '../build/webpack/plugins/flight-manifest-plugin'
import type { NextFontManifest } from '../build/webpack/plugins/next-font-manifest-plugin'
import type { AppPageRouteModule } from './future/route-modules/app-page/module'
import type { PagesAPIRouteMatch } from './future/route-matches/pages-api-route-match'
import type { AppRouteRouteHandlerContext } from './future/route-modules/app-route/module'
import type {
  Server as HTTPServer,
  IncomingMessage,
  ServerResponse as HTTPServerResponse,
} from 'http'
import type { MiddlewareMatcher } from '../build/analysis/get-page-static-info'
import type { TLSSocket } from 'tls'

import { format as formatUrl, parse as parseUrl } from 'url'
import { formatHostname } from './lib/format-hostname'
import { getRedirectStatus } from '../lib/redirect-status'
import { isEdgeRuntime } from '../lib/is-edge-runtime'
import {
  APP_PATHS_MANIFEST,
  NEXT_BUILTIN_DOCUMENT,
  PAGES_MANIFEST,
  STATIC_STATUS_PAGES,
  UNDERSCORE_NOT_FOUND_ROUTE,
  UNDERSCORE_NOT_FOUND_ROUTE_ENTRY,
} from '../shared/lib/constants'
import { isDynamicRoute } from '../shared/lib/router/utils'
import { checkIsOnDemandRevalidate } from './api-utils'
import { setConfig } from '../shared/lib/runtime-config.external'
import {
  formatRevalidate,
  type Revalidate,
  type SwrDelta,
} from './lib/revalidate'
import { execOnce } from '../shared/lib/utils'
import { isBlockedPage } from './utils'
import { isBot } from '../shared/lib/router/utils/is-bot'
import RenderResult from './render-result'
import { removeTrailingSlash } from '../shared/lib/router/utils/remove-trailing-slash'
import { denormalizePagePath } from '../shared/lib/page-path/denormalize-page-path'
import * as Log from '../build/output/log'
import escapePathDelimiters from '../shared/lib/router/utils/escape-path-delimiters'
import isError, { getProperError } from '../lib/is-error'
import {
  addRequestMeta,
  getRequestMeta,
  removeRequestMeta,
  setRequestMeta,
} from './request-meta'
import { normalizeAppPath } from '../shared/lib/router/utils/app-paths'
import {
  RSC_HEADER,
  NEXT_RSC_UNION_QUERY,
  NEXT_ROUTER_PREFETCH_HEADER,
  NEXT_DID_POSTPONE_HEADER,
  NEXT_URL,
  NEXT_ROUTER_STATE_TREE,
} from '../client/components/app-router-headers'
import type {
  MatchOptions,
  RouteMatcherManager,
} from './future/route-matcher-managers/route-matcher-manager'
import { I18nPathnameNormalizer } from './future/normalizers/request/i18n-route-normalizer'
import { DefaultRouteMatcherManager } from './future/route-matcher-managers/default-route-matcher-manager'
import { AppPageRouteMatcherProvider } from './future/route-matcher-providers/app-page-route-matcher-provider'
import { AppRouteRouteMatcherProvider } from './future/route-matcher-providers/app-route-route-matcher-provider'
import { PagesAPIRouteMatcherProvider } from './future/route-matcher-providers/pages-api-route-matcher-provider'
import { PagesRouteMatcherProvider } from './future/route-matcher-providers/pages-route-matcher-provider'
import { ServerManifestLoader } from './future/route-matcher-providers/helpers/manifest-loaders/server-manifest-loader'
import { getTracer, SpanKind } from './lib/trace/tracer'
import { BaseServerSpan } from './lib/trace/constants'
import { I18NProvider } from './future/helpers/i18n-provider'
import { sendResponse } from './send-response'
import { handleInternalServerErrorResponse } from './future/route-modules/helpers/response-handlers'
import {
  fromNodeOutgoingHttpHeaders,
  toNodeOutgoingHttpHeaders,
} from './web/utils'
import { CACHE_ONE_YEAR, NEXT_CACHE_TAGS_HEADER } from '../lib/constants'
import {
  NextRequestAdapter,
  signalFromNodeResponse,
} from './web/spec-extension/adapters/next-request'
import { matchNextDataPathname } from './lib/match-next-data-pathname'
import getRouteFromAssetPath from '../shared/lib/router/utils/get-route-from-asset-path'
import { stripInternalHeaders } from './internal-utils'
import { stripFlightHeaders } from './app-render/strip-flight-headers'
import {
  isAppPageRouteModule,
  isAppRouteRouteModule,
  isPagesRouteModule,
} from './future/route-modules/checks'
import { getIsServerAction } from './lib/server-action-request-meta'
import { isInterceptionRouteAppPath } from './future/helpers/interception-routes'
import { toRoute } from './lib/to-route'
import type { DeepReadonly } from '../shared/lib/deep-readonly'
import { isNodeNextRequest, isNodeNextResponse } from './base-http/helpers'
import { patchSetHeaderWithCookieSupport } from './lib/patch-set-header'
import { checkIsAppPPREnabled } from './lib/experimental/ppr'
import type { RequestAdapter } from './request-adapter/request-adapter'
import { XMatchedPathRequestAdapter } from './request-adapter/x-matched-path-request-adapter'
import {
  XInvokeError,
  XInvokePathRequestAdapter,
} from './request-adapter/x-invoke-path-request-adapter'
import { BaseRequestAdapter } from './request-adapter/base-request-adapter'
import { BubbledError, isBubbledError } from './lib/trace/bubble-error'

export type FindComponentsResult = {
  components: LoadComponentsReturnType
  query: NextParsedUrlQuery
}

export interface MiddlewareRoutingItem {
  page: string
  match: MiddlewareRouteMatch
  matchers?: MiddlewareMatcher[]
}

export type RouteHandler<
  ServerRequest extends BaseNextRequest = BaseNextRequest,
  ServerResponse extends BaseNextResponse = BaseNextResponse,
> = (
  req: ServerRequest,
  res: ServerResponse,
  parsedUrl: NextUrlWithParsedQuery
) => PromiseLike<boolean> | boolean

/**
 * The normalized route manifest is the same as the route manifest, but with
 * the rewrites normalized to the object shape that the router expects.
 */
export type NormalizedRouteManifest = {
  readonly dynamicRoutes: ReadonlyArray<ManifestRoute>
  readonly rewrites: {
    readonly beforeFiles: ReadonlyArray<ManifestRewriteRoute>
    readonly afterFiles: ReadonlyArray<ManifestRewriteRoute>
    readonly fallback: ReadonlyArray<ManifestRewriteRoute>
  }
}

export interface Options {
  /**
   * Object containing the configuration next.config.js
   */
  conf: NextConfig
  /**
   * Set to false when the server was created by Next.js
   */
  customServer?: boolean
  /**
   * Tells if Next.js is running in dev mode
   */
  dev?: boolean
  /**
   * Enables the experimental testing mode.
   */
  experimentalTestProxy?: boolean

  /**
   * Whether or not the dev server is running in experimental HTTPS mode
   */
  experimentalHttpsServer?: boolean
  /**
   * Where the Next project is located
   */
  dir?: string
  /**
   * Tells if Next.js is at the platform-level
   */
  minimalMode?: boolean
  /**
   * Hide error messages containing server information
   */
  quiet?: boolean
  /**
   * The hostname the server is running behind
   */
  hostname?: string
  /**
   * The port the server is running behind
   */
  port?: number
  /**
   * The HTTP Server that Next.js is running behind
   */
  httpServer?: HTTPServer

  isNodeDebugging?: 'brk' | boolean
}

export type RenderOpts = PagesRenderOptsPartial & AppRenderOptsPartial

export type LoadedRenderOpts = RenderOpts & LoadComponentsReturnType

type BaseRenderOpts = RenderOpts & {
  poweredByHeader: boolean
  generateEtags: boolean
  previewProps: __ApiPreviewProps
}

/**
 * The public interface for rendering with the server programmatically. This
 * would typically only allow the base request or response to extend it, but
 * because this can be programmatically accessed, we assume that it could also
 * be the base Node.js request and response types.
 */
export interface BaseRequestHandler<
  ServerRequest extends BaseNextRequest | IncomingMessage = BaseNextRequest,
  ServerResponse extends
    | BaseNextResponse
    | HTTPServerResponse = BaseNextResponse,
> {
  (
    req: ServerRequest,
    res: ServerResponse,
    parsedUrl?: NextUrlWithParsedQuery | undefined
  ): Promise<void> | void
}

export type RequestContext<
  ServerRequest extends BaseNextRequest = BaseNextRequest,
  ServerResponse extends BaseNextResponse = BaseNextResponse,
> = {
  req: ServerRequest
  res: ServerResponse
  pathname: string
  query: NextParsedUrlQuery
  renderOpts: RenderOpts
}

export type FallbackMode = false | undefined | 'blocking' | 'static'

export class NoFallbackError extends Error {}

// Internal wrapper around build errors at development
// time, to prevent us from propagating or logging them
export class WrappedBuildError extends Error {
  innerError: Error

  constructor(innerError: Error) {
    super()
    this.innerError = innerError
  }
}

type ResponsePayload = {
  type: 'html' | 'json' | 'rsc'
  body: RenderResult
  revalidate?: Revalidate
}

export type NextEnabledDirectories = {
  readonly pages: boolean
  readonly app: boolean
}

export default abstract class Server<
  ServerOptions extends Options = Options,
  ServerRequest extends BaseNextRequest = BaseNextRequest,
  ServerResponse extends BaseNextResponse = BaseNextResponse,
> {
  public readonly hostname?: string
  public readonly fetchHostname?: string
  public readonly port?: number
  protected readonly dir: string
  protected readonly quiet: boolean
  protected readonly nextConfig: NextConfigComplete
  protected readonly distDir: string
  protected readonly publicDir: string
  protected readonly hasStaticDir: boolean
  protected readonly pagesManifest?: PagesManifest
  protected readonly appPathsManifest?: PagesManifest
  protected readonly buildId: string
  protected readonly minimalMode: boolean
  protected readonly renderOpts: BaseRenderOpts
  protected readonly serverOptions: Readonly<ServerOptions>
  protected readonly appPathRoutes?: Record<string, string[]>
  protected readonly clientReferenceManifest?: DeepReadonly<ClientReferenceManifest>
  protected interceptionRoutePatterns: RegExp[]
  protected nextFontManifest?: DeepReadonly<NextFontManifest>
  private readonly responseCache: ResponseCacheBase

  protected abstract getPublicDir(): string
  protected abstract getHasStaticDir(): boolean
  protected abstract getPagesManifest(): PagesManifest | undefined
  protected abstract getAppPathsManifest(): PagesManifest | undefined
  protected abstract getBuildId(): string
  protected abstract getinterceptionRoutePatterns(): RegExp[]

  protected readonly enabledDirectories: NextEnabledDirectories
  protected abstract getEnabledDirectories(dev: boolean): NextEnabledDirectories

  protected readonly experimentalTestProxy?: boolean

  protected abstract findPageComponents(params: {
    page: string
    query: NextParsedUrlQuery
    params: Params
    isAppPath: boolean
    // The following parameters are used in the development server's
    // implementation.
    sriEnabled?: boolean
    appPaths?: ReadonlyArray<string> | null
    shouldEnsure?: boolean
    url?: string
  }): Promise<FindComponentsResult | null>
  protected abstract getFontManifest(): DeepReadonly<FontManifest> | undefined
  protected abstract getPrerenderManifest(): DeepReadonly<PrerenderManifest>
  protected abstract getNextFontManifest():
    | DeepReadonly<NextFontManifest>
    | undefined
  protected abstract attachRequestMeta(
    req: ServerRequest,
    parsedUrl: NextUrlWithParsedQuery
  ): void
  protected abstract getFallback(page: string): Promise<string>
  protected abstract hasPage(pathname: string): Promise<boolean>

  protected abstract sendRenderResult(
    req: ServerRequest,
    res: ServerResponse,
    options: {
      result: RenderResult
      type: 'html' | 'json' | 'rsc'
      generateEtags: boolean
      poweredByHeader: boolean
      revalidate?: Revalidate
      swrDelta?: SwrDelta
    }
  ): Promise<void>

  protected abstract runApi(
    req: ServerRequest,
    res: ServerResponse,
    query: ParsedUrlQuery,
    match: PagesAPIRouteMatch
  ): Promise<boolean>

  protected abstract renderHTML(
    req: ServerRequest,
    res: ServerResponse,
    pathname: string,
    query: NextParsedUrlQuery,
    renderOpts: LoadedRenderOpts
  ): Promise<RenderResult>

  protected abstract getPrefetchRsc(pathname: string): Promise<string | null>

  protected abstract getIncrementalCache(options: {
    requestHeaders: Record<string, undefined | string | string[]>
    requestProtocol: 'http' | 'https'
  }): Promise<import('./lib/incremental-cache').IncrementalCache>

  protected abstract getResponseCache(options: {
    dev: boolean
  }): ResponseCacheBase

  protected abstract loadEnvConfig(params: {
    dev: boolean
    forceReload?: boolean
  }): void

  // TODO-APP: (wyattjoh): Make protected again. Used for turbopack in route-resolver.ts right now.
  public readonly matchers: RouteMatcherManager
  protected readonly i18nProvider?: I18NProvider
  protected readonly i18nNormalizer?: I18nPathnameNormalizer

  /**
   * The request adapter is used to adapt the incoming request based on the
   * environment Next.js is running inside.
   */
  private readonly requestAdapter: RequestAdapter<ServerRequest>

  public constructor(options: ServerOptions) {
    const {
      dir = '.',
      quiet = false,
      conf,
      dev = false,
      minimalMode = false,
      customServer = true,
      hostname,
      port,
      experimentalTestProxy,
    } = options

    this.experimentalTestProxy = experimentalTestProxy
    this.serverOptions = options

    this.dir =
      process.env.NEXT_RUNTIME === 'edge' ? dir : require('path').resolve(dir)

    this.quiet = quiet
    this.loadEnvConfig({ dev })

    // TODO: should conf be normalized to prevent missing
    // values from causing issues as this can be user provided
    this.nextConfig = conf as NextConfigComplete
    this.hostname = hostname
    if (this.hostname) {
      // we format the hostname so that it can be fetched
      this.fetchHostname = formatHostname(this.hostname)
    }
    this.port = port
    this.distDir =
      process.env.NEXT_RUNTIME === 'edge'
        ? this.nextConfig.distDir
        : require('path').join(this.dir, this.nextConfig.distDir)
    this.publicDir = this.getPublicDir()
    this.hasStaticDir = !minimalMode && this.getHasStaticDir()

    this.i18nProvider = this.nextConfig.i18n?.locales
      ? new I18NProvider(this.nextConfig.i18n)
      : undefined

    // Configure the locale normalizer, it's used for routes inside `pages/`.
    this.i18nNormalizer = this.i18nProvider
      ? new I18nPathnameNormalizer(this.i18nProvider)
      : undefined

    // Only serverRuntimeConfig needs the default
    // publicRuntimeConfig gets it's default in client/index.js
    const {
      serverRuntimeConfig = {},
      publicRuntimeConfig,
      assetPrefix,
      generateEtags,
    } = this.nextConfig

    this.buildId = this.getBuildId()
    // this is a hack to avoid Webpack knowing this is equal to this.minimalMode
    // because we replace this.minimalMode to true in production bundles.
    const minimalModeKey = 'minimalMode'
    this[minimalModeKey] =
      minimalMode || !!process.env.NEXT_PRIVATE_MINIMAL_MODE

    this.enabledDirectories = this.getEnabledDirectories(dev)

    const isAppPPREnabled =
      this.enabledDirectories.app &&
      checkIsAppPPREnabled(this.nextConfig.experimental.ppr)

    this.nextFontManifest = this.getNextFontManifest()

    if (process.env.NEXT_RUNTIME !== 'edge') {
      process.env.NEXT_DEPLOYMENT_ID = this.nextConfig.deploymentId || ''
    }

    this.renderOpts = {
      supportsDynamicHTML: true,
      trailingSlash: this.nextConfig.trailingSlash,
      deploymentId: this.nextConfig.deploymentId,
      strictNextHead: this.nextConfig.experimental.strictNextHead ?? true,
      poweredByHeader: this.nextConfig.poweredByHeader,
      canonicalBase: this.nextConfig.amp.canonicalBase || '',
      buildId: this.buildId,
      generateEtags,
      previewProps: this.getPrerenderManifest().preview,
      customServer: customServer === true ? true : undefined,
      ampOptimizerConfig: this.nextConfig.experimental.amp?.optimizer,
      basePath: this.nextConfig.basePath,
      images: this.nextConfig.images,
      optimizeFonts: this.nextConfig.optimizeFonts as FontConfig,
      fontManifest:
        (this.nextConfig.optimizeFonts as FontConfig) && !dev
          ? this.getFontManifest()
          : undefined,
      optimizeCss: this.nextConfig.experimental.optimizeCss,
      nextConfigOutput: this.nextConfig.output,
      nextScriptWorkers: this.nextConfig.experimental.nextScriptWorkers,
      disableOptimizedLoading:
        this.nextConfig.experimental.disableOptimizedLoading,
      domainLocales: this.nextConfig.i18n?.domains,
      distDir: this.distDir,
      serverComponents: this.enabledDirectories.app,
      enableTainting: this.nextConfig.experimental.taint,
      crossOrigin: this.nextConfig.crossOrigin
        ? this.nextConfig.crossOrigin
        : undefined,
      largePageDataBytes: this.nextConfig.experimental.largePageDataBytes,
      // Only the `publicRuntimeConfig` key is exposed to the client side
      // It'll be rendered as part of __NEXT_DATA__ on the client side
      runtimeConfig:
        Object.keys(publicRuntimeConfig).length > 0
          ? publicRuntimeConfig
          : undefined,

      // @ts-expect-error internal field not publicly exposed
      isExperimentalCompile: this.nextConfig.experimental.isExperimentalCompile,
      experimental: {
        isAppPPREnabled,
        swrDelta: this.nextConfig.experimental.swrDelta,
      },
    }

    // Initialize next/config with the environment configuration
    setConfig({
      serverRuntimeConfig,
      publicRuntimeConfig,
    })

    this.pagesManifest = this.getPagesManifest()
    this.appPathsManifest = this.getAppPathsManifest()
    this.appPathRoutes = this.getAppPathRoutes()
    this.interceptionRoutePatterns = this.getinterceptionRoutePatterns()

    // Configure the routes.
    this.matchers = this.getRouteMatchers()

    // Start route compilation. We don't wait for the routes to finish loading
    // because we use the `waitTillReady` promise below in `handleRequest` to
    // wait. Also we can't `await` in the constructor.
    void this.matchers.reload()

    this.setAssetPrefix(assetPrefix)
    this.responseCache = this.getResponseCache({ dev })

    // Setup the request adapter.
    if (this.minimalMode && process.env.NEXT_RUNTIME !== 'edge') {
      this.requestAdapter = new XMatchedPathRequestAdapter(
        this.buildId,
        this.enabledDirectories,
        this.i18nProvider,
        this.matchers,
        this.nextConfig,
        this.getRoutesManifest.bind(this)
      )
    } else if (!customServer && process.env.NEXT_RUNTIME !== 'edge') {
      this.requestAdapter = new XInvokePathRequestAdapter(
        this.enabledDirectories,
        this.i18nProvider,
        this.nextConfig
      )
    } else {
      this.requestAdapter = new BaseRequestAdapter(
        this.enabledDirectories,
        this.i18nProvider,
        this.nextConfig
      )
    }
  }

  protected reloadMatchers() {
    return this.matchers.reload()
  }

  private handleNextDataRequest: RouteHandler<ServerRequest, ServerResponse> =
    async (req, res, parsedUrl) => {
      const middleware = this.getMiddleware()
      const params = matchNextDataPathname(parsedUrl.pathname)

      // ignore for non-next data URLs
      if (!params || !params.path) {
        return false
      }

      if (params.path[0] !== this.buildId) {
        // Ignore if its a middleware request when we aren't on edge.
        if (
          process.env.NEXT_RUNTIME !== 'edge' &&
          req.headers['x-middleware-invoke']
        ) {
          return false
        }

        // Make sure to 404 if the buildId isn't correct
        await this.render404(req, res, parsedUrl)
        return true
      }

      // remove buildId from URL
      params.path.shift()

      const lastParam = params.path[params.path.length - 1]

      // show 404 if it doesn't end with .json
      if (typeof lastParam !== 'string' || !lastParam.endsWith('.json')) {
        await this.render404(req, res, parsedUrl)
        return true
      }

      // re-create page's pathname
      let pathname = `/${params.path.join('/')}`
      pathname = getRouteFromAssetPath(pathname, '.json')

      // ensure trailing slash is normalized per config
      if (middleware) {
        if (this.nextConfig.trailingSlash && !pathname.endsWith('/')) {
          pathname += '/'
        }
        if (
          !this.nextConfig.trailingSlash &&
          pathname.length > 1 &&
          pathname.endsWith('/')
        ) {
          pathname = pathname.substring(0, pathname.length - 1)
        }
      }

      if (this.i18nProvider) {
        // Remove the port from the hostname if present.
        const hostname = req?.headers.host?.split(':', 1)[0].toLowerCase()

        const domainLocale = this.i18nProvider.detectDomainLocale(hostname)
        const defaultLocale =
          domainLocale?.defaultLocale ?? this.i18nProvider.config.defaultLocale

        const localePathResult = this.i18nProvider.analyze(pathname)

        // If the locale is detected from the path, we need to remove it
        // from the pathname.
        if (localePathResult.detectedLocale) {
          pathname = localePathResult.pathname
        }

        // Update the query with the detected locale and default locale.
        parsedUrl.query.__nextLocale = localePathResult.detectedLocale
        parsedUrl.query.__nextDefaultLocale = defaultLocale

        // If the locale is not detected from the path, we need to mark that
        // it was not inferred from default.
        if (!localePathResult.detectedLocale) {
          delete parsedUrl.query.__nextInferredLocaleFromDefault
        }

        // If no locale was detected and we don't have middleware, we need
        // to render a 404 page.
        if (!localePathResult.detectedLocale && !middleware) {
          parsedUrl.query.__nextLocale = defaultLocale
          await this.render404(req, res, parsedUrl)
          return true
        }
      }

      parsedUrl.pathname = pathname
      parsedUrl.query.__nextDataReq = '1'

      return false
    }

  protected handleNextImageRequest: RouteHandler<
    ServerRequest,
    ServerResponse
  > = () => false

  protected handleCatchallRenderRequest: RouteHandler<
    ServerRequest,
    ServerResponse
  > = () => false

  protected handleCatchallMiddlewareRequest: RouteHandler<
    ServerRequest,
    ServerResponse
  > = () => false

  protected getRouteMatchers(): RouteMatcherManager {
    // Create a new manifest loader that get's the manifests from the server.
    const manifestLoader = new ServerManifestLoader((name) => {
      switch (name) {
        case PAGES_MANIFEST:
          return this.getPagesManifest() ?? null
        case APP_PATHS_MANIFEST:
          return this.getAppPathsManifest() ?? null
        default:
          return null
      }
    })

    // Configure the matchers and handlers.
    const matchers: RouteMatcherManager = new DefaultRouteMatcherManager()

    // Match pages under `pages/`.
    matchers.push(
      new PagesRouteMatcherProvider(
        this.distDir,
        manifestLoader,
        this.i18nProvider
      )
    )

    // Match api routes under `pages/api/`.
    matchers.push(
      new PagesAPIRouteMatcherProvider(
        this.distDir,
        manifestLoader,
        this.i18nProvider
      )
    )

    // If the app directory is enabled, then add the app matchers and handlers.
    if (this.enabledDirectories.app) {
      // Match app pages under `app/`.
      matchers.push(
        new AppPageRouteMatcherProvider(this.distDir, manifestLoader)
      )
      matchers.push(
        new AppRouteRouteMatcherProvider(this.distDir, manifestLoader)
      )
    }

    return matchers
  }

  public logError(err: Error): void {
    if (this.quiet) return
    Log.error(err)
  }

  public async handleRequest(
    req: ServerRequest,
    res: ServerResponse,
    parsedUrl?: NextUrlWithParsedQuery
  ): Promise<void> {
    await this.prepare()
    const method = req.method.toUpperCase()

    const tracer = getTracer()
    return tracer.withPropagatedContext(req.headers, () => {
      return tracer.trace(
        BaseServerSpan.handleRequest,
        {
          spanName: `${method} ${req.url}`,
          kind: SpanKind.SERVER,
          attributes: {
            'http.method': method,
            'http.target': req.url,
          },
        },
        async (span) =>
          this.handleRequestImpl(req, res, parsedUrl).finally(() => {
            if (!span) return

            const isRSCRequest = isRSCRequestCheck(req) ?? false

            span.setAttributes({
              'http.status_code': res.statusCode,
              'next.rsc': isRSCRequest,
            })

            const rootSpanAttributes = tracer.getRootSpanAttributes()
            // We were unable to get attributes, probably OTEL is not enabled
            if (!rootSpanAttributes) return

            if (
              rootSpanAttributes.get('next.span_type') !==
              BaseServerSpan.handleRequest
            ) {
              console.warn(
                `Unexpected root span type '${rootSpanAttributes.get(
                  'next.span_type'
                )}'. Please report this Next.js issue https://github.com/vercel/next.js`
              )
              return
            }

            const route = rootSpanAttributes.get('next.route')
            if (route) {
              const name = isRSCRequest
                ? `RSC ${method} ${route}`
                : `${method} ${route}`

              span.setAttributes({
                'next.route': route,
                'http.route': route,
                'next.span_name': name,
              })
              span.updateName(name)
            } else {
              span.updateName(
                isRSCRequest
                  ? `RSC ${method} ${req.url}`
                  : `${method} ${req.url}`
              )
            }
          })
      )
    })
  }

  private async handleRequestImpl(
    req: ServerRequest,
    res: ServerResponse,
    parsedUrl?: NextUrlWithParsedQuery
  ): Promise<void> {
    try {
      // Wait for the matchers to be ready.
      await this.matchers.waitTillReady()

      // ensure cookies set in middleware are merged and
      // not overridden by API routes/getServerSideProps
      patchSetHeaderWithCookieSupport(
        req,
        isNodeNextResponse(res) ? res.originalResponse : res
      )

      const urlParts = (req.url || '').split('?', 1)
      const urlNoQuery = urlParts[0]

      // this normalizes repeated slashes in the path e.g. hello//world ->
      // hello/world or backslashes to forward slashes, this does not
      // handle trailing slash as that is handled the same as a next.config.js
      // redirect
      if (urlNoQuery?.match(/(\\|\/\/)/)) {
        const cleanUrl = normalizeRepeatedSlashes(req.url!)
        res.redirect(cleanUrl, 308).body(cleanUrl).send()
        return
      }

      // Parse url if parsedUrl not provided
      if (!parsedUrl || typeof parsedUrl !== 'object') {
        if (!req.url) {
          throw new Error('Invariant: url can not be undefined')
        }

        parsedUrl = parseUrl(req.url!, true)
      }

      if (!parsedUrl.pathname) {
        throw new Error("Invariant: pathname can't be empty")
      }

      // Parse the querystring ourselves if the user doesn't handle querystring parsing
      if (typeof parsedUrl.query === 'string') {
        parsedUrl.query = Object.fromEntries(
          new URLSearchParams(parsedUrl.query)
        )
      }

      // Update the `x-forwarded-*` headers.
      const { originalRequest = null } = isNodeNextRequest(req) ? req : {}
      const xForwardedProto = originalRequest?.headers['x-forwarded-proto']
      const isHttps = xForwardedProto
        ? xForwardedProto === 'https'
        : !!(originalRequest?.socket as TLSSocket)?.encrypted

      req.headers['x-forwarded-host'] ??= req.headers['host'] ?? this.hostname
      req.headers['x-forwarded-port'] ??= this.port
        ? this.port.toString()
        : isHttps
          ? '443'
          : '80'
      req.headers['x-forwarded-proto'] ??= isHttps ? 'https' : 'http'
      req.headers['x-forwarded-for'] ??= originalRequest?.socket?.remoteAddress

      // This should be done before any normalization of the pathname happens as
      // it captures the initial URL.
      this.attachRequestMeta(req, parsedUrl)

      // Adapt the request using the adapter if it's setup.
      await this.requestAdapter.adapt(req, parsedUrl)

      // set incremental cache to request meta so it can
      // be passed down for edge functions and the fetch disk
      // cache can be leveraged locally
      if (
        !(this.serverOptions as any).webServerConfig &&
        !getRequestMeta(req, 'incrementalCache')
      ) {
        let protocol: 'http:' | 'https:' = 'https:'

        try {
          const parsedFullUrl = new URL(
            getRequestMeta(req, 'initURL') || '/',
            'http://n'
          )
          protocol = parsedFullUrl.protocol as 'https:' | 'http:'
        } catch {}

        const incrementalCache = await this.getIncrementalCache({
          requestHeaders: Object.assign({}, req.headers),
          requestProtocol: protocol.substring(0, protocol.length - 1) as
            | 'http'
            | 'https',
        })
        incrementalCache.resetRequestCache()
        addRequestMeta(req, 'incrementalCache', incrementalCache)
        ;(globalThis as any).__incrementalCache = incrementalCache
      }

      let finished = await this.normalizeAndAttachMetadata(req, res, parsedUrl)
      if (finished) return

      // Handle middleware requests.
      if (
        process.env.NEXT_RUNTIME !== 'edge' &&
        req.headers['x-middleware-invoke']
      ) {
        finished = await this.handleCatchallMiddlewareRequest(
          req,
          res,
          parsedUrl
        )
        if (finished) return

        throw new BubbledError(true, {
          response: new Response(null, {
            headers: { 'x-middleware-next': '1' },
          }),
        })
      }

      res.statusCode = 200

      // If we aren't in minimal mode, this isn't a custom server, and we aren't
      // in the edge runtime, we should use the handle method directly, as this
      // has been routed by Next.js.
      if (
        !this.minimalMode &&
        !this.renderOpts.customServer &&
        process.env.NEXT_RUNTIME !== 'edge'
      ) {
        await this.handleCatchallRenderRequest(req, res, parsedUrl)
      } else {
        await this.run(req, res, parsedUrl)
      }

      return
    } catch (err: any) {
      if (err instanceof XInvokeError) {
        res.statusCode = err.statusCode
        return this.renderError(err.cause, req, res, '/_error', err.query)
      }

      if (err instanceof NoFallbackError) {
        throw err
      }

      if (
        (err && typeof err === 'object' && err.code === 'ERR_INVALID_URL') ||
        err instanceof DecodeError ||
        err instanceof NormalizeError
      ) {
        res.statusCode = 400
        return this.renderError(null, req, res, '/_error', {})
      }

      if (
        this.minimalMode ||
        this.renderOpts.dev ||
        (isBubbledError(err) && err.bubble)
      ) {
        throw err
      }
      this.logError(getProperError(err))
      res.statusCode = 500
      res.body('Internal Server Error').send()
    }
  }

  private normalizeAndAttachMetadata: RouteHandler<
    ServerRequest,
    ServerResponse
  > = async (req, res, url) => {
    let finished = await this.handleNextImageRequest(req, res, url)
    if (finished) return true

    if (this.enabledDirectories.pages) {
      finished = await this.handleNextDataRequest(req, res, url)
      if (finished) return true
    }

    return false
  }

  /**
   * @internal - this method is internal to Next.js and should not be used directly by end-users
   */
  public getRequestHandlerWithMetadata(
    meta: RequestMeta
  ): BaseRequestHandler<ServerRequest, ServerResponse> {
    const handler = this.getRequestHandler()
    return (req, res, parsedUrl) => {
      setRequestMeta(req, meta)
      return handler(req, res, parsedUrl)
    }
  }

  public getRequestHandler(): BaseRequestHandler<
    ServerRequest,
    ServerResponse
  > {
    return this.handleRequest.bind(this)
  }

  protected abstract handleUpgrade(
    req: ServerRequest,
    socket: any,
    head?: any
  ): Promise<void>

  public setAssetPrefix(prefix?: string): void {
    this.renderOpts.assetPrefix = prefix ? prefix.replace(/\/$/, '') : ''
  }

  protected prepared: boolean = false
  protected preparedPromise: Promise<void> | null = null
  /**
   * Runs async initialization of server.
   * It is idempotent, won't fire underlying initialization more than once.
   */
  public async prepare(): Promise<void> {
    if (this.prepared) return

    if (this.preparedPromise === null) {
      this.preparedPromise = this.prepareImpl().then(() => {
        this.prepared = true
        this.preparedPromise = null
      })
    }
    return this.preparedPromise
  }
  protected async prepareImpl(): Promise<void> {}

  // Backwards compatibility
  protected async close(): Promise<void> {}

  protected getAppPathRoutes(): Record<string, string[]> {
    const appPathRoutes: Record<string, string[]> = {}

    Object.keys(this.appPathsManifest || {}).forEach((entry) => {
      const normalizedPath = normalizeAppPath(entry)
      if (!appPathRoutes[normalizedPath]) {
        appPathRoutes[normalizedPath] = []
      }
      appPathRoutes[normalizedPath].push(entry)
    })
    return appPathRoutes
  }

  protected async run(
    req: ServerRequest,
    res: ServerResponse,
    parsedUrl: UrlWithParsedQuery
  ): Promise<void> {
    return getTracer().trace(BaseServerSpan.run, async () =>
      this.runImpl(req, res, parsedUrl)
    )
  }

  private async runImpl(
    req: ServerRequest,
    res: ServerResponse,
    parsedUrl: UrlWithParsedQuery
  ): Promise<void> {
    await this.handleCatchallRenderRequest(req, res, parsedUrl)
  }

  private async pipe(
    fn: (
      ctx: RequestContext<ServerRequest, ServerResponse>
    ) => Promise<ResponsePayload | null>,
    partialContext: Omit<
      RequestContext<ServerRequest, ServerResponse>,
      'renderOpts'
    >
  ): Promise<void> {
    return getTracer().trace(BaseServerSpan.pipe, async () =>
      this.pipeImpl(fn, partialContext)
    )
  }

  private async pipeImpl(
    fn: (
      ctx: RequestContext<ServerRequest, ServerResponse>
    ) => Promise<ResponsePayload | null>,
    partialContext: Omit<
      RequestContext<ServerRequest, ServerResponse>,
      'renderOpts'
    >
  ): Promise<void> {
    const isBotRequest = isBot(partialContext.req.headers['user-agent'] || '')
    const ctx: RequestContext<ServerRequest, ServerResponse> = {
      ...partialContext,
      renderOpts: {
        ...this.renderOpts,
        supportsDynamicHTML: !isBotRequest,
        isBot: !!isBotRequest,
      },
    }
    const payload = await fn(ctx)
    if (payload === null) {
      return
    }
    const { req, res } = ctx
    const originalStatus = res.statusCode
    const { body, type } = payload
    let { revalidate } = payload
    if (!res.sent) {
      const { generateEtags, poweredByHeader, dev } = this.renderOpts

      // In dev, we should not cache pages for any reason.
      if (dev) {
        res.setHeader('Cache-Control', 'no-store, must-revalidate')
        revalidate = undefined
      }

      await this.sendRenderResult(req, res, {
        result: body,
        type,
        generateEtags,
        poweredByHeader,
        revalidate,
        swrDelta: this.nextConfig.experimental.swrDelta,
      })
      res.statusCode = originalStatus
    }
  }

  private async getStaticHTML(
    fn: (
      ctx: RequestContext<ServerRequest, ServerResponse>
    ) => Promise<ResponsePayload | null>,
    partialContext: Omit<
      RequestContext<ServerRequest, ServerResponse>,
      'renderOpts'
    >
  ): Promise<string | null> {
    const ctx: RequestContext<ServerRequest, ServerResponse> = {
      ...partialContext,
      renderOpts: {
        ...this.renderOpts,
        supportsDynamicHTML: false,
      },
    }
    const payload = await fn(ctx)
    if (payload === null) {
      return null
    }
    return payload.body.toUnchunkedString()
  }

  public async render(
    req: ServerRequest,
    res: ServerResponse,
    pathname: string,
    query: NextParsedUrlQuery = {},
    parsedUrl?: NextUrlWithParsedQuery,
    internalRender = false
  ): Promise<void> {
    return getTracer().trace(BaseServerSpan.render, async () =>
      this.renderImpl(req, res, pathname, query, parsedUrl, internalRender)
    )
  }

  private async renderImpl(
    req: ServerRequest,
    res: ServerResponse,
    pathname: string,
    query: NextParsedUrlQuery = {},
    parsedUrl?: NextUrlWithParsedQuery,
    internalRender = false
  ): Promise<void> {
    if (!pathname.startsWith('/')) {
      console.warn(
        `Cannot render page with path "${pathname}", did you mean "/${pathname}"?. See more info here: https://nextjs.org/docs/messages/render-no-starting-slash`
      )
    }

    if (
      this.renderOpts.customServer &&
      pathname === '/index' &&
      !(await this.hasPage('/index'))
    ) {
      // maintain backwards compatibility for custom server
      // (see custom-server integration tests)
      pathname = '/'
    }

    // we allow custom servers to call render for all URLs
    // so check if we need to serve a static _next file or not.
    // we don't modify the URL for _next/data request but still
    // call render so we special case this to prevent an infinite loop
    if (
      !internalRender &&
      !this.minimalMode &&
      !query.__nextDataReq &&
      (req.url?.match(/^\/_next\//) ||
        (this.hasStaticDir && req.url!.match(/^\/static\//)))
    ) {
      return this.handleRequest(req, res, parsedUrl)
    }

    if (isBlockedPage(pathname)) {
      return this.render404(req, res, parsedUrl)
    }

    return this.pipe((ctx) => this.renderToResponse(ctx), {
      req,
      res,
      pathname,
      query,
    })
  }

  protected async getStaticPaths({
    pathname,
  }: {
    pathname: string
    requestHeaders: import('./lib/incremental-cache').IncrementalCache['requestHeaders']
    page: string
    isAppPath: boolean
  }): Promise<{
    staticPaths?: string[]
    fallbackMode?: 'static' | 'blocking' | false
  }> {
    // Read whether or not fallback should exist from the manifest.
    const fallbackField =
      this.getPrerenderManifest().dynamicRoutes[pathname]?.fallback

    return {
      // `staticPaths` is intentionally set to `undefined` as it should've
      // been caught when checking disk data.
      staticPaths: undefined,
      fallbackMode:
        typeof fallbackField === 'string'
          ? 'static'
          : fallbackField === null
            ? 'blocking'
            : fallbackField,
    }
  }

  private async renderToResponseWithComponents(
    requestContext: RequestContext<ServerRequest, ServerResponse>,
    findComponentsResult: FindComponentsResult
  ): Promise<ResponsePayload | null> {
    return getTracer().trace(
      BaseServerSpan.renderToResponseWithComponents,
      async () =>
        this.renderToResponseWithComponentsImpl(
          requestContext,
          findComponentsResult
        )
    )
  }

  protected stripInternalHeaders(req: ServerRequest): void {
    // Skip stripping internal headers in test mode while the header stripping
    // has been explicitly disabled. This allows tests to verify internal
    // routing behavior.
    if (
      process.env.__NEXT_TEST_MODE &&
      process.env.__NEXT_NO_STRIP_INTERNAL_HEADERS === '1'
    ) {
      return
    }

    // Strip the internal headers from both the request and the original
    // request.
    stripInternalHeaders(req.headers)

    if (
      // The type check here ensures that `req` is correctly typed, and the
      // environment variable check provides dead code elimination.
      process.env.NEXT_RUNTIME !== 'edge' &&
      isNodeNextRequest(req)
    ) {
      stripInternalHeaders(req.originalRequest.headers)
    }
  }

  protected pathCouldBeIntercepted(resolvedPathname: string): boolean {
    return (
      isInterceptionRouteAppPath(resolvedPathname) ||
      this.interceptionRoutePatterns.some((regexp) => {
        return regexp.test(resolvedPathname)
      })
    )
  }

  protected setVaryHeader(
    req: ServerRequest,
    res: ServerResponse,
    isAppPath: boolean,
    resolvedPathname: string
  ): void {
    const baseVaryHeader = `${RSC_HEADER}, ${NEXT_ROUTER_STATE_TREE}, ${NEXT_ROUTER_PREFETCH_HEADER}`
    const isRSCRequest = isRSCRequestCheck(req)

    let addedNextUrlToVary = false

    if (isAppPath && this.pathCouldBeIntercepted(resolvedPathname)) {
      // Interception route responses can vary based on the `Next-URL` header.
      // We use the Vary header to signal this behavior to the client to properly cache the response.
      res.setHeader('vary', `${baseVaryHeader}, ${NEXT_URL}`)
      addedNextUrlToVary = true
    } else if (isAppPath || isRSCRequest) {
      // We don't need to include `Next-URL` in the Vary header for non-interception routes since it won't affect the response.
      // We also set this header for pages to avoid caching issues when navigating between pages and app.
      res.setHeader('vary', baseVaryHeader)
    }

    if (!addedNextUrlToVary) {
      // Remove `Next-URL` from the request headers we determined it wasn't necessary to include in the Vary header.
      // This is to avoid any dependency on the `Next-URL` header being present when preparing the response.
      delete req.headers[NEXT_URL]
    }
  }

  private async renderToResponseWithComponentsImpl(
    {
      req,
      res,
      pathname,
      renderOpts: opts,
    }: RequestContext<ServerRequest, ServerResponse>,
    { components, query }: FindComponentsResult
  ): Promise<ResponsePayload | null> {
    if (pathname === UNDERSCORE_NOT_FOUND_ROUTE) {
      pathname = '/404'
    }
    const is404Page = pathname === '/404'

    // Strip the internal headers.
    this.stripInternalHeaders(req)

    const is500Page = pathname === '/500'
    const isAppPath = components.isAppPath === true

    const hasServerProps = !!components.getServerSideProps
    let hasStaticPaths = !!components.getStaticPaths
    const isServerAction = getIsServerAction(req)
    const hasGetInitialProps = !!components.Component?.getInitialProps
    let isSSG = !!components.getStaticProps

    // Compute the iSSG cache key. We use the rewroteUrl since
    // pages with fallback: false are allowed to be rewritten to
    // and we need to look up the path by the rewritten path
    let urlPathname = parseUrl(req.url || '').pathname || '/'

    let resolvedUrlPathname = getRequestMeta(req, 'rewroteURL') || urlPathname

    this.setVaryHeader(req, res, isAppPath, resolvedUrlPathname)

    let staticPaths: string[] | undefined

    let fallbackMode: FallbackMode
    let hasFallback = false
    const isDynamic = isDynamicRoute(components.page)

    const prerenderManifest = this.getPrerenderManifest()

    if (isAppPath && isDynamic) {
      const pathsResult = await this.getStaticPaths({
        pathname,
        page: components.page,
        isAppPath,
        requestHeaders: req.headers,
      })

      staticPaths = pathsResult.staticPaths
      fallbackMode = pathsResult.fallbackMode
      hasFallback = typeof fallbackMode !== 'undefined'

      if (this.nextConfig.output === 'export') {
        const page = components.page

        if (fallbackMode !== 'static') {
          throw new Error(
            `Page "${page}" is missing exported function "generateStaticParams()", which is required with "output: export" config.`
          )
        }
        const resolvedWithoutSlash = removeTrailingSlash(resolvedUrlPathname)
        if (!staticPaths?.includes(resolvedWithoutSlash)) {
          throw new Error(
            `Page "${page}" is missing param "${resolvedWithoutSlash}" in "generateStaticParams()", which is required with "output: export" config.`
          )
        }
      }

      if (hasFallback) {
        hasStaticPaths = true
      }
    }

    if (
      hasFallback ||
      staticPaths?.includes(resolvedUrlPathname) ||
      // this signals revalidation in deploy environments
      // TODO: make this more generic
      req.headers['x-now-route-matches']
    ) {
      isSSG = true
    } else if (!this.renderOpts.dev) {
      isSSG ||= !!prerenderManifest.routes[toRoute(pathname)]
    }

    // Toggle whether or not this is a Data request
    let isDataReq =
      !!(
        query.__nextDataReq ||
        (req.headers['x-nextjs-data'] &&
          (this.serverOptions as any).webServerConfig)
      ) &&
      (isSSG || hasServerProps)

    /**
     * If true, this indicates that the request being made is for an app
     * prefetch request.
     */
    const isPrefetchRSCRequest =
      (req.headers[NEXT_ROUTER_PREFETCH_HEADER.toLowerCase()] === '1' ||
        getRequestMeta(req, 'isPrefetchRSCRequest')) ??
      false

    // when we are handling a middleware prefetch and it doesn't
    // resolve to a static data route we bail early to avoid
    // unexpected SSR invocations
    if (
      !isSSG &&
      req.headers['x-middleware-prefetch'] &&
      !(is404Page || pathname === '/_error')
    ) {
      res.setHeader('x-matched-path', pathname)
      res.setHeader('x-middleware-skip', '1')
      res.setHeader(
        'cache-control',
        'private, no-cache, no-store, max-age=0, must-revalidate'
      )
      res.body('{}').send()
      return null
    }

    delete query.__nextDataReq

    // normalize req.url for SSG paths as it is not exposed
    // to getStaticProps and the asPath should not expose /_next/data
    if (
      isSSG &&
      this.minimalMode &&
      req.headers['x-matched-path'] &&
      req.url.startsWith('/_next/data')
    ) {
      req.url = this.stripNextDataPath(req.url)
    }

    if (
      !!req.headers['x-nextjs-data'] &&
      (!res.statusCode || res.statusCode === 200)
    ) {
      res.setHeader(
        'x-nextjs-matched-path',
        `${query.__nextLocale ? `/${query.__nextLocale}` : ''}${pathname}`
      )
    }

    // Don't delete headers[RSC] yet, it still needs to be used in renderToHTML later
    const isRSCRequest = isRSCRequestCheck(req)

    const { routeModule } = components

    /**
     * If the route being rendered is an app page, and the ppr feature has been
     * enabled, then the given route _could_ support PPR.
     */
    const couldSupportPPR: boolean =
      typeof routeModule !== 'undefined' &&
      isAppPageRouteModule(routeModule) &&
      this.renderOpts.experimental.isAppPPREnabled

    // If this is a request that's rendering an app page that support's PPR,
    // then if we're in development mode (or using the experimental test
    // proxy) and the query parameter is set, then we should render the
    // skeleton. We assume that if the page _could_ support it, we should
    // show the skeleton in development. Ideally we would check the appConfig
    // to see if this page has it enabled or not, but that would require
    // plumbing the appConfig through to the server during development.
    const isDebugPPRSkeleton =
      query.__nextppronly &&
      couldSupportPPR &&
      (this.renderOpts.dev || this.experimentalTestProxy)
        ? true
        : false

    // This page supports PPR if it has `experimentalPPR` set to `true` in the
    // prerender manifest and this is an app page.
    const isRoutePPREnabled: boolean =
      couldSupportPPR &&
      ((
        prerenderManifest.routes[pathname] ??
        prerenderManifest.dynamicRoutes[pathname]
      )?.experimentalPPR === true ||
        isDebugPPRSkeleton)

    // If we're in minimal mode, then try to get the postponed information from
    // the request metadata. If available, use it for resuming the postponed
    // render.
    const minimalPostponed = isRoutePPREnabled
      ? getRequestMeta(req, 'postponed')
      : undefined

    // If PPR is enabled, and this is a RSC request (but not a prefetch), then
    // we can use this fact to only generate the flight data for the request
    // because we can't cache the HTML (as it's also dynamic).
    const isDynamicRSCRequest =
      isRoutePPREnabled && isRSCRequest && !isPrefetchRSCRequest

    // we need to ensure the status code if /404 is visited directly
    if (is404Page && !isDataReq && !isRSCRequest) {
      res.statusCode = 404
    }

    // ensure correct status is set when visiting a status page
    // directly e.g. /500
    if (STATIC_STATUS_PAGES.includes(pathname)) {
      res.statusCode = parseInt(pathname.slice(1), 10)
    }

    if (
      // Server actions can use non-GET/HEAD methods.
      !isServerAction &&
      // Resume can use non-GET/HEAD methods.
      !minimalPostponed &&
      !is404Page &&
      !is500Page &&
      pathname !== '/_error' &&
      req.method !== 'HEAD' &&
      req.method !== 'GET' &&
      (typeof components.Component === 'string' || isSSG)
    ) {
      res.statusCode = 405
      res.setHeader('Allow', ['GET', 'HEAD'])
      await this.renderError(null, req, res, pathname)
      return null
    }

    // handle static page
    if (typeof components.Component === 'string') {
      return {
        type: 'html',
        // TODO: Static pages should be serialized as RenderResult
        body: RenderResult.fromStatic(components.Component),
      }
    }

    // Ensure that if the `amp` query parameter is falsy that we remove it from
    // the query object. This ensures it won't be found by the `in` operator.
    if ('amp' in query && !query.amp) delete query.amp

    if (opts.supportsDynamicHTML === true) {
      const isBotRequest = isBot(req.headers['user-agent'] || '')
      const isSupportedDocument =
        typeof components.Document?.getInitialProps !== 'function' ||
        // The built-in `Document` component also supports dynamic HTML for concurrent mode.
        NEXT_BUILTIN_DOCUMENT in components.Document

      // Disable dynamic HTML in cases that we know it won't be generated,
      // so that we can continue generating a cache key when possible.
      // TODO-APP: should the first render for a dynamic app path
      // be static so we can collect revalidate and populate the
      // cache if there are no dynamic data requirements
      opts.supportsDynamicHTML =
        !isSSG && !isBotRequest && !query.amp && isSupportedDocument
      opts.isBot = isBotRequest
    }

    // In development, we always want to generate dynamic HTML.
    if (
      !isDataReq &&
      isAppPath &&
      opts.dev &&
      opts.supportsDynamicHTML === false
    ) {
      opts.supportsDynamicHTML = true
    }

    const defaultLocale = isSSG
      ? this.nextConfig.i18n?.defaultLocale
      : query.__nextDefaultLocale

    const locale = query.__nextLocale
    const locales = this.nextConfig.i18n?.locales

    let previewData: PreviewData
    let isPreviewMode = false

    if (hasServerProps || isSSG || isAppPath) {
      // For the edge runtime, we don't support preview mode in SSG.
      if (process.env.NEXT_RUNTIME !== 'edge') {
        const { tryGetPreviewData } =
          require('./api-utils/node/try-get-preview-data') as typeof import('./api-utils/node/try-get-preview-data')
        previewData = tryGetPreviewData(req, res, this.renderOpts.previewProps)
        isPreviewMode = previewData !== false
      }
    }

    if (isAppPath) {
      if (!this.renderOpts.dev && !isPreviewMode && isSSG && isRSCRequest) {
        // If this is an RSC request but we aren't in minimal mode, then we mark
        // that this is a data request so that we can generate the flight data
        // only.
        if (!this.minimalMode) {
          isDataReq = true
        }

        // If this is a dynamic RSC request, ensure that we don't purge the
        // flight headers to ensure that we will only produce the RSC response.
        // We only need to do this in non-edge environments (as edge doesn't
        // support static generation).
        if (
          !isDynamicRSCRequest &&
          (!isEdgeRuntime(opts.runtime) ||
            (this.serverOptions as any).webServerConfig)
        ) {
          stripFlightHeaders(req.headers)
        }
      }
    }

    let isOnDemandRevalidate = false
    let revalidateOnlyGenerated = false

    if (isSSG) {
      ;({ isOnDemandRevalidate, revalidateOnlyGenerated } =
        checkIsOnDemandRevalidate(req, this.renderOpts.previewProps))
    }

    if (isSSG && this.minimalMode && req.headers['x-matched-path']) {
      // the url value is already correct when the matched-path header is set
      resolvedUrlPathname = urlPathname
    }

    urlPathname = removeTrailingSlash(urlPathname)
    resolvedUrlPathname = removeTrailingSlash(resolvedUrlPathname)
    if (this.i18nNormalizer) {
      resolvedUrlPathname = this.i18nNormalizer.normalize(resolvedUrlPathname)
    }

    const handleRedirect = (pageData: any) => {
      const redirect = {
        destination: pageData.pageProps.__N_REDIRECT,
        statusCode: pageData.pageProps.__N_REDIRECT_STATUS,
        basePath: pageData.pageProps.__N_REDIRECT_BASE_PATH,
      }
      const statusCode = getRedirectStatus(redirect)
      const { basePath } = this.nextConfig

      if (
        basePath &&
        redirect.basePath !== false &&
        redirect.destination.startsWith('/')
      ) {
        redirect.destination = `${basePath}${redirect.destination}`
      }

      if (redirect.destination.startsWith('/')) {
        redirect.destination = normalizeRepeatedSlashes(redirect.destination)
      }

      res
        .redirect(redirect.destination, statusCode)
        .body(redirect.destination)
        .send()
    }

    // remove /_next/data prefix from urlPathname so it matches
    // for direct page visit and /_next/data visit
    if (isDataReq) {
      resolvedUrlPathname = this.stripNextDataPath(resolvedUrlPathname)
      urlPathname = this.stripNextDataPath(urlPathname)
    }

    let ssgCacheKey: string | null = null
    if (
      !isPreviewMode &&
      isSSG &&
      !opts.supportsDynamicHTML &&
      !isServerAction &&
      !minimalPostponed &&
      !isDynamicRSCRequest
    ) {
      ssgCacheKey = `${locale ? `/${locale}` : ''}${
        (pathname === '/' || resolvedUrlPathname === '/') && locale
          ? ''
          : resolvedUrlPathname
      }${query.amp ? '.amp' : ''}`
    }

    if ((is404Page || is500Page) && isSSG) {
      ssgCacheKey = `${locale ? `/${locale}` : ''}${pathname}${
        query.amp ? '.amp' : ''
      }`
    }

    if (ssgCacheKey) {
      // we only encode path delimiters for path segments from
      // getStaticPaths so we need to attempt decoding the URL
      // to match against and only escape the path delimiters
      // this allows non-ascii values to be handled e.g. Japanese characters

      // TODO: investigate adding this handling for non-SSG pages so
      // non-ascii names work there also
      ssgCacheKey = ssgCacheKey
        .split('/')
        .map((seg) => {
          try {
            seg = escapePathDelimiters(decodeURIComponent(seg), true)
          } catch (_) {
            // An improperly encoded URL was provided
            throw new DecodeError('failed to decode param')
          }
          return seg
        })
        .join('/')

      // ensure /index and / is normalized to one key
      ssgCacheKey =
        ssgCacheKey === '/index' && pathname === '/' ? '/' : ssgCacheKey
    }
    let protocol: 'http:' | 'https:' = 'https:'

    try {
      const parsedFullUrl = new URL(
        getRequestMeta(req, 'initURL') || '/',
        'http://n'
      )
      protocol = parsedFullUrl.protocol as 'https:' | 'http:'
    } catch {}

    // use existing incrementalCache instance if available
    const incrementalCache =
      (globalThis as any).__incrementalCache ||
      (await this.getIncrementalCache({
        requestHeaders: Object.assign({}, req.headers),
        requestProtocol: protocol.substring(0, protocol.length - 1) as
          | 'http'
          | 'https',
      }))

    // TODO: investigate, this is not safe across multiple concurrent requests
    incrementalCache?.resetRequestCache()

    type Renderer = (context: {
      /**
       * The postponed data for this render. This is only provided when resuming
       * a render that has been postponed.
       */
      postponed: string | undefined
    }) => Promise<ResponseCacheEntry | null>

    const doRender: Renderer = async ({ postponed }) => {
      // In development, we always want to generate dynamic HTML.
      let supportsDynamicHTML: boolean =
        // If this isn't a data request and we're not in development, then we
        // support dynamic HTML.
        (!isDataReq && opts.dev === true) ||
        // If this is not SSG or does not have static paths, then it supports
        // dynamic HTML.
        (!isSSG && !hasStaticPaths) ||
        // If this request has provided postponed data, it supports dynamic
        // HTML.
        typeof postponed === 'string' ||
        // If this is a dynamic RSC request, then this render supports dynamic
        // HTML (it's dynamic).
        isDynamicRSCRequest

      const origQuery = parseUrl(req.url || '', true).query

      // clear any dynamic route params so they aren't in
      // the resolvedUrl
      if (opts.params) {
        Object.keys(opts.params).forEach((key) => {
          delete origQuery[key]
        })
      }
      const hadTrailingSlash =
        urlPathname !== '/' && this.nextConfig.trailingSlash

      const resolvedUrl = formatUrl({
        pathname: `${resolvedUrlPathname}${hadTrailingSlash ? '/' : ''}`,
        // make sure to only add query values from original URL
        query: origQuery,
      })

      const renderOpts: LoadedRenderOpts = {
        ...components,
        ...opts,
        ...(isAppPath
          ? {
              incrementalCache,
              // This is a revalidation request if the request is for a static
              // page and it is not being resumed from a postponed render and
              // it is not a dynamic RSC request then it is a revalidation
              // request.
              isRevalidate: isSSG && !postponed && !isDynamicRSCRequest,
              originalPathname: components.ComponentMod.originalPathname,
              serverActions: this.nextConfig.experimental.serverActions,
            }
          : {}),
        isDataReq,
        resolvedUrl,
        locale,
        locales,
        defaultLocale,
        // For getServerSideProps and getInitialProps we need to ensure we use the original URL
        // and not the resolved URL to prevent a hydration mismatch on
        // asPath
        resolvedAsPath:
          hasServerProps || hasGetInitialProps
            ? formatUrl({
                // we use the original URL pathname less the _next/data prefix if
                // present
                pathname: `${urlPathname}${hadTrailingSlash ? '/' : ''}`,
                query: origQuery,
              })
            : resolvedUrl,
        experimental: {
          ...opts.experimental,
          isRoutePPREnabled,
        },
        supportsDynamicHTML,
        isOnDemandRevalidate,
        isDraftMode: isPreviewMode,
        isServerAction,
        postponed,
      }

      if (isDebugPPRSkeleton) {
        supportsDynamicHTML = false
        renderOpts.nextExport = true
        renderOpts.supportsDynamicHTML = false
        renderOpts.isStaticGeneration = true
        renderOpts.isRevalidate = true
        renderOpts.isDebugPPRSkeleton = true
      }

      // Legacy render methods will return a render result that needs to be
      // served by the server.
      let result: RenderResult

      if (routeModule) {
        if (isAppRouteRouteModule(routeModule)) {
          if (
            // The type check here ensures that `req` is correctly typed, and the
            // environment variable check provides dead code elimination.
            process.env.NEXT_RUNTIME === 'edge' ||
            !isNodeNextRequest(req) ||
            !isNodeNextResponse(res)
          ) {
            throw new Error(
              'Invariant: App Route Route Modules cannot be used in the edge runtime'
            )
          }

          const context: AppRouteRouteHandlerContext = {
            params: opts.params,
            prerenderManifest,
            renderOpts: {
              originalPathname: components.ComponentMod.originalPathname,
              supportsDynamicHTML,
              incrementalCache,
              isRevalidate: isSSG,
            },
          }

          try {
            const request = NextRequestAdapter.fromNodeNextRequest(
              req,
              signalFromNodeResponse(res.originalResponse)
            )

            const response = await routeModule.handle(request, context)

            ;(req as any).fetchMetrics = (
              context.renderOpts as any
            ).fetchMetrics

            const cacheTags = (context.renderOpts as any).fetchTags

            // If the request is for a static response, we can cache it so long
            // as it's not edge.
            if (isSSG) {
              const blob = await response.blob()

              // Copy the headers from the response.
              const headers = toNodeOutgoingHttpHeaders(response.headers)

              if (cacheTags) {
                headers[NEXT_CACHE_TAGS_HEADER] = cacheTags
              }

              if (!headers['content-type'] && blob.type) {
                headers['content-type'] = blob.type
              }

              const revalidate = context.renderOpts.store?.revalidate ?? false

              // Create the cache entry for the response.
              const cacheEntry: ResponseCacheEntry = {
                value: {
                  kind: 'ROUTE',
                  status: response.status,
                  body: Buffer.from(await blob.arrayBuffer()),
                  headers,
                },
                revalidate,
              }

              return cacheEntry
            }

            // Send the response now that we have copied it into the cache.
            await sendResponse(req, res, response, context.renderOpts.waitUntil)
            return null
          } catch (err) {
            // If this is during static generation, throw the error again.
            if (isSSG) throw err

            Log.error(err)

            // Otherwise, send a 500 response.
            await sendResponse(req, res, handleInternalServerErrorResponse())

            return null
          }
        } else if (isPagesRouteModule(routeModule)) {
          // Due to the way we pass data by mutating `renderOpts`, we can't extend
          // the object here but only updating its `clientReferenceManifest` and
          // `nextFontManifest` properties.
          // https://github.com/vercel/next.js/blob/df7cbd904c3bd85f399d1ce90680c0ecf92d2752/packages/next/server/render.tsx#L947-L952
          renderOpts.nextFontManifest = this.nextFontManifest
          renderOpts.clientReferenceManifest =
            components.clientReferenceManifest

          const request = isNodeNextRequest(req) ? req.originalRequest : req
          const response = isNodeNextResponse(res) ? res.originalResponse : res

          // Call the built-in render method on the module.
          result = await routeModule.render(
            // TODO: fix this type
            // @ts-expect-error - preexisting accepted this
            request,
            response,
            {
              page: pathname,
              params: opts.params,
              query,
              renderOpts,
            }
          )
        } else if (isAppPageRouteModule(routeModule)) {
          const module = components.routeModule as AppPageRouteModule

          // Due to the way we pass data by mutating `renderOpts`, we can't extend the
          // object here but only updating its `nextFontManifest` field.
          // https://github.com/vercel/next.js/blob/df7cbd904c3bd85f399d1ce90680c0ecf92d2752/packages/next/server/render.tsx#L947-L952
          renderOpts.nextFontManifest = this.nextFontManifest

          // Call the built-in render method on the module.
          result = await module.render(req, res, {
            page: is404Page ? '/404' : pathname,
            params: opts.params,
            query,
            renderOpts,
          })
        } else {
          throw new Error('Invariant: Unknown route module type')
        }
      } else {
        // If we didn't match a page, we should fallback to using the legacy
        // render method.
        result = await this.renderHTML(req, res, pathname, query, renderOpts)
      }

      const { metadata } = result

      const {
        headers = {},
        // Add any fetch tags that were on the page to the response headers.
        fetchTags: cacheTags,
      } = metadata

      if (cacheTags) {
        headers[NEXT_CACHE_TAGS_HEADER] = cacheTags
      }

      // Pull any fetch metrics from the render onto the request.
      ;(req as any).fetchMetrics = metadata.fetchMetrics

      // we don't throw static to dynamic errors in dev as isSSG
      // is a best guess in dev since we don't have the prerender pass
      // to know whether the path is actually static or not
      if (
        isAppPath &&
        isSSG &&
        metadata.revalidate === 0 &&
        !this.renderOpts.dev &&
        !isRoutePPREnabled
      ) {
        const staticBailoutInfo = metadata.staticBailoutInfo

        const err = new Error(
          `Page changed from static to dynamic at runtime ${urlPathname}${
            staticBailoutInfo?.description
              ? `, reason: ${staticBailoutInfo.description}`
              : ``
          }` +
            `\nsee more here https://nextjs.org/docs/messages/app-static-to-dynamic-error`
        )

        if (staticBailoutInfo?.stack) {
          const stack = staticBailoutInfo.stack
          err.stack = err.message + stack.substring(stack.indexOf('\n'))
        }

        throw err
      }

      // Based on the metadata, we can determine what kind of cache result we
      // should return.

      // Handle `isNotFound`.
      if ('isNotFound' in metadata && metadata.isNotFound) {
        return { value: null, revalidate: metadata.revalidate }
      }

      // Handle `isRedirect`.
      if (metadata.isRedirect) {
        return {
          value: {
            kind: 'REDIRECT',
            props: metadata.pageData ?? metadata.flightData,
          },
          revalidate: metadata.revalidate,
        }
      }

      // Handle `isNull`.
      if (result.isNull) {
        return null
      }

      // We now have a valid HTML result that we can return to the user.
      return {
        value: {
          kind: 'PAGE',
          html: result,
          pageData: metadata.pageData ?? metadata.flightData,
          postponed: metadata.postponed,
          headers,
          status: isAppPath ? res.statusCode : undefined,
        },
        revalidate: metadata.revalidate,
      }
    }

    const responseGenerator: ResponseGenerator = async (
      hasResolved,
      previousCacheEntry,
      isRevalidating
    ): Promise<ResponseCacheEntry | null> => {
      const isProduction = !this.renderOpts.dev
      const didRespond = hasResolved || res.sent

      if (!staticPaths) {
        ;({ staticPaths, fallbackMode } = hasStaticPaths
          ? await this.getStaticPaths({
              pathname,
              requestHeaders: req.headers,
              isAppPath,
              page: components.page,
            })
          : { staticPaths: undefined, fallbackMode: false })
      }

      if (fallbackMode === 'static' && isBot(req.headers['user-agent'] || '')) {
        fallbackMode = 'blocking'
      }

      // skip on-demand revalidate if cache is not present and
      // revalidate-if-generated is set
      if (
        isOnDemandRevalidate &&
        revalidateOnlyGenerated &&
        !previousCacheEntry &&
        !this.minimalMode
      ) {
        await this.render404(req, res)
        return null
      }

      if (previousCacheEntry?.isStale === -1) {
        isOnDemandRevalidate = true
      }

      // only allow on-demand revalidate for fallback: true/blocking
      // or for prerendered fallback: false paths
      if (
        isOnDemandRevalidate &&
        (fallbackMode !== false || previousCacheEntry)
      ) {
        fallbackMode = 'blocking'
      }

      // We use `ssgCacheKey` here as it is normalized to match the encoding
      // from getStaticPaths along with including the locale.
      //
      // We use the `resolvedUrlPathname` for the development case when this
      // is an app path since it doesn't include locale information.
      let staticPathKey =
        ssgCacheKey ?? (opts.dev && isAppPath ? resolvedUrlPathname : null)
      if (staticPathKey && query.amp) {
        staticPathKey = staticPathKey.replace(/\.amp$/, '')
      }

      const isPageIncludedInStaticPaths =
        staticPathKey && staticPaths?.includes(staticPathKey)

      if ((this.nextConfig.experimental as any).isExperimentalCompile) {
        fallbackMode = 'blocking'
      }

      // When we did not respond from cache, we need to choose to block on
      // rendering or return a skeleton.
      //
      // - Data requests always block.
      // - Blocking mode fallback always blocks.
      // - Preview mode toggles all pages to be resolved in a blocking manner.
      // - Non-dynamic pages should block (though this is an impossible
      //   case in production).
      // - Dynamic pages should return their skeleton if not defined in
      //   getStaticPaths, then finish the data request on the client-side.
      //
      if (
        process.env.NEXT_RUNTIME !== 'edge' &&
        !this.minimalMode &&
        fallbackMode !== 'blocking' &&
        staticPathKey &&
        !didRespond &&
        !isPreviewMode &&
        isDynamic &&
        (isProduction || !staticPaths || !isPageIncludedInStaticPaths)
      ) {
        if (
          // In development, fall through to render to handle missing
          // getStaticPaths.
          (isProduction || (staticPaths && staticPaths?.length > 0)) &&
          // When fallback isn't present, abort this render so we 404
          fallbackMode !== 'static'
        ) {
          throw new NoFallbackError()
        }

        if (!isDataReq) {
          // Production already emitted the fallback as static HTML.
          if (isProduction) {
            const html = await this.getFallback(
              locale ? `/${locale}${pathname}` : pathname
            )

            return {
              value: {
                kind: 'PAGE',
                html: RenderResult.fromStatic(html),
                postponed: undefined,
                status: undefined,
                headers: undefined,
                pageData: {},
              },
            }
          }
          // We need to generate the fallback on-demand for development.
          else {
            query.__nextFallback = 'true'

            // We pass `undefined` as there cannot be a postponed state in
            // development.
            const result = await doRender({ postponed: undefined })
            if (!result) {
              return null
            }
            // Prevent caching this result
            delete result.revalidate
            return result
          }
        }
      }

      const result = await doRender({
        // Only requests that aren't revalidating can be resumed. If we have the
        // minimal postponed data, then we should resume the render with it.
        postponed:
          !isOnDemandRevalidate && !isRevalidating && minimalPostponed
            ? minimalPostponed
            : undefined,
      })
      if (!result) {
        return null
      }

      return {
        ...result,
        revalidate:
          result.revalidate !== undefined
            ? result.revalidate
            : /* default to minimum revalidate (this should be an invariant) */ 1,
      }
    }

    const cacheEntry = await this.responseCache.get(
      ssgCacheKey,
      responseGenerator,
      {
        routeKind: routeModule?.definition.kind,
        incrementalCache,
        isOnDemandRevalidate,
        isPrefetch: req.headers.purpose === 'prefetch',
      }
    )

    if (!cacheEntry) {
      if (ssgCacheKey && !(isOnDemandRevalidate && revalidateOnlyGenerated)) {
        // A cache entry might not be generated if a response is written
        // in `getInitialProps` or `getServerSideProps`, but those shouldn't
        // have a cache key. If we do have a cache key but we don't end up
        // with a cache entry, then either Next.js or the application has a
        // bug that needs fixing.
        throw new Error('invariant: cache entry required but not generated')
      }
      return null
    }

    const didPostpone =
      cacheEntry.value?.kind === 'PAGE' &&
      typeof cacheEntry.value.postponed === 'string'

    if (
      isSSG &&
      !this.minimalMode &&
      // We don't want to send a cache header for requests that contain dynamic
      // data. If this is a Dynamic RSC request or wasn't a Prefetch RSC
      // request, then we should set the cache header.
      !isDynamicRSCRequest &&
      (!didPostpone || isPrefetchRSCRequest)
    ) {
      // set x-nextjs-cache header to match the header
      // we set for the image-optimizer
      res.setHeader(
        'x-nextjs-cache',
        isOnDemandRevalidate
          ? 'REVALIDATED'
          : cacheEntry.isMiss
            ? 'MISS'
            : cacheEntry.isStale
              ? 'STALE'
              : 'HIT'
      )
    }

    const { value: cachedData } = cacheEntry

    // If the cache value is an image, we should error early.
    if (cachedData?.kind === 'IMAGE') {
      throw new Error('invariant SSG should not return an image cache value')
    }

    // Coerce the revalidate parameter from the render.
    let revalidate: Revalidate | undefined

    // If this is a resume request in minimal mode it is streamed with dynamic
    // content and should not be cached.
    if (minimalPostponed) {
      revalidate = 0
    }

    // If this is in minimal mode and this is a flight request that isn't a
    // prefetch request while PPR is enabled, it cannot be cached as it contains
    // dynamic content.
    else if (
      this.minimalMode &&
      isRSCRequest &&
      !isPrefetchRSCRequest &&
      isRoutePPREnabled
    ) {
      revalidate = 0
    } else if (
      typeof cacheEntry.revalidate !== 'undefined' &&
      (!this.renderOpts.dev || (hasServerProps && !isDataReq))
    ) {
      // If this is a preview mode request, we shouldn't cache it. We also don't
      // cache 404 pages.
      if (isPreviewMode || (is404Page && !isDataReq)) {
        revalidate = 0
      }

      // If this isn't SSG, then we should set change the header only if it is
      // not set already.
      else if (!isSSG) {
        if (!res.getHeader('Cache-Control')) {
          revalidate = 0
        }
      }

      // If the cache entry has a revalidate value that's a number, use it.
      else if (typeof cacheEntry.revalidate === 'number') {
        if (cacheEntry.revalidate < 1) {
          throw new Error(
            `Invariant: invalid Cache-Control duration provided: ${cacheEntry.revalidate} < 1`
          )
        }

        revalidate = cacheEntry.revalidate
      }
      // Otherwise if the revalidate value is false, then we should use the cache
      // time of one year.
      else if (cacheEntry.revalidate === false) {
        revalidate = CACHE_ONE_YEAR
      }
    }

    cacheEntry.revalidate = revalidate

    // If there's a callback for `onCacheEntry`, call it with the cache entry
    // and the revalidate options.
    const onCacheEntry = getRequestMeta(req, 'onCacheEntry')
    if (onCacheEntry) {
      const finished = await onCacheEntry(cacheEntry, {
        url: getRequestMeta(req, 'initURL'),
      })
      if (finished) {
        // TODO: maybe we have to end the request?
        return null
      }
    }

    if (!cachedData) {
      if (cacheEntry.revalidate) {
        res.setHeader(
          'Cache-Control',
          formatRevalidate({
            revalidate: cacheEntry.revalidate,
            swrDelta: this.nextConfig.experimental.swrDelta,
          })
        )
      }
      if (isDataReq) {
        res.statusCode = 404
        res.body('{"notFound":true}').send()
        return null
      }

      if (this.renderOpts.dev) {
        query.__nextNotFoundSrcPage = pathname
      }

      await this.render404(req, res, { pathname, query }, false)
      return null
    } else if (cachedData.kind === 'REDIRECT') {
      if (cacheEntry.revalidate) {
        res.setHeader(
          'Cache-Control',
          formatRevalidate({
            revalidate: cacheEntry.revalidate,
            swrDelta: this.nextConfig.experimental.swrDelta,
          })
        )
      }

      if (isDataReq) {
        return {
          type: 'json',
          body: RenderResult.fromStatic(
            // @TODO: Handle flight data.
            JSON.stringify(cachedData.props)
          ),
          revalidate: cacheEntry.revalidate,
        }
      } else {
        await handleRedirect(cachedData.props)
        return null
      }
    } else if (cachedData.kind === 'ROUTE') {
      const headers = { ...cachedData.headers }

      if (!(this.minimalMode && isSSG)) {
        delete headers[NEXT_CACHE_TAGS_HEADER]
      }

      await sendResponse(
        req,
        res,
        new Response(cachedData.body, {
          headers: fromNodeOutgoingHttpHeaders(headers),
          status: cachedData.status || 200,
        })
      )
      return null
    } else if (isAppPath) {
      // If the request has a postponed state and it's a resume request we
      // should error.
      if (cachedData.postponed && minimalPostponed) {
        throw new Error(
          'Invariant: postponed state should not be present on a resume request'
        )
      }

      if (cachedData.headers) {
        const headers = { ...cachedData.headers }

        if (!this.minimalMode || !isSSG) {
          delete headers[NEXT_CACHE_TAGS_HEADER]
        }

        for (let [key, value] of Object.entries(headers)) {
          if (typeof value === 'undefined') continue

          if (Array.isArray(value)) {
            for (const v of value) {
              res.appendHeader(key, v)
            }
          } else if (typeof value === 'number') {
            value = value.toString()
            res.appendHeader(key, value)
          } else {
            res.appendHeader(key, value)
          }
        }
      }

      if (
        this.minimalMode &&
        isSSG &&
        cachedData.headers?.[NEXT_CACHE_TAGS_HEADER]
      ) {
        res.setHeader(
          NEXT_CACHE_TAGS_HEADER,
          cachedData.headers[NEXT_CACHE_TAGS_HEADER] as string
        )
      }

      // If the request is a data request, then we shouldn't set the status code
      // from the response because it should always be 200. This should be gated
      // behind the experimental PPR flag.
      if (cachedData.status && (!isDataReq || !isRoutePPREnabled)) {
        res.statusCode = cachedData.status
      }

      // Mark that the request did postpone if this is a data request.
      if (cachedData.postponed && isRSCRequest) {
        res.setHeader(NEXT_DID_POSTPONE_HEADER, '1')
      }

      // we don't go through this block when preview mode is true
      // as preview mode is a dynamic request (bypasses cache) and doesn't
      // generate both HTML and payloads in the same request so continue to just
      // return the generated payload
      if (isDataReq && !isPreviewMode) {
        // If this is a dynamic RSC request, then stream the response.
        if (isDynamicRSCRequest) {
          if (cachedData.pageData) {
            throw new Error('Invariant: Expected pageData to be undefined')
          }

          if (cachedData.postponed) {
            throw new Error('Invariant: Expected postponed to be undefined')
          }

          return {
            type: 'rsc',
            body: cachedData.html,
            // Dynamic RSC responses cannot be cached, even if they're
            // configured with `force-static` because we have no way of
            // distinguishing between `force-static` and pages that have no
            // postponed state.
            // TODO: distinguish `force-static` from pages with no postponed state (static)
            revalidate: 0,
          }
        }

        if (typeof cachedData.pageData !== 'string') {
          throw new Error(
            `Invariant: expected pageData to be a string, got ${typeof cachedData.pageData}`
          )
        }

        // As this isn't a prefetch request, we should serve the static flight
        // data.
        return {
          type: 'rsc',
          body: RenderResult.fromStatic(cachedData.pageData),
          revalidate: cacheEntry.revalidate,
        }
      }

      // This is a request for HTML data.
      let body = cachedData.html

      // If there's no postponed state, we should just serve the HTML. This
      // should also be the case for a resume request because it's completed
      // as a server render (rather than a static render).
      if (!cachedData.postponed || this.minimalMode) {
        return {
          type: 'html',
          body,
          revalidate: cacheEntry.revalidate,
        }
      }

      // If we're debugging the skeleton, we should just serve the HTML without
      // resuming the render. The returned HTML will be the static shell.
      if (isDebugPPRSkeleton) {
        return { type: 'html', body, revalidate: 0 }
      }

      // This request has postponed, so let's create a new transformer that the
      // dynamic data can pipe to that will attach the dynamic data to the end
      // of the response.
      const transformer = new TransformStream<Uint8Array, Uint8Array>()
      body.chain(transformer.readable)

      // Perform the render again, but this time, provide the postponed state.
      // We don't await because we want the result to start streaming now, and
      // we've already chained the transformer's readable to the render result.
      doRender({ postponed: cachedData.postponed })
        .then(async (result) => {
          if (!result) {
            throw new Error('Invariant: expected a result to be returned')
          }

          if (result.value?.kind !== 'PAGE') {
            throw new Error(
              `Invariant: expected a page response, got ${result.value?.kind}`
            )
          }

          // Pipe the resume result to the transformer.
          await result.value.html.pipeTo(transformer.writable)
        })
        .catch((err) => {
          // An error occurred during piping or preparing the render, abort
          // the transformers writer so we can terminate the stream.
          transformer.writable.abort(err).catch((e) => {
            console.error("couldn't abort transformer", e)
          })
        })

      return {
        type: 'html',
        body,
        // We don't want to cache the response if it has postponed data because
        // the response being sent to the client it's dynamic parts are streamed
        // to the client on the same request.
        revalidate: 0,
      }
    } else if (isDataReq) {
      return {
        type: 'json',
        body: RenderResult.fromStatic(JSON.stringify(cachedData.pageData)),
        revalidate: cacheEntry.revalidate,
      }
    } else {
      return {
        type: 'html',
        body: cachedData.html,
        revalidate: cacheEntry.revalidate,
      }
    }
  }

  private stripNextDataPath(path: string, stripLocale = true) {
    if (path.includes(this.buildId)) {
      const splitPath = path.substring(
        path.indexOf(this.buildId) + this.buildId.length
      )

      path = denormalizePagePath(splitPath.replace(/\.json$/, ''))
    }

    if (this.i18nNormalizer && stripLocale) {
      return this.i18nNormalizer.normalize(path)
    }
    return path
  }

  // map the route to the actual bundle name
  protected getOriginalAppPaths(route: string) {
    if (this.enabledDirectories.app) {
      const originalAppPath = this.appPathRoutes?.[route]

      if (!originalAppPath) {
        return null
      }

      return originalAppPath
    }
    return null
  }

  protected async renderPageComponent(
    ctx: RequestContext<ServerRequest, ServerResponse>,
    bubbleNoFallback: boolean
  ) {
    const { query, pathname } = ctx

    const appPaths = this.getOriginalAppPaths(pathname)
    const isAppPath = Array.isArray(appPaths)

    let page = pathname
    if (isAppPath) {
      // the last item in the array is the root page, if there are parallel routes
      page = appPaths[appPaths.length - 1]
    }

    const result = await this.findPageComponents({
      page,
      query,
      params: ctx.renderOpts.params || {},
      isAppPath,
      sriEnabled: !!this.nextConfig.experimental.sri?.algorithm,
      appPaths,
      // Ensuring for loading page component routes is done via the matcher.
      shouldEnsure: false,
    })
    if (result) {
      getTracer().getRootSpanAttributes()?.set('next.route', pathname)
      try {
        return await this.renderToResponseWithComponents(ctx, result)
      } catch (err) {
        const isNoFallbackError = err instanceof NoFallbackError

        if (!isNoFallbackError || (isNoFallbackError && bubbleNoFallback)) {
          throw err
        }
      }
    }
    return false
  }

  private async renderToResponse(
    ctx: RequestContext<ServerRequest, ServerResponse>
  ): Promise<ResponsePayload | null> {
    return getTracer().trace(
      BaseServerSpan.renderToResponse,
      {
        spanName: `rendering page`,
        attributes: {
          'next.route': ctx.pathname,
        },
      },
      async () => {
        return this.renderToResponseImpl(ctx)
      }
    )
  }

  protected abstract getMiddleware(): MiddlewareRoutingItem | undefined
  protected abstract getFallbackErrorComponents(
    url?: string
  ): Promise<LoadComponentsReturnType | null>
  protected abstract getRoutesManifest(): NormalizedRouteManifest | undefined

  private async renderToResponseImpl(
    ctx: RequestContext<ServerRequest, ServerResponse>
  ): Promise<ResponsePayload | null> {
    const { res, query, pathname } = ctx
    let page = pathname
    const bubbleNoFallback = !!query._nextBubbleNoFallback
    delete query[NEXT_RSC_UNION_QUERY]
    delete query._nextBubbleNoFallback

    const options: MatchOptions = {
      i18n: this.i18nProvider?.fromQuery(pathname, query),
    }

    try {
      for await (const match of this.matchers.matchAll(pathname, options)) {
        // when a specific invoke-output is meant to be matched
        // ensure a prior dynamic route/page doesn't take priority
        const invokeOutput = ctx.req.headers['x-invoke-output']
        if (
          !this.minimalMode &&
          typeof invokeOutput === 'string' &&
          isDynamicRoute(invokeOutput || '') &&
          invokeOutput !== match.definition.pathname
        ) {
          continue
        }

        const result = await this.renderPageComponent(
          {
            ...ctx,
            pathname: match.definition.pathname,
            renderOpts: {
              ...ctx.renderOpts,
              params: match.params,
            },
          },
          bubbleNoFallback
        )
        if (result !== false) return result
      }

      // currently edge functions aren't receiving the x-matched-path
      // header so we need to fallback to matching the current page
      // when we weren't able to match via dynamic route to handle
      // the rewrite case
      // @ts-expect-error extended in child class web-server
      if (this.serverOptions.webServerConfig) {
        // @ts-expect-error extended in child class web-server
        ctx.pathname = this.serverOptions.webServerConfig.page
        const result = await this.renderPageComponent(ctx, bubbleNoFallback)
        if (result !== false) return result
      }
    } catch (error) {
      const err = getProperError(error)

      if (error instanceof MissingStaticPage) {
        console.error(
          'Invariant: failed to load static page',
          JSON.stringify(
            {
              page,
              url: ctx.req.url,
              matchedPath: ctx.req.headers['x-matched-path'],
              initUrl: getRequestMeta(ctx.req, 'initURL'),
              didRewrite: !!getRequestMeta(ctx.req, 'rewroteURL'),
              rewroteUrl: getRequestMeta(ctx.req, 'rewroteURL'),
            },
            null,
            2
          )
        )
        throw err
      }

      if (err instanceof NoFallbackError && bubbleNoFallback) {
        throw err
      }
      if (err instanceof DecodeError || err instanceof NormalizeError) {
        res.statusCode = 400
        return await this.renderErrorToResponse(ctx, err)
      }

      res.statusCode = 500

      // if pages/500 is present we still need to trigger
      // /_error `getInitialProps` to allow reporting error
      if (await this.hasPage('/500')) {
        ctx.query.__nextCustomErrorRender = '1'
        await this.renderErrorToResponse(ctx, err)
        delete ctx.query.__nextCustomErrorRender
      }

      const isWrappedError = err instanceof WrappedBuildError

      if (!isWrappedError) {
        if (
          (this.minimalMode && process.env.NEXT_RUNTIME !== 'edge') ||
          this.renderOpts.dev
        ) {
          if (isError(err)) err.page = page
          throw err
        }
        this.logError(getProperError(err))
      }
      const response = await this.renderErrorToResponse(
        ctx,
        isWrappedError ? (err as WrappedBuildError).innerError : err
      )
      return response
    }

    if (
      this.getMiddleware() &&
      !!ctx.req.headers['x-nextjs-data'] &&
      (!res.statusCode || res.statusCode === 200 || res.statusCode === 404)
    ) {
      res.setHeader(
        'x-nextjs-matched-path',
        `${query.__nextLocale ? `/${query.__nextLocale}` : ''}${pathname}`
      )
      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.body('{}')
      res.send()
      return null
    }

    res.statusCode = 404
    return this.renderErrorToResponse(ctx, null)
  }

  public async renderToHTML(
    req: ServerRequest,
    res: ServerResponse,
    pathname: string,
    query: ParsedUrlQuery = {}
  ): Promise<string | null> {
    return getTracer().trace(BaseServerSpan.renderToHTML, async () => {
      return this.renderToHTMLImpl(req, res, pathname, query)
    })
  }

  private async renderToHTMLImpl(
    req: ServerRequest,
    res: ServerResponse,
    pathname: string,
    query: ParsedUrlQuery = {}
  ): Promise<string | null> {
    return this.getStaticHTML((ctx) => this.renderToResponse(ctx), {
      req,
      res,
      pathname,
      query,
    })
  }

  public async renderError(
    err: Error | null,
    req: ServerRequest,
    res: ServerResponse,
    pathname: string,
    query: NextParsedUrlQuery = {},
    setHeaders = true
  ): Promise<void> {
    return getTracer().trace(BaseServerSpan.renderError, async () => {
      return this.renderErrorImpl(err, req, res, pathname, query, setHeaders)
    })
  }

  private async renderErrorImpl(
    err: Error | null,
    req: ServerRequest,
    res: ServerResponse,
    pathname: string,
    query: NextParsedUrlQuery = {},
    setHeaders = true
  ): Promise<void> {
    if (setHeaders) {
      res.setHeader(
        'Cache-Control',
        'no-cache, no-store, max-age=0, must-revalidate'
      )
    }

    return this.pipe(
      async (ctx) => {
        const response = await this.renderErrorToResponse(ctx, err)
        if (this.minimalMode && res.statusCode === 500) {
          throw err
        }
        return response
      },
      { req, res, pathname, query }
    )
  }

  private customErrorNo404Warn = execOnce(() => {
    Log.warn(
      `You have added a custom /_error page without a custom /404 page. This prevents the 404 page from being auto statically optimized.\nSee here for info: https://nextjs.org/docs/messages/custom-error-no-custom-404`
    )
  })

  private async renderErrorToResponse(
    ctx: RequestContext<ServerRequest, ServerResponse>,
    err: Error | null
  ): Promise<ResponsePayload | null> {
    return getTracer().trace(BaseServerSpan.renderErrorToResponse, async () => {
      return this.renderErrorToResponseImpl(ctx, err)
    })
  }

  protected async renderErrorToResponseImpl(
    ctx: RequestContext<ServerRequest, ServerResponse>,
    err: Error | null
  ): Promise<ResponsePayload | null> {
    // Short-circuit favicon.ico in development to avoid compiling 404 page when the app has no favicon.ico.
    // Since favicon.ico is automatically requested by the browser.
    if (this.renderOpts.dev && ctx.pathname === '/favicon.ico') {
      return {
        type: 'html',
        body: RenderResult.fromStatic(''),
      }
    }
    const { res, query } = ctx

    try {
      let result: null | FindComponentsResult = null

      const is404 = res.statusCode === 404
      let using404Page = false

      if (is404) {
        if (this.enabledDirectories.app) {
          // Use the not-found entry in app directory
          result = await this.findPageComponents({
            page: UNDERSCORE_NOT_FOUND_ROUTE_ENTRY,
            query,
            params: {},
            isAppPath: true,
            shouldEnsure: true,
            url: ctx.req.url,
          })
          using404Page = result !== null
        }

        if (!result && (await this.hasPage('/404'))) {
          result = await this.findPageComponents({
            page: '/404',
            query,
            params: {},
            isAppPath: false,
            // Ensuring can't be done here because you never "match" a 404 route.
            shouldEnsure: true,
            url: ctx.req.url,
          })
          using404Page = result !== null
        }
      }
      let statusPage = `/${res.statusCode}`

      if (
        !ctx.query.__nextCustomErrorRender &&
        !result &&
        STATIC_STATUS_PAGES.includes(statusPage)
      ) {
        // skip ensuring /500 in dev mode as it isn't used and the
        // dev overlay is used instead
        if (statusPage !== '/500' || !this.renderOpts.dev) {
          result = await this.findPageComponents({
            page: statusPage,
            query,
            params: {},
            isAppPath: false,
            // Ensuring can't be done here because you never "match" a 500
            // route.
            shouldEnsure: true,
            url: ctx.req.url,
          })
        }
      }

      if (!result) {
        result = await this.findPageComponents({
          page: '/_error',
          query,
          params: {},
          isAppPath: false,
          // Ensuring can't be done here because you never "match" an error
          // route.
          shouldEnsure: true,
          url: ctx.req.url,
        })
        statusPage = '/_error'
      }

      if (
        process.env.NODE_ENV !== 'production' &&
        !using404Page &&
        (await this.hasPage('/_error')) &&
        !(await this.hasPage('/404'))
      ) {
        this.customErrorNo404Warn()
      }

      if (!result) {
        // this can occur when a project directory has been moved/deleted
        // which is handled in the parent process in development
        if (this.renderOpts.dev) {
          return {
            type: 'html',
            // wait for dev-server to restart before refreshing
            body: RenderResult.fromStatic(
              `
              <pre>missing required error components, refreshing...</pre>
              <script>
                async function check() {
                  const res = await fetch(location.href).catch(() => ({}))

                  if (res.status === 200) {
                    location.reload()
                  } else {
                    setTimeout(check, 1000)
                  }
                }
                check()
              </script>`
            ),
          }
        }

        throw new WrappedBuildError(
          new Error('missing required error components')
        )
      }

      // If the page has a route module, use it for the new match. If it doesn't
      // have a route module, remove the match.
      if (result.components.routeModule) {
        addRequestMeta(ctx.req, 'match', {
          definition: result.components.routeModule.definition,
          params: undefined,
        })
      } else {
        removeRequestMeta(ctx.req, 'match')
      }

      try {
        return await this.renderToResponseWithComponents(
          {
            ...ctx,
            pathname: statusPage,
            renderOpts: {
              ...ctx.renderOpts,
              err,
            },
          },
          result
        )
      } catch (maybeFallbackError) {
        if (maybeFallbackError instanceof NoFallbackError) {
          throw new Error('invariant: failed to render error page')
        }
        throw maybeFallbackError
      }
    } catch (error) {
      const renderToHtmlError = getProperError(error)
      const isWrappedError = renderToHtmlError instanceof WrappedBuildError
      if (!isWrappedError) {
        this.logError(renderToHtmlError)
      }
      res.statusCode = 500
      const fallbackComponents = await this.getFallbackErrorComponents(
        ctx.req.url
      )

      if (fallbackComponents) {
        // There was an error, so use it's definition from the route module
        // to add the match to the request.
        addRequestMeta(ctx.req, 'match', {
          definition: fallbackComponents.routeModule!.definition,
          params: undefined,
        })

        return this.renderToResponseWithComponents(
          {
            ...ctx,
            pathname: '/_error',
            renderOpts: {
              ...ctx.renderOpts,
              // We render `renderToHtmlError` here because `err` is
              // already captured in the stacktrace.
              err: isWrappedError
                ? renderToHtmlError.innerError
                : renderToHtmlError,
            },
          },
          {
            query,
            components: fallbackComponents,
          }
        )
      }
      return {
        type: 'html',
        body: RenderResult.fromStatic('Internal Server Error'),
      }
    }
  }

  public async renderErrorToHTML(
    err: Error | null,
    req: ServerRequest,
    res: ServerResponse,
    pathname: string,
    query: ParsedUrlQuery = {}
  ): Promise<string | null> {
    return this.getStaticHTML((ctx) => this.renderErrorToResponse(ctx, err), {
      req,
      res,
      pathname,
      query,
    })
  }

  public async render404(
    req: ServerRequest,
    res: ServerResponse,
    parsedUrl?: Pick<NextUrlWithParsedQuery, 'pathname' | 'query'>,
    setHeaders = true
  ): Promise<void> {
    const { pathname, query } = parsedUrl ? parsedUrl : parseUrl(req.url!, true)

    if (this.nextConfig.i18n) {
      query.__nextLocale ||= this.nextConfig.i18n.defaultLocale
      query.__nextDefaultLocale ||= this.nextConfig.i18n.defaultLocale
    }

    res.statusCode = 404
    return this.renderError(null, req, res, pathname!, query, setHeaders)
  }
}

/**
 * Check if the request is a RSC request. This is only attached after the
 * `handle` method is called, or at least the `requestAdapter.adapt` is called
 * on the request.
 */
export function isRSCRequestCheck(req: BaseNextRequest): boolean {
  const isRSCRequest = getRequestMeta(req, 'isRSCRequest')
  if (typeof isRSCRequest !== 'boolean') {
    // If the RSC request metadata is missing, then we should throw an error. It
    // means it's being called before it's checked (which will lead to false
    // negatives).
    throw new Error('Invariant: missing isRSCRequest metadata')
  }

  return isRSCRequest
}
