export type Industry = {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  challenges: string[];
  services: string[]; // service slugs
  lead?: boolean; // featured on the home page
};

// Lead industries first (healthcare, hospitality, financial services, infrastructure).
export const industries: Industry[] = [
  {
    slug: 'healthcare', title: 'Healthcare & Life Sciences', icon: 'heart', lead: true,
    summary: 'Keeping patient data private, connected medical and building systems safe, and operations running smoothly, so care is never interrupted.',
    challenges: ['Sensitive patient records', 'Connected medical and building devices', 'Ransomware targeting hospitals', 'Strict privacy obligations'],
    services: ['endpoint-network-detection-response', 'compliance-risk-advisory', 'security-awareness-training', 'mobility-solutions', 'cloud-security'],
  },
  {
    slug: 'hospitality-retail', title: 'Hospitality & Retail', icon: 'store', lead: true,
    summary: 'Protecting guests, payments and brand reputation, while automating parking, payments and reconciliation behind the scenes.',
    challenges: ['Payment card data and fraud', 'Fake websites and booking scams', 'High payment volumes to reconcile', 'Parking and access at busy sites'],
    services: ['threat-intelligence-brand-protection', 'fraud-prevention', 'payment-reconciliation', 'mobility-solutions', 'penetration-testing'],
  },
  {
    slug: 'financial-services', title: 'Financial Services', icon: 'bank', lead: true,
    summary: 'Securing banks, exchange houses, payment firms and fintechs, with onboarding checks, fraud prevention, AML monitoring and compliance regulators expect.',
    challenges: ['Fraud and account takeover', 'KYC, AML and sanctions obligations', 'PCI DSS and regulator audits', 'Zero tolerance for downtime'],
    services: ['kyc-kyb-onboarding-checks', 'fraud-prevention', 'aml-transaction-monitoring', 'compliance-risk-advisory', 'payment-reconciliation', 'penetration-testing'],
  },
  {
    slug: 'infrastructure-utilities', title: 'Infrastructure, Energy & Utilities', icon: 'bolt', lead: true,
    summary: 'Securing and automating the systems that keep buildings, power, water and transport running, from networks and cameras to access and parking.',
    challenges: ['Converging IT and operational systems', 'Connected cameras and access points', 'Safety and availability first', 'Nation-state and sabotage risk'],
    services: ['infrastructure-technology', 'mobility-solutions', 'security-assessment', 'endpoint-network-detection-response', 'incident-response-forensics'],
  },
  {
    slug: 'government', title: 'Government & Public Sector', icon: 'landmark',
    summary: 'Protecting citizen data, public services and national infrastructure against advanced, often state-backed threats.',
    challenges: ['Targeted attacks and espionage', 'Large, complex legacy estates', 'UAE IA and national security rules', 'Public trust and continuity of services'],
    services: ['penetration-testing', 'compliance-risk-advisory', 'threat-intelligence-brand-protection', 'incident-response-forensics'],
  },
  {
    slug: 'aviation-logistics', title: 'Aviation, Ports & Logistics', icon: 'plane',
    summary: 'Securing airports, seaports and supply chains where an incident can stop the movement of people and goods.',
    challenges: ['Operational systems that cannot stop', 'Many partners and third parties', 'Physical and cyber risks combined', 'Regulatory and customs data'],
    services: ['infrastructure-technology', 'penetration-testing', 'zero-trust-identity-security', 'incident-response-forensics'],
  },
  {
    slug: 'education', title: 'Education & Research', icon: 'graduation',
    summary: 'Protecting universities and colleges with open networks, research data and thousands of users.',
    challenges: ['Open, distributed networks', 'Student and staff identity at scale', 'Valuable research data', 'Phishing against large user bases'],
    services: ['security-awareness-training', 'zero-trust-identity-security', 'cloud-security', 'microsoft-365-copilot'],
  },
  {
    slug: 'manufacturing', title: 'Manufacturing & Industrial', icon: 'factory',
    summary: 'Keeping production lines, intellectual property and supply chains safe from disruption.',
    challenges: ['Ransomware stopping production', 'Connected machinery and sensors', 'Protecting designs and IP', 'Supplier access to systems'],
    services: ['infrastructure-technology', 'endpoint-network-detection-response', 'security-assessment', 'incident-response-forensics'],
  },
  {
    slug: 'enterprise', title: 'Enterprise', icon: 'building',
    summary: 'Security and technology programmes for large organisations operating across regions and clouds.',
    challenges: ['Hybrid and multi-cloud estates', 'Identity sprawl', 'Regulation across many countries', 'Board-level risk reporting'],
    services: ['compliance-risk-advisory', 'zero-trust-identity-security', 'cloud-security', 'microsoft-365-copilot', 'endpoint-network-detection-response'],
  },
  {
    slug: 'small-business', title: 'Small & Medium Businesses', icon: 'briefcase',
    summary: 'Practical, right-sized protection and IT for growing businesses without a large security team.',
    challenges: ['Limited in-house security skills', 'Phishing and business email compromise', 'Microsoft 365 settings and licences', 'Budget that must go further'],
    services: ['security-assessment', 'security-awareness-training', 'it-services-licensing', 'software-development'],
  },
];
