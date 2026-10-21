export type Industry = {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  challenges: string[];
  services: string[]; // service slugs
};

export const industries: Industry[] = [
  {
    slug: 'government', title: 'Government & Public Sector', icon: 'landmark',
    summary: 'Protecting citizen data, critical public services and national infrastructure against advanced, often state-backed threats.',
    challenges: ['Targeted attacks and espionage', 'Large, complex legacy estates', 'Strict national security and data rules', 'Public trust and continuity of services'],
    services: ['penetration-testing', 'compliance-risk-advisory', 'threat-intelligence-brand-protection', 'incident-response-forensics'],
  },
  {
    slug: 'banking-finance', title: 'Banking & Finance', icon: 'bank',
    summary: 'Securing payments, customer accounts and trading systems while meeting demanding financial regulations.',
    challenges: ['Fraud, phishing and account takeover', 'PCI DSS and regulator requirements', 'Third-party and fintech integrations', 'Zero tolerance for downtime'],
    services: ['penetration-testing', 'zero-trust-identity-security', 'compliance-risk-advisory', 'threat-intelligence-brand-protection', 'fintech-mobility'],
  },
  {
    slug: 'healthcare', title: 'Healthcare & Life Sciences', icon: 'heart',
    summary: 'Keeping patient data private and connected medical devices safe, so care is never interrupted.',
    challenges: ['Sensitive patient records', 'Unsecured IoMT and medical devices', 'Ransomware targeting hospitals', 'HIPAA-style privacy obligations'],
    services: ['ot-iot-iomt-security', 'endpoint-network-detection-response', 'compliance-risk-advisory', 'security-awareness-training'],
  },
  {
    slug: 'energy-critical-infrastructure', title: 'Energy, Utilities & Critical Infrastructure', icon: 'bolt',
    summary: 'Defending the operational technology that keeps power, water, ports and transport running.',
    challenges: ['Converging IT and OT networks', 'Legacy industrial control systems', 'Safety and availability first', 'Nation-state and sabotage risk'],
    services: ['ot-iot-iomt-security', 'security-assessment', 'endpoint-network-detection-response', 'incident-response-forensics'],
  },
  {
    slug: 'aviation-logistics', title: 'Aviation, Ports & Logistics', icon: 'plane',
    summary: 'Securing airports, seaports and supply chains where cyber incidents can stop the movement of people and goods.',
    challenges: ['Operational systems that cannot stop', 'Many partners and third parties', 'Physical and cyber risks combined', 'Regulatory and customs data'],
    services: ['ot-iot-iomt-security', 'penetration-testing', 'zero-trust-identity-security', 'incident-response-forensics'],
  },
  {
    slug: 'education', title: 'Education & Research', icon: 'graduation',
    summary: 'Protecting universities and colleges with open networks, research data and thousands of users.',
    challenges: ['Open, distributed networks', 'Student and staff identity at scale', 'Valuable research data', 'Phishing against large user bases'],
    services: ['security-awareness-training', 'zero-trust-identity-security', 'cloud-security', 'security-assessment'],
  },
  {
    slug: 'manufacturing', title: 'Manufacturing & Industrial', icon: 'factory',
    summary: 'Keeping production lines, intellectual property and supply chains safe from disruption.',
    challenges: ['Ransomware stopping production', 'Connected machinery and sensors', 'Protecting designs and IP', 'Supplier access to systems'],
    services: ['ot-iot-iomt-security', 'endpoint-network-detection-response', 'security-assessment', 'incident-response-forensics'],
  },
  {
    slug: 'retail-hospitality', title: 'Retail, Hospitality & Consumer Brands', icon: 'store',
    summary: 'Protecting customer data, online stores and brand reputation from fraud and impersonation.',
    challenges: ['Payment card data', 'Fake websites and social accounts', 'E-commerce and app security', 'Seasonal peaks and promotions'],
    services: ['threat-intelligence-brand-protection', 'penetration-testing', 'compliance-risk-advisory', 'cloud-security'],
  },
  {
    slug: 'enterprise', title: 'Enterprise', icon: 'building',
    summary: 'End-to-end security programmes for large organisations operating across regions and clouds.',
    challenges: ['Hybrid and multi-cloud estates', 'Identity sprawl', 'Regulation across many countries', 'Board-level risk reporting'],
    services: ['compliance-risk-advisory', 'zero-trust-identity-security', 'cloud-security', 'endpoint-network-detection-response'],
  },
  {
    slug: 'small-business', title: 'Small & Medium Businesses', icon: 'briefcase',
    summary: 'Practical, right-sized protection for growing businesses without a large security team.',
    challenges: ['Limited in-house security skills', 'Phishing and business email compromise', 'Cloud and Microsoft 365 settings', 'Budget that must go further'],
    services: ['security-assessment', 'security-awareness-training', 'cloud-security', 'endpoint-network-detection-response'],
  },
];
