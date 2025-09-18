/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const hubspot = require('@hubspot/api-client');

// Initialize HubSpot client for CRM operations
const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN
});

// Create or update contact in HubSpot
const createOrUpdateContact = async (userData) => {
  try {
    const { email, first_name, last_name, username } = userData;
    
    const contactData = {
      properties: {
        email: email,
        firstname: first_name || '',
        lastname: last_name || '',
        company: 'PassionArt Community',
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        // Custom properties for PassionArt
        passionart_username: username || '',
        passionart_registration_date: new Date().toISOString(),
        passionart_user_type: 'artist_member',
        website: 'passionart.io'
      }
    };

    // Try to get existing contact first
    let contact;
    try {
      contact = await hubspotClient.crm.contacts.basicApi.getById(email, ['email']);
      console.log(`📞 Updating existing HubSpot contact: ${email}`);
      
      // Update existing contact
      const updatedContact = await hubspotClient.crm.contacts.basicApi.update(
        contact.id, 
        contactData
      );
      
      return {
        success: true,
        contactId: updatedContact.id,
        action: 'updated',
        message: 'Contact updated successfully in HubSpot'
      };
      
    } catch (getError) {
      // Contact doesn't exist, create new one
      console.log(`📞 Creating new HubSpot contact: ${email}`);
      
      const newContact = await hubspotClient.crm.contacts.basicApi.create(contactData);
      
      return {
        success: true,
        contactId: newContact.id,
        action: 'created',
        message: 'Contact created successfully in HubSpot'
      };
    }
    
  } catch (error) {
    console.error('❌ HubSpot contact error:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to sync contact with HubSpot'
    };
  }
};

// Track custom events in HubSpot
const trackEvent = async (email, eventName, eventProperties = {}) => {
  try {
    const eventData = {
      email: email,
      eventName: eventName,
      properties: {
        ...eventProperties,
        source: 'PassionArt Website',
        timestamp: new Date().toISOString()
      }
    };

    // Send custom event to HubSpot
    await hubspotClient.events.eventsApi.create(eventData);
    
    console.log(`📊 HubSpot event tracked: ${eventName} for ${email}`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ HubSpot event tracking error:', error.message);
    return { success: false, error: error.message };
  }
};

// Get contact activity from HubSpot
const getContactActivity = async (email) => {
  try {
    // Get contact by email
    const contact = await hubspotClient.crm.contacts.basicApi.getById(
      email, 
      ['email', 'firstname', 'lastname', 'createdate', 'lastmodifieddate']
    );
    
    // Get contact's timeline events
    const timeline = await hubspotClient.crm.timeline.timelineApi.getPage(
      'contacts',
      contact.id
    );
    
    return {
      success: true,
      contact: contact,
      timeline: timeline.results || []
    };
    
  } catch (error) {
    console.error('❌ HubSpot contact activity error:', error.message);
    return { success: false, error: error.message };
  }
};

// Sync user registration to HubSpot with lead scoring
const syncUserRegistration = async (userData) => {
  try {
    // Create/update contact
    const contactResult = await createOrUpdateContact(userData);
    
    if (contactResult.success) {
      // Track registration event
      await trackEvent(userData.email, 'PassionArt_User_Registration', {
        registration_source: 'website',
        user_type: 'artist',
        username: userData.username
      });
      
      console.log(`✅ User synced to HubSpot: ${userData.email}`);
    }
    
    return contactResult;
    
  } catch (error) {
    console.error('❌ HubSpot user sync error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createOrUpdateContact,
  trackEvent,
  getContactActivity,
  syncUserRegistration
};
