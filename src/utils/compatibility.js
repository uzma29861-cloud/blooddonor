// Blood Group Compatibility Engine
// Supports standard ABO & Rh systems, plus Bombay Blood (hh)

export const BLOOD_GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Bombay (hh)'];

// Whole Blood & Red Blood Cells (RBC) compatibility matrix
// Recipient -> Array of compatible donors
export const RED_CELL_COMPATIBILITY = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'Bombay (hh)': ['Bombay (hh)'], // Bombay phenotype can only receive from Bombay
};

// Plasma compatibility (Inverse of RBC compatibility)
// Recipient -> Array of compatible donors
export const PLASMA_COMPATIBILITY = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
  'Bombay (hh)': ['Bombay (hh)', 'O-', 'O+'],
};

// Platelets compatibility (Prefer exact or plasma compatible)
export const PLATELET_COMPATIBILITY = {
  'O-': ['O-', 'A-', 'B-', 'AB-'],
  'O+': ['O-', 'O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
  'Bombay (hh)': ['Bombay (hh)'],
};

/**
 * Returns which donor blood groups a recipient can safely receive from.
 */
export function getCanReceiveFrom(recipientGroup, componentType = 'Whole Blood') {
  if (!recipientGroup) return [];
  if (componentType === 'Plasma') {
    return PLASMA_COMPATIBILITY[recipientGroup] || [recipientGroup];
  }
  if (componentType === 'Single Donor Platelets (SDP)') {
    return PLATELET_COMPATIBILITY[recipientGroup] || RED_CELL_COMPATIBILITY[recipientGroup] || [recipientGroup];
  }
  return RED_CELL_COMPATIBILITY[recipientGroup] || [recipientGroup];
}

/**
 * Returns which recipient blood groups this donor group can safely donate to.
 */
export function getCanDonateTo(donorGroup, componentType = 'Whole Blood') {
  if (!donorGroup) return [];
  const allGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  if (donorGroup === 'Bombay (hh)') {
    return ['Bombay (hh)', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  }

  return allGroups.filter((recipient) => {
    const compatibleDonors = getCanReceiveFrom(recipient, componentType);
    return compatibleDonors.includes(donorGroup);
  });
}

/**
 * Checks if a specific donor group can donate to a specific recipient.
 */
export function isCompatible(donorGroup, recipientGroup, componentType = 'Whole Blood') {
  const allowed = getCanReceiveFrom(recipientGroup, componentType);
  return allowed.includes(donorGroup);
}

/**
 * Educational notes for blood group logic
 */
export const BLOOD_FACTS = {
  'O-': {
    title: 'Universal Red Cell Donor',
    badge: 'Universal Donor',
    description: 'O- Negative red blood cells can be transfused to almost any emergency patient regardless of recipient blood type.',
    rarity: 'Rare (approx 1-2% in Indian sub-continent)',
  },
  'AB+': {
    title: 'Universal Red Cell Recipient',
    badge: 'Universal Recipient',
    description: 'AB+ Positive individuals can safely receive red blood cells from any blood group during an emergency.',
    rarity: 'Common (~8% population)',
  },
  'AB-': {
    title: 'Universal Plasma Donor',
    badge: 'Universal Plasma',
    description: 'AB- plasma has no antibodies against A or B antigens and can be given to anyone in burn or trauma wards.',
    rarity: 'Extremely Rare (<0.5%)',
  },
  'Bombay (hh)': {
    title: 'Extremely Rare Phenotype',
    badge: 'Ultra Rare (hh)',
    description: 'Lacks H antigen. Individuals with Bombay blood group can only receive blood from another Bombay blood group donor.',
    rarity: '1 in 10,000 in India (0.0004% globally)',
  },
  'O+': {
    title: 'Most Needed Blood Group',
    badge: 'High Demand',
    description: 'Most common blood group. Essential for daily hospital surgeries, accident traumas, and pediatric care.',
    rarity: 'Most common (~35-40%)',
  },
  'A+': {
    title: 'High Demand Group',
    badge: 'High Need',
    description: 'Widely needed for cancer care, platelet transfusions, and major cardiac surgeries.',
    rarity: 'Common (~22-25%)',
  },
  'B+': {
    title: 'Very Common in South Asia',
    badge: 'Critical Supply',
    description: 'The single most prevalent blood group across the Indian subcontinent.',
    rarity: 'Very common (~32-35%)',
  },
  'A-': {
    title: 'Rare Negative Group',
    badge: 'Urgent Shortage',
    description: 'Can donate to A+, A-, AB+, AB-. High priority when accident or thalassemia emergencies arise.',
    rarity: 'Rare (~1-2%)',
  },
  'B-': {
    title: 'Rare Negative Group',
    badge: 'Urgent Shortage',
    description: 'Can donate to B+, B-, AB+, AB-. Very often has critical shortage in blood banks.',
    rarity: 'Rare (~1-2%)',
  },
};
