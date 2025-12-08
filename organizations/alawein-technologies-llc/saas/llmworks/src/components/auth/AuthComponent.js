"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthComponent = AuthComponent;
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var tabs_1 = require("@/components/ui/tabs");
var useAuth_1 = require("@/hooks/useAuth");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var use_toast_1 = require("@/hooks/use-toast");
function AuthComponent() {
    var _this = this;
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, loading = _a.loading, signIn = _a.signIn, signUp = _a.signUp, signOut = _a.signOut;
    var toast = (0, use_toast_1.useToast)().toast;
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)({
        email: "",
        password: "",
    }), signInForm = _c[0], setSignInForm = _c[1];
    var _d = (0, react_1.useState)({
        email: "",
        password: "",
        displayName: "",
    }), signUpForm = _d[0], setSignUpForm = _d[1];
    var handleSignIn = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    return [4 /*yield*/, signIn(signInForm.email, signInForm.password)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        toast({
                            title: "Sign in failed",
                            description: error.message,
                            variant: "destructive",
                        });
                    }
                    else {
                        toast({
                            title: "Welcome back!",
                            description: "You have successfully signed in.",
                        });
                    }
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSignUp = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    return [4 /*yield*/, signUp(signUpForm.email, signUpForm.password, {
                            display_name: signUpForm.displayName,
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        toast({
                            title: "Sign up failed",
                            description: error.message,
                            variant: "destructive",
                        });
                    }
                    else {
                        toast({
                            title: "Account created!",
                            description: "Please check your email to verify your account.",
                        });
                    }
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSignOut = function () { return __awaiter(_this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signOut()];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        toast({
                            title: "Sign out failed",
                            description: error.message,
                            variant: "destructive",
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>);
    }
    if (user) {
        return (<card_1.Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <lucide_react_1.User className="h-8 w-8 text-primary"/>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Welcome back!</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <button_1.Button onClick={handleSignOut} variant="outline" size="sm">
            <lucide_react_1.LogOut className="h-4 w-4 mr-2"/>
            Sign Out
          </button_1.Button>
        </div>
      </card_1.Card>);
    }
    return (<card_1.Card className="p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <lucide_react_1.Shield className="h-6 w-6 text-primary"/>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Authentication</h2>
          <p className="text-sm text-muted-foreground">Optional — enables sync & cloud features (planned)</p>
        </div>
      </div>

      <tabs_1.Tabs defaultValue="signin" className="w-full">
        <tabs_1.TabsList className="grid w-full grid-cols-2 mb-6">
          <tabs_1.TabsTrigger value="signin">Sign In</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="signup">Sign Up</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="signin">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label_1.Label htmlFor="signin-email">Email</label_1.Label>
              <div className="relative">
                <lucide_react_1.Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                <input_1.Input id="signin-email" type="email" placeholder="Enter your email" className="pl-10" value={signInForm.email} onChange={function (e) { return setSignInForm(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} required/>
              </div>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="signin-password">Password</label_1.Label>
              <div className="relative">
                <lucide_react_1.Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                <input_1.Input id="signin-password" type="password" placeholder="Enter your password" className="pl-10" value={signInForm.password} onChange={function (e) { return setSignInForm(function (prev) { return (__assign(__assign({}, prev), { password: e.target.value })); }); }} required/>
              </div>
            </div>

            <button_1.Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button_1.Button>
          </form>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="signup">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label_1.Label htmlFor="signup-name">Display Name</label_1.Label>
              <div className="relative">
                <lucide_react_1.User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                <input_1.Input id="signup-name" type="text" placeholder="Enter your name" className="pl-10" value={signUpForm.displayName} onChange={function (e) { return setSignUpForm(function (prev) { return (__assign(__assign({}, prev), { displayName: e.target.value })); }); }} required/>
              </div>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="signup-email">Email</label_1.Label>
              <div className="relative">
                <lucide_react_1.Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                <input_1.Input id="signup-email" type="email" placeholder="Enter your email" className="pl-10" value={signUpForm.email} onChange={function (e) { return setSignUpForm(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} required/>
              </div>
            </div>

            <div className="space-y-2">
              <label_1.Label htmlFor="signup-password">Password</label_1.Label>
              <div className="relative">
                <lucide_react_1.Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                <input_1.Input id="signup-password" type="password" placeholder="Create a password" className="pl-10" value={signUpForm.password} onChange={function (e) { return setSignUpForm(function (prev) { return (__assign(__assign({}, prev), { password: e.target.value })); }); }} required/>
              </div>
            </div>

            <button_1.Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </button_1.Button>
          </form>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </card_1.Card>);
}
