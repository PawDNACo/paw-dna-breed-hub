/**
 * Security utility for validating and sanitizing user inputs
 * Prevents SQL injection and other injection attacks
 */

// US state codes for validation
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

/**
 * Validates and sanitizes city name input
 * @param city - Raw city input from user
 * @returns Sanitized city name or null if invalid
 */
export function validateCity(city: string | null): string | null {
  if (!city) return null;
  
  // Remove leading/trailing whitespace
  const trimmed = city.trim();
  
  // Check length (cities typically don't exceed 50 characters)
  if (trimmed.length === 0 || trimmed.length > 50) return null;
  
  // Only allow letters, spaces, hyphens, and apostrophes
  // This prevents SQL injection attempts
  const validCityPattern = /^[a-zA-Z\s'-]+$/;
  if (!validCityPattern.test(trimmed)) return null;
  
  return trimmed;
}

/**
 * Validates and sanitizes state code input
 * @param state - Raw state code input from user
 * @returns Sanitized state code or null if invalid
 */
export function validateState(state: string | null): string | null {
  if (!state) return null;
  
  // Remove whitespace and convert to uppercase
  const normalized = state.trim().toUpperCase();
  
  // Check if it's a valid US state code
  if (!US_STATES.includes(normalized)) return null;
  
  return normalized;
}

/**
 * Validates species input
 * @param species - Raw species input
 * @returns Validated species or null if invalid
 */
export function validateSpecies(species: string | null): string | null {
  if (!species) return null;
  
  const validSpecies = ['dog', 'cat', 'bird', 'reptile', 'small_animal', 'all'];
  const normalized = species.toLowerCase().trim();
  
  if (!validSpecies.includes(normalized)) return null;
  
  return normalized;
}
