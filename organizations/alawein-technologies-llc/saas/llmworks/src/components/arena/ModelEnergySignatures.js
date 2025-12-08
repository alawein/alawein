"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelEnergySignatures = void 0;
var react_1 = require("react");
var ModelEnergySignaturesComponent = function (_a) {
    var leftPersonality = _a.leftPersonality, rightPersonality = _a.rightPersonality, leftEnergy = _a.leftEnergy, rightEnergy = _a.rightEnergy, leftBattleState = _a.leftBattleState, rightBattleState = _a.rightBattleState, isActive = _a.isActive, _b = _a.academicMode, academicMode = _b === void 0 ? false : _b;
    var canvasRef = (0, react_1.useRef)(null);
    var animationRef = (0, react_1.useRef)();
    var timeRef = (0, react_1.useRef)(0);
    // Define unique energy signatures for each AI personality
    var getEnergySignature = function (personality) {
        switch (personality) {
            case 'analytical':
                return {
                    id: 'analytical-signature',
                    personality: personality,
                    baseFrequency: 2.5, // Steady, methodical
                    waveform: 'sine',
                    amplitude: 0.7,
                    harmonics: [5.0, 7.5], // Mathematical precision harmonics
                    color: {
                        primary: '#3B82F6', // Blue
                        secondary: '#60A5FA',
                        trail: 'rgba(59, 130, 246, 0.3)'
                    },
                    particlePattern: 'grid'
                };
            case 'creative':
                return {
                    id: 'creative-signature',
                    personality: personality,
                    baseFrequency: 1.8, // Flowing, artistic
                    waveform: 'triangle',
                    amplitude: 0.9,
                    harmonics: [3.6, 5.4, 9.0], // Rich harmonic content
                    color: {
                        primary: '#A855F7', // Purple
                        secondary: '#C084FC',
                        trail: 'rgba(168, 85, 247, 0.4)'
                    },
                    particlePattern: 'organic'
                };
            case 'speed':
                return {
                    id: 'speed-signature',
                    personality: personality,
                    baseFrequency: 8.0, // High frequency, rapid
                    waveform: 'pulse',
                    amplitude: 0.8,
                    harmonics: [16.0, 24.0], // High-frequency harmonics
                    color: {
                        primary: '#F59E0B', // Amber/Yellow
                        secondary: '#FBBF24',
                        trail: 'rgba(245, 158, 11, 0.5)'
                    },
                    particlePattern: 'linear'
                };
            case 'conversational':
                return {
                    id: 'conversational-signature',
                    personality: personality,
                    baseFrequency: 1.2, // Gentle, human-like
                    waveform: 'sine',
                    amplitude: 0.6,
                    harmonics: [2.4, 3.6], // Warm harmonics
                    color: {
                        primary: '#10B981', // Emerald
                        secondary: '#34D399',
                        trail: 'rgba(16, 185, 129, 0.3)'
                    },
                    particlePattern: 'spiral'
                };
            case 'strategic':
                return {
                    id: 'strategic-signature',
                    personality: personality,
                    baseFrequency: 0.8, // Deep, tactical
                    waveform: 'square',
                    amplitude: 0.85,
                    harmonics: [1.6, 3.2, 6.4], // Structured harmonics
                    color: {
                        primary: '#DC2626', // Red
                        secondary: '#F87171',
                        trail: 'rgba(220, 38, 38, 0.4)'
                    },
                    particlePattern: 'chaotic'
                };
            default:
                return {
                    id: 'default-signature',
                    personality: personality,
                    baseFrequency: 2.0,
                    waveform: 'sine',
                    amplitude: 0.5,
                    harmonics: [4.0],
                    color: {
                        primary: '#6B7280',
                        secondary: '#9CA3AF',
                        trail: 'rgba(107, 114, 128, 0.3)'
                    },
                    particlePattern: 'grid'
                };
        }
    };
    var leftSignature = getEnergySignature(leftPersonality);
    var rightSignature = getEnergySignature(rightPersonality);
    // Generate waveform value based on signature parameters
    var generateWaveValue = function (signature, time, energy) {
        var normalizedEnergy = energy / 100;
        var frequency = signature.baseFrequency * (0.5 + normalizedEnergy);
        var baseWave = 0;
        switch (signature.waveform) {
            case 'sine':
                baseWave = Math.sin(2 * Math.PI * frequency * time);
                break;
            case 'square':
                baseWave = Math.sin(2 * Math.PI * frequency * time) > 0 ? 1 : -1;
                break;
            case 'triangle': {
                var t = (frequency * time) % 1;
                baseWave = t < 0.5 ? 4 * t - 1 : 3 - 4 * t;
                break;
            }
            case 'sawtooth':
                baseWave = 2 * ((frequency * time) % 1) - 1;
                break;
            case 'pulse': {
                var pulseWidth = 0.1 + normalizedEnergy * 0.3;
                baseWave = ((frequency * time) % 1) < pulseWidth ? 1 : -1;
                break;
            }
            default:
                baseWave = Math.sin(2 * Math.PI * frequency * time);
        }
        // Add harmonics
        var harmonicSum = 0;
        signature.harmonics.forEach(function (harmonic, index) {
            var harmonicAmplitude = signature.amplitude / (index + 2);
            harmonicSum += harmonicAmplitude * Math.sin(2 * Math.PI * harmonic * time);
        });
        return (baseWave * signature.amplitude + harmonicSum * 0.3) * normalizedEnergy;
    };
    // Generate particles based on personality pattern
    var generateParticles = function (signature, centerX, centerY, energy, time) {
        var particleCount = Math.floor(energy / 20) + 3; // 3-8 particles
        var particles = [];
        var normalizedEnergy = energy / 100;
        for (var i = 0; i < particleCount; i++) {
            var x = centerX;
            var y = centerY;
            var baseRadius = 30 + normalizedEnergy * 40;
            switch (signature.particlePattern) {
                case 'spiral': {
                    var spiralAngle = (time + i * 0.5) * 2;
                    var spiralRadius = baseRadius * (0.5 + 0.5 * Math.sin(time * 2 + i));
                    x += Math.cos(spiralAngle) * spiralRadius;
                    y += Math.sin(spiralAngle) * spiralRadius;
                    break;
                }
                case 'grid': {
                    var gridX = (i % 3) - 1;
                    var gridY = Math.floor(i / 3) - 1;
                    x += gridX * baseRadius * 0.8;
                    y += gridY * baseRadius * 0.8;
                    break;
                }
                case 'organic': {
                    var organicAngle = (i / particleCount) * 2 * Math.PI + time * 0.5;
                    var organicRadius = baseRadius * (0.7 + 0.3 * Math.sin(time * 3 + i * 2));
                    x += Math.cos(organicAngle) * organicRadius;
                    y += Math.sin(organicAngle) * organicRadius;
                    break;
                }
                case 'linear': {
                    var linearOffset = (i - particleCount / 2) * 15;
                    x += linearOffset;
                    y += Math.sin(time * 8 + i) * 10;
                    break;
                }
                case 'chaotic': {
                    var chaoticRadius = baseRadius * (0.3 + 0.7 * Math.random());
                    var chaoticAngle = Math.random() * 2 * Math.PI + time * 0.3;
                    x += Math.cos(chaoticAngle) * chaoticRadius;
                    y += Math.sin(chaoticAngle) * chaoticRadius;
                    break;
                }
            }
            particles.push({
                x: x,
                y: y,
                alpha: 0.3 + normalizedEnergy * 0.7,
                size: 2 + normalizedEnergy * 4
            });
        }
        return particles;
    };
    // Canvas animation loop
    (0, react_1.useEffect)(function () {
        if (!isActive || academicMode)
            return;
        var canvas = canvasRef.current;
        if (!canvas)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        var animate = function (currentTime) {
            if (!canvas)
                return;
            timeRef.current = currentTime / 1000; // Convert to seconds
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            // Left AI signature
            var leftCenterX = canvas.offsetWidth * 0.25;
            var leftCenterY = canvas.offsetHeight * 0.5;
            var leftWaveValue = generateWaveValue(leftSignature, timeRef.current, leftEnergy);
            // Draw left energy field
            ctx.save();
            ctx.globalAlpha = 0.6;
            var leftGradient = ctx.createRadialGradient(leftCenterX, leftCenterY, 0, leftCenterX, leftCenterY, 80);
            leftGradient.addColorStop(0, leftSignature.color.primary + '40');
            leftGradient.addColorStop(1, leftSignature.color.primary + '00');
            ctx.fillStyle = leftGradient;
            ctx.beginPath();
            ctx.arc(leftCenterX, leftCenterY, 40 + Math.abs(leftWaveValue) * 30, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
            // Draw left particles
            var leftParticles = generateParticles(leftSignature, leftCenterX, leftCenterY, leftEnergy, timeRef.current);
            leftParticles.forEach(function (particle) {
                ctx.save();
                ctx.globalAlpha = particle.alpha;
                ctx.fillStyle = leftSignature.color.secondary;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
            });
            // Right AI signature (mirror logic)
            var rightCenterX = canvas.offsetWidth * 0.75;
            var rightCenterY = canvas.offsetHeight * 0.5;
            var rightWaveValue = generateWaveValue(rightSignature, timeRef.current, rightEnergy);
            // Draw right energy field
            ctx.save();
            ctx.globalAlpha = 0.6;
            var rightGradient = ctx.createRadialGradient(rightCenterX, rightCenterY, 0, rightCenterX, rightCenterY, 80);
            rightGradient.addColorStop(0, rightSignature.color.primary + '40');
            rightGradient.addColorStop(1, rightSignature.color.primary + '00');
            ctx.fillStyle = rightGradient;
            ctx.beginPath();
            ctx.arc(rightCenterX, rightCenterY, 40 + Math.abs(rightWaveValue) * 30, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
            // Draw right particles
            var rightParticles = generateParticles(rightSignature, rightCenterX, rightCenterY, rightEnergy, timeRef.current);
            rightParticles.forEach(function (particle) {
                ctx.save();
                ctx.globalAlpha = particle.alpha;
                ctx.fillStyle = rightSignature.color.secondary;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
            });
            // Draw energy interaction in center if both AIs are active
            if (leftEnergy > 50 && rightEnergy > 50) {
                var centerX = canvas.offsetWidth * 0.5;
                var centerY = canvas.offsetHeight * 0.5;
                var interactionIntensity = (leftEnergy + rightEnergy) / 200;
                ctx.save();
                ctx.globalAlpha = 0.4;
                ctx.strokeStyle = "rgba(255, 255, 255, ".concat(interactionIntensity, ")");
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.lineDashOffset = -timeRef.current * 20;
                ctx.beginPath();
                ctx.moveTo(leftCenterX, leftCenterY);
                ctx.lineTo(rightCenterX, rightCenterY);
                ctx.stroke();
                ctx.restore();
            }
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
        return function () {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive, leftEnergy, rightEnergy, leftPersonality, rightPersonality, academicMode]);
    if (academicMode) {
        return (<div className="absolute inset-0 pointer-events-none">
        {/* Minimal academic indicators */}
        <div className="absolute bottom-4 left-4 glass-minimal px-3 py-1 rounded-lg">
          <div className="text-xs text-muted-foreground">
            {leftPersonality} vs {rightPersonality}
          </div>
        </div>
      </div>);
    }
    return (<div className="absolute inset-0 pointer-events-none">
      {/* Canvas for energy signatures */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen' }}/>
      
      {/* Personality indicators */}
      <div className="absolute top-4 left-4">
        <div className="glass-minimal px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={"w-3 h-3 rounded-full bg-energy-".concat(leftPersonality)}/>
            <span className="text-xs font-medium capitalize">{leftPersonality}</span>
            <span className="text-xs text-muted-foreground">
              {leftSignature.baseFrequency}Hz {leftSignature.waveform}
            </span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        <div className="glass-minimal px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={"w-3 h-3 rounded-full bg-energy-".concat(rightPersonality)}/>
            <span className="text-xs font-medium capitalize">{rightPersonality}</span>
            <span className="text-xs text-muted-foreground">
              {rightSignature.baseFrequency}Hz {rightSignature.waveform}
            </span>
          </div>
        </div>
      </div>
    </div>);
};
exports.ModelEnergySignatures = (0, react_1.memo)(ModelEnergySignaturesComponent);
