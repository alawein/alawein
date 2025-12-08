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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedDebateArena = void 0;
var react_1 = require("react");
var AIPersonalityAvatar_1 = require("./AIPersonalityAvatar");
var EpicConfrontationMoments_1 = require("./EpicConfrontationMoments");
var ArgumentImpactSystem_1 = require("./ArgumentImpactSystem");
var ComboDetectionSystem_1 = require("./ComboDetectionSystem");
var EnvironmentalEffects_1 = require("./EnvironmentalEffects");
var ModelEnergySignatures_1 = require("./ModelEnergySignatures");
var CitationTracker_1 = require("./CitationTracker");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var debateReducer = function (state, action) {
    var _a;
    switch (action.type) {
        case 'SET_PHASE':
            return __assign(__assign({}, state), { phase: action.phase });
        case 'ADD_ARGUMENT':
            return __assign(__assign({}, state), { arguments: __spreadArray(__spreadArray([], state.arguments, true), [action.argument], false) });
        case 'UPDATE_SCORE':
            return __assign(__assign({}, state), { score: __assign(__assign({}, state.score), (_a = {}, _a[action.side] = action.score, _a)) });
        case 'SET_SPEAKER':
            return __assign(__assign({}, state), { currentSpeaker: action.speaker });
        case 'TICK_TIME':
            return __assign(__assign({}, state), { timeRemaining: Math.max(0, state.timeRemaining - 1) });
        case 'TOGGLE_ACADEMIC_MODE':
            return __assign(__assign({}, state), { academicMode: !state.academicMode });
        case 'TOGGLE_SOUND':
            return __assign(__assign({}, state), { soundEnabled: !state.soundEnabled });
        case 'RESET_DEBATE':
            return __assign(__assign({}, state), { phase: 'setup', timeRemaining: 300, currentSpeaker: null, arguments: [], score: { left: 0, right: 0 } });
        default:
            return state;
    }
};
var EnhancedDebateArenaComponent = function (_a) {
    var topic = _a.topic, leftDebater = _a.leftDebater, rightDebater = _a.rightDebater, onDebateComplete = _a.onDebateComplete;
    var _b = (0, react_1.useReducer)(debateReducer, {
        phase: 'setup',
        timeRemaining: 300,
        currentSpeaker: null,
        arguments: [],
        score: { left: 0, right: 0 },
        academicMode: false,
        soundEnabled: true
    }), debateState = _b[0], dispatch = _b[1];
    var _c = (0, react_1.useState)([
        __assign(__assign({}, leftDebater), { position: 'left' }),
        __assign(__assign({}, rightDebater), { position: 'right' })
    ]), debaters = _c[0], setDebaters = _c[1];
    var _d = (0, react_1.useState)(false), isPlaying = _d[0], setIsPlaying = _d[1];
    var _e = (0, react_1.useState)(0), argumentIntensity = _e[0], setArgumentIntensity = _e[1];
    // Simulate debate progression
    (0, react_1.useEffect)(function () {
        if (!isPlaying || debateState.phase === 'complete')
            return;
        var interval = setInterval(function () {
            dispatch({ type: 'TICK_TIME' });
            // Simulate argument generation
            if (Math.random() < 0.3) { // 30% chance per second
                simulateArgument();
            }
            // Check for phase transitions
            if (debateState.timeRemaining <= 0) {
                advancePhase();
            }
        }, 1000);
        return function () { return clearInterval(interval); };
    }, [isPlaying, debateState.phase, debateState.timeRemaining]);
    var simulateArgument = function () {
        var speaker = debateState.currentSpeaker || (Math.random() < 0.5 ? 'left' : 'right');
        var argumentStrength = Math.floor(Math.random() * 40) + 40; // 40-80 base strength
        // Add topic relevance and personality modifiers
        var debater = debaters.find(function (d) { return d.position === speaker; });
        var modifiedStrength = argumentStrength;
        if (debater) {
            switch (debater.personality) {
                case 'analytical':
                    modifiedStrength += Math.random() < 0.7 ? 15 : 0; // 70% chance for logic bonus
                    break;
                case 'creative':
                    modifiedStrength += Math.random() < 0.6 ? 20 : 0; // 60% chance for creativity bonus
                    break;
                case 'speed':
                    modifiedStrength += Math.random() < 0.8 ? 10 : 0; // 80% chance for quick response
                    break;
            }
        }
        var argument = {
            id: "arg-".concat(Date.now()),
            speaker: speaker,
            content: generateArgumentContent(speaker, (debater === null || debater === void 0 ? void 0 : debater.personality) || 'analytical'),
            strength: Math.min(100, modifiedStrength),
            timestamp: new Date(),
            type: 'argument'
        };
        dispatch({ type: 'ADD_ARGUMENT', argument: argument });
        // Update argument intensity for environmental effects
        setArgumentIntensity(Math.min(100, modifiedStrength));
        // Update debater states
        setDebaters(function (prev) { return [
            prev[0].position === speaker ? __assign(__assign({}, prev[0]), { battleState: 'arguing', energy: Math.min(100, prev[0].energy + 5) }) : __assign(__assign({}, prev[0]), { battleState: argument.strength > 70 ? 'defending' : 'idle', energy: argument.strength > 70 ? Math.max(0, prev[0].energy - 3) : prev[0].energy }),
            prev[1].position === speaker ? __assign(__assign({}, prev[1]), { battleState: 'arguing', energy: Math.min(100, prev[1].energy + 5) }) : __assign(__assign({}, prev[1]), { battleState: argument.strength > 70 ? 'defending' : 'idle', energy: argument.strength > 70 ? Math.max(0, prev[1].energy - 3) : prev[1].energy })
        ]; });
        // Update scores
        var scoreIncrease = Math.floor(argument.strength / 10);
        dispatch({ type: 'UPDATE_SCORE', side: speaker, score: debateState.score[speaker] + scoreIncrease });
        // Switch speaker
        setTimeout(function () {
            dispatch({ type: 'SET_SPEAKER', speaker: speaker === 'left' ? 'right' : 'left' });
        }, 2000);
    };
    var generateArgumentContent = function (speaker, personality) {
        var argumentStyles = {
            analytical: [
                "According to established research patterns...",
                "The logical framework suggests...",
                "Empirical evidence demonstrates...",
                "Systematic analysis reveals..."
            ],
            creative: [
                "Consider this innovative perspective...",
                "What if we reimagined...",
                "A fresh approach might be...",
                "Breaking conventional thinking..."
            ],
            speed: [
                "Rapid assessment shows...",
                "Quick analysis indicates...",
                "Immediate pattern recognition...",
                "Fast processing reveals..."
            ],
            conversational: [
                "In human terms, this means...",
                "From a relatable standpoint...",
                "Speaking practically...",
                "In everyday experience..."
            ],
            strategic: [
                "Tactical evaluation suggests...",
                "Strategic positioning indicates...",
                "From a planning perspective...",
                "Calculated approach shows..."
            ]
        };
        var styles = argumentStyles[personality];
        return styles[Math.floor(Math.random() * styles.length)];
    };
    var advancePhase = function () {
        switch (debateState.phase) {
            case 'setup':
                dispatch({ type: 'SET_PHASE', phase: 'opening' });
                dispatch({ type: 'SET_SPEAKER', speaker: 'left' });
                break;
            case 'opening':
                dispatch({ type: 'SET_PHASE', phase: 'exchange' });
                break;
            case 'exchange':
                dispatch({ type: 'SET_PHASE', phase: 'closing' });
                break;
            case 'closing':
                dispatch({ type: 'SET_PHASE', phase: 'judgment' });
                break;
            case 'judgment':
                dispatch({ type: 'SET_PHASE', phase: 'complete' });
                determineWinner();
                break;
        }
    };
    var determineWinner = function () {
        var _a = debateState.score, left = _a.left, right = _a.right;
        var winner = left > right ? 'left' : right > left ? 'right' : 'tie';
        // Update debater states
        setDebaters(function (prev) { return [
            __assign(__assign({}, prev[0]), { battleState: winner === prev[0].position ? 'victory' : winner === 'tie' ? 'idle' : 'defeat' }),
            __assign(__assign({}, prev[1]), { battleState: winner === prev[1].position ? 'victory' : winner === 'tie' ? 'idle' : 'defeat' })
        ]; });
        onDebateComplete === null || onDebateComplete === void 0 ? void 0 : onDebateComplete(winner, debateState.score);
    };
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins, ":").concat(secs.toString().padStart(2, '0'));
    };
    var getPhaseDescription = function () {
        switch (debateState.phase) {
            case 'setup': return 'Preparing for intellectual combat...';
            case 'opening': return 'Opening statements';
            case 'exchange': return 'Active debate exchange';
            case 'closing': return 'Closing arguments';
            case 'judgment': return 'Evaluating performance...';
            case 'complete': return 'Debate concluded';
            default: return '';
        }
    };
    return (<div className="relative">
      {/* Arena Background */}
      <div className="glass-panel p-8 rounded-xl border-2 border-primary/20 min-h-[600px]">
        
        {/* Arena Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="heading-refined text-2xl">Neural Battlefield Arena</h2>
            <div className="glass-minimal px-4 py-2 rounded-full">
              <div className="flex items-center gap-2 text-sm">
                <div className={"w-2 h-2 rounded-full ".concat(debateState.phase === 'exchange' ? 'bg-red-400 animate-pulse' :
            debateState.phase === 'complete' ? 'bg-green-400' : 'bg-yellow-400')}/>
                <span>{getPhaseDescription()}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button_1.Button variant="outline" size="sm" onClick={function () { return dispatch({ type: 'TOGGLE_ACADEMIC_MODE' }); }} className={"glass-minimal ".concat(debateState.academicMode ? 'bg-primary/10' : '')}>
              {debateState.academicMode ? <lucide_react_1.Eye className="h-4 w-4"/> : <lucide_react_1.EyeOff className="h-4 w-4"/>}
            </button_1.Button>
            
            <button_1.Button variant="outline" size="sm" onClick={function () { return dispatch({ type: 'TOGGLE_SOUND' }); }} className="glass-minimal">
              {debateState.soundEnabled ? <lucide_react_1.Volume2 className="h-4 w-4"/> : <lucide_react_1.VolumeX className="h-4 w-4"/>}
            </button_1.Button>

            <button_1.Button onClick={function () { return setIsPlaying(!isPlaying); }} disabled={debateState.phase === 'complete'} className="bg-primary hover:bg-primary/90">
              {isPlaying ? <lucide_react_1.PauseCircle className="h-4 w-4"/> : <lucide_react_1.PlayCircle className="h-4 w-4"/>}
            </button_1.Button>
          </div>
        </div>

        {/* Topic Display */}
        <div className="text-center mb-8 relative">
          <div className="glass-subtle p-4 rounded-lg border border-primary/20">
            <h3 className="heading-refined text-lg mb-2">Debate Topic</h3>
            <p className="text-muted-foreground italic">"{topic}"</p>
          </div>
          
          {/* Citation Tracker Overlay */}
          <div className="absolute inset-0">
            <CitationTracker_1.CitationTracker arguments={debateState.arguments} onCitationVerified={function (citation, isValid) {
            console.log('Citation verified:', citation, isValid);
            // Could update UI indicators or scoring
        }} onFactCheckComplete={function (factCheck) {
            console.log('Fact check completed:', factCheck);
            // Could influence debate scoring
        }} academicMode={debateState.academicMode} realTimeChecking={isPlaying}/>
          </div>
        </div>

        {/* Main Arena */}
        <div className="relative h-96 bg-gradient-to-b from-muted/5 to-muted/20 rounded-lg border border-primary/20 overflow-hidden">
          
          {/* Model Energy Signatures Layer (Background) */}
          <ModelEnergySignatures_1.ModelEnergySignatures leftPersonality={debaters[0].personality} rightPersonality={debaters[1].personality} leftEnergy={debaters[0].energy} rightEnergy={debaters[1].energy} leftBattleState={debaters[0].battleState} rightBattleState={debaters[1].battleState} isActive={isPlaying} academicMode={debateState.academicMode}/>
          
          {/* Environmental Effects Layer */}
          <EnvironmentalEffects_1.EnvironmentalEffects topic={{
            text: topic,
            category: 'technology', // Could be dynamic based on topic analysis
            intensity: argumentIntensity > 80 ? 'explosive' : argumentIntensity > 60 ? 'heated' : argumentIntensity > 40 ? 'moderate' : 'calm'
        }} debatePhase={debateState.phase} argumentIntensity={argumentIntensity} academicMode={debateState.academicMode}/>
          
          {/* Argument Impact System */}
          <ArgumentImpactSystem_1.ArgumentImpactSystem onImpact={function (impact) {
            console.log('Argument impact:', impact);
            // Could trigger sound effects here if enabled
        }} academicMode={debateState.academicMode} soundEnabled={debateState.soundEnabled}/>
          
          {/* Combo Detection System */}
          <ComboDetectionSystem_1.ComboDetectionSystem arguments={debateState.arguments} onComboDetected={function (combo) {
            console.log('Combo detected:', combo);
            // Could trigger sound effects here if enabled
        }} onComboComplete={function (combo, finalScore) {
            console.log('Combo complete:', combo, finalScore);
            // Add bonus points to the combo performer
            var bonusPoints = Math.floor(finalScore / 10);
            dispatch({
                type: 'UPDATE_SCORE',
                side: combo.speaker,
                score: debateState.score[combo.speaker] + bonusPoints
            });
        }} academicMode={debateState.academicMode}/>
          
          {/* Epic Confrontation Effects */}
          <EpicConfrontationMoments_1.EpicConfrontationMoments argumentExchanges={debateState.arguments} academicMode={debateState.academicMode} onEpicMoment={function (moment) {
            console.log('Epic moment:', moment);
            // Could trigger sound effects here if enabled
        }}/>

          {/* Debater Positions */}
          <div className="absolute inset-0 flex items-center justify-between p-8">
            <AIPersonalityAvatar_1.AIPersonalityAvatar personality={debaters[0].personality} battleState={debaters[0].battleState} energy={debaters[0].energy} name={debaters[0].name} isActive={debateState.currentSpeaker === 'left'} position="left"/>

            <AIPersonalityAvatar_1.AIPersonalityAvatar personality={debaters[1].personality} battleState={debaters[1].battleState} energy={debaters[1].energy} name={debaters[1].name} isActive={debateState.currentSpeaker === 'right'} position="right"/>
          </div>

          {/* Center Information */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="glass-minimal px-4 py-2 rounded-full text-center">
              <div className="text-lg font-mono">{formatTime(debateState.timeRemaining)}</div>
              <div className="text-xs text-muted-foreground capitalize">{debateState.phase}</div>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="glass-minimal p-4 rounded-lg text-center">
            <div className="text-2xl font-mono text-primary">{debateState.score.left}</div>
            <div className="text-sm text-muted-foreground">{debaters[0].name}</div>
          </div>
          
          <div className="glass-minimal p-4 rounded-lg text-center">
            <div className="text-lg font-mono text-secondary">VS</div>
            <div className="text-xs text-muted-foreground">
              {debateState.arguments.length} exchanges
            </div>
          </div>
          
          <div className="glass-minimal p-4 rounded-lg text-center">
            <div className="text-2xl font-mono text-primary">{debateState.score.right}</div>
            <div className="text-sm text-muted-foreground">{debaters[1].name}</div>
          </div>
        </div>

        {/* Recent Arguments (Academic Mode) */}
        {debateState.academicMode && debateState.arguments.length > 0 && (<div className="mt-6">
            <h4 className="heading-refined text-sm mb-3">Recent Arguments</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {debateState.arguments.slice(-3).map(function (argument) { return (<div key={argument.id} className="glass-minimal p-3 rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">
                      {argument.speaker === 'left' ? debaters[0].name : debaters[1].name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Strength: {argument.strength}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{argument.content}</p>
                </div>); })}
            </div>
          </div>)}
      </div>
    </div>);
};
exports.EnhancedDebateArena = (0, react_1.memo)(EnhancedDebateArenaComponent);
