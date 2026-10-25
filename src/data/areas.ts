// The six solution areas (source: CSL services Google Sheet, 25 Oct 2026).
// Cybersecurity is the core; the others are supplementary, delivered directly or through partners.
export type AreaSlug =
  | 'cybersecurity-digital-risk'
  | 'fraud-risk-compliance'
  | 'payments-reconciliation'
  | 'smart-infrastructure-automation'
  | 'cloud-solutions'
  | 'it-services-software-development';

export type Area = {
  slug: AreaSlug;
  title: string;
  icon: string;
  short: string;     // one line for cards
  problem: string;   // the business problem
  solution: string;  // how CSL helps
  benefits: string[];
  audience: string;
};

export const areas: Area[] = [
  {
    slug: 'cybersecurity-digital-risk',
    title: 'Cybersecurity & Digital Risk',
    icon: 'shieldcheck',
    short: 'Find weaknesses before attackers do, protect people and systems, and respond fast when something happens.',
    problem: 'Attacks are faster and more targeted than ever. Ransomware, phishing and impersonation hit organisations of every size, and one incident can stop operations, expose customer data and damage trust.',
    solution: 'Our core specialism. We assess your exposure through testing and assessments, put the right protection, monitoring and training in place, and respond around the clock when incidents happen.',
    benefits: ['Fewer successful attacks', 'Faster detection and recovery', 'Evidence for boards, auditors and regulators'],
    audience: 'Security, IT and risk leaders',
  },
  {
    slug: 'fraud-risk-compliance',
    title: 'Fraud, Risk & Compliance',
    icon: 'file',
    short: 'Onboarding checks, fraud prevention, AML monitoring and compliance programmes that satisfy regulators.',
    problem: 'Regulators expect strong controls, while fraudsters target every weak point in onboarding and payments. Manual checks are slow, inconsistent and hard to evidence.',
    solution: 'We help you verify customers and businesses at onboarding, detect fraud and suspicious transactions in real time, and build compliance programmes for UAE IA, ISO 27001, PCI DSS, GDPR and more.',
    benefits: ['Faster, consistent onboarding', 'Lower fraud losses', 'Audit-ready compliance'],
    audience: 'Compliance, risk and finance teams',
  },
  {
    slug: 'payments-reconciliation',
    title: 'Payments & Reconciliation',
    icon: 'bank',
    short: 'Payment tracking, settlement and cash reconciliation with clear reporting and dashboards.',
    problem: 'Finance teams spend days matching payments, bank statements and invoices by hand. Errors slip through, month-end drags on and cash visibility suffers.',
    solution: 'We automate payment tracking, settlement and cash reconciliation, flag exceptions for review, and give finance teams dashboards they can trust.',
    benefits: ['Hours of manual work removed', 'Fewer errors and faster month-end', 'Real-time cash visibility'],
    audience: 'Finance and operations teams',
  },
  {
    slug: 'smart-infrastructure-automation',
    title: 'Smart Infrastructure & Automation',
    icon: 'building',
    short: 'Parking, access, ticketing, cameras and the infrastructure behind them, secured from day one.',
    problem: 'Car parks, access points, cameras and payment terminals are now connected devices. Run on separate, unsecured systems, they create cost, complexity and a way in for attackers.',
    solution: 'We design and deliver parking, access, ticketing and integrated payment solutions, plus the networks, hardware and AI-enabled CCTV behind them, with operational systems protected against cyber threats from day one.',
    benefits: ['Smoother, automated operations', 'One partner from design to support', 'Connected systems that stay secure'],
    audience: 'Facilities, operations and property teams',
  },
  {
    slug: 'cloud-solutions',
    title: 'Cloud Solutions',
    icon: 'cloud',
    short: 'Secure cloud architecture, migration and Microsoft 365 Copilot on AWS, Azure and Microsoft 365.',
    problem: 'Moving to the cloud promises speed and savings, but rushed migrations and misconfigured settings are now a leading cause of data exposure.',
    solution: 'We plan and migrate workloads to AWS, Azure and Microsoft 365, build resilient and automated environments, secure identities and data, and help teams use Microsoft 365 Copilot safely.',
    benefits: ['Secure, well-architected cloud', 'Minimal downtime during migration', 'AI productivity with data protected'],
    audience: 'IT and digital leaders',
  },
  {
    slug: 'it-services-software-development',
    title: 'IT Services & Software Development',
    icon: 'code',
    short: 'Licensing, backup, password management and custom software, websites and apps.',
    problem: 'Everyday IT tools and business software are often bought piecemeal, configured in a hurry and left unsupported, which costs money and leaves gaps.',
    solution: 'We supply and set up Microsoft licensing, Acronis backup and 1Password, and build custom and branded software, websites and mobile apps with security designed in.',
    benefits: ['Right-sized licences', 'Data backed up and recoverable', 'Software built around your business'],
    audience: 'Business owners and IT managers',
  },
];

export const areaBySlug = (s: string) => areas.find((a) => a.slug === s)!;
