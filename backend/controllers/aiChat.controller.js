const express = require('express');

// AI Chat Controller for MuiscArt Coach Lite integration
const aiChatController = {
  // Handle AI chat requests
  sendMessage: async (req, res) => {
    try {
      const { message, gptModel } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // TODO: Integrate with OpenAI ChatGPT API for MuiscArt Coach Lite
      // For now, we'll return enhanced fallback responses
      const response = generateMuiscArtResponse(message);
      
      res.json({
        response: response,
        model: gptModel || 'muiscart-coach-lite',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('AI Chat error:', error);
      res.status(500).json({ 
        error: 'Failed to process AI request',
        fallbackResponse: "I'm experiencing some technical difficulties, but I'm still here to help with your art questions! Please try again or rephrase your question."
      });
    }
  }
};

// Enhanced MuiscArt Coach Lite response generator
function generateMuiscArtResponse(userInput) {
  const input = userInput.toLowerCase();
  
  // Color theory responses
  if (input.includes('color') || input.includes('colour')) {
    if (input.includes('harmony') || input.includes('scheme')) {
      return "Color Harmony Mastery: Beautiful color harmony creates visual unity and emotional impact! Try these proven approaches:\n\n• Analogous: Use 3-5 neighboring colors on the wheel (like blue, blue-green, green) for natural harmony\n• Complementary: Pair opposites (red/green, blue/orange) for vibrant contrast\n• Triadic: Use three evenly spaced colors for balanced energy\n• Monochromatic: Explore tints, tones, and shades of one color for subtle sophistication\n\nConsider the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent. What's your current color challenge?";
    } else if (input.includes('mixing') || input.includes('blend')) {
      return "Color Mixing Expertise: Successful color mixing is both science and intuition! Key principles:\n\n• Warm + Cool: Creates natural grays and complex colors\n• Opacity matters: Transparent colors mix differently than opaque ones\n• Less is more: Start with small amounts of stronger colors\n• Color temperature: Adding warm/cool versions changes the entire mood\n\nFor digital: Use overlay/multiply blend modes to simulate traditional mixing. For traditional: Practice with limited palettes first. What medium are you working with?";
    } else {
      return "Color Theory Deep Dive: Color is one of the most powerful tools in your artistic arsenal! Understanding color psychology enhances your storytelling:\n\n• Warm colors (reds, oranges, yellows): Advance, energize, create intimacy\n• Cool colors (blues, greens, purples): Recede, calm, suggest distance\n• Saturation levels: High saturation demands attention, low saturation creates subtlety\n• Value relationships: Often more important than hue choices\n\nWhat specific color challenge are you facing in your current artwork?";
    }
  }
  
  // Composition responses
  else if (input.includes('composition') || input.includes('layout')) {
    if (input.includes('portrait') || input.includes('figure')) {
      return "Portrait Composition Mastery: Great portrait composition draws viewers into an emotional connection!\n\n• Eye placement: Position eyes on the upper third line for natural engagement\n• Negative space: Use background space to enhance, not compete with, your subject\n• Cropping choices: Tight crops create intimacy, wider shots provide context\n• Angle variations: Slight tilts add energy, straight angles suggest stability\n• Lighting direction: Side lighting reveals form, front lighting shows detail\n\nConsider the triangle composition - arrange features and shadows to create visual triangles. What type of portrait are you working on?";
    } else if (input.includes('landscape') || input.includes('nature')) {
      return "Landscape Composition Excellence: Powerful landscapes guide the viewer's journey through your scene!\n\n• Foreground, middle, background: Create depth layers for immersive experience\n• Leading lines: Use paths, rivers, shorelines to direct attention to focal points\n• Scale indicators: Include recognizable objects to emphasize grandeur\n• Sky proportion: Generally 1/3 or 2/3 sky, avoid 50/50 splits\n• Golden hour: Best light occurs 1 hour after sunrise/before sunset\n\nConsider the S-curve composition for dynamic flow. What landscape challenge are you tackling?";
    } else {
      return "Universal Composition Principles: Strong composition is the invisible foundation that makes art compelling!\n\n• Rule of thirds: Place key elements on intersection points, not dead center\n• Visual weight: Balance large/small, dark/light, detailed/simple elements\n• Flow and rhythm: Create paths for the eye to follow through your piece\n• Contrast: Use differences in value, color, texture to create focal points\n• Unity and variety: Repeat elements for cohesion, vary them for interest\n\nRemember: rules exist to be broken intelligently! What type of composition are you exploring?";
    }
  }
  
  // Technique responses
  else if (input.includes('technique') || input.includes('brush') || input.includes('paint') || input.includes('draw')) {
    if (input.includes('digital') || input.includes('photoshop') || input.includes('procreate')) {
      return "💻 Digital Art Technique Mastery: Digital tools offer incredible flexibility for artistic expression!\n\n• **Layer workflow**: Use separate layers for sketching, base colors, shadows, highlights, details\n• **Brush dynamics**: Adjust opacity, flow, and pressure sensitivity for natural marks\n• **Blending modes**: Experiment with multiply (shadows), overlay (lighting), color dodge (highlights)\n• **Custom brushes**: Create texture brushes for organic effects like foliage, clouds, skin\n• **Color picking**: Sample from real photos to build natural palettes\n\nKey tip: Don't over-rely on digital 'undo' - embrace happy accidents! What digital technique are you exploring?";
    } else if (input.includes('oil') || input.includes('acrylic') || input.includes('watercolor')) {
      return "🖌️ Traditional Media Mastery: Each traditional medium has unique properties that can enhance your artistic voice!\n\n**Oil painting**: Slow drying allows blending, glazing, and reworking. Build fat over lean (more oil in upper layers).\n\n**Acrylic**: Fast-drying versatility. Use medium for blending time, work quickly or in sections.\n\n**Watercolor**: Transparent layers and happy accidents. Work light to dark, embrace the paper's texture.\n\n• **Brushwork**: Vary pressure, angle, and speed for different marks\n• **Color temperature mixing**: Cool shadows, warm lights create dimension\n• **Texture techniques**: Dry brush, scumbling, glazing add surface interest\n\nWhat traditional medium are you working with?";
    } else {
      return "🎨 Fundamental Technique Development: Mastering techniques serves artistic expression, not the other way around!\n\n• **Observational skills**: Practice drawing what you see, not what you think you see\n• **Value studies**: Work in grayscale first to understand light and form\n• **Mark-making variety**: Develop a vocabulary of different strokes and textures\n• **Consistent practice**: Daily sketching builds muscle memory and confidence\n• **Study masters**: Analyze how great artists achieved specific effects\n\nTechnique grows through experimentation and repetition. What specific technique challenge are you facing?";
    }
  }
  
  // Inspiration and creativity
  else if (input.includes('inspiration') || input.includes('idea') || input.includes('block') || input.includes('stuck')) {
    return "💡 Creative Breakthrough Coaching: Every artist faces creative challenges - they're growth opportunities in disguise!\n\n**Immediate inspiration boosters:**\n• Change your environment - work outside, in a café, different room\n• Try extreme constraints - paint with 3 colors only, or in 15 minutes\n• Cross-pollinate - combine two unrelated concepts (urban + nature, classical + futuristic)\n• Study different art forms - architecture, dance, music can spark visual ideas\n• Use photo references differently - extreme close-ups, unusual angles\n\n**Long-term creativity cultivation:**\n• Keep a visual journal for daily observations\n• Follow the 'ugly art' practice - make deliberately bad art to reduce pressure\n• Study artists outside your comfort zone\n• Take inspiration walks without your phone\n\nWhat type of creative block are you experiencing?";
  }
  
  // Style development
  else if (input.includes('style') || input.includes('voice') || input.includes('develop') || input.includes('unique')) {
    return "🎭 Artistic Style Development: Your unique style emerges from consistent choices and authentic expression!\n\n**Style isn't forced - it's discovered through:**\n• **Subject preferences**: What draws you to paint/draw repeatedly?\n• **Color choices**: Do you gravitate toward bold or subtle palettes?\n• **Mark-making**: Smooth blends vs. visible brushstrokes reveal personality\n• **Emotional expression**: Are you drawn to drama, serenity, energy, mystery?\n• **Technical approach**: Realistic detail vs. impressionistic suggestion\n\n**Development strategies:**\n• Create series of works exploring one concept\n• Study 3-5 artists you admire, identify what resonates\n• Experiment with exaggeration - push your natural tendencies further\n• Document your evolution - style develops gradually\n\nYour style is already emerging in your choices! What artistic direction feels most authentic to you?";
  }
  
  // Art career and professional development
  else if (input.includes('career') || input.includes('sell') || input.includes('professional') || input.includes('portfolio')) {
    return "💼 Art Career Strategy: Building a sustainable art career combines creative excellence with smart business practices!\n\n**Portfolio Development:**\n• Show consistency in quality and voice across 15-20 pieces\n• Include process shots and artist statements\n• Present work professionally - good photography matters\n• Create both physical and digital portfolios\n\n**Building Your Presence:**\n• Social media consistency - post regularly, engage authentically\n• Network with other artists, gallery owners, collectors\n• Participate in local art shows and online exhibitions\n• Consider multiple revenue streams: originals, prints, commissions, teaching\n\n**Pricing Your Work:**\n• Factor in materials, time, overhead, and profit margin\n• Research comparable artists in your area/style\n• Start modest but don't undervalue your work\n• Raise prices gradually as demand increases\n\nWhat aspect of art career development interests you most?";
  }
  
  // Critique and improvement
  else if (input.includes('critique') || input.includes('feedback') || input.includes('improve') || input.includes('better')) {
    return "🔍 Artistic Growth Through Self-Critique: Developing your critical eye accelerates artistic improvement!\n\n**Effective Self-Critique Questions:**\n• Does this achieve my intended emotional impact?\n• Where does my eye go first, and is that intentional?\n• Are my values (light/dark) clear from across the room?\n• Do my colors work harmoniously or create mud?\n• What would I change if I painted this again?\n\n**Critique Strategies:**\n• Step back regularly - view your work from 6+ feet away\n• Take photos - the camera reveals what your eye misses\n• Compare to your reference materials\n• Show work to other artists for fresh perspectives\n• Keep a 'lessons learned' journal for each piece\n\n**Growth Mindset:**\nEvery artwork teaches something. 'Failed' pieces often teach more than successful ones. What specific aspect of your work would you like to develop further?";
  }
  
  // Default response
  else {
    return "MuiscArt Coach Lite at Your Service: I'm here to provide specialized guidance for your artistic journey!\n\nMy areas of expertise:\n• Color Theory: Harmony, mixing, psychology, and application\n• Composition: Rules, principles, and creative breaking of them\n• Techniques: Digital and traditional media mastery\n• Creative Development: Inspiration, style, and artistic voice\n• Art Career: Portfolio, pricing, promotion, and professional growth\n• Critique & Improvement: Self-assessment and growth strategies\n\nI provide personalized coaching based on your specific needs and artistic goals. What creative challenge can I help you tackle today? Feel free to share details about your current project, medium, or artistic aspirations!";
  }
}

module.exports = aiChatController;
