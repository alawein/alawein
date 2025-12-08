"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.withErrorBoundary = exports.ErrorBoundary = void 0;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        Object.defineProperty(_this, "retry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                _this.setState({ hasError: false, error: undefined });
            }
        });
        _this.state = { hasError: false };
        return _this;
    }
    Object.defineProperty(ErrorBoundary, "getDerivedStateFromError", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error) {
            return { hasError: true, error: error };
        }
    });
    Object.defineProperty(ErrorBoundary.prototype, "componentDidCatch", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (error, errorInfo) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
    });
    Object.defineProperty(ErrorBoundary.prototype, "render", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (this.state.hasError) {
                var FallbackComponent = this.props.fallback || DefaultErrorFallback;
                return <FallbackComponent error={this.state.error} retry={this.retry}/>;
            }
            return this.props.children;
        }
    });
    return ErrorBoundary;
}(react_1.default.Component));
exports.ErrorBoundary = ErrorBoundary;
var DefaultErrorFallback = function (_a) {
    var error = _a.error, retry = _a.retry;
    return (<div className="min-h-[400px] flex items-center justify-center p-6" role="alert">
      <card_1.Card className="max-w-md w-full">
        <card_1.CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <lucide_react_1.AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true"/>
          </div>
          <card_1.CardTitle className="text-xl">Something went wrong</card_1.CardTitle>
          <card_1.CardDescription>
            We encountered an unexpected error. Please try refreshing the page.
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="text-center space-y-4">
          {error && (<details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Error details
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-left whitespace-pre-wrap text-xs">
                {error.message}
              </pre>
            </details>)}
          <button_1.Button onClick={retry} className="w-full">
            <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
            Try again
          </button_1.Button>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
var withErrorBoundary = function (Component, fallback) {
    var WrappedComponent = function (props) { return (<ErrorBoundary fallback={fallback}>
      <Component {...props}/>
    </ErrorBoundary>); };
    WrappedComponent.displayName = "withErrorBoundary(".concat(Component.displayName || Component.name, ")");
    return WrappedComponent;
};
exports.withErrorBoundary = withErrorBoundary;
