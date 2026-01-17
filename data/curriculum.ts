export type Resource = {
  title: string;
  type: 'video' | 'article' | 'tool' | 'template';
  url: string;
  duration?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  resources?: Resource[];
};

export type Module = {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
};

export type Capstone = {
  title: string;
  role: string;
  scenario: string;
  deliverables: string[];
};

export type Track = {
  id: string;
  title: string;
  description: string;
  learning: Resource[];
  modules: Module[];
  capstone: Capstone;
};

export const CURRICULUM: Record<string, Track> = {
  'customer-support': {
    id: 'customer-support',
    title: 'Customer Support Specialist',
    description: 'Master modern SaaS support tools and empathy-driven communication.',
    learning: [
      { title: 'Customer Service Basics (HubSpot)', type: 'article', url: 'https://blog.hubspot.com/service/customer-service' },
      { title: 'The Golden Rules of Customer Support (Intercom)', type: 'article', url: 'https://www.intercom.com/blog/golden-rules-of-customer-support/' },
      { title: 'Incident Management Guide (Atlassian)', type: 'article', url: 'https://www.atlassian.com/incident-management' },
      { title: 'Writing for Support: Tone and Empathy (Zendesk)', type: 'article', url: 'https://www.zendesk.com/blog/customer-service-tone/' },
      { title: 'SaaS Metrics Overview (Baremetrics)', type: 'article', url: 'https://baremetrics.com/academy/saas-metrics' },
      { title: 'Statuspage: Product Overview', type: 'article', url: 'https://www.atlassian.com/software/statuspage' }
    ],
    capstone: {
      title: 'Enterprise SaaS Crisis Management',
      role: 'Senior Support Specialist',
      scenario: 'A major outage has affected 40% of users. You must handle incoming volume, update the status page, and draft a post-mortem.',
      deliverables: ['Status Page Update Text', '3 Macro Templates for Outage', 'Post-Mortem Draft']
    },
    modules: [
      {
        id: 'cs-mod-1',
        title: 'Week 1: Fundamentals of SaaS Support',
        description: 'Understand the role of support in a SaaS business and master ticket triage.',
        tasks: [
          {
            id: 'cs-001',
            title: 'SaaS Support Fundamentals',
            description: 'Read about the "Support as a Feature" philosophy.',
            required: true,
            resources: [
              { title: 'Customer Service Basics (HubSpot)', type: 'article', url: 'https://blog.hubspot.com/service/customer-service' },
              { title: 'SaaS Metrics Overview (Baremetrics)', type: 'article', url: 'https://baremetrics.com/academy/saas-metrics' }
            ]
          },
          {
            id: 'cs-002',
            title: 'Ticket Triage & Prioritization',
            description: 'Learn how to categorize and prioritize incoming requests.',
            required: true,
            resources: [{ title: 'Incident Prioritization (Atlassian)', type: 'article', url: 'https://www.atlassian.com/incident-management/prioritization' }]
          },
          {
            id: 'cs-003',
            title: 'Tooling: Zendesk & Intercom',
            description: 'Set up a sandbox environment and explore the interface.',
            required: true,
            resources: [
              { title: 'Getting started with Zendesk Support', type: 'article', url: 'https://support.zendesk.com/hc/en-us/articles/4408823978650-Getting-started-with-Zendesk-Support' },
              { title: 'Inbox Zero (Intercom)', type: 'article', url: 'https://www.intercom.com/blog/inbox-zero/' }
            ]
          }
        ]
      },
      {
        id: 'cs-mod-2',
        title: 'Week 2: Advanced Communication',
        description: 'Craft perfect responses and handle difficult situations.',
        tasks: [
          {
            id: 'cs-004',
            title: 'Building a Macro Library',
            description: 'Create 5 reusable snippets for common issues.',
            required: true,
            resources: [
              { title: 'Zendesk Macros Best Practices', type: 'article', url: 'https://support.zendesk.com/hc/en-us/articles/4408823920410-Macros-best-practices' },
              { title: 'Intercom Saved Replies', type: 'article', url: 'https://www.intercom.com/help/en/articles/182-create-saved-replies-to-quickly-send-common-responses' }
            ]
          },
          {
            id: 'cs-005',
            title: 'De-escalation Techniques',
            description: 'Roleplay a high-tension scenario with an angry customer.',
            required: true,
            resources: [
              { title: 'Customer Escalation Management (Zendesk)', type: 'article', url: 'https://www.zendesk.com/blog/customer-escalation-management/' }
            ]
          }
        ]
      }
    ]
  },
  'research-intelligence': {
    id: 'research-intelligence',
    title: 'Research & Intelligence Analyst',
    description: 'Master OSINT tools, ethical data gathering, and executive briefing.',
    learning: [
      { title: 'OSINT Framework', type: 'tool', url: 'https://osintframework.com/' },
      { title: 'Bellingcat Online Investigation Toolkit', type: 'article', url: 'https://www.bellingcat.com/resources' },
      { title: 'The Intelligence Cycle (CIA)', type: 'article', url: 'https://www.cia.gov/stories/story/the-intelligence-cycle/' },
      { title: 'Plain Language Writing Guide', type: 'article', url: 'https://www.plainlanguage.gov/guidelines/' },
      { title: 'Verification Handbook', type: 'article', url: 'https://verificationhandbook.com/' },
      { title: 'Google Advanced Search Operators', type: 'article', url: 'https://support.google.com/websearch/answer/2466433' }
    ],
    capstone: {
      title: 'Market Entry Intelligence Report',
      role: 'Intelligence Analyst',
      scenario: 'Your client wants to expand into the Nigerian Fintech market. Map the key players, regulatory risks, and customer sentiment.',
      deliverables: ['Competitor Matrix', 'Regulatory Risk Assessment', 'Executive Summary (BLUF)']
    },
    modules: [
      {
        id: 'ri-mod-1',
        title: 'Week 1: OSINT Basics',
        description: 'Learn the foundations of Open Source Intelligence.',
        tasks: [
          {
            id: 'ri-001',
            title: 'Google Dorking Mastery',
            description: 'Use advanced search operators to find hidden files.',
            required: true,
            resources: [{ title: 'Google Hacking Database', type: 'tool', url: 'https://www.exploit-db.com/google-hacking-database' }]
          },
          {
            id: 'ri-002',
            title: 'Corporate Reconnaissance',
            description: 'Map out a target company\'s structure and key personnel.',
            required: true,
            resources: [
              { title: 'OSINT Framework', type: 'tool', url: 'https://osintframework.com/' }
            ]
          }
        ]
      },
      {
        id: 'ri-mod-2',
        title: 'Week 2: Synthesis & Reporting',
        description: 'Turn raw data into actionable intelligence.',
        tasks: [
          {
            id: 'ri-003',
            title: 'Writing the BLUF Brief',
            description: 'Practice the "Bottom Line Up Front" writing style.',
            required: true,
            resources: [{ title: 'Plain Language Writing Guide', type: 'article', url: 'https://www.plainlanguage.gov/guidelines/' }]
          },
          {
            id: 'ri-004',
            title: 'Fact-Checking & Verification',
            description: 'Verify 3 distinct sources for a controversial claim.',
            required: true,
            resources: [
              { title: 'First Draft: Verification Resources', type: 'article', url: 'https://firstdraftnews.org/long-form-article/our-guides-and-resources/' }
            ]
          }
        ]
      }
    ]
  },
  'virtual-assistant': {
    id: 'virtual-assistant',
    title: 'AI-Powered Virtual Assistant',
    description: 'Become an executive powerhouse with modern productivity tools.',
    learning: [
      { title: 'Time Blocking: Ultimate Guide', type: 'article', url: 'https://todoist.com/productivity-methods/time-blocking' },
      { title: 'Inbox Zero: The System (Zapier)', type: 'article', url: 'https://zapier.com/blog/inbox-zero/' },
      { title: 'Google Calendar Tips', type: 'article', url: 'https://support.google.com/calendar/answer/2465776' },
      { title: 'Getting Started with Notion', type: 'article', url: 'https://www.notion.so/help/guides/getting-started' },
      { title: 'ClickUp Getting Started', type: 'article', url: 'https://help.clickup.com/hc/en-us/articles/6322268258841-Getting-started-with-ClickUp' },
      { title: 'World Time Buddy', type: 'tool', url: 'https://www.worldtimebuddy.com/' }
    ],
    capstone: {
      title: 'Executive Office Setup',
      role: 'Executive Assistant',
      scenario: 'A new CEO has been hired. You need to organize their chaotic calendar, set up a travel itinerary for a 3-city tour, and create an inbox management system.',
      deliverables: ['Calendar Color-Coding System', 'Travel Itinerary PDF', 'Email Triage Protocol']
    },
    modules: [
      {
        id: 'va-mod-1',
        title: 'Week 1: Calendar & Inbox Management',
        description: 'Master the art of time protection and communication flow.',
        tasks: [
          {
            id: 'va-001',
            title: 'Inbox Zero Method',
            description: 'Process 100 emails into Action, Waiting, Reference, and Trash.',
            required: true,
            resources: [
              { title: 'Inbox Zero: The System (Zapier)', type: 'article', url: 'https://zapier.com/blog/inbox-zero/' }
            ]
          },
          {
            id: 'va-002',
            title: 'Complex Scheduling',
            description: 'Coordinate a meeting across 3 time zones with 5 stakeholders.',
            required: true,
            resources: [{ title: 'World Time Buddy', type: 'tool', url: 'https://www.worldtimebuddy.com/' }]
          }
        ]
      },
      {
        id: 'va-mod-2',
        title: 'Week 2: Project Management',
        description: 'Set up workspaces in Notion and ClickUp.',
        tasks: [
          {
            id: 'va-003',
            title: 'Notion Dashboard Setup',
            description: 'Build a personal dashboard for an executive.',
            required: true,
            resources: [
              { title: 'Getting Started with Notion', type: 'article', url: 'https://www.notion.so/help/guides/getting-started' }
            ]
          },
          {
            id: 'va-004',
            title: 'Travel Logistics',
            description: 'Plan a multi-leg business trip including flights and hotels.',
            required: true,
            resources: [
              { title: 'Rome2rio: Multi-city Trip Planning', type: 'tool', url: 'https://www.rome2rio.com/' },
              { title: 'Google Flights', type: 'tool', url: 'https://www.google.com/travel/flights' }
            ]
          }
        ]
      }
    ]
  },
  'no-code-builder': {
    id: 'no-code-builder',
    title: 'No-Code Product Builder',
    description: 'Build functional web apps and automations without code.',
    learning: [
      { title: 'Webflow University', type: 'video', url: 'https://university.webflow.com/' },
      { title: 'Bubble Academy', type: 'video', url: 'https://bubble.io/academy' },
      { title: 'Airtable Guide: Tables, Records, Fields', type: 'article', url: 'https://support.airtable.com/docs/guide-to-tables-records-and-fields' },
      { title: 'Zapier Basics', type: 'article', url: 'https://zapier.com/blog/getting-started-guide/' },
      { title: 'Figma for Beginners', type: 'video', url: 'https://help.figma.com/hc/en-us/articles/360040514233-Get-started-in-Figma' },
      { title: 'No-Code Tools Directory (NoCode.tech)', type: 'article', url: 'https://www.nocode.tech/tools' }
    ],
    capstone: {
      title: 'Service Marketplace MVP',
      role: 'No-Code Developer',
      scenario: 'Build a two-sided marketplace for local tutors. Users should be able to sign up, list services, and book sessions.',
      deliverables: ['Webflow Frontend Link', 'Airtable Database Schema', 'Booking Logic Walkthrough']
    },
    modules: [
      {
        id: 'nc-mod-1',
        title: 'Week 1: Frontend with Webflow',
        description: 'Translate designs into responsive websites.',
        tasks: [
          {
            id: 'nc-001',
            title: 'Box Model & CSS Grid',
            description: 'Replicate a landing page hero section.',
            required: true,
            resources: [
              { title: 'Webflow 101 Crash Course', type: 'video', url: 'https://university.webflow.com/courses/webflow-101-crash-course' },
              { title: 'MDN: The Box Model', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model' },
              { title: 'MDN: CSS Grid Layout', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout' }
            ]
          },
          {
            id: 'nc-002',
            title: 'CMS Structure',
            description: 'Design a database for a blog or portfolio.',
            required: true,
            resources: [
              { title: 'Webflow CMS Guide', type: 'article', url: 'https://university.webflow.com/lesson/cms' },
              { title: 'Airtable Basics', type: 'article', url: 'https://support.airtable.com/docs/guide-to-tables-records-and-fields' }
            ]
          }
        ]
      },
      {
        id: 'nc-mod-2',
        title: 'Week 2: Logic & Database',
        description: 'Connect frontends to data using Airtable and Bubble.',
        tasks: [
          {
            id: 'nc-003',
            title: 'Relational Data Modeling',
            description: 'Link Users to Orders in Airtable.',
            required: true,
            resources: [
              { title: 'Airtable: Linked Records', type: 'article', url: 'https://support.airtable.com/docs/creating-relationships-between-records' }
            ]
          },
          {
            id: 'nc-004',
            title: 'API Basics with Zapier',
            description: 'Automate a form submission to Slack notification.',
            required: true,
            resources: [
              { title: 'What is an API? (Zapier)', type: 'article', url: 'https://zapier.com/blog/what-is-an-api/' },
              { title: 'Zapier + Slack: Send messages from form responses', type: 'article', url: 'https://zapier.com/apps/slack/integrations' }
            ]
          }
        ]
      }
    ]
  },
  'content-ops': {
    id: 'content-ops',
    title: 'Content Operations Specialist',
    description: 'Scale content production with AI and SEO strategy.',
    learning: [
      { title: 'Google SEO Starter Guide', type: 'article', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
      { title: 'Moz Beginner’s Guide to SEO', type: 'article', url: 'https://moz.com/beginners-guide-to-seo' },
      { title: 'Content Strategy Fundamentals (HubSpot)', type: 'article', url: 'https://blog.hubspot.com/marketing/content-marketing-strategy' },
      { title: 'On-Page SEO Guide (Backlinko)', type: 'article', url: 'https://backlinko.com/on-page-seo' },
      { title: 'E-E-A-T Overview (Google)', type: 'article', url: 'https://developers.google.com/search/blog/2022/08/helpful-content-update' },
      { title: 'Notion Content Calendar Template', type: 'template', url: 'https://www.notion.so/templates/content-calendar' }
    ],
    capstone: {
      title: 'Quarterly Content Strategy',
      role: 'Content Ops Manager',
      scenario: 'Plan the content roadmap for a B2B SaaS company targeting HR professionals. Goal: Increase organic traffic by 30%.',
      deliverables: ['Keyword Cluster Analysis', '3-Month Editorial Calendar', 'Content Distribution Checklist']
    },
    modules: [
      {
        id: 'co-mod-1',
        title: 'Week 1: SEO & Strategy',
        description: 'Understand how search engines rank content.',
        tasks: [
          {
            id: 'co-001',
            title: 'Keyword Research',
            description: 'Find 10 high-volume, low-competition keywords.',
            required: true,
            resources: [{ title: 'Google Trends', type: 'tool', url: 'https://trends.google.com/trends/' }]
          },
          {
            id: 'co-002',
            title: 'Search Intent Analysis',
            description: 'Classify keywords by Informational vs. Transactional.',
            required: true,
            resources: [
              { title: 'Search Intent: Beginner’s Guide (Moz)', type: 'article', url: 'https://moz.com/blog/search-intent' }
            ]
          }
        ]
      },
      {
        id: 'co-mod-2',
        title: 'Week 2: AI-Assisted Production',
        description: 'Use LLMs to accelerate drafting and editing.',
        tasks: [
          {
            id: 'co-003',
            title: 'Prompt Engineering for Writers',
            description: 'Generate blog outlines using structured prompts.',
            required: true,
            resources: [
              { title: 'Learn Prompting', type: 'article', url: 'https://learnprompting.org/' },
              { title: 'Prompt Engineering Guide', type: 'article', url: 'https://www.promptingguide.ai/' }
            ]
          },
          {
            id: 'co-004',
            title: 'Editorial Calendar Management',
            description: 'Plan a month of content in Notion.',
            required: true,
            resources: [
              { title: 'Notion Content Calendar Template', type: 'template', url: 'https://www.notion.so/templates/content-calendar' }
            ]
          }
        ]
      }
    ]
  }
};
