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
      return "Color Harmony Mastery: Beautiful color harmony creates visual unity and emotional impact! Try these proven approaches:\n\nâ€¢ Analogous: Use 3-5 neighboring colors on the wheel (like blue, blue-green, green) for natural harmony\nâ€¢ Complementary: Pair opposites (red/green, blue/orange) for vibrant contrast\nâ€¢ Triadic: Use three evenly spaced colors for balanced energy\nâ€¢ Monochromatic: Explore tints, tones, and shades of one color for subtle sophistication\n\nConsider the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent. What's your current color challenge?";
    } else if (input.includes('mixing') || input.includes('blend')) {
      return "Color Mixing Expertise: Successful color mixing is both science and intuition! Key principles:\n\nâ€¢ Warm + Cool: Creates natural grays and complex colors\nâ€¢ Opacity matters: Transparent colors mix differently than opaque ones\nâ€¢ Less is more: Start with small amounts of stronger colors\nâ€¢ Color temperature: Adding warm/cool versions changes the entire mood\n\nFor digital: Use overlay/multiply blend modes to simulate traditional mixing. For traditional: Practice with limited palettes first. What medium are you working with?";
    } else {
      return "Color Theory Deep Dive: Color is one of the most powerful tools in your artistic arsenal! Understanding color psychology enhances your storytelling:\n\nâ€¢ Warm colors (reds, oranges, yellows): Advance, energize, create intimacy\nâ€¢ Cool colors (blues, greens, purples): Recede, calm, suggest distance\nâ€¢ Saturation levels: High saturation demands attention, low saturation creates subtlety\nâ€¢ Value relationships: Often more important than hue choices\n\nWhat specific color challenge are you facing in your current artwork?";
    }
  }
  
  // Composition responses
  else if (input.includes('composition') || input.includes('layout')) {
    if (input.includes('portrait') || input.includes('figure')) {
      return "Portrait Composition Mastery: Great portrait composition draws viewers into an emotional connection!\n\nâ€¢ Eye placement: Position eyes on the upper third line for natural engagement\nâ€¢ Negative space: Use background space to enhance, not compete with, your subject\nâ€¢ Cropping choices: Tight crops create intimacy, wider shots provide context\nâ€¢ Angle variations: Slight tilts add energy, straight angles suggest stability\nâ€¢ Lighting direction: Side lighting reveals form, front lighting shows detail\n\nConsider the triangle composition - arrange features and shadows to create visual triangles. What type of portrait are you working on?";
    } else if (input.includes('landscape') || input.includes('nature')) {
      return "Landscape Composition Excellence: Powerful landscapes guide the viewer's journey through your scene!\n\nâ€¢ Foreground, middle, background: Create depth layers for immersive experience\nâ€¢ Leading lines: Use paths, rivers, shorelines to direct attention to focal points\nâ€¢ Scale indicators: Include recognizable objects to emphasize grandeur\nâ€¢ Sky proportion: Generally 1/3 or 2/3 sky, avoid 50/50 splits\nâ€¢ Golden hour: Best light occurs 1 hour after sunrise/before sunset\n\nConsider the S-curve composition for dynamic flow. What landscape challenge are you tackling?";
    } else {
      return "Universal Composition Principles: Strong composition is the invisible foundation that makes art compelling!\n\nâ€¢ Rule of thirds: Place key elements on intersection points, not dead center\nâ€¢ Visual weight: Balance large/small, dark/light, detailed/simple elements\nâ€¢ Flow and rhythm: Create paths for the eye to follow through your piece\nâ€¢ Contrast: Use differences in value, color, texture to create focal points\nâ€¢ Unity and variety: Repeat elements for cohesion, vary them for interest\n\nRemember: rules exist to be broken intelligently! What type of composition are you exploring?";
    }
  }
  
  // Technique responses
  else if (input.includes('technique') || input.includes('brush') || input.includes('paint') || input.includes('draw')) {
    if (input.includes('digital') || input.includes('photoshop') || input.includes('procreate')) {
      return "ðŸ’» Digital Art Technique Mastery: Digital tools offer incredible flexibility for artistic expression!\n\nâ€¢ **Layer workflow**: Use separate layers for sketching, base colors, shadows, highlights, details\nâ€¢ **Brush dynamics**: Adjust opacity, flow, and pressure sensitivity for natural marks\nâ€¢ **Blending modes**: Experiment with multiply (shadows), overlay (lighting), color dodge (highlights)\nâ€¢ **Custom brushes**: Create texture brushes for organic effects like foliage, clouds, skin\nâ€¢ **Color picking**: Sample from real photos to build natural palettes\n\nKey tip: Don't over-rely on digital 'undo' - embrace happy accidents! What digital technique are you exploring?";
    } else if (input.includes('oil') || input.includes('acrylic') || input.includes('watercolor')) {
      return "ðŸ–Œï¸ Traditional Media Mastery: Each traditional medium has unique properties that can enhance your artistic voice!\n\n**Oil painting**: Slow drying allows blending, glazing, and reworking. Build fat over lean (more oil in upper layers).\n\n**Acrylic**: Fast-drying versatility. Use medium for blending time, work quickly or in sections.\n\n**Watercolor**: Transparent layers and happy accidents. Work light to dark, embrace the paper's texture.\n\nâ€¢ **Brushwork**: Vary pressure, angle, and speed for different marks\nâ€¢ **Color temperature mixing**: Cool shadows, warm lights create dimension\nâ€¢ **Texture techniques**: Dry brush, scumbling, glazing add surface interest\n\nWhat traditional medium are you working with?";
    } else {
      return "ðŸŽ¨ Fundamental Technique Development: Mastering techniques serves artistic expression, not the other way around!\n\nâ€¢ **Observational skills**: Practice drawing what you see, not what you think you see\nâ€¢ **Value studies**: Work in grayscale first to understand light and form\nâ€¢ **Mark-making variety**: Develop a vocabulary of different strokes and textures\nâ€¢ **Consistent practice**: Daily sketching builds muscle memory and confidence\nâ€¢ **Study masters**: Analyze how great artists achieved specific effects\n\nTechnique grows through experimentation and repetition. What specific technique challenge are you facing?";
    }
  }
  
  // Inspiration and creativity
  else if (input.includes('inspiration') || input.includes('idea') || input.includes('block') || input.includes('stuck')) {
    return "ðŸ’¡ Creative Breakthrough Coaching: Every artist faces creative challenges - they're growth opportunities in disguise!\n\n**Immediate inspiration boosters:**\nâ€¢ Change your environment - work outside, in a cafÃ©, different room\nâ€¢ Try extreme constraints - paint with 3 colors only, or in 15 minutes\nâ€¢ Cross-pollinate - combine two unrelated concepts (urban + nature, classical + futuristic)\nâ€¢ Study different art forms - architecture, dance, music can spark visual ideas\nâ€¢ Use photo references differently - extreme close-ups, unusual angles\n\n**Long-term creativity cultivation:**\nâ€¢ Keep a visual journal for daily observations\nâ€¢ Follow the 'ugly art' practice - make deliberately bad art to reduce pressure\nâ€¢ Study artists outside your comfort zone\nâ€¢ Take inspiration walks without your phone\n\nWhat type of creative block are you experiencing?";
  }
  
  // Style development
  else if (input.includes('style') || input.includes('voice') || input.includes('develop') || input.includes('unique')) {
    return "ðŸŽ­ Artistic Style Development: Your unique style emerges from consistent choices and authentic expression!\n\n**Style isn't forced - it's discovered through:**\nâ€¢ **Subject preferences**: What draws you to paint/draw repeatedly?\nâ€¢ **Color choices**: Do you gravitate toward bold or subtle palettes?\nâ€¢ **Mark-making**: Smooth blends vs. visible brushstrokes reveal personality\nâ€¢ **Emotional expression**: Are you drawn to drama, serenity, energy, mystery?\nâ€¢ **Technical approach**: Realistic detail vs. impressionistic suggestion\n\n**Development strategies:**\nâ€¢ Create series of works exploring one concept\nâ€¢ Study 3-5 artists you admire, identify what resonates\nâ€¢ Experiment with exaggeration - push your natural tendencies further\nâ€¢ Document your evolution - style develops gradually\n\nYour style is already emerging in your choices! What artistic direction feels most authentic to you?";
  }
  
  // Art career and professional development
  else if (input.includes('career') || input.includes('sell') || input.includes('professional') || input.includes('portfolio')) {
    return "ðŸ’¼ Art Career Strategy: Building a sustainable art career combines creative excellence with smart business practices!\n\n**Portfolio Development:**\nâ€¢ Show consistency in quality and voice across 15-20 pieces\nâ€¢ Include process shots and artist statements\nâ€¢ Present work professionally - good photography matters\nâ€¢ Create both physical and digital portfolios\n\n**Building Your Presence:**\nâ€¢ Social media consistency - post regularly, engage authentically\nâ€¢ Network with other artists, gallery owners, collectors\nâ€¢ Participate in local art shows and online exhibitions\nâ€¢ Consider multiple revenue streams: originals, prints, commissions, teaching\n\n**Pricing Your Work:**\nâ€¢ Factor in materials, time, overhead, and profit margin\nâ€¢ Research comparable artists in your area/style\nâ€¢ Start modest but don't undervalue your work\nâ€¢ Raise prices gradually as demand increases\n\nWhat aspect of art career development interests you most?";
  }
  
  // Critique and improvement
  else if (input.includes('critique') || input.includes('feedback') || input.includes('improve') || input.includes('better')) {
    return "ðŸ” Artistic Growth Through Self-Critique: Developing your critical eye accelerates artistic improvement!\n\n**Effective Self-Critique Questions:**\nâ€¢ Does this achieve my intended emotional impact?\nâ€¢ Where does my eye go first, and is that intentional?\nâ€¢ Are my values (light/dark) clear from across the room?\nâ€¢ Do my colors work harmoniously or create mud?\nâ€¢ What would I change if I painted this again?\n\n**Critique Strategies:**\nâ€¢ Step back regularly - view your work from 6+ feet away\nâ€¢ Take photos - the camera reveals what your eye misses\nâ€¢ Compare to your reference materials\nâ€¢ Show work to other artists for fresh perspectives\nâ€¢ Keep a 'lessons learned' journal for each piece\n\n**Growth Mindset:**\nEvery artwork teaches something. 'Failed' pieces often teach more than successful ones. What specific aspect of your work would you like to develop further?";
  }
  
  // Default response
  else {
    return "MuiscArt Coach Lite at Your Service: I'm here to provide specialized guidance for your artistic journey!\n\nMy areas of expertise:\nâ€¢ Color Theory: Harmony, mixing, psychology, and application\nâ€¢ Composition: Rules, principles, and creative breaking of them\nâ€¢ Techniques: Digital and traditional media mastery\nâ€¢ Creative Development: Inspiration, style, and artistic voice\nâ€¢ Art Career: Portfolio, pricing, promotion, and professional growth\nâ€¢ Critique & Improvement: Self-assessment and growth strategies\n\nI provide personalized coaching based on your specific needs and artistic goals. What creative challenge can I help you tackle today? Feel free to share details about your current project, medium, or artistic aspirations!";
  }
}

module.exports = aiChatController;

