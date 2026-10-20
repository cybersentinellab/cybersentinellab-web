const t = (s: string) => s.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

const clientFiles = [
  ['sharjah-airport', 'Sharjah Airport'],
  ['masdar', 'Masdar'],
  ['rak-ports', 'RAK Ports'],
  ['sharjah-seaports-customs', 'Department of Seaports & Customs, Government of Sharjah'],
  ['heriot-watt-university', 'Heriot-Watt University'],
  ['emarat', 'Emarat'],
  ['canadian-specialist-hospital', 'Canadian Specialist Hospital'],
  ['dubai-medical-university', 'Dubai Medical University'],
  ['dubai-pharmacy-college', 'Dubai Pharmacy College'],
  ['sharjah-asset-management', 'Sharjah Asset Management'],
  ['zafco', 'ZAFCO'],
  ['the-entertainer', 'The Entertainer'],
  ['pantheon-elysee', 'Pantheon Elysee Development'],
  ['swiss-arabian', 'Swiss Arabian'],
  ['rafid', 'Rafid Automotive Solutions'],
  ['quality-point', 'Quality Point'],
  ['air-advanced-inhalation-rituals', 'Advanced Inhalation Rituals (AIR)'],
];

const partnerFiles = [
  'crowdstrike', 'palo-alto-networks', 'microsoft', 'aws', 'ibm', 'check-point', 'sentinelone', 'trend-micro',
  'tenable', 'vectra', 'corelight', 'cortex-xsoar', 'elastic', 'azure-sentinel', 'vmware', 'acronis',
  'knowbe4', 'lastpass', 'solarwinds', 'threatdown', 'asimily', 'neushield', 'dmarcian', 'izoologic',
];
const partnerNames: Record<string, string> = {
  aws: 'Amazon Web Services', ibm: 'IBM', vmware: 'VMware', knowbe4: 'KnowBe4', lastpass: 'LastPass',
  sentinelone: 'SentinelOne', crowdstrike: 'CrowdStrike', solarwinds: 'SolarWinds', threatdown: 'ThreatDown by Malwarebytes',
  neushield: 'NeuShield', izoologic: 'iZOOlogic', 'cortex-xsoar': 'Cortex XSOAR', 'azure-sentinel': 'Microsoft Azure Sentinel',
  microsoft: 'Microsoft Partner', dmarcian: 'dmarcian',
};

export const clients = clientFiles.map(([f, name]) => ({ name, src: `/images/logos/clients/${f}.webp` }));
export const partners = partnerFiles.map((f) => ({ name: partnerNames[f] ?? t(f), src: `/images/logos/partners/${f}.webp` }));
