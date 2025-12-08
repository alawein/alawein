/**
 * Bi-directional Design Tool Sync System
 * Handles Figma ↔ Style Dictionary synchronization
 */

interface FigmaToken {
  name: string;
  value: string;
  type: 'color' | 'dimension' | 'fontFamily' | 'fontWeight' | 'shadow';
  description?: string;
  scopes?: string[];
}

interface StyleDictionaryToken {
  value: string;
  type: string;
  description?: string;
  attributes?: {
    category: string;
    type: string;
    item: string;
  };
}

export class DesignToolSync {
  private figmaApiKey: string;
  private figmaFileKey: string;
  private tokenJsonPath: string;

  constructor(config: {
    figmaApiKey: string;
    figmaFileKey: string;
    tokenJsonPath: string;
  }) {
    this.figmaApiKey = config.figmaApiKey;
    this.figmaFileKey = config.figmaFileKey;
    this.tokenJsonPath = config.tokenJsonPath;
  }

  /**
   * Fetch tokens from Figma Variables API
   */
  async fetchFromFigma(): Promise<FigmaToken[]> {
    const response = await fetch(
      `https://api.figma.com/v1/files/${this.figmaFileKey}/variables/local`,
      {
        headers: {
          'X-Figma-Token': this.figmaApiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformFigmaVariables(data.meta.variables);
  }

  /**
   * Transform Figma variables to our token format
   */
  private transformFigmaVariables(variables: any[]): FigmaToken[] {
    return variables.map(variable => ({
      name: this.figmaNameToTokenName(variable.name),
      value: this.extractVariableValue(variable),
      type: this.mapFigmaType(variable.resolvedType),
      description: variable.description,
      scopes: variable.scopes
    }));
  }

  /**
   * Convert Figma variable names to token naming convention
   */
  private figmaNameToTokenName(figmaName: string): string {
    // Convert "Colors/Quantum/Primary" → "--semantic-domain-quantum"
    const parts = figmaName.toLowerCase().split('/');
    
    if (parts[0] === 'colors') {
      if (parts[1] === 'primitives') {
        return `--primitive-${parts[2]}-${parts[3] || '500'}`;
      } else {
        return `--semantic-domain-${parts[1]}`;
      }
    }
    
    if (parts[0] === 'spacing') {
      return `--primitive-space-${parts[1]}`;
    }
    
    if (parts[0] === 'typography') {
      return `--primitive-font-${parts[1]}`;
    }
    
    // Fallback
    return `--${parts.join('-').replace(/[^a-z0-9-]/g, '')}`;
  }

  /**
   * Extract value from Figma variable
   */
  private extractVariableValue(variable: any): string {
    const value = variable.valuesByMode[Object.keys(variable.valuesByMode)[0]];
    
    switch (variable.resolvedType) {
      case 'COLOR':
        return `hsl(${Math.round(value.h * 360)}, ${Math.round(value.s * 100)}%, ${Math.round(value.l * 100)}%)`;
      case 'FLOAT':
        return `${value}rem`;
      case 'STRING':
        return value;
      default:
        return String(value);
    }
  }

  /**
   * Map Figma types to our token types
   */
  private mapFigmaType(figmaType: string): FigmaToken['type'] {
    switch (figmaType) {
      case 'COLOR': return 'color';
      case 'FLOAT': return 'dimension';
      case 'STRING': return 'fontFamily';
      default: return 'color';
    }
  }

  /**
   * Push tokens to Figma (when Figma API supports it)
   */
  async pushToFigma(tokens: StyleDictionaryToken[]): Promise<void> {
    // Note: Figma Variables API is currently read-only
    // This would use the future write API when available
    console.warn('Figma Variables API write operations not yet supported');
    
    // Alternative: Generate Figma-compatible JSON for manual import
    const figmaImportData = this.generateFigmaImportFormat(tokens);
    
    // Save to file for manual import
    await this.saveFigmaImportFile(figmaImportData);
  }

  /**
   * Generate Figma import format
   */
  private generateFigmaImportFormat(tokens: StyleDictionaryToken[]): any {
    const collections: Record<string, any> = {};
    
    Object.entries(tokens).forEach(([name, token]) => {
      const parts = name.split('-');
      const category = parts[1] || 'misc'; // primitive, semantic, component
      
      if (!collections[category]) {
        collections[category] = {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          modes: [{ name: 'Default', modeId: 'default' }],
          variables: []
        };
      }
      
      collections[category].variables.push({
        name: this.tokenNameToFigmaName(name),
        type: this.mapTokenTypeToFigma(token.type),
        valuesByMode: {
          default: this.parseTokenValue(token.value, token.type)
        },
        description: token.description || ''
      });
    });
    
    return { collections: Object.values(collections) };
  }

  /**
   * Convert token names back to Figma format
   */
  private tokenNameToFigmaName(tokenName: string): string {
    // Convert "--semantic-domain-quantum" → "Colors/Quantum/Primary"
    const parts = tokenName.replace('--', '').split('-');
    
    if (parts[0] === 'primitive') {
      if (parts[1] === 'space') {
        return `Spacing/${parts[2]}`;
      }
      return `Colors/Primitives/${parts[1]}/${parts[2] || '500'}`;
    }
    
    if (parts[0] === 'semantic') {
      if (parts[1] === 'domain') {
        return `Colors/${parts[2].charAt(0).toUpperCase() + parts[2].slice(1)}/Primary`;
      }
      return `Semantic/${parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('/')}`;
    }
    
    if (parts[0] === 'component') {
      return `Components/${parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('/')}`;
    }
    
    return tokenName;
  }

  /**
   * Map token types back to Figma
   */
  private mapTokenTypeToFigma(tokenType: string): string {
    switch (tokenType) {
      case 'color': return 'COLOR';
      case 'dimension': return 'FLOAT';
      case 'fontFamily': return 'STRING';
      default: return 'COLOR';
    }
  }

  /**
   * Parse token value for Figma format
   */
  private parseTokenValue(value: string, type: string): any {
    if (type === 'color' && value.startsWith('hsl(')) {
      const match = value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        return {
          h: parseInt(match[1]) / 360,
          s: parseInt(match[2]) / 100,
          l: parseInt(match[3]) / 100
        };
      }
    }
    
    if (type === 'dimension' && value.endsWith('rem')) {
      return parseFloat(value.replace('rem', ''));
    }
    
    return value;
  }

  /**
   * Save Figma import file
   */
  private async saveFigmaImportFile(data: any): Promise<void> {
    const fs = await import('fs/promises');
    const path = './figma-import.json';
    
    await fs.writeFile(path, JSON.stringify(data, null, 2));
    console.log(`✅ Figma import file saved to ${path}`);
    console.log('   Import this file manually in Figma using Variables panel');
  }

  /**
   * Sync workflow: Figma → Style Dictionary
   */
  async syncFromFigma(): Promise<void> {
    try {
      console.log('🔄 Syncing tokens from Figma...');
      
      const figmaTokens = await this.fetchFromFigma();
      const styleTokens = this.convertToStyleDictionary(figmaTokens);
      
      await this.saveStyleDictionaryTokens(styleTokens);
      
      console.log(`✅ Synced ${figmaTokens.length} tokens from Figma`);
    } catch (error) {
      console.error('❌ Figma sync failed:', error);
      throw error;
    }
  }

  /**
   * Convert Figma tokens to Style Dictionary format
   */
  private convertToStyleDictionary(figmaTokens: FigmaToken[]): Record<string, StyleDictionaryToken> {
    const result: Record<string, StyleDictionaryToken> = {};
    
    figmaTokens.forEach(token => {
      result[token.name] = {
        value: token.value,
        type: token.type,
        description: token.description,
        attributes: this.generateTokenAttributes(token.name)
      };
    });
    
    return result;
  }

  /**
   * Generate token attributes for Style Dictionary
   */
  private generateTokenAttributes(tokenName: string): { category: string; type: string; item: string } {
    const parts = tokenName.replace('--', '').split('-');
    
    return {
      category: parts[0], // primitive, semantic, component
      type: parts[1] || 'misc',
      item: parts[2] || 'default'
    };
  }

  /**
   * Save Style Dictionary tokens
   */
  private async saveStyleDictionaryTokens(tokens: Record<string, StyleDictionaryToken>): Promise<void> {
    const fs = await import('fs/promises');
    
    await fs.writeFile(
      this.tokenJsonPath,
      JSON.stringify(tokens, null, 2)
    );
  }
}

/**
 * CLI integration for design sync
 */
export async function runDesignSync(direction: 'from-figma' | 'to-figma' = 'from-figma'): Promise<void> {
  const config = {
    figmaApiKey: process.env.FIGMA_API_KEY || '',
    figmaFileKey: process.env.FIGMA_FILE_KEY || '',
    tokenJsonPath: './tokens/generated-from-figma.json'
  };
  
  if (!config.figmaApiKey || !config.figmaFileKey) {
    console.error('❌ Missing Figma API credentials');
    console.log('   Set FIGMA_API_KEY and FIGMA_FILE_KEY environment variables');
    return;
  }
  
  const sync = new DesignToolSync(config);
  
  if (direction === 'from-figma') {
    await sync.syncFromFigma();
  } else {
    console.log('🔄 Preparing tokens for Figma import...');
    // Load existing tokens and push to Figma format
    const fs = await import('fs/promises');
    const tokens = JSON.parse(await fs.readFile('./tokens/all.json', 'utf-8'));
    await sync.pushToFigma(tokens);
  }
}