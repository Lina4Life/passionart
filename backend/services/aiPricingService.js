const OpenAI = require('openai');

class AIPricingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async estimateArtworkPrice(artworkData) {
    const {
      title,
      description,
      medium,
      dimensions,
      artistName,
      artworkImage,
      style,
      yearCreated,
      condition = 'good'
    } = artworkData;

    const prompt = `
As an art valuation expert, provide a detailed price estimation for this artwork:

Title: ${title}
Artist: ${artistName}
Medium: ${medium}
Dimensions: ${dimensions}
Style: ${style}
Year Created: ${yearCreated}
Condition: ${condition}
Description: ${description}

Please analyze and provide:
1. Estimated price range in USD (minimum and maximum)
2. Key factors affecting the valuation
3. Market positioning (emerging, mid-career, established artist level)
4. Comparable sales or market trends
5. Investment potential score (1-10)

Consider factors such as:
- Artist reputation and market presence
- Technical skill and artistic merit
- Rarity and uniqueness
- Historical significance
- Current market demand for this style/medium
- Size and display considerations
- Condition and preservation

Provide your response in JSON format:
{
  "priceRange": {
    "minimum": number,
    "maximum": number,
    "currency": "USD"
  },
  "factors": [
    {
      "factor": "string",
      "impact": "positive" | "negative" | "neutral",
      "description": "string"
    }
  ],
  "marketPosition": "emerging" | "mid-career" | "established",
  "comparables": "string",
  "investmentScore": number (1-10),
  "confidence": "high" | "medium" | "low",
  "reasoning": "string"
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional art appraiser with 20+ years of experience in contemporary and classical art markets. Provide accurate, conservative estimates based on current market data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const estimation = JSON.parse(response.choices[0].message.content);
      
      // Add timestamp and additional metadata
      return {
        ...estimation,
        estimatedAt: new Date().toISOString(),
        method: 'AI_GPT4',
        version: '1.0'
      };
    } catch (error) {
      console.error('AI Pricing estimation error:', error);
      
      // Fallback estimation based on basic factors
      return this.getFallbackEstimation(artworkData);
    }
  }

  getFallbackEstimation(artworkData) {
    const { medium, dimensions } = artworkData;
    
    // Simple fallback pricing logic
    let basePrice = 100;
    
    // Medium multipliers
    const mediumMultipliers = {
      'oil': 2.5,
      'acrylic': 2.0,
      'watercolor': 1.5,
      'digital': 1.2,
      'mixed media': 2.2,
      'sculpture': 3.0,
      'photography': 1.3
    };
    
    const multiplier = mediumMultipliers[medium?.toLowerCase()] || 1.5;
    
    // Size factor (assuming dimensions in cm)
    const sizeMatch = dimensions?.match(/(\d+)\s*x\s*(\d+)/);
    let sizeMultiplier = 1;
    if (sizeMatch) {
      const area = parseInt(sizeMatch[1]) * parseInt(sizeMatch[2]);
      sizeMultiplier = Math.sqrt(area / 1000); // Normalize to reasonable range
    }
    
    const estimatedPrice = basePrice * multiplier * sizeMultiplier;
    
    return {
      priceRange: {
        minimum: Math.round(estimatedPrice * 0.7),
        maximum: Math.round(estimatedPrice * 1.5),
        currency: 'USD'
      },
      factors: [
        {
          factor: 'Medium',
          impact: 'positive',
          description: `${medium} artworks typically have good market demand`
        }
      ],
      marketPosition: 'emerging',
      comparables: 'Limited data available for fallback estimation',
      investmentScore: 5,
      confidence: 'low',
      reasoning: 'Fallback estimation used due to AI service unavailability',
      estimatedAt: new Date().toISOString(),
      method: 'FALLBACK',
      version: '1.0'
    };
  }

  async analyzePricingTrends(category, timeframe = '1year') {
    const prompt = `
Analyze current market trends for ${category} artworks over the past ${timeframe}.

Provide insights on:
1. Price movements and trends
2. Popular styles and mediums
3. Emerging artists vs established artists performance
4. Market demand indicators
5. Investment recommendations

Format as JSON:
{
  "trend": "rising" | "stable" | "declining",
  "averageGrowth": number,
  "popularStyles": ["style1", "style2"],
  "marketOutlook": "string",
  "recommendations": ["recommendation1", "recommendation2"]
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an art market analyst providing current market intelligence."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Market trend analysis error:', error);
      return {
        trend: 'stable',
        averageGrowth: 0,
        popularStyles: ['contemporary', 'abstract'],
        marketOutlook: 'Market analysis unavailable',
        recommendations: ['Consult with local art experts']
      };
    }
  }
}

module.exports = AIPricingService;

